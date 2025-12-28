'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CaseStudy } from '@/content/case-studies'
import { ExternalLink, Download, X } from 'lucide-react'

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null
  isOpen: boolean
  onClose: () => void
}

export default function CaseStudyModal({ caseStudy, isOpen, onClose }: CaseStudyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null)
  const lastFocusableRef = useRef<HTMLElement | null>(null)

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'

      // Get all focusable elements
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        firstFocusableRef.current = firstElement as HTMLButtonElement
        lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement
        firstElement.focus()
      }

      // Handle Tab key for focus trap
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault()
            lastFocusableRef.current?.focus()
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault()
            firstFocusableRef.current?.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTab)
      return () => {
        document.removeEventListener('keydown', handleTab)
      }
    } else {
      document.body.style.overflow = 'unset'
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (caseStudy?.images && caseStudy.images.length > 0) {
      setCurrentImageIndex(0)
    }
  }, [caseStudy])

  if (!isOpen || !caseStudy) return null

  const currentImage = caseStudy.images?.[currentImageIndex]
  const hasMultipleImages = caseStudy.images && caseStudy.images.length > 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-card rounded-none sm:rounded-lg border-0 sm:border border-border shadow-xl max-w-5xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg p-2.5 sm:p-2 bg-card/90 backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-5 sm:h-5" />
        </button>

        <div className="p-5 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {caseStudy.category.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2.5 py-1 rounded-md bg-accent/10 text-accent border border-accent/20 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h2 id="case-study-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {caseStudy.title}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted">
              {caseStudy.oneLiner}
            </p>
          </div>

          {/* Media Gallery */}
          {(caseStudy.images && caseStudy.images.length > 0) || caseStudy.videoUrl ? (
            <div className="mb-6">
              {caseStudy.videoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted/20">
                  <iframe
                    src={getEmbedUrl(caseStudy.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video for ${caseStudy.title}`}
                  />
                </div>
              ) : null}
              
              {caseStudy.images && caseStudy.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/20">
                    <Image
                      src={currentImage!}
                      alt={`${caseStudy.title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                  
                  {hasMultipleImages ? (
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 sm:mx-0 px-5 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {caseStudy.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all min-w-[64px] min-h-[64px] ${
                            index === currentImageIndex
                              ? 'border-accent'
                              : 'border-border opacity-60 hover:opacity-100'
                          }`}
                          aria-label={`View image ${index + 1}`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Content Sections */}
          <div className="space-y-5 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Problem</h3>
              <p className="text-muted leading-relaxed text-sm sm:text-base">{caseStudy.problem}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Build</h3>
              <p className="text-muted leading-relaxed text-sm sm:text-base">{caseStudy.build}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Outcome</h3>
              <p className="text-muted leading-relaxed text-sm sm:text-base">{caseStudy.outcome}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-md bg-muted/20 text-muted border border-border text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Website / Live Link */}
          {caseStudy.websiteUrl ? (
            <div className="mb-4">
              <a
                href={caseStudy.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity font-medium text-sm sm:text-base"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Live Website
              </a>
            </div>
          ) : null}

          {/* Developer Credit */}
          {caseStudy.developerCredit ? (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted">
                {caseStudy.developerCredit}
              </p>
            </div>
          ) : null}

          {/* PDF Download */}
          {caseStudy.pdfUrl ? (
            <div className={`pt-4 ${caseStudy.developerCredit ? '' : 'border-t border-border'}`}>
              <a
                href={caseStudy.pdfUrl}
                download
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                Download Full Case Study (PDF)
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function getEmbedUrl(url: string): string {
  // Loom
  if (url.includes('loom.com')) {
    const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
    if (match) {
      return `https://www.loom.com/embed/${match[1]}`
    }
  }
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/)
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`
    }
  }
  
  return url
}
