import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your actual Render URL
  const baseUrl = 'https://noctis-mqk9.onrender.com' // Adjust if needed

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
