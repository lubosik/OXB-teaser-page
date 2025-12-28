import { ReactNode, forwardRef } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  background?: 'default' | 'card'
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, children, className = '', background = 'default' }, ref) => {
    const bgClass = background === 'card' ? 'bg-card/50' : ''
    
    return (
      <section
        ref={ref}
        id={id}
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 ${bgClass} ${className}`}
      >
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

export default Section

