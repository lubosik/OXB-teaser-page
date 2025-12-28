import { CaseStudy, CaseStudyCategory } from '@/content/case-studies'
import * as fs from 'fs'
import * as path from 'path'

// Safely get enhanced metadata
function getEnhancedMetadata(): Record<string, any> {
  try {
    // Use dynamic import for better compatibility
    const enhancedModule = require('@/data/portfolio/enhanced')
    return enhancedModule.enhancedMetadata || {}
  } catch (error) {
    // If import fails, return empty object
    return {}
  }
}

interface IngestedMetadata {
  slug: string
  url: string
  title: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  h1?: string
  h2s?: string[]
  status: 'success' | 'blocked' | 'error'
  error?: string
  screenshotPath?: string
  screenshotPaths?: string[] // Multiple screenshots
  thumbnailPath?: string
  timestamp: string
}

/**
 * Infer category from project metadata
 */
function inferCategory(metadata: IngestedMetadata): CaseStudyCategory[] {
  const title = (metadata.title || '').toLowerCase()
  const description = (metadata.description || metadata.ogDescription || '').toLowerCase()
  const h2s = (metadata.h2s || []).join(' ').toLowerCase()
  const combined = `${title} ${description} ${h2s}`

  const categories: CaseStudyCategory[] = []

  // AI-related keywords
  if (
    combined.includes('ai') ||
    combined.includes('artificial intelligence') ||
    combined.includes('chatbot') ||
    combined.includes('agent') ||
    combined.includes('voice')
  ) {
    categories.push('AI Agents')
  }

  // SaaS keywords
  if (
    combined.includes('saas') ||
    combined.includes('platform') ||
    combined.includes('software') ||
    combined.includes('app')
  ) {
    categories.push('SaaS')
  }

  // Lead gen/CRM keywords
  if (
    combined.includes('lead') ||
    combined.includes('crm') ||
    combined.includes('sales') ||
    combined.includes('customer')
  ) {
    categories.push('Lead Gen/CRM')
  }

  // Automation keywords
  if (
    combined.includes('automation') ||
    combined.includes('workflow') ||
    combined.includes('automate')
  ) {
    categories.push('Automations')
  }

  // Integration keywords
  if (
    combined.includes('integration') ||
    combined.includes('api') ||
    combined.includes('connect')
  ) {
    categories.push('Integrations')
  }

  // Marketplace keywords
  if (
    combined.includes('marketplace') ||
    combined.includes('market') ||
    combined.includes('buy') ||
    combined.includes('sell')
  ) {
    categories.push('Marketplaces')
  }

  // Ops tooling keywords
  if (
    combined.includes('dashboard') ||
    combined.includes('ops') ||
    combined.includes('operations') ||
    combined.includes('internal')
  ) {
    categories.push('Ops Tooling')
  }

  // Default to SaaS if no categories found
  if (categories.length === 0) {
    categories.push('SaaS')
  }

  return categories
}

/**
 * Extract tech stack from metadata
 */
