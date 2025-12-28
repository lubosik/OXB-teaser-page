'use client'

import { useEffect } from 'react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Modal */}
      <div
        className="relative bg-card rounded-lg border border-border shadow-xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded p-1"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 id="coming-soon-title" className="text-2xl font-bold text-foreground mb-4">
            OXB Studio Coming Soon
          </h2>
          <p className="text-muted mb-6">
            The full OXB Studio platform is currently in development. Browse provider profiles, 
            match with builders, and manage projects all in one place—coming soon.
          </p>
          <p className="text-muted mb-6">
            In the meantime, you can book a consultation to get matched with expert builders, 
            or join our Skool community for early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                onClose()
                const element = document.getElementById('consultation')
                if (element) {
                  setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }
              }}
              className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Book a Consultation
            </button>
            <a
              href="https://www.skool.com/oxb"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-block rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-foreground hover:bg-border/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center"
            >
              Join Skool Community
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

