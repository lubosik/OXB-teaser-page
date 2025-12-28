'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  Zap, 
  Users, 
  Target, 
  CheckCircle2,
  Code2,
  Database,
  CreditCard,
  MessageSquare,
  Workflow,
  Brain,
} from 'lucide-react'
import Section from './Section'

interface CredibilityClaim {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const claims: CredibilityClaim[] = [
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Ship in weeks, not months. Our builders move fast without cutting corners.',
  },
  {
    icon: Users,
    title: 'Senior Builders',
    description: 'Curated network of experienced developers who\'ve built real systems at scale.',
  },
  {
    icon: Target,
    title: 'Operator Mindset',
    description: 'We understand business outcomes, not just technical requirements.',
  },
  {
    icon: CheckCircle2,
    title: 'Proven Results',
    description: 'Real systems shipped, real businesses transformed, real ROI delivered.',
  },
]

const techStack = [
  { name: 'Next.js', icon: Code2 },
  { name: 'Node.js', icon: Code2 },
  { name: 'Python', icon: Code2 },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Stripe', icon: CreditCard },
  { name: 'Twilio', icon: MessageSquare },
  { name: 'Zapier/Make', icon: Workflow },
  { name: 'OpenAI', icon: Brain },
]

export default function Credibility() {
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
    <Section ref={sectionRef}>
      {/* Credibility Claims */}
      <div className="mb-8 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {claims.map((claim, index) => {
            const Icon = claim.icon
            return (
              <div
                key={claim.title}
                className={`text-center transition-opacity duration-700 ${
                  isVisible
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-accent/20">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                  {claim.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed px-2">
                  {claim.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-border pt-8 sm:pt-12">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-4 sm:mb-6">
          Selected Stack
        </h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
          {techStack.map((tech, index) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border transition-opacity duration-700 ${
                  isVisible
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
                style={{
                  transitionDelay: isVisible ? `${(claims.length * 100) + (index * 50)}ms` : '0ms',
                }}
              >
                <Icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
