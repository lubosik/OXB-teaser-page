#!/usr/bin/env node

/**
 * Interactive script to enhance ingested portfolio case studies
 * 
 * Usage:
 *   npm run enhance:portfolio [slug]
 * 
 * If slug is provided, opens that case study for editing.
 * Otherwise, lists all ingested case studies and lets you choose.
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import * as readline from 'readline'

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
  thumbnailPath?: string
  timestamp: string
}

interface EnhancedMetadata {
  slug: string
  title?: string
  oneLiner?: string
  category?: string[]
  problem?: string
  build?: string
  outcome?: string
  tech?: string[]
  videoUrl?: string
  pdfUrl?: string
  additionalImages?: string[]
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function loadIngestedMetadata(slug: string): Promise<IngestedMetadata | null> {
  try {
    const filePath = path.join('data/portfolio/ingested', `${slug}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

async function listIngestedProjects(): Promise<string[]> {
  try {
    const dir = path.join('data/portfolio/ingested')
    const files = await fs.readdir(dir)
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
      .filter((f) => f !== 'example') // Skip example
  } catch {
    return []
  }
}

async function loadEnhancedMetadata(): Promise<Record<string, EnhancedMetadata>> {
  try {
    const filePath = path.join('data/portfolio/enhanced.ts')
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Simple extraction of enhanced metadata (basic parsing)
    // In production, you might want to use a proper TypeScript parser
    const matches = content.matchAll(/^\s*(\w+):\s*\{/gm)
    const slugs: string[] = []
    for (const match of matches) {
      slugs.push(match[1])
    }
    
    // For now, return empty - user will edit the file directly
    return {}
  } catch {
    return {}
  }
}

async function displayProjectInfo(metadata: IngestedMetadata) {
  console.log('\n' + '='.repeat(60))
  console.log(`Project: ${metadata.slug}`)
  console.log('='.repeat(60))
  console.log(`Title: ${metadata.title || metadata.ogTitle || 'N/A'}`)
  console.log(`URL: ${metadata.url}`)
  console.log(`Description: ${metadata.ogDescription || metadata.description || 'N/A'}`)
  console.log(`Status: ${metadata.status}`)
  if (metadata.h2s && metadata.h2s.length > 0) {
    console.log(`\nHeadings found:`)
    metadata.h2s.slice(0, 5).forEach((h2, i) => {
      console.log(`  ${i + 1}. ${h2}`)
    })
  }
  console.log('='.repeat(60) + '\n')
}

async function main() {
  const args = process.argv.slice(2)
  let targetSlug = args[0]

  if (!targetSlug) {
    // List all projects
    const projects = await listIngestedProjects()
    
    if (projects.length === 0) {
      console.log('❌ No ingested projects found. Run ingestion first.')
      process.exit(1)
    }

    console.log('\n📋 Available projects:\n')
    projects.forEach((slug, i) => {
      console.log(`  ${i + 1}. ${slug}`)
    })
    
    const choice = await question('\nEnter project number or slug: ')
    const num = parseInt(choice, 10)
    
    if (!isNaN(num) && num > 0 && num <= projects.length) {
      targetSlug = projects[num - 1]
    } else {
      targetSlug = choice.trim()
    }
  }

  const metadata = await loadIngestedMetadata(targetSlug)
  
  if (!metadata) {
    console.error(`❌ Project "${targetSlug}" not found.`)
    process.exit(1)
  }

  await displayProjectInfo(metadata)

  console.log('📝 To enhance this project, edit: data/portfolio/enhanced.ts')
  console.log(`\nAdd an entry for "${targetSlug}" with fields like:`)
  console.log(`
  ${targetSlug}: {
    slug: '${targetSlug}',
    title: '${metadata.ogTitle || metadata.title || 'Project Title'}',
    oneLiner: 'Short description here',
    category: ['SaaS'], // or ['AI Agents'], ['Marketplaces'], etc.
    problem: 'Detailed problem statement...',
    build: 'What was built and how...',
    outcome: 'Results and impact...',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
    websiteUrl: '${metadata.url}',
  },
  `)

  console.log('\n💡 Tips:')
  console.log('  - Use the h2s and description above to write better problem/build/outcome')
  console.log('  - Categories: SaaS, AI Agents, Automations, Lead Gen/CRM, Integrations, Ops Tooling, Marketplaces')
  console.log('  - After editing, the portfolio will automatically use the enhanced data\n')

  rl.close()
}

main().catch(console.error)

