import { NextResponse } from 'next/server'
import { loadIngestedPortfolio, mergePortfolioData } from '@/lib/portfolio-loader'
import { caseStudies } from '@/content/case-studies'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const ingested = loadIngestedPortfolio()
    const merged = mergePortfolioData(caseStudies, ingested)
    
    return NextResponse.json(merged, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error loading portfolio:', error)
    // Fallback to existing case studies if ingestion fails
    return NextResponse.json(caseStudies, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  }
}

