'use client'

import { useEffect, useRef, useState } from 'react'
import Section from './Section'

interface Stat {
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 60, suffix: '+', label: 'Builders in Network' },
  { value: 100, suffix: '+', label: 'Years Combined Experience' },
  { value: 250, suffix: '+', label: 'Projects Delivered' },
]

export default function ProofCounters() {
  const [displayValues, setDisplayValues] = useState<number[]>(stats.map(() => 0))
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Show final values immediately
      setDisplayValues(stats.map(stat => stat.value))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          startAnimation()
        }
      },
      { threshold: 0.2 }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasStarted])

  const startAnimation = () => {
    const duration = 2000
    const startTime = Date.now()
    const endValues = stats.map(stat => stat.value)

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      const newValues = endValues.map((end) => {
        return Math.floor(end * easeOutCubic)
      })

      setDisplayValues(newValues)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Ensure final values
        setDisplayValues(endValues)
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <Section ref={sectionRef} className="py-10 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="text-center border-b md:border-b-0 md:border-r border-border last:border-0 pb-6 sm:pb-8 md:pb-0 md:pr-8 lg:pr-12 last:pr-0"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">
              {displayValues[index] || 0}
              <span className="text-accent">{stat.suffix}</span>
            </div>
            <div className="text-xs sm:text-sm md:text-base text-muted font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
