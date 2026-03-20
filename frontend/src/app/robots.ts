import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin-dashboard/',
        '/admin-login/',
        '/api/'
      ],
    },
    sitemap: 'https://tattvalogic.com/sitemap.xml',
  }
}
