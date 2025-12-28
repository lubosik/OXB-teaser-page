#!/usr/bin/env node

import { chromium, Browser, Page } from 'playwright'
import * as fs from 'fs/promises'
import * as path from 'path'
import sharp from 'sharp'
import * as cheerio from 'cheerio'
import { fetch } from 'undici'
import pdf from 'pdf-parse'

interface ProjectMetadata {
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
  screenshotPaths?: string[] // Multiple screenshots
  timestamp: string
}

interface ExtractedProject {
  name: string
  url: string
  slug: string
}

interface IngestOptions {
  urls: string[]
  outputDir: string
  force?: boolean
  maxScreenshots?: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function getSlugFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace(/^www\./, '')
    return slugify(hostname.split('.')[0] || hostname)
  } catch {
    return slugify(url)
  }
}

function normalizeUrl(url: string): string {
  url = url.trim()
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

async function getTotalSize(dir: string, paths: string[]): Promise<number> {
  let total = 0
  for (const relPath of paths) {
    const fullPath = path.join('public', relPath)
    try {
      const stats = await fs.stat(fullPath)
      total += stats.size
    } catch {
      // File doesn't exist, skip
    }
  }
  return total
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

async function findPdfFile(filename: string): Promise<string | null> {
  const candidates = [
    path.join(process.cwd(), filename),
    path.join(process.cwd(), 'assets', filename),
    path.join(process.cwd(), 'docs', filename),
    path.join(process.cwd(), '..', filename),
    path.join('/Users/ghost/Downloads', filename),
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      continue
    }
  }

  return null
}

async function extractProjectsFromPdf(pdfPath: string): Promise<ExtractedProject[]> {
  console.log(`📄 Reading PDF: ${pdfPath}`)
  const dataBuffer = await fs.readFile(pdfPath)
  const pdfData = await pdf(dataBuffer)
  const text = pdfData.text

  console.log(`📖 Extracted ${text.length} characters from PDF`)
  
  // Debug: show first 500 chars if extraction seems small
  if (text.length < 1000) {
    console.log(`📝 Sample text (first 500 chars): ${text.substring(0, 500)}`)
  }

  // Known URLs from the requirements (fallback if PDF parsing fails)
  const knownUrls = [
    'www.passportv3.io',
    'www.socialtip.io',
    'www.wearevenu.com',
    'www.takeoffyachts.com',
    'www.zoomies.ae',
    'www.izzyai.com',
  ]

  // More comprehensive URL patterns
  const urlPatterns = [
    // Full URLs with protocol
    /https?:\/\/[^\s\)]+/gi,
    // www. URLs
    /www\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(?:\/[^\s\)]*)?/gi,
    // Domain patterns (more flexible)
    /[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s\)]*)?/g,
  ]

  const foundUrls = new Set<string>()
  for (const pattern of urlPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        // Clean up URL
        let url = match.trim()
        // Remove trailing punctuation
        url = url.replace(/[.,;:!?\)]+$/, '')
        // Remove leading/trailing whitespace and parentheses
        url = url.replace(/^[\(\s]+|[\)\s]+$/g, '')
        // Skip if too short or looks like an email
        if (url.length > 4 && !url.includes('@') && !url.match(/^mailto:/i)) {
          // Skip common non-URL patterns
          if (!url.match(/^(the|a|an|and|or|but|in|on|at|to|for|of|with|by)$/i)) {
            foundUrls.add(url)
          }
        }
      })
    }
  }

  const projects: ExtractedProject[] = []
  const lines = text.split('\n')

  for (const url of foundUrls) {
    const normalized = normalizeUrl(url)
    
    // Try to find project name - look for text before the URL
    let projectName = ''
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(url) || lines[i].includes(url.replace('https://', '').replace('http://', ''))) {
        // Look backwards for a heading or name
        for (let j = Math.max(0, i - 3); j < i; j++) {
          const line = lines[j].trim()
          if (line && line.length > 3 && line.length < 100 && !line.includes('http')) {
            // Check if it looks like a project name (not a generic word)
            if (!/^(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\s/i.test(line)) {
              projectName = line
              break
            }
          }
        }
        break
      }
    }

    // If no name found, derive from URL
    if (!projectName) {
      try {
        const urlObj = new URL(normalized)
        const hostname = urlObj.hostname.replace(/^www\./, '')
        projectName = hostname.split('.')[0] || hostname
        projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1)
      } catch {
        projectName = url.replace(/^https?:\/\//, '').split('/')[0]
      }
    }

    projects.push({
      name: projectName.trim(),
      url: normalized,
      slug: getSlugFromUrl(normalized),
    })
  }

  // Always ensure known URLs are included (they're mentioned in requirements)
  const foundUrlSet = new Set(projects.map((p) => p.url.toLowerCase()))
  for (const knownUrl of knownUrls) {
    const normalized = normalizeUrl(knownUrl)
    if (!foundUrlSet.has(normalized.toLowerCase())) {
      try {
        const urlObj = new URL(normalized)
        const hostname = urlObj.hostname.replace(/^www\./, '')
        const projectName = hostname.split('.')[0] || hostname
        projects.push({
          name: projectName.charAt(0).toUpperCase() + projectName.slice(1),
          url: normalized,
          slug: getSlugFromUrl(normalized),
        })
        console.log(`➕ Added known URL: ${normalized}`)
      } catch {
        // Skip invalid URLs
      }
    }
  }
  
  if (projects.length === 0) {
    console.log(`⚠️  No URLs found in PDF text and no known URLs to process`)
  }

  // Remove duplicates by URL
  const uniqueProjects = Array.from(
    new Map(projects.map((p) => [p.url.toLowerCase(), p])).values()
  )

  console.log(`🔍 Found ${uniqueProjects.length} unique project URLs`)

  return uniqueProjects
}

