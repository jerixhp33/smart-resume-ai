'use client'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface TransitionLinkProps extends LinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: React.ReactNode
  className?: string
  href: string
}

export function TransitionLink({ children, href, className, ...props }: TransitionLinkProps) {
  const router = useRouter()

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      router.push(href)
      return
    }

    document.startViewTransition(() => {
      router.push(href)
    })
  }

  return (
    <Link 
      href={href} 
      onClick={handleTransition} 
      className={className} 
      {...props}
    >
      {children}
    </Link>
  )
}
