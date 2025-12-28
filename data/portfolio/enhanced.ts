import { CaseStudyCategory } from '@/content/case-studies'

/**
 * Enhanced metadata for ingested case studies
 * This file allows you to override or enhance the auto-generated metadata
 * from the ingestion process with better descriptions, categories, etc.
 */
export interface EnhancedMetadata {
  slug: string
  title?: string
  oneLiner?: string
  category?: CaseStudyCategory[]
  problem?: string
  build?: string
  outcome?: string
  tech?: string[]
  videoUrl?: string
  pdfUrl?: string
  websiteUrl?: string
  // Additional images beyond the thumbnail
  additionalImages?: string[]
  coverImage?: string // Primary cover image for the project
  developerCredit?: string // Credit to original developer
  imagePrompt?: string // Prompt for generating cover image with Gemini 3 Nano/Banana 3 Pro
}

export const enhancedMetadata: Record<string, EnhancedMetadata> = {
  socialtip: {
    slug: 'socialtip',
    title: 'Social Tip Platform',
    oneLiner: 'Get paid to post on socials - Turn everyday moments into real cash rewards',
    category: ['SaaS', 'Marketplaces'],
    problem: 'Brands needed a way to connect with authentic creators and reward them for genuine social media posts. Traditional influencer marketing was expensive and lacked authenticity. They needed a platform that could match brands with real people who genuinely love their products.',
    build: 'Built a full-stack marketplace platform connecting brands with everyday creators. Implemented user authentication, brand onboarding, content submission workflow, payment processing via Stripe, and automated payout system. Created matching algorithm based on user interests and brand requirements. Built mobile-responsive web app with real-time notifications.',
    outcome: 'Launched platform enabling brands to reach authentic audiences at scale. Users earn real cash rewards for genuine posts. Reduced brand marketing costs while increasing authentic engagement. Platform successfully connects brands with thousands of active creators.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Node.js'],
    websiteUrl: 'https://www.socialtip.io',
  },
  izzyai: {
    slug: 'izzyai',
    title: 'IzzyAI Speech Therapy Platform',
    oneLiner: 'Fix your speech with AI-powered therapists. Tailored therapy for stammering, articulation, and more.',
    category: ['AI Agents', 'SaaS'],
    problem: 'Access to speech therapy is expensive and often requires long wait times. Many people need consistent practice but can\'t afford regular sessions. They needed an accessible, affordable solution that could provide personalized speech therapy guidance anytime.',
    build: 'Developed an AI-powered speech therapy platform using advanced speech recognition and natural language processing. Built personalized therapy plans, real-time feedback system, progress tracking, and gamified practice sessions. Integrated voice analysis technology to provide instant feedback on pronunciation and fluency.',
    outcome: 'Made speech therapy accessible and affordable. Users can practice anytime, anywhere. Reduced therapy costs by 80% while maintaining quality. Platform helps thousands improve their speech with consistent, personalized guidance.',
    tech: ['Next.js', 'TypeScript', 'OpenAI API', 'Web Speech API', 'PostgreSQL', 'Tailwind CSS'],
    websiteUrl: 'https://www.izzyai.com',
  },
  zoomies: {
    slug: 'zoomies',
    title: 'Zoomies Doggy Daycare Booking System',
    oneLiner: 'Premium dog daycare, boarding, and training services in Dubai',
    category: ['SaaS'],
    problem: 'A dog daycare business needed a modern booking system to manage appointments, customer communications, and service offerings. They were using manual booking processes that were error-prone and time-consuming.',
    build: 'Built a comprehensive booking and management platform with online reservations, customer profiles, service management, automated reminders, and payment processing. Integrated calendar system, SMS notifications, and customer portal for easy booking and account management.',
    outcome: 'Streamlined booking process reduced administrative time by 60%. Increased bookings through online availability. Improved customer satisfaction with easy self-service booking. Better organization and scheduling led to 40% increase in capacity utilization.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Twilio', 'Tailwind CSS'],
    websiteUrl: 'https://www.zoomies.ae',
  },
  passportv3: {
    slug: 'passportv3',
    title: 'PassportV3 Identity Verification Platform',
    oneLiner: 'Digital identity and verification platform',
    category: ['SaaS', 'Integrations'],
    problem: 'Organizations needed a secure, scalable solution for digital identity verification and document management. Existing solutions were either too expensive or lacked the required security features.',
    build: 'Built a secure digital identity platform with document verification, biometric authentication, and compliance features. Implemented end-to-end encryption, audit logging, and integration APIs for seamless onboarding.',
    outcome: 'Enabled secure digital identity verification at scale. Reduced verification time from days to minutes. Improved security and compliance posture. Platform successfully processes thousands of verifications monthly.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
    websiteUrl: 'https://www.passportv3.io',
    coverImage: '/portfolio/ingested/passportv3/cover.png',
    developerCredit: 'Built by a member in the OXB network',
    imagePrompt: 'Professional high-resolution photograph of a modern passport document open on a sleek, minimalist desk. The passport page displays a realistic photo ID with holographic security features visible under soft, diffused studio lighting. The background features a subtle blur with warm, professional tones. Camera angle: slightly elevated, 45-degree perspective. Depth of field: shallow focus on the passport, background softly blurred. Lighting: natural window light mixed with soft fill lighting, creating gentle shadows and highlights. Color palette: warm whites, deep navy blues, and subtle gold accents. Texture: crisp paper texture, glossy holographic elements, matte desk surface. Style: clean, professional, trustworthy, secure. No text overlays, pure photographic realism. Shot with professional camera, 85mm lens, f/2.8 aperture, natural color grading.',
  },
  takeoffyachts: {
    slug: 'takeoffyachts',
    title: 'Takeoff Yachts Charter Booking Platform',
    oneLiner: 'Luxury yacht charter and booking platform',
    category: ['SaaS', 'Marketplaces'],
    problem: 'A yacht charter business needed a modern platform to showcase their fleet, manage bookings, and handle customer inquiries. They were losing bookings due to outdated processes and lack of online presence.',
    build: 'Built a beautiful booking platform with yacht listings, availability calendar, online booking system, payment processing, and customer management. Created responsive design optimized for mobile browsing. Integrated with payment gateways and email systems.',
    outcome: 'Increased online bookings by 200%. Reduced booking processing time from hours to minutes. Improved customer experience with easy online booking. Better inventory management led to higher utilization rates.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    websiteUrl: 'https://takeoffyachts.com/',
    coverImage: '/portfolio/ingested/takeoffyachts/cover.png',
    developerCredit: 'Built by a member in the OXB network',
    imagePrompt: 'Stunning photorealistic image of a luxury superyacht cruising through crystal-clear turquoise waters at golden hour. The yacht features a sleek, modern white hull with polished chrome accents, multiple decks, and elegant design lines. The scene captures the yacht from a three-quarter angle, showing its impressive scale and luxury details. The water is calm with gentle ripples reflecting the warm sunset colors. In the background, a picturesque coastline with palm trees and luxury villas is visible in soft focus. The sky displays a gradient from warm orange and pink near the horizon to deep blue above. Lighting: golden hour sunlight creating warm highlights on the yacht\'s surfaces, with soft reflections on the water. Camera: professional wide-angle shot, 24mm equivalent, f/8 aperture for sharp detail throughout. Color grading: vibrant but natural, emphasizing the luxury and elegance. Style: editorial travel photography, aspirational, premium, sophisticated. No people visible, focus entirely on the yacht and its luxurious environment.',
  },
  wearevenu: {
    slug: 'wearevenu',
    title: 'Venu Event Management Platform',
    oneLiner: 'Event management and venue booking platform',
    category: ['SaaS', 'Marketplaces'],
    problem: 'Event organizers and venues needed a unified platform to discover spaces, manage bookings, and coordinate events. The process was fragmented across multiple tools and communication channels.',
    build: 'Built a comprehensive event management platform connecting venues with event organizers. Implemented venue search and filtering, booking system, payment processing, event management tools, and communication features. Created admin dashboards for both venues and organizers.',
    outcome: 'Streamlined event booking process. Increased venue bookings by 150%. Reduced booking coordination time by 70%. Better matching between venues and events led to higher satisfaction rates.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Node.js'],
    websiteUrl: 'https://www.wearevenu.com',
    coverImage: '/portfolio/ingested/wearevenu/cover.png',
    developerCredit: 'Built by a member in the OXB network',
    imagePrompt: 'Professional photorealistic photograph of a modern, elegant event venue interior set up for a corporate conference. The spacious hall features a large, minimalist stage with a sleek design, surrounded by rows of premium chairs arranged in perfect symmetry. High-quality architectural lighting fixtures illuminate the space with warm, inviting light. Large LED screens on either side of the stage display a clean, modern user interface mockup of the Venu platform. The venue has high ceilings with exposed architectural elements, polished concrete or hardwood floors, and floor-to-ceiling windows showing natural light. The atmosphere is professional, sophisticated, and welcoming. Camera: wide-angle perspective from the back of the venue, capturing the full scope of the space. Depth of field: sharp focus throughout, showcasing the venue\'s details. Lighting: natural daylight mixed with warm architectural lighting, creating depth and dimension. Color palette: neutral tones with warm wood accents, crisp whites, and subtle brand colors. Style: architectural photography, clean, modern, professional, aspirational. No people visible, focus on the venue space and platform integration. Shot with professional camera, 16-24mm lens, f/5.6 aperture, natural color grading with slight warmth.',
  },
}

