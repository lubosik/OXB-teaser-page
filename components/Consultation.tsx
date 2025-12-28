'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Section from './Section'

export default function Consultation() {
  const [calendlyUrl, setCalendlyUrl] = useState<string>(
    'https://calendly.com/ai-poweredsolutions/30min?hide_gdpr_banner=1'
  )
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Build Calendly URL with UTM parameters from query string
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('source') || urlParams.get('utm_source')
    const utmCampaign = urlParams.get('utm_campaign')
    const utmMedium = urlParams.get('utm_medium')
    
    let url = 'https://calendly.com/ai-poweredsolutions/30min?hide_gdpr_banner=1'
    
    if (utmSource || utmCampaign || utmMedium) {
      const calendlyParams = new URLSearchParams()
      if (utmSource) calendlyParams.append('utm_source', utmSource)
      if (utmCampaign) calendlyParams.append('utm_campaign', utmCampaign)
      if (utmMedium) calendlyParams.append('utm_medium', utmMedium)
      
      url += `&${calendlyParams.toString()}`
    }
    
    setCalendlyUrl(url)
  }, [])

  return (
    <Section id="consultation">
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          Book a Consultation
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-2">
          Schedule a 30-minute call to discuss your project and see how OXB can help bring your vision to life.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <div
          className="calendly-inline-widget rounded-lg overflow-hidden border border-border shadow-lg bg-card"
          data-url={calendlyUrl}
          style={{ 
            minWidth: '320px', 
            height: isMobile ? '600px' : '700px',
            width: '100%',
          }}
        />
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        id="calendly-script"
      />
    </Section>
  )
}

