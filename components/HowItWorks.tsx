'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, MessageSquare, Search, CheckCircle, Rocket } from 'lucide-react'
import Section from './Section'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Consultation & Scoping',
    description: 'We run a paid consultation to understand your business needs and translate them into clear technical requirements.',
    icon: MessageSquare,
  },
  {
    number: 2,
    title: 'Builder Matching',
    description: 'We identify and assign the right builder from our curated network—someone who has built similar systems.',
    icon: Search,
  },
  {
    number: 3,
    title: 'Agreement & Planning',
    description: 'We agree on delivery timeline, price, and outcomes. You get transparency before work begins.',
    icon: CheckCircle,
  },
  {
    number: 4,
    title: 'Managed Execution',
    description: 'We manage the project end-to-end to ensure on-time delivery and correct outcomes. You get a working system.',
    icon: Rocket,
  },
]

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <Section id="how-it-works" ref={sectionRef}>
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          How OXB Works
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-2">
          Operator-led execution layer. We translate your business needs, match you with the right builder, and manage delivery to ensure outcomes.
        </p>
      </div>
      
      {/* Flow Chart - Desktop */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-4 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            return (
              <div key={step.number} className="flex items-start flex-1">
                <div className="w-full">
                  <div className={`transition-opacity duration-700 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`} style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}>
                    <div className="bg-card border-2 border-border rounded-xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all relative">
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-base shadow-lg z-10">
                        {step.number}
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        {/* Icon Circle */}
                        <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-accent/10 border-2 border-accent/30 mx-auto mb-4 flex items-center justify-center">
                          <Icon className="h-10 w-10 lg:h-12 lg:w-12 text-accent" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-3">
                          {step.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm lg:text-base text-muted leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex-shrink-0 px-3 lg:px-4 pt-8">
                    <div className={`transition-opacity duration-700 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`} style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}>
                      <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-accent/50" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Flow Chart - Mobile/Tablet */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          return (
            <div key={step.number}>
              <div className={`transition-opacity duration-700 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}>
                <div className="bg-card border-2 border-border rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon Circle with Number */}
                    <div className="flex-shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center relative">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
                      <div className="absolute -top-2 -left-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Arrow Connector */}
              {!isLast && (
                <div className="flex justify-center py-1 sm:py-2">
                  <div className={`transition-opacity duration-700 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`} style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}>
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-accent/40 rotate-90" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
