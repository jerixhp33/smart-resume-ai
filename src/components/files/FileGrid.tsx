'use client'

import React, { useState } from 'react'
import { FileText, Image as ImageIcon, File, MoreVertical, Download, Trash2, Edit2, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import type { UserFile } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { getFileDownloadUrlAction } from '@/features/files/actions'
import { toast } from '@/components/ui/toast'

interface FileGridProps {
  files: UserFile[]
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
}

export function FileGrid({ files, onDelete, onRename }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-2xl border border-dashed border-border">
        <File className="h-10 w-10 mx-auto mb-3 opacity-20" />
        <p>No files found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map(file => (
        <FileCard key={file.id} file={file} onDelete={onDelete} onRename={onRename} />
      ))}
    </div>
  )
}

function FileCard({ file, onDelete, onRename }: { file: UserFile, onDelete: (id: string) => void, onRename: (id: string, newName: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(file.name)

  const mimeType = file.mime_type || ''
  const isImage = mimeType.startsWith('image/')
  const Icon = isImage ? ImageIcon : mimeType === 'application/pdf' ? FileText : File
  const iconColor = isImage ? 'text-blue-500' : mimeType === 'application/pdf' ? 'text-red-500' : 'text-gray-500'

  const sizeStr = (file.size / 1024 / 1024).toFixed(2) + ' MB'

  async function handleDownload() {
    const res = await getFileDownloadUrlAction(file.id)
    if (res.error) {
      toast({ title: 'Download failed', description: res.error, variant: 'error' })
      return
    }
    if (res.url) {
      window.open(res.url, '_blank')
    }
  }

  function handleSaveRename() {
    if (editName.trim() && editName !== file.name) {
      onRename(file.id, editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <div className="group relative bg-card border border-border rounded-xl p-4 transition-all hover:shadow-md hover:border-primary/30 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg bg-muted ${iconColor} bg-opacity-10`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(file.id)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={handleSaveRename}
            onKeyDown={e => e.key === 'Enter' && handleSaveRename()}
            className="w-full text-sm font-medium bg-background border border-input rounded px-2 py-1 mb-1 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <h3 className="font-semibold text-sm truncate" title={file.name}>{file.name}</h3>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{sizeStr}</span>
          <span>•</span>
          <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  )
}
