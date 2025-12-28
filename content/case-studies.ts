export type CaseStudyCategory = 
  | 'SaaS'
  | 'AI Agents'
  | 'Automations'
  | 'Lead Gen/CRM'
  | 'Integrations'
  | 'Ops Tooling'
  | 'Marketplaces'

export interface CaseStudy {
  id: string
  title: string
  oneLiner: string
  category: CaseStudyCategory[]
  problem: string
  build: string
  outcome: string
  tech: string[]
  images?: string[] // Paths to images in /public/case-studies/
  videoUrl?: string // Loom/YouTube/Vimeo URL
  pdfUrl?: string // Path to PDF in /public/case-studies/
  websiteUrl?: string // Live website URL
  developerCredit?: string // Credit to original developer
  imagePrompt?: string // Prompt for generating cover image
}

export const caseStudies: CaseStudy[] = []
