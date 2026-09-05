'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InterviewQuestion } from '@/types'
import { cn } from '@/utils/cn'

interface InterviewFlashcardsProps {
  questions: InterviewQuestion[]
  onClose: () => void
}

export function InterviewFlashcards({ questions: initialQuestions, onClose }: InterviewFlashcardsProps) {
  const [questions, setQuestions] = useState([...initialQuestions])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentQ = questions[currentIndex]

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(c => c + 1), 150) // Wait for flip to hide
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(c => c - 1), 150)
    }
  }

  function handleShuffle() {
    setIsFlipped(false)
    setTimeout(() => {
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
      setCurrentIndex(0)
    }, 150)
  }

  // Keyboard navigation
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (!isFlipped && e.key === ' ') {
          setIsFlipped(true)
        } else {
          handleNext()
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setIsFlipped(f => !f)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isFlipped, questions.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const difficultyColor = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100',
  }[currentQ.difficulty]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 max-w-4xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-bold">Practice Mode</h2>
          <p className="text-sm text-muted-foreground">Use arrow keys to navigate, space to flip.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 bg-muted hover:bg-muted/80">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Flashcard Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        
        {/* Progress */}
        <div className="mb-8 w-full max-w-2xl flex items-center gap-4">
          <span className="text-sm font-medium whitespace-nowrap">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 3D Scene */}
        <div 
          className="w-full max-w-2xl h-[400px] perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Card Wrapper for rotation */}
          <div 
            className={cn(
              "w-full h-full relative preserve-3d transition-transform duration-500 ease-out shadow-2xl rounded-3xl",
              isFlipped ? "rotate-y-180" : ""
            )}
          >
            {/* FRONT SIDE (Question) */}
            <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-3xl p-10 flex flex-col">
              <div className="flex justify-between items-start mb-auto">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {currentQ.category.replace('_', ' ')}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColor}`}>
                  {currentQ.difficulty.toUpperCase()}
                </span>
              </div>
              
              <div className="my-auto text-center">
                <h3 className="text-2xl sm:text-3xl font-medium leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>
              
              <div className="mt-auto text-center">
                <span className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 animate-pulse">
                  <RotateCw className="h-4 w-4" /> Click to flip
                </span>
              </div>
            </div>

            {/* BACK SIDE (Guidance) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary border-primary rounded-3xl p-10 flex flex-col text-primary-foreground shadow-inner">
              <div className="mb-6">
                <span className="text-sm font-bold uppercase tracking-wider opacity-80 border-b border-primary-foreground/20 pb-1">
                  AI Guidance
                </span>
              </div>
              
              <div className="my-auto overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-lg sm:text-xl leading-relaxed opacity-95 whitespace-pre-wrap">
                  {currentQ.guidance}
                </p>
              </div>
              
              <div className="mt-auto text-center pt-6 opacity-70">
                <span className="text-sm flex items-center justify-center gap-1.5">
                  <RotateCw className="h-4 w-4" /> Click to flip back
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-6">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-14 w-14 rounded-full p-0 shadow-sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="h-14 px-6 rounded-full font-semibold shadow-sm gap-2"
            onClick={handleShuffle}
          >
            <Shuffle className="h-4 w-4" /> Shuffle Deck
          </Button>

          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full p-0 shadow-md"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
