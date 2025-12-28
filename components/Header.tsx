'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

interface NavLink {
  label: string
  id: string
}

const navLinks: NavLink[] = [
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'Capabilities', id: 'capabilities' },
  { label: 'Coming Soon', id: 'coming-soon' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // Active section detection
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 64 // h-16 = 64px
      const sections = navLinks.map(link => ({
        id: link.id,
        element: document.getElementById(link.id),
      }))

      const scrollPosition = window.scrollY + headerHeight + 100 // Offset for better UX

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element) {
          const top = section.element.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(section.id)
            break
          }
        }
      }

      // If scrolled to top, clear active section
      if (window.scrollY < 100) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 64 // h-16 = 64px
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setMobileMenuOpen(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const handleBookConsultation = () => {
    scrollToSection('consultation')
  }

  return (
    <header className="w-full border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              scrollToTop()
            }}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="OXB Studio Home"
          >
            <Image
              src="/logo.png"
              alt="OXB Studio"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="ml-2 text-lg font-semibold text-foreground">
              OXB Studio
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1 relative ${
                  activeSection === link.id
                    ? 'text-foreground after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-accent'
                    : 'text-muted hover:text-foreground after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-accent after:scale-x-0 after:transition-transform hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleBookConsultation}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Book Consultation"
            >
              Book Consultation
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-2 space-y-0">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`w-full text-left py-4 px-2 text-base transition-colors border-b border-border last:border-0 min-h-[44px] flex items-center ${
                    activeSection === link.id
                      ? 'text-foreground font-medium'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={handleBookConsultation}
                className="w-full text-left py-4 px-2 text-base font-medium text-accent hover:text-accent/80 transition-colors min-h-[44px] flex items-center"
              >
                Book Consultation
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
