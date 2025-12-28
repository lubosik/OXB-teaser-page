#!/usr/bin/env node

/**
 * Validation script for ingested portfolio data
 * Checks for missing files, broken links, and data quality issues
 * 
 * Usage:
 *   npm run validate:portfolio
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { loadIngestedPortfolio } from '@/lib/portfolio-loader'

interface ValidationIssue {
  slug: string
  type: 'error' | 'warning'
  message: string
}

async function validatePortfolio(): Promise<void> {
  console.log('🔍 Validating portfolio data...\n')
  
  const issues: ValidationIssue[] = []
  const ingested = loadIngestedPortfolio()
  
  if (ingested.length === 0) {
    console.log('⚠️  No ingested projects found.')
    return
  }

  console.log(`📊 Found ${ingested.length} ingested projects\n`)

  for (const project of ingested) {
    // Check if images exist
    if (project.images && project.images.length > 0) {
      for (const imagePath of project.images) {
        const fullPath = path.join('public', imagePath)
        try {
          await fs.access(fullPath)
        } catch {
          issues.push({
            slug: project.id,
            type: 'error',
            message: `Missing image: ${imagePath}`,
          })
        }
      }
    } else {
      issues.push({
        slug: project.id,
        type: 'warning',
        message: 'No images found',
      })
    }

    // Check for generic descriptions
    if (project.problem.includes('Client needed a solution for')) {
      issues.push({
        slug: project.id,
        type: 'warning',
        message: 'Generic problem description - consider enhancing in data/portfolio/enhanced.ts',
      })
    }

    if (project.build.includes('Built') && project.build.includes('with modern web technologies')) {
      issues.push({
        slug: project.id,
        type: 'warning',
        message: 'Generic build description - consider enhancing in data/portfolio/enhanced.ts',
      })
    }

    if (project.outcome.includes('Successfully delivered') && project.outcome.includes('with positive results')) {
      issues.push({
        slug: project.id,
        type: 'warning',
        message: 'Generic outcome description - consider enhancing in data/portfolio/enhanced.ts',
      })
    }

    // Check for missing website URL
    if (!project.websiteUrl) {
      issues.push({
        slug: project.id,
        type: 'warning',
        message: 'Missing website URL',
      })
    }

    // Check for empty tech stack
    if (!project.tech || project.tech.length === 0) {
      issues.push({
        slug: project.id,
        type: 'warning',
        message: 'Empty tech stack',
      })
    }

    // Check for empty categories
    if (!project.category || project.category.length === 0) {
      issues.push({
        slug: project.id,
        type: 'error',
        message: 'No categories assigned',
      })
    }
  }

  // Report issues
  const errors = issues.filter((i) => i.type === 'error')
  const warnings = issues.filter((i) => i.type === 'warning')

  if (errors.length > 0) {
    console.log('❌ Errors:\n')
    errors.forEach((issue) => {
      console.log(`  ${issue.slug}: ${issue.message}`)
    })
    console.log('')
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:\n')
    warnings.forEach((issue) => {
      console.log(`  ${issue.slug}: ${issue.message}`)
    })
    console.log('')
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All validations passed!\n')
  } else {
    console.log(`📋 Summary: ${errors.length} error(s), ${warnings.length} warning(s)\n`)
    
    if (warnings.length > 0) {
      console.log('💡 Tip: Run `npm run enhance:portfolio [slug]` to improve descriptions\n')
    }
  }

  // Exit with error code if there are critical issues
  if (errors.length > 0) {
    process.exit(1)
  }
}

validatePortfolio().catch((error) => {
  console.error('❌ Validation failed:', error)
  process.exit(1)
})

