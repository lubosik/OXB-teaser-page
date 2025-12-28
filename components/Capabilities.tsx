'use client'

import { capabilities } from '@/content/capabilities'
import CapabilityCard from './CapabilityCard'
import Section from './Section'

export default function Capabilities() {
  return (
    <Section id="capabilities">
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          Capabilities
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-2">
          What we can build for you
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {capabilities.map((capability, index) => (
          <CapabilityCard
            key={capability.id}
            capability={capability}
            index={index}
          />
        ))}
      </div>
    </Section>
  )
}

