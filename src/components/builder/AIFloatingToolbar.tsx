'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Briefcase, FileText, Loader2, Wand2 } from 'lucide-react'
import { improveText } from '@/features/ai/actions'
import { toast } from '@/components/ui/toast'
import { cn } from '@/utils/cn'

interface Position {
  top: number
  left: number
}

export function AIFloatingToolbar() {
  const [position, setPosition] = useState<Position | null>(null)
  const [activeElement, setActiveElement] = useState<HTMLTextAreaElement | HTMLInputElement | null>(null)
  const [selectedText, setSelectedText] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleSelection() {
      // Small timeout to allow the browser selection to finish updating
      setTimeout(() => {
        const active = document.activeElement
        
        // We only care about textareas and input fields
        if (!active || (active.tagName !== 'TEXTAREA' && active.tagName !== 'INPUT')) {
          setPosition(null)
          return
        }

        const el = active as HTMLTextAreaElement | HTMLInputElement
        const start = el.selectionStart || 0
        const end = el.selectionEnd || 0
        
        const text = el.value.substring(start, end)
        
        if (text.trim().length > 3) {
          // If we have text selected, let's find the position.
          // Getting coordinates inside a textarea is tricky, so we'll position it
          // based on the textarea's bounding rect, centered horizontally.
          const rect = el.getBoundingClientRect()
          
          setPosition({
            top: rect.top - 48, // Place it just above the textarea
            left: rect.left + (rect.width / 2),
          })
          setActiveElement(el)
          setSelectedText(text)
        } else {
          setPosition(null)
          setActiveElement(null)
          setSelectedText('')
        }
      }, 50)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    
    // Hide when clicking outside
    function handleClickOutside(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        // If they didn't click inside the toolbar or the active element, hide it.
        if (activeElement && !activeElement.contains(e.target as Node)) {
           setPosition(null)
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    // Hide on scroll to prevent detached floating
    document.addEventListener('scroll', () => setPosition(null), true)

    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', () => setPosition(null), true)
    }
  }, [activeElement])

  async function handleImprove(instruction: 'grammar' | 'professional' | 'concise') {
    if (!activeElement) return

    setLoading(instruction)
    
    const res = await improveText({ instruction, text: selectedText })
    
    setLoading(null)
    
    if (res.error || !res.result?.improved) {
      toast({ title: 'AI Error', description: res.error || 'Failed to improve text', variant: 'error' })
      return
    }

    const newText = res.result.improved

    // Focus the element back
    activeElement.focus()
    
    // Replace the exact text selection using setRangeText
    // This safely modifies the value without destroying React/Zustand state bindings
    activeElement.setRangeText(newText, activeElement.selectionStart || 0, activeElement.selectionEnd || 0, 'select')
    
    // Dispatch a synthetic input event so React/Zustand catches the change
    activeElement.dispatchEvent(new Event('input', { bubbles: true }))
    
    // Close the toolbar
    setPosition(null)
    toast({ title: 'Text improved! ✨', variant: 'success' })
  }

  if (!position) return null

  return (
    <div 
      ref={toolbarRef}
      className={cn(
        "fixed z-50 animate-in fade-in zoom-in-95 duration-200 shadow-xl",
        "bg-white dark:bg-slate-900 border border-border rounded-full p-1.5 flex items-center gap-1",
        "-translate-x-1/2" // center horizontally based on left coord
      )}
      style={{ top: position.top, left: position.left }}
    >
      <div className="pl-2 pr-1 border-r border-border flex items-center">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      </div>

      <button
        onClick={() => handleImprove('grammar')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        {loading === 'grammar' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
        Fix Grammar
      </button>

      <button
        onClick={() => handleImprove('professional')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        {loading === 'professional' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Briefcase className="h-3 w-3" />}
        Professional
      </button>

      <button
        onClick={() => handleImprove('concise')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
      >
        {loading === 'concise' ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />}
        Concise
      </button>
    </div>
  )
}
