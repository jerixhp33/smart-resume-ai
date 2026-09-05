'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { toast } from '@/components/ui/toast'

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)
    try {
      await onUpload(file)
      toast({ title: 'File uploaded', description: file.name, variant: 'success' })
    } catch (error) {
      toast({ title: 'Upload failed', description: String(error), variant: 'error' })
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50',
        isUploading ? 'opacity-50 pointer-events-none' : ''
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="p-4 rounded-full bg-primary/10">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8 text-primary" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">
            {isUploading ? 'Uploading...' : isDragActive ? 'Drop file here' : 'Click or drag file to upload'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, DOCX, JPG, PNG (Max 10MB)
          </p>
        </div>
      </div>
    </div>
  )
}
