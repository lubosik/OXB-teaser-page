export function getStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OXB Studio',
    description: 'OXB Studio connects business owners with a curated network of professional developers, designers, and experts to bring your projects to life.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://oxbstudio.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://oxbstudio.com'}/logo.png`,
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      // Add contact information when available
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
  }
}

