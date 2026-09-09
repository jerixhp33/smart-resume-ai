'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { claimUsernameAction } from '@/features/portfolio/actions'
import { toast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'

interface ClaimUsernameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaimed: (username: string) => void
}

export function ClaimUsernameModal({ open, onOpenChange, onClaimed }: ClaimUsernameModalProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClaim = async () => {
    if (!username.trim() || username.length < 3) {
      toast({ title: 'Invalid username', description: 'Must be at least 3 characters', variant: 'error' })
      return
    }

    setLoading(true)
    const res = await claimUsernameAction(username)
    setLoading(false)

    if (res.error) {
      toast({ title: 'Claim Failed', description: res.error, variant: 'error' })
      return
    }

    if (res.username) {
      toast({ title: 'Username Claimed!', description: `Your portfolio is now at /portfolio/${res.username}`, variant: 'success' })
      onClaimed(res.username)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim Your Portfolio URL</DialogTitle>
          <DialogDescription>
            Choose a unique username for your public portfolio link. This cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">resunio.ai/portfolio/</span>
            <input 
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
              placeholder="username"
              className="flex-1 bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleClaim} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Claim Username
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
