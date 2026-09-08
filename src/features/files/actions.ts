'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { UserFile, FileCategory } from '@/types'

export async function uploadFileAction(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const file = formData.get('file') as File
  const category = formData.get('category') as FileCategory
  if (!file) return { error: 'No file provided' }

  const originalName = file.name
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storagePath = `${user.id}/${Date.now()}_${safeName}`

  // 1. Upload to Storage bucket 'user_files'
  const { error: uploadError } = await supabase.storage
    .from('user_files')
    .upload(storagePath, file)

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return { error: 'Failed to upload file to storage.' }
  }

  // 2. Insert into DB
  const { data: dbData, error: dbError } = await supabase
    .from('user_files')
    .insert({
      user_id: user.id,
      name: originalName,
      original_name: originalName,
      storage_path: storagePath,
      size: file.size,
      mime_type: file.type || 'application/octet-stream',
      category: category || 'certificates',
    })
    .select()
    .single()

  if (dbError) {
    console.error('DB insert error:', dbError)
    // Attempt rollback
    await supabase.storage.from('user_files').remove([storagePath])
    return { error: 'Failed to save file metadata.' }
  }

  return { data: dbData as UserFile }
}

export async function deleteFileAction(id: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // 1. Get file metadata to find storage path
  const { data: file } = await supabase
    .from('user_files')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (!file) return { error: 'File not found' }

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from('user_files')
    .delete()
    .eq('id', id)

  if (dbError) return { error: dbError.message }

  // 3. Delete from Storage
  await supabase.storage.from('user_files').remove([file.storage_path])

  return { success: true }
}

export async function renameFileAction(id: string, newName: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('user_files')
    .update({ name: newName, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }
  return { data: data as UserFile }
}

export async function getFilesAction() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], userId: null, username: null }

  // Fetch the user's profile to check if they have a username
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('user_id', user.id)
    .single()

  const { data, error } = await supabase
    .from('user_files')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get files error:', error)
    return { data: [], userId: user.id, username: profile?.username || null }
  }

  return { data: data as UserFile[], userId: user.id, username: profile?.username || null }
}

export async function getFileDownloadUrlAction(id: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: file } = await supabase
    .from('user_files')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (!file) return { error: 'File not found' }

  const { data, error } = await supabase.storage
    .from('user_files')
    .createSignedUrl(file.storage_path, 60) // 60 seconds

  if (error) return { error: error.message }
  return { url: data.signedUrl }
}
