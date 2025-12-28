'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasHeroImage, setHasHeroImage] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Check if hero image exists
    const img = new window.Image()
    img.onload = () => setHasHeroImage(true)
    img.onerror = () => setHasHeroImage(false)
    img.src = '/hero.png'

    // Respect reduced motion preference
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 64 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24"
    >
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Left: Headline and CTAs */}
        <div
          className={`space-y-5 sm:space-y-6 lg:space-y-8 transition-opacity duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              If you can describe it, we can ship it.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted font-medium">
              Operator-led execution, backed by a curated network of builders.
            </p>
          </div>
          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            OXB is an operator-led execution layer that translates your business needs into technical scope, matches you with the right builder, and ensures on-time delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => scrollToSection('portfolio')}
              className="rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-white hover:opacity-90 transition-opacity shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background min-h-[44px] flex items-center justify-center"
            >
              View Portfolio
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="inline-block rounded-lg border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground hover:bg-border/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background text-center min-h-[44px] flex items-center justify-center"
            >
              How We Deliver
            </button>
          </div>
        </div>

        {/* Right: Hero Image Card */}
        <div
          className={`relative lg:pl-8 order-first lg:order-last transition-opacity duration-700 delay-150 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg border border-border/30 bg-gradient-to-br from-muted/20 to-muted/5 hover:shadow-xl transition-shadow duration-300 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
            {hasHeroImage ? (
              <Image
                src="/hero.png"
                alt="OXB Studio - Professional builders delivering results"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center w-full">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                    <svg
                      className="w-12 h-12 text-accent/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted/80 font-medium">
                    Add hero.jpg to /public
                  </p>
                  <p className="text-xs text-muted/60 mt-1">
                    Recommended: 600x800px or similar 3:4 aspect ratio
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