function extractTechStack(metadata: IngestedMetadata): string[] {
  const tech: string[] = []
  const combined = [
    metadata.title,
    metadata.description,
    metadata.ogDescription,
    ...(metadata.h2s || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  // Common tech stack detection
  const techKeywords: Record<string, string> = {
    'next.js': 'Next.js',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'node.js': 'Node.js',
    'python': 'Python',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'mysql': 'MySQL',
    'stripe': 'Stripe',
    'tailwind': 'Tailwind CSS',
    'prisma': 'Prisma',
    'supabase': 'Supabase',
    'vercel': 'Vercel',
    'aws': 'AWS',
  }

  for (const [keyword, techName] of Object.entries(techKeywords)) {
    if (combined.includes(keyword) && !tech.includes(techName)) {
      tech.push(techName)
    }
  }

  // Default tech stack if none found
  if (tech.length === 0) {
    tech.push('Next.js', 'TypeScript', 'Tailwind CSS')
  }

  return tech
}

/**
 * Transform ingested metadata to CaseStudy format
 * Merges with enhanced metadata if available
 */
function transformToCaseStudy(metadata: IngestedMetadata): CaseStudy {
  const enhancedMetadata = getEnhancedMetadata()
  const enhanced = enhancedMetadata[metadata.slug]
  
  // Use enhanced title or fall back to metadata
  const title = enhanced?.title || metadata.ogTitle || metadata.title || metadata.slug
  const oneLiner = enhanced?.oneLiner || 
    metadata.ogDescription || 
    metadata.description || 
    `Built and delivered ${title}`
  
  // Build images array: prioritize cover image, then screenshots, then additional images
  const images: string[] = []
  
  // First priority: cover image from enhanced metadata
  if (enhanced?.coverImage) {
    images.push(enhanced.coverImage)
  }
  
  // Second priority: multiple screenshots from ingestion
  if (metadata.screenshotPaths && metadata.screenshotPaths.length > 0) {
    images.push(...metadata.screenshotPaths)
  } else if (metadata.screenshotPath) {
    // Fallback to single screenshot
    images.push(metadata.screenshotPath)
  } else if (metadata.thumbnailPath) {
    // Last resort: use thumbnail
    images.push(metadata.thumbnailPath)
  }
  
  // Add any additional images from enhanced metadata (but not the cover image)
  if (enhanced?.additionalImages) {
    images.push(...enhanced.additionalImages.filter(img => img !== enhanced.coverImage))
  }

  // Merge categories: enhanced takes precedence
  const category = enhanced?.category || inferCategory(metadata)
  
  // Merge tech stack: enhanced takes precedence
  const tech = enhanced?.tech || extractTechStack(metadata)

  return {
    id: metadata.slug,
    title,
    oneLiner,
    category,
    problem: enhanced?.problem || `Client needed a solution for ${title.toLowerCase()}.`,
    build: enhanced?.build || `Built ${title} with modern web technologies and best practices.`,
    outcome: enhanced?.outcome || `Successfully delivered ${title} with positive results.`,
    tech,
    images,
    videoUrl: enhanced?.videoUrl,
    pdfUrl: enhanced?.pdfUrl,
    websiteUrl: enhanced?.websiteUrl || metadata.url,
    developerCredit: enhanced?.developerCredit,
    imagePrompt: enhanced?.imagePrompt,
  }
}

/**
 * Load all ingested portfolio metadata files
 */
export function loadIngestedPortfolio(): CaseStudy[] {
  try {
    const ingestedDir = path.join(process.cwd(), 'data/portfolio/ingested')
    
    if (!fs.existsSync(ingestedDir)) {
      return []
    }

    const files = fs.readdirSync(ingestedDir)
    const jsonFiles = files.filter((file) => file.endsWith('.json'))

    const caseStudies: CaseStudy[] = []

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(ingestedDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const metadata = JSON.parse(content) as IngestedMetadata

        // Skip if status is error or missing required fields
        if (metadata.status === 'error' || !metadata.slug || !metadata.url) {
          continue
        }
        
        // Skip placeholder/example projects
        if (metadata.slug === 'example' || metadata.url.includes('example.com')) {
          continue
        }

        const caseStudy = transformToCaseStudy(metadata)
        caseStudies.push(caseStudy)
      } catch (error) {
        console.error(`Error loading ${file}:`, error)
        continue
      }
    }

    return caseStudies
  } catch (error) {
    console.error('Error loading ingested portfolio:', error)
    return []
  }
}

/**
 * Merge ingested portfolio with existing case studies
 * Ingested projects take precedence if they have the same ID
 */
export function mergePortfolioData(
  existing: CaseStudy[],
  ingested: CaseStudy[]
): CaseStudy[] {
  const existingMap = new Map(existing.map((cs) => [cs.id, cs]))
  const ingestedMap = new Map(ingested.map((cs) => [cs.id, cs]))

  // Start with existing case studies
  const merged: CaseStudy[] = []

  // Add existing case studies that aren't overridden by ingested
  for (const caseStudy of existing) {
    if (!ingestedMap.has(caseStudy.id)) {
      merged.push(caseStudy)
    }
  }

  // Add all ingested case studies (they override existing ones with same ID)
  for (const caseStudy of ingested) {
    merged.push(caseStudy)
  }

  return merged
}

