'use client'

import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProofCounters from '@/components/ProofCounters'
import Capabilities from '@/components/Capabilities'
import Portfolio from '@/components/Portfolio'
import HowItWorks from '@/components/HowItWorks'
import Credibility from '@/components/Credibility'
import ComingSoon from '@/components/ComingSoon'
import Consultation from '@/components/Consultation'
import Footer from '@/components/Footer'

export default function Home() {
  const [skoolUrl, setSkoolUrl] = useState<string>('https://www.skool.com/oxb')

  useEffect(() => {
    // Preserve UTM parameters in Skool link
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('source') || urlParams.get('utm_source')
    const utmCampaign = urlParams.get('utm_campaign')
    const utmMedium = urlParams.get('utm_medium')
    
    let url = 'https://www.skool.com/oxb'
    
    if (utmSource || utmCampaign || utmMedium) {
      const skoolParams = new URLSearchParams()
      if (utmSource) skoolParams.append('utm_source', utmSource)
      if (utmCampaign) skoolParams.append('utm_campaign', utmCampaign)
      if (utmMedium) skoolParams.append('utm_medium', utmMedium)
      
      url += `?${skoolParams.toString()}`
    }
    
    setSkoolUrl(url)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 64
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />

      {/* Hero Section */}
      <main id="main-content">
      <Hero />

      {/* Proof Counters Section */}
      <ProofCounters />

      {/* Capabilities Section */}
      <Capabilities />

      {/* Portfolio Section */}
      <Portfolio />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Credibility Section */}
      <Credibility />

      {/* Coming Soon Section */}
      <ComingSoon />

      {/* Consultation Section */}
      <Consultation />

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Ready to Build?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted mb-5 sm:mb-6 px-2">
            Choose your path: book a consultation for managed delivery, or join Skool to browse builders and post projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => scrollToSection('consultation')}
              className="rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-white hover:opacity-90 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 min-h-[44px] flex items-center justify-center"
            >
              Book a Consultation
            </button>
            <a
              href={skoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground hover:bg-border/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center min-h-[44px] flex items-center justify-center"
            >
              Join Skool Community
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Suspense fallback={
        <footer className="border-t border-border bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted">
                © {new Date().getFullYear()} OXB Studio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      }>
        <Footer />
      </Suspense>
      </main>
    </div>
  )
}

