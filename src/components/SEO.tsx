// src/components/SEO.tsx
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  slug?: string;
}

export const SEO = ({ title, description, image, article, slug }: SEOProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const defaultImage = `${siteUrl}/default-og-image.jpg`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic metadata
    setMetaTag('description', description);

    // Open Graph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image || defaultImage, true);
    setMetaTag('og:url', `${siteUrl}${slug ? `/blog/${slug}` : ''}`, true);
    setMetaTag('og:type', article ? 'article' : 'website', true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image || defaultImage);

    // Article specific metadata
    if (article) {
      setMetaTag('article:published_time', new Date().toISOString(), true);
      
      // JSON-LD structured data
      let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdScript);
      }
      
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: image || defaultImage,
        url: `${siteUrl}/blog/${slug}`,
        datePublished: new Date().toISOString(),
      });
    }
  }, [title, description, image, article, slug, siteUrl, defaultImage]);

  return null; // This component only manages document metadata
};
