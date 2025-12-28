'use client'

import { useEffect, useState } from 'react'
import Section from './Section'

export default function ComingSoon() {
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
    <Section id="coming-soon" background="card">
      <div className="text-center max-w-3xl mx-auto px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          OXB Studio Platform Coming Soon
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted mb-5 sm:mb-6 leading-relaxed">
          The full OXB Studio platform will allow builders to showcase work and operators to match quickly. For now, the fastest path is to book a consultation or join the Skool community for early access updates and access to the builder network.
        </p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection('consultation')}
              className="w-full sm:w-auto rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-white hover:opacity-90 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 min-h-[44px] flex items-center justify-center"
            >
              Book a Consultation
            </button>
            <a
              href={skoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-block rounded-lg border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground hover:bg-border/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-center min-h-[44px] flex items-center justify-center"
            >
              Join Skool Community
            </a>
          </div>
          <div className="text-xs sm:text-sm text-muted space-y-1 pt-2 px-2">
            <p className="font-medium text-foreground">Two paths forward:</p>
            <p>1. <strong>Book a consultation</strong> — matching + managed delivery</p>
            <p>2. <strong>Join the Skool community</strong> — early access + browse builders + post a project</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
