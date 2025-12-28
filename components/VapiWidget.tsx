'use client'

import { useEffect, useState } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vapi-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'public-key': string
        'assistant-id': string
        mode?: string
        theme?: string
        position?: string
        size?: string
        radius?: string
        'base-color'?: string
        'accent-color'?: string
        'button-base-color'?: string
        'button-accent-color'?: string
        'main-label'?: string
        'start-button-text'?: string
        'end-button-text'?: string
        'empty-voice-message'?: string
      }
    }
  }
}

export default function StellaInkChamberWidget() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Check if script already exists
    if (document.querySelector('script[src*="vapi-ai"]')) {
      return
    }

    // Load the Vapi widget script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js'
    script.async = true
    script.type = 'text/javascript'

    document.body.appendChild(script)

    // Add mobile-specific CSS for the widget
    const style = document.createElement('style')
    style.textContent = `
      vapi-widget {
        --vapi-widget-width: 100% !important;
        --vapi-widget-max-width: 100vw !important;
        --vapi-widget-height: 100vh !important;
        --vapi-widget-max-height: 100vh !important;
      }
      
      @media (max-width: 767px) {
        vapi-widget {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          margin: 0 !important;
        }
        
        vapi-widget::part(container) {
          width: 100% !important;
          height: 100% !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
        }
        
        vapi-widget::part(button) {
          bottom: 20px !important;
          right: 20px !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
        }
      }
      
      @media (min-width: 768px) {
        vapi-widget {
          max-width: 420px !important;
          max-height: 600px !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [isMounted])

  if (!isMounted) {
    return null
  }

  return (
    <vapi-widget
      public-key="462f73ea-ba32-416f-8dc0-0e08fda79f6d"
      assistant-id="9c7f933e-b312-4c8f-86a8-53c55da5b1db"
      mode="voice"
      theme="light"
      position="bottom-right"
      size={isMobile ? "compact" : "full"}
      radius={isMobile ? "none" : "large"}
      base-color="#faf8f3"
      accent-color="#ff6b35"
      button-base-color="#ff6b35"
      button-accent-color="#ffffff"
      main-label="Talk with Emily"
      start-button-text="Start Voice Chat"
      end-button-text="End Call"
      empty-voice-message="Click to start a voice conversation with Emily from Stella's Ink Chamber"
    />
  )
}

