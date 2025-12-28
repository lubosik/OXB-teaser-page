#!/usr/bin/env node

/**
 * Portfolio management utilities
 * 
 * Usage:
 *   npm run manage:portfolio list          - List all projects with stats
 *   npm run manage:portfolio cleanup       - Remove orphaned files
 *   npm run manage:portfolio stats          - Show portfolio statistics
 *   npm run manage:portfolio export [format] - Export portfolio data (json/csv)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { loadIngestedPortfolio } from '@/lib/portfolio-loader'
import { caseStudies } from '@/content/case-studies'

interface ProjectStats {
  slug: string
  title: string
  status: string
  screenshotCount: number
  totalSize: number
  hasEnhanced: boolean
  lastUpdated: string
}

async function listProjects(): Promise<void> {
  console.log('📋 Portfolio Projects\n')
  console.log('='.repeat(80))
  
  const ingested = loadIngestedPortfolio()
  const allProjects = [...caseStudies, ...ingested]
  
  const stats: ProjectStats[] = []
  
  for (const project of allProjects) {
    const ingestedDir = path.join('data/portfolio/ingested', `${project.id}.json`)
    let status = 'manual'
    let screenshotCount = project.images?.length || 0
    let totalSize = 0
    let lastUpdated = 'N/A'
    let hasEnhanced = false
    
    // Check if it's an ingested project
    try {
      const metadataContent = await fs.readFile(ingestedDir, 'utf-8')
      const metadata = JSON.parse(metadataContent)
      status = metadata.status || 'ingested'
      lastUpdated = new Date(metadata.timestamp).toLocaleDateString()
      screenshotCount = metadata.screenshotPaths?.length || metadata.screenshotPath ? 1 : 0
      
      // Calculate total size
      if (metadata.screenshotPaths) {
        for (const imgPath of metadata.screenshotPaths) {
          const fullPath = path.join('public', imgPath)
          try {
            const stat = await fs.stat(fullPath)
            totalSize += stat.size
          } catch {
            // File doesn't exist
          }
        }
      }
      
      // Also check thumbnail
      if (metadata.thumbnailPath) {
        const thumbPath = path.join('public', metadata.thumbnailPath)
        try {
          const stat = await fs.stat(thumbPath)
          totalSize += stat.size
        } catch {
          // File doesn't exist
        }
      }
      
      // Check for enhanced metadata
      try {
        const enhancedContent = await fs.readFile('data/portfolio/enhanced.ts', 'utf-8')
        // Check for slug in enhanced metadata (look for slug: 'project-id')
        hasEnhanced = enhancedContent.includes(`slug: '${project.id}'`) || enhancedContent.includes(`slug: "${project.id}"`)
      } catch {
        // Enhanced file doesn't exist
      }
    } catch {
      // Not an ingested project
    }
    
    stats.push({
      slug: project.id,
      title: project.title,
      status,
      screenshotCount,
      totalSize,
      hasEnhanced,
      lastUpdated,
    })
  }
  
  // Sort by title
  stats.sort((a, b) => a.title.localeCompare(b.title))
  
  // Display
  console.log(`${'Title'.padEnd(30)} ${'Status'.padEnd(12)} ${'Screenshots'.padEnd(12)} ${'Size'.padEnd(10)} ${'Enhanced'.padEnd(10)}`)
  console.log('-'.repeat(80))
  
  for (const stat of stats) {
    const sizeStr = stat.totalSize > 0 ? formatBytes(stat.totalSize) : 'N/A'
    const enhancedStr = stat.hasEnhanced ? '✓' : '-'
    console.log(
      `${stat.title.substring(0, 28).padEnd(30)} ${stat.status.padEnd(12)} ${stat.screenshotCount.toString().padEnd(12)} ${sizeStr.padEnd(10)} ${enhancedStr.padEnd(10)}`
    )
  }
  
  console.log('='.repeat(80))
  console.log(`\nTotal: ${stats.length} projects`)
  console.log(`Ingested: ${stats.filter(s => s.status !== 'manual').length}`)
  console.log(`Enhanced: ${stats.filter(s => s.hasEnhanced).length}`)
}

async function showStats(): Promise<void> {
  console.log('📊 Portfolio Statistics\n')
  
  const ingested = loadIngestedPortfolio()
  const allProjects = [...caseStudies, ...ingested]
  
  // Count by category
  const categoryCount: Record<string, number> = {}
  for (const project of allProjects) {
    for (const cat of project.category) {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    }
  }
  
  // Count by status
  const statusCount: Record<string, number> = { manual: caseStudies.length }
  for (const project of ingested) {
    try {
      const metadataPath = path.join('data/portfolio/ingested', `${project.id}.json`)
      const content = await fs.readFile(metadataPath, 'utf-8')
      const metadata = JSON.parse(content)
      const status = metadata.status || 'unknown'
      statusCount[status] = (statusCount[status] || 0) + 1
    } catch {
      statusCount.unknown = (statusCount.unknown || 0) + 1
    }
  }
  
  // Calculate total size
  let totalSize = 0
  const ingestedDir = path.join('public/portfolio/ingested')
  try {
    const dirs = await fs.readdir(ingestedDir)
    for (const dir of dirs) {
      const dirPath = path.join(ingestedDir, dir)
      const files = await fs.readdir(dirPath)
      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stat = await fs.stat(filePath)
        totalSize += stat.size
      }
    }
  } catch {
    // Directory doesn't exist
  }
  
  console.log('Projects by Category:')
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat.padEnd(20)} ${count}`)
    })
  
  console.log('\nProjects by Status:')
  Object.entries(statusCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([status, count]) => {
      console.log(`  ${status.padEnd(20)} ${count}`)
    })
  
  console.log(`\nTotal Projects: ${allProjects.length}`)
  console.log(`Total Storage: ${formatBytes(totalSize)}`)
  console.log(`Average per Project: ${formatBytes(Math.floor(totalSize / Math.max(1, ingested.length)))}`)
}

async function cleanupOrphanedFiles(): Promise<void> {
  console.log('🧹 Cleaning up orphaned files...\n')
  
  let removed = 0
  let errors = 0
  
  // Check ingested directory
  const ingestedDir = path.join('data/portfolio/ingested')
  const publicDir = path.join('public/portfolio/ingested')
  
  try {
    const metadataFiles = await fs.readdir(ingestedDir)
    const validSlugs = new Set(metadataFiles.map(f => f.replace('.json', '')))
    
    // Check public directory for orphaned project folders
    try {
      const projectDirs = await fs.readdir(publicDir)
      for (const dir of projectDirs) {
        if (!validSlugs.has(dir)) {
          const dirPath = path.join(publicDir, dir)
          console.log(`  Removing orphaned directory: ${dir}`)
          try {
            await fs.rm(dirPath, { recursive: true })
            removed++
          } catch (error) {
            console.error(`  ❌ Error removing ${dir}:`, error)
            errors++
          }
        }
      }
    } catch {
      // Directory doesn't exist
    }
    
    // Check for orphaned PNG files (should be converted to JPG)
    for (const slug of validSlugs) {
      const projectDir = path.join(publicDir, slug)
      try {
        const files = await fs.readdir(projectDir)
        for (const file of files) {
          if (file.endsWith('.png') && file !== 'home.png') {
            // Check if corresponding JPG exists
            const jpgFile = file.replace('.png', '.jpg')
            if (files.includes(jpgFile)) {
              const pngPath = path.join(projectDir, file)
              console.log(`  Removing old PNG: ${slug}/${file}`)
              try {
                await fs.unlink(pngPath)
                removed++
              } catch (error) {
                console.error(`  ❌ Error removing ${file}:`, error)
                errors++
              }
            }
          }
        }
      } catch {
        // Project directory doesn't exist
      }
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
  
  console.log(`\n✅ Cleanup complete: ${removed} file(s) removed, ${errors} error(s)`)
}

async function exportPortfolio(format: string = 'json'): Promise<void> {
  console.log(`📤 Exporting portfolio data (${format.toUpperCase()})...\n`)
  
  const ingested = loadIngestedPortfolio()
  const allProjects = [...caseStudies, ...ingested]
  
  if (format === 'json') {
    const outputPath = 'portfolio-export.json'
    await fs.writeFile(outputPath, JSON.stringify(allProjects, null, 2))
    console.log(`✅ Exported ${allProjects.length} projects to ${outputPath}`)
  } else if (format === 'csv') {
    const outputPath = 'portfolio-export.csv'
    const headers = ['ID', 'Title', 'One Liner', 'Categories', 'Tech Stack', 'Website URL', 'Images Count']
    const rows = allProjects.map(p => [
      p.id,
      p.title,
      p.oneLiner,
      p.category.join('; '),
      p.tech.join('; '),
      p.websiteUrl || '',
      (p.images?.length || 0).toString(),
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
    await fs.writeFile(outputPath, csv)
    console.log(`✅ Exported ${allProjects.length} projects to ${outputPath}`)
  } else {
    console.error(`❌ Unknown format: ${format}. Use 'json' or 'csv'`)
    process.exit(1)
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  switch (command) {
    case 'list':
      await listProjects()
      break
    case 'stats':
      await showStats()
      break
    case 'cleanup':
      await cleanupOrphanedFiles()
      break
    case 'export':
      const format = args[1] || 'json'
      await exportPortfolio(format)
      break
    default:
      console.log('Portfolio Management Tools\n')
      console.log('Usage:')
      console.log('  npm run manage:portfolio list          - List all projects with stats')
      console.log('  npm run manage:portfolio stats         - Show portfolio statistics')
      console.log('  npm run manage:portfolio cleanup       - Remove orphaned files')
      console.log('  npm run manage:portfolio export [json|csv] - Export portfolio data')
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

