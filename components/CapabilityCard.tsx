'use client'

import { useEffect, useRef, useState } from 'react'
import { Capability } from '@/content/capabilities'

interface CapabilityCardProps {
  capability: Capability
  index: number
}

export default function CapabilityCard({ capability, index }: CapabilityCardProps) {
  const [isVisible, setIsVisible] = useState(false)
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

  const Icon = capability.icon

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300 hover:-translate-y-1 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
      }}
    >
      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 border border-accent/20 transition-colors">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {capability.title}
      </h3>
      <p className="text-muted leading-relaxed text-sm sm:text-base">
        {capability.description}
      </p>
    </div>
  )
}