async function createPlaceholderThumbnail(
  outputPath: string,
  projectName: string
): Promise<void> {
  const width = 600
  const height = 400
  const bgColor = '#faf8f3' // warm cream background
  const textColor = '#2d2d2d' // charcoal

  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="50%" y="45%" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">OXB</text>
      <text x="50%" y="55%" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${projectName}</text>
    </svg>
  `

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 80 })
    .toFile(outputPath)
}

async function downloadOgImage(ogImageUrl: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(ogImageUrl)
    if (!response.ok) return false

    const buffer = Buffer.from(await response.arrayBuffer())
    await sharp(buffer)
      .resize(600, 400, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toFile(outputPath)
    return true
  } catch {
    return false
  }
}

async function extractMetadataViaFetch(url: string): Promise<Partial<ProjectMetadata>> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    })
    const html = await response.text()
    const $ = cheerio.load(html)

    const metadata: Partial<ProjectMetadata> = {
      title: $('title').text() || undefined,
      description: $('meta[name="description"]').attr('content') || undefined,
      ogTitle: $('meta[property="og:title"]').attr('content') || undefined,
      ogDescription: $('meta[property="og:description"]').attr('content') || undefined,
      ogImage: $('meta[property="og:image"]').attr('content') || undefined,
      h1: $('h1').first().text().trim() || undefined,
      h2s: $('h2')
        .slice(0, 5)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean),
    }

    return metadata
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function extractMetadataFromPage(page: Page): Promise<Partial<ProjectMetadata>> {
  return await page.evaluate(() => {
    const getMeta = (selector: string) => {
      const meta = document.querySelector(selector)
      return meta?.getAttribute('content') || undefined
    }

    const getMetaName = (name: string) => {
      const meta = document.querySelector(`meta[name="${name}"]`)
      return meta?.getAttribute('content') || undefined
    }

    const h1 = document.querySelector('h1')?.textContent?.trim()
    const h2s = Array.from(document.querySelectorAll('h2'))
      .slice(0, 10) // Increased to 10 for better categorization
      .map((h2) => h2.textContent?.trim())
      .filter(Boolean) as string[]

    // Extract keywords if available
    const keywords = getMetaName('keywords')
    
    // Try to get canonical URL
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    
    // Extract language
    const lang = document.documentElement.lang || document.querySelector('html')?.getAttribute('lang')

    return {
      title: document.title || undefined,
      description: getMeta('meta[name="description"]') || getMetaName('description'),
      ogTitle: getMeta('meta[property="og:title"]'),
      ogDescription: getMeta('meta[property="og:description"]'),
      ogImage: getMeta('meta[property="og:image"]'),
      h1,
      h2s: h2s.length > 0 ? h2s : undefined,
    }
  })
}

async function optimizeScreenshot(
  inputPath: string,
  outputPath: string,
  maxWidth: number = 1920,
  quality: number = 85
): Promise<void> {
  try {
    await sharp(inputPath)
      .resize(maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true, // Better compression
        progressive: true,
      })
      .toFile(outputPath)
    
    // Remove original PNG if optimization succeeded
    if (inputPath !== outputPath && inputPath.endsWith('.png')) {
      await fs.unlink(inputPath).catch(() => {})
    }
  } catch (error) {
    console.log(`⚠️  Error optimizing screenshot: ${error}`)
    // Fallback: copy original if optimization fails
    if (inputPath !== outputPath) {
      await fs.copyFile(inputPath, outputPath).catch(() => {})
    }
  }
}

async function captureMultipleScreenshots(
  page: Page,
  projectDir: string,
  slug: string,
  maxScreenshots: number = 3
): Promise<string[]> {
  const screenshots: string[] = []
  
  try {
    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Capture full page screenshot (homepage)
    const homePathPng = path.join(projectDir, 'home.png')
    const homePathJpg = path.join(projectDir, 'home.jpg')
    await page.screenshot({
      path: homePathPng,
      fullPage: true,
      type: 'png',
    })
    
    // Optimize to JPEG
    await optimizeScreenshot(homePathPng, homePathJpg, 1920, 85)
    screenshots.push(`/portfolio/ingested/${slug}/home.jpg`)
    
    // Try to capture additional sections by scrolling
    if (maxScreenshots > 1) {
      const viewportHeight = 1080
      const pageHeight = await page.evaluate(() => document.body.scrollHeight)
      const scrollSteps = Math.min(maxScreenshots - 1, Math.ceil(pageHeight / viewportHeight) - 1)
      
      for (let i = 1; i <= scrollSteps && screenshots.length < maxScreenshots; i++) {
        // Scroll to different sections
        const scrollPosition = (viewportHeight * i)
        await page.evaluate((pos) => {
          window.scrollTo({ top: pos, behavior: 'instant' })
        }, scrollPosition)
        
        // Wait a bit for any lazy-loaded content
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Capture viewport screenshot (not full page for variety)
        const sectionPathPng = path.join(projectDir, `section-${i}.png`)
        const sectionPathJpg = path.join(projectDir, `section-${i}.jpg`)
        await page.screenshot({
          path: sectionPathPng,
          fullPage: false,
          type: 'png',
        })
        
        // Optimize to JPEG
        await optimizeScreenshot(sectionPathPng, sectionPathJpg, 1920, 85)
        screenshots.push(`/portfolio/ingested/${slug}/section-${i}.jpg`)
      }
    }
    
    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    
  } catch (error) {
    console.log(`⚠️  Error capturing multiple screenshots: ${error}`)
  }
  
  return screenshots
}

async function ingestProject(
  browser: Browser,
  url: string,
  options: IngestOptions
): Promise<ProjectMetadata> {
  const slug = getSlugFromUrl(url)
  const projectDir = path.join(options.outputDir, slug)
  const metadataPath = path.join('data/portfolio/ingested', `${slug}.json`)
  const screenshotPath = path.join(projectDir, 'home.png')
  const thumbnailPath = path.join(projectDir, 'thumb.jpg')

  // Check if already exists
  if (!options.force) {
    try {
      const existing = await fs.readFile(metadataPath, 'utf-8')
      const metadata = JSON.parse(existing) as ProjectMetadata
      if (metadata.screenshotPath && metadata.thumbnailPath) {
        console.log(`⏭️  Skipping ${url} (already ingested)`)
        return metadata
      }
    } catch {
      // File doesn't exist, continue
    }
  }

  await fs.mkdir(projectDir, { recursive: true })

  const metadata: ProjectMetadata = {
    slug,
    url,
    title: '',
    status: 'success',
    timestamp: new Date().toISOString(),
  }

  let page: Page | null = null

  try {
    console.log(`🌐 Crawling ${url}...`)

    page = await browser.newPage()
    await page.setViewportSize({ width: 1920, height: 1080 })

    try {
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // Extract metadata
      const pageMetadata = await extractMetadataFromPage(page)
      Object.assign(metadata, pageMetadata)

      // Capture multiple screenshots
      const maxScreenshots = options.maxScreenshots || 3
      const screenshotPaths = await captureMultipleScreenshots(page, projectDir, slug, maxScreenshots)
      
      if (screenshotPaths.length > 0) {
        metadata.screenshotPath = screenshotPaths[0] // Keep for backward compatibility
        metadata.screenshotPaths = screenshotPaths // New field for multiple screenshots
        
        // Generate optimized thumbnail from first screenshot
        const firstScreenshotPath = path.join(projectDir, 'home.jpg')
        
        try {
          await sharp(firstScreenshotPath)
            .resize(600, 400, { fit: 'cover', position: 'center' })
            .jpeg({
              quality: 85,
              mozjpeg: true,
              progressive: true,
            })
            .toFile(thumbnailPath)
        } catch (error) {
          // Fallback if home.jpg doesn't exist (shouldn't happen, but just in case)
          const fallbackPath = path.join(projectDir, 'home.png')
          await sharp(fallbackPath)
            .resize(600, 400, { fit: 'cover', position: 'center' })
            .jpeg({
              quality: 85,
              mozjpeg: true,
              progressive: true,
            })
            .toFile(thumbnailPath)
        }

        metadata.thumbnailPath = `/portfolio/ingested/${slug}/thumb.jpg`
        metadata.status = 'success'

        const totalSize = await getTotalSize(projectDir, screenshotPaths)
        console.log(`✅ Successfully ingested ${url} (${screenshotPaths.length} screenshots, ${formatBytes(totalSize)})`)
      }
    } catch (error) {
      console.log(`⚠️  Browser navigation failed for ${url}, trying fallback...`)
      metadata.status = 'blocked'

      // Fallback: try fetch + OG image
      const fetchMetadata = await extractMetadataViaFetch(url)
      Object.assign(metadata, fetchMetadata)

      if (metadata.ogImage) {
        const ogImageUrl = metadata.ogImage.startsWith('http')
          ? metadata.ogImage
          : new URL(metadata.ogImage, url).toString()

        const downloaded = await downloadOgImage(ogImageUrl, thumbnailPath)
        if (downloaded) {
          // Copy thumbnail as screenshot too
          await fs.copyFile(thumbnailPath, screenshotPath.replace('.png', '.jpg'))
          metadata.screenshotPath = `/portfolio/ingested/${slug}/home.jpg`
          metadata.thumbnailPath = `/portfolio/ingested/${slug}/thumb.jpg`
          metadata.status = 'success'
          console.log(`✅ Used OG image for ${url}`)
        }
      }

      if (!metadata.thumbnailPath) {
        // Generate placeholder
        const projectName = metadata.title || metadata.ogTitle || slug
        await createPlaceholderThumbnail(thumbnailPath, projectName)
        await createPlaceholderThumbnail(screenshotPath.replace('.png', '.jpg'), projectName)
        metadata.screenshotPath = `/portfolio/ingested/${slug}/home.jpg`
        metadata.thumbnailPath = `/portfolio/ingested/${slug}/thumb.jpg`
        metadata.status = 'blocked'
        console.log(`📦 Generated placeholder for ${url}`)
      }
    }
  } catch (error) {
    metadata.status = 'error'
    metadata.error = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Error ingesting ${url}:`, error)

    // Ensure we have at least a placeholder
    if (!metadata.thumbnailPath) {
      const projectName = metadata.title || slug
      await createPlaceholderThumbnail(thumbnailPath, projectName)
      await createPlaceholderThumbnail(screenshotPath.replace('.png', '.jpg'), projectName)
      metadata.screenshotPath = `/portfolio/ingested/${slug}/home.jpg`
      metadata.thumbnailPath = `/portfolio/ingested/${slug}/thumb.jpg`
    }
  } finally {
    if (page) await page.close()
  }

  // Save metadata
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))

  return metadata
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const pdfIndex = args.findIndex((arg) => arg === '--pdf')
  const urlIndex = args.findIndex((arg) => arg === '--urls')
  const screenshotsIndex = args.findIndex((arg) => arg === '--screenshots')
  const urls: string[] = []
  let maxScreenshots = 3

  // Handle PDF extraction
  if (pdfIndex !== -1 && args[pdfIndex + 1]) {
    const pdfFilename = args[pdfIndex + 1]
    const pdfPath = await findPdfFile(pdfFilename)

    if (!pdfPath) {
      console.error(`❌ PDF file not found: ${pdfFilename}`)
      console.error(`   Searched in: assets/, docs/, repo root, and Downloads folder`)
      process.exit(1)
    }

    console.log(`📄 Extracting projects from PDF...`)
    const extractedProjects = await extractProjectsFromPdf(pdfPath)

    // Save extracted list
    const extractedPath = path.join('data/portfolio', 'partner-extracted.json')
    await fs.writeFile(
      extractedPath,
      JSON.stringify(extractedProjects, null, 2)
    )
    console.log(`💾 Saved extracted projects to ${extractedPath}`)

    // Add URLs to ingestion list
    if (extractedProjects.length > 0) {
      urls.push(...extractedProjects.map((p) => p.url))
    } else {
      console.log(`⚠️  No URLs extracted from PDF, but continuing with known URLs if any were found`)
    }
  }
  
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    // Handle explicit URLs
    urls.push(...args[urlIndex + 1].split(',').map((u) => u.trim()))
  }

  // Parse max screenshots option
  if (screenshotsIndex !== -1 && args[screenshotsIndex + 1]) {
    const screenshotsValue = parseInt(args[screenshotsIndex + 1], 10)
    if (!isNaN(screenshotsValue) && screenshotsValue > 0) {
      maxScreenshots = Math.min(screenshotsValue, 10) // Cap at 10
    }
  }

  if (urls.length === 0) {
    console.error('❌ No URLs provided.')
    console.error('   Use --pdf "filename.pdf" to extract from PDF')
    console.error('   Or use --urls "url1,url2,url3" for explicit URLs')
    console.error('   Optional: --screenshots N (1-10, default: 3)')
    process.exit(1)
  }

  console.log(`🚀 Starting ingestion for ${urls.length} URL(s)...`)

  const browser = await chromium.launch({ headless: true })
  const outputDir = path.join(process.cwd(), 'public/portfolio/ingested')

  try {
    const results: ProjectMetadata[] = []

    for (const url of urls) {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
      const result = await ingestProject(browser, normalizedUrl, {
        urls,
        outputDir,
        force,
        maxScreenshots,
      })
      results.push(result)
    }

    console.log(`\n✨ Ingestion complete!`)
    console.log(`✅ Success: ${results.filter((r) => r.status === 'success').length}`)
    console.log(`⚠️  Blocked/Fallback: ${results.filter((r) => r.status === 'blocked').length}`)
    console.log(`❌ Errors: ${results.filter((r) => r.status === 'error').length}`)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
