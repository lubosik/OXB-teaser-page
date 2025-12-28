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

  useEffect(() => {
    setIsMounted(true)
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

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
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
      size="full"
      radius="large"
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

