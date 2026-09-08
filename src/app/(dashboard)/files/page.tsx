'use client'

import React, { useState, useEffect } from 'react'
import { FolderOpen, Loader2, Share2, Copy } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileUploader } from '@/components/files/FileUploader'
import { FileGrid } from '@/components/files/FileGrid'
import { uploadFileAction, getFilesAction, deleteFileAction, renameFileAction } from '@/features/files/actions'
import { toast } from '@/components/ui/toast'
import type { UserFile, FileCategory } from '@/types'
import { Button } from '@/components/ui/button'
import { ClaimUsernameModal } from '@/components/portfolio/ClaimUsernameModal'

export default function FilesPage() {
  const [files, setFiles] = useState<UserFile[]>([])
  const [activeTab, setActiveTab] = useState<FileCategory | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [showClaimModal, setShowClaimModal] = useState(false)

  useEffect(() => {
    getFilesAction().then(res => {
      if (res.data) setFiles(res.data)
      if (res.userId) setUserId(res.userId)
      if (res.username) setUsername(res.username)
      setLoading(false)
    })
  }, [])

  const filteredFiles = activeTab === 'all' ? files : files.filter(f => f.category === activeTab)

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', activeTab === 'all' ? 'certificates' : activeTab)

    const res = await uploadFileAction(formData)
    if (res.error) throw new Error(res.error)
    if (res.data) {
      setFiles(prev => [res.data, ...prev])
    }
  }

  const handleDelete = async (id: string) => {
    const res = await deleteFileAction(id)
    if (res.error) {
      toast({ title: 'Failed to delete', description: res.error, variant: 'error' })
      return
    }
    setFiles(prev => prev.filter(f => f.id !== id))
    toast({ title: 'File deleted', variant: 'success' })
  }

  const handleRename = async (id: string, newName: string) => {
    const res = await renameFileAction(id, newName)
    if (res.error) {
      toast({ title: 'Failed to rename', description: res.error, variant: 'error' })
      return
    }
    if (res.data) {
      setFiles(prev => prev.map(f => f.id === id ? res.data! : f))
      toast({ title: 'File renamed', variant: 'success' })
    }
  }

  const handleSharePortfolio = () => {
    if (!username) {
      setShowClaimModal(true)
      return
    }
    const url = `${window.location.origin}/portfolio/${username}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied!',
      description: 'Your public portfolio link has been copied to your clipboard.',
      variant: 'success'
    })
  }

  const handleUsernameClaimed = (newUsername: string) => {
    setUsername(newUsername)
    const url = `${window.location.origin}/portfolio/${newUsername}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <ClaimUsernameModal 
        open={showClaimModal} 
        onOpenChange={setShowClaimModal} 
        onClaimed={handleUsernameClaimed} 
      />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-primary" />
            My Certificates & Files
          </h1>
          <p className="text-sm text-muted-foreground">Upload your certificates and documents. Uploaded certificates will be displayed on your AI Portfolio.</p>
        </div>
        {userId && (
          <Button onClick={handleSharePortfolio} variant="outline" className="gap-2 shadow-sm border-primary/20 hover:bg-primary/5">
            <Share2 className="h-4 w-4 text-primary" />
            Share Portfolio
          </Button>
        )}
      </div>

      {/* Sync Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between text-xs text-foreground">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-base">📜</span>
          <span>Uploaded certificates and documents automatically sync and display on your public AI Portfolio!</span>
        </div>
      </div>

      <FileUploader onUpload={handleUpload} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between border-b border-border pb-px mb-6">
          <TabsList className="bg-transparent p-0 h-auto gap-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-2">
              All Files
            </TabsTrigger>
            <TabsTrigger value="resumes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-2">
              Resumes
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-2">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-2">
              Documents
            </TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-2">
              Other
            </TabsTrigger>
          </TabsList>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <FileGrid files={filteredFiles} onDelete={handleDelete} onRename={handleRename} />
        )}
      </Tabs>
    </div>
  )
}
