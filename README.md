# OXB Studio Portfolio

A premium, single-page portfolio/capability showcase for OXB Studio (Operators x Builders). This is a sales asset designed for outreach to business owners.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js 14 App Router pages and layouts
- `/components` - Reusable React components
- `/content` - Data files for capabilities and case studies
- `/public` - Static assets (logo, images, PDFs)
  - `/public/case-studies` - Case study media files

## Design System

Theme tokens are defined in `app/globals.css` as CSS variables. Adjust these to match the design precisely:

- `--bg`: Background color (warm off-white/cream) - `#faf8f3`
- `--text`: Primary text color (dark near-black) - `#2d2d2d`
- `--muted`: Secondary text color (muted gray) - `#6b6b6b`
- `--accent`: Primary accent color (warm orange) - `#ff6b35`
- `--card`: Card background color - `#ffffff`
- `--border`: Border color - `#e5e5e5`
- `--radius`: Border radius for rounded corners - `8px`

## Mobile Optimization

The site is fully optimized for mobile devices:
- Responsive navigation with mobile menu
- Touch-friendly buttons (minimum 44x44px)
- Full-screen modals on mobile
- Optimized typography and spacing
- Horizontal scrollable filters
- Calendly widget responsive sizing

## Adding Case Studies

### Method 1: Manual Entry (Existing Method)

Case studies are defined in `/content/case-studies.ts`. To add a new case study:

1. **Add media files** to `/public/case-studies/`:
   - Images: `your-project-1.jpg`, `your-project-2.jpg`, etc.
   - PDF (optional): `your-project-case-study.pdf`

2. **Edit `/content/case-studies.ts`**:
   - Add a new object to the `caseStudies` array
   - Include: `id`, `title`, `oneLiner`, `category`, `problem`, `build`, `outcome`, `tech`
   - Reference images: `images: ['/case-studies/your-project-1.jpg']`
   - Add video URL (optional): `videoUrl: 'https://loom.com/share/...'`
   - Add PDF (optional): `pdfUrl: '/case-studies/your-project-case-study.pdf'`

3. **Categories** must match the `CaseStudyCategory` type:
   - SaaS, AI Agents, Automations, Lead Gen/CRM, Integrations, Ops Tooling, Marketplaces

### Method 2: Automated Ingestion (Recommended)

The portfolio ingestion system automatically crawls websites and extracts metadata:

#### Basic Usage

```bash
# Ingest from PDF (extracts URLs automatically)
npm run ingest:portfolio -- --pdf "clients-portfolio.pdf"

# Ingest specific URLs
npm run ingest:portfolio -- --urls "https://example.com,https://another.com"

# Force re-ingestion (overwrites existing)
npm run ingest:portfolio -- --urls "https://example.com" --force

# Control number of screenshots (1-10, default: 3)
npm run ingest:portfolio -- --urls "https://example.com" --screenshots 5
```

#### What It Does

1. **Crawls the website** using Playwright
2. **Extracts metadata**: title, description, headings, OG tags
3. **Captures screenshots**: Multiple screenshots (default: 3) showing different sections
4. **Generates thumbnails**: Optimized thumbnails for portfolio cards
5. **Saves to**: `/data/portfolio/ingested/` (metadata) and `/public/portfolio/ingested/` (images)

#### Enhancing Ingested Projects

After ingestion, enhance the auto-generated descriptions:

```bash
# View project details and get enhancement template
npm run enhance:portfolio socialtip

# Then edit: data/portfolio/enhanced.ts
# Add detailed problem/build/outcome descriptions, refine categories, etc.
```

The enhanced metadata automatically overrides the auto-generated content.

#### Validating Portfolio Data

Check for missing files, broken links, and data quality issues:

```bash
# Run validation
npm run validate:portfolio
```

This will:
- Check if all image files exist
- Identify projects with generic descriptions (needing enhancement)
- Report missing website URLs, empty tech stacks, etc.
- Provide actionable tips for improvement

#### Managing Portfolio

Use management tools for portfolio operations:

```bash
# List all projects with details
npm run manage:portfolio list

# Show portfolio statistics
npm run manage:portfolio stats

# Clean up orphaned files
npm run manage:portfolio cleanup

# Export portfolio data
npm run manage:portfolio export json   # JSON format
npm run manage:portfolio export csv   # CSV format
```

#### Image Optimization

Screenshots are automatically optimized:
- **Format**: PNG screenshots are converted to optimized JPEG (85% quality, progressive)
- **Size**: Screenshots are resized to max 1920px width (maintains aspect ratio)
- **Compression**: Uses mozjpeg for better compression
- **Thumbnails**: Generated at 600x400px with optimized JPEG compression
- **File size**: Typically 60-80% smaller than original PNGs

#### How It Works

- **Ingested projects** are automatically merged with manual case studies
- **Enhanced metadata** (in `data/portfolio/enhanced.ts`) takes precedence
- **Multiple screenshots** are displayed in the portfolio modal gallery
- **API route** (`/api/portfolio`) serves the merged data with caching
- **Images are optimized** automatically during ingestion for better performance

The portfolio will automatically display your new case study with filtering, modal view, and deep linking support.

## Deep Linking & UTM Tracking

### Case Studies
Case studies support deep linking via URL:
- Hash: `#case-study-id` (e.g., `#saas-marketplace`)
- Query: `?case-study=case-study-id`

### Sales Links with UTM Parameters
For sales outreach, use query parameters that persist through the booking flow:

```
https://yoursite.com/?source=linkedin&utm_campaign=outreach&utm_medium=social
```

These parameters will:
- Pass through to Calendly booking
- Display a "Referred by" badge in the footer
- Track attribution in your analytics

Example sales links:
- LinkedIn: `?source=linkedin&utm_campaign=outreach`
- Email: `?source=email&utm_campaign=newsletter`
- WhatsApp: `?source=whatsapp&utm_campaign=direct`

## Environment Variables

Create a `.env.local` file for configuration:

```env
# Site URL (for SEO and structured data)
NEXT_PUBLIC_SITE_URL=https://oxbstudio.com

# Skool Community URL (optional)
NEXT_PUBLIC_SKOOL_URL=https://skool.com/your-community
```

## Deployment

The site is ready for deployment to Vercel, Netlify, or any Next.js-compatible platform:

```bash
npm run build
npm start
```

## Features

- ✅ Fully responsive (mobile-first)
- ✅ SEO optimized with structured data
- ✅ Accessible (WCAG compliant)
- ✅ Performance optimized
- ✅ UTM parameter tracking
- ✅ Deep linking support
- ✅ Calendly integration
- ✅ Case study portfolio with filtering
- ✅ Smooth animations (respects reduced motion)

