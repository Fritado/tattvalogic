import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin-dashboard/',
        '/portal/',
        '/api/'
      ],
    },
    sitemap: 'https://tattvalogic.com/sitemap.xml',
  }
}
