'use client'

import { useState, useEffect } from 'react'
import { CaseStudy, CaseStudyCategory } from '@/content/case-studies'
import { caseStudies as defaultCaseStudies } from '@/content/case-studies'
import CaseStudyCard from './CaseStudyCard'
import CaseStudyModal from './CaseStudyModal'
import Section from './Section'

export default function Portfolio() {
  const [allCaseStudies, setAllCaseStudies] = useState<CaseStudy[]>(defaultCaseStudies)
  const [selectedCategory, setSelectedCategory] = useState<CaseStudyCategory | 'All'>('All')
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load ingested portfolio data
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const response = await fetch('/api/portfolio')
        if (response.ok) {
          const data = await response.json()
          setAllCaseStudies(data)
        }
      } catch (error) {
        console.error('Error loading portfolio:', error)
        // Keep default case studies on error
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  // Handle deep linking
  useEffect(() => {
    if (isLoading) return

    // Check URL hash
    const hash = window.location.hash.slice(1)
    if (hash) {
      const caseStudy = allCaseStudies.find((cs) => cs.id === hash)
      if (caseStudy) {
        setSelectedCaseStudy(caseStudy.id)
        setIsModalOpen(true)
      }
    }

    // Check query parameter
    const params = new URLSearchParams(window.location.search)
    const caseStudyId = params.get('case-study')
    if (caseStudyId) {
      const caseStudy = allCaseStudies.find((cs) => cs.id === caseStudyId)
      if (caseStudy) {
        setSelectedCaseStudy(caseStudy.id)
        setIsModalOpen(true)
      }
    }
  }, [isLoading, allCaseStudies])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isModalOpen && selectedCaseStudy) {
      // Update URL without reload
      window.history.pushState(
        { caseStudy: selectedCaseStudy },
        '',
        `#${selectedCaseStudy}`
      )
    } else {
      // Remove hash when closing
      if (window.location.hash) {
        window.history.pushState({}, '', window.location.pathname)
      }
    }
  }, [isModalOpen, selectedCaseStudy])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        const caseStudy = allCaseStudies.find((cs) => cs.id === hash)
        if (caseStudy) {
          setSelectedCaseStudy(caseStudy.id)
          setIsModalOpen(true)
        }
      } else {
        setIsModalOpen(false)
        setSelectedCaseStudy(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [allCaseStudies])

  const categories: (CaseStudyCategory | 'All')[] = [
    'All',
    'SaaS',
    'AI Agents',
    'Integrations',
    'Marketplaces',
  ]

  const filteredCaseStudies = selectedCategory === 'All'
    ? allCaseStudies
    : allCaseStudies.filter((cs) => cs.category.includes(selectedCategory))

  const currentCaseStudy = allCaseStudies.find((cs) => cs.id === selectedCaseStudy)

  const handleCardClick = (caseStudyId: string) => {
    setSelectedCaseStudy(caseStudyId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCaseStudy(null)
  }

  return (
    <Section id="portfolio" background="card">
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          Portfolio
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto px-2">
          Real projects, real results
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-nowrap gap-2 justify-start sm:justify-center overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 min-h-[44px] flex items-center justify-center whitespace-nowrap snap-start ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-card border border-border text-foreground hover:bg-border/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      {filteredCaseStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredCaseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              onClick={() => handleCardClick(caseStudy.id)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">No case studies found in this category.</p>
        </div>
      )}

      {/* Modal */}
      <CaseStudyModal
        caseStudy={currentCaseStudy || null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Section>
  )
}

