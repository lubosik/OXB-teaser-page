'use client'

import Image from 'next/image'
import { CaseStudy } from '@/content/case-studies'
import { useEffect, useRef, useState } from 'react'

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  onClick: () => void
  index: number
}

export default function CaseStudyCard({ caseStudy, onClick, index }: CaseStudyCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  const hasImage = caseStudy.images && caseStudy.images.length > 0 && !imageError

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 30}ms` : '0ms',
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View case study: ${caseStudy.title}`}
    >
      {/* Thumbnail with fixed aspect ratio */}
      <div className="aspect-[16/10] bg-muted/10 relative overflow-hidden">
        {hasImage && caseStudy.images ? (
          <Image
            src={caseStudy.images[0]}
            alt={caseStudy.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <svg
                  className="w-6 h-6 text-accent/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1z"
                  />
                </svg>
              </div>
              <p className="text-xs text-muted/70">Add image to /public/case-studies/</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {caseStudy.category.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 font-medium"
            >
              {cat}
            </span>
          ))}
          {caseStudy.category.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-muted/20 text-muted border border-border">
              +{caseStudy.category.length - 2}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
          {caseStudy.title}
        </h3>
        
        {/* Description */}
        <p className="text-muted text-sm leading-relaxed line-clamp-2">
          {caseStudy.oneLiner}
        </p>
      </div>
    </div>
  )
}
