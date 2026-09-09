'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { importResumeFromText } from '@/features/resume/actions'
import { AIProcessingModal } from '@/components/ai/AIProcessingModal'


export default function ImportResumePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [pastedText, setPastedText] = useState('')

  async function handleImport(textToParse: string) {
    if (!textToParse.trim()) {
      setError('Please provide some text or upload a file.')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await importResumeFromText(textToParse)
      if (result.error) {
        setError(result.error)
      } else if (result.resumeId) {
        router.push(`/builder/${result.resumeId}`)
      }
    } catch (e) {
      setError('Failed to import resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function extractTextFromPDF(file: File): Promise<string> {
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        fullText += pageText + '\n'
      }

      return fullText
    } catch (e) {
      console.error('PDF parsing error', e)
      throw new Error('Could not extract text from this PDF.')
    }
  }

  async function handleFileUpload(file: File) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are currently supported for upload.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const text = await extractTextFromPDF(file)
      await handleImport(text)
    } catch (e: any) {
      setError(e.message || 'Failed to process file.')
      setIsLoading(false)
    }
  }

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <AIProcessingModal isOpen={isLoading} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Resume</h1>
        <p className="text-muted-foreground">
          Upload your existing PDF resume or paste your LinkedIn profile text. Our AI will automatically extract and format your information into a new Resunio resume.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Zone */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Upload PDF</h2>
          <label
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card hover:bg-accent/50'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">PDF format (Max 5MB)</p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
              }}
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Paste Zone */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Or Paste Text</h2>
          <div className="flex-1 flex flex-col gap-3 relative">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume or LinkedIn profile text here..."
              className="flex-1 w-full p-4 rounded-xl border border-input bg-card min-h-[250px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleImport(pastedText)}
              disabled={isLoading || !pastedText.trim()}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isLoading ? 'Importing...' : 'Import with AI'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
