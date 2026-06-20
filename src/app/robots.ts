import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Replace this with your actual Render URL
  const baseUrl = 'https://noctis.onrender.com' // Adjust if needed

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
