// src/components/EnhancedSEO.tsx
import { useEffect } from 'react';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    section?: string;
  };
  organization?: {
    name: string;
    logo: string;
    url: string;
  };
  breadcrumb?: Array<{
    name: string;
    item: string;
  }>;
  canonicalUrl?: string;
  noindex?: boolean;
  robots?: string;
}

export const EnhancedSEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  article,
  organization = {
    name: 'CryptoWebb',
    logo: '/logo-512.png',
    url: 'https://cryptowebb.com'
  },
  breadcrumb,
  canonicalUrl,
  noindex = false,
  robots = 'index,follow'
}: EnhancedSEOProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://cryptowebb.com';
  const currentUrl = url || window.location.href;
  const defaultImage = `${siteUrl}/og-default.jpg`;
  const seoImage = image || defaultImage;

  // Create structured data for the website
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: organization.name,
    url: organization.url,
    logo: `${siteUrl}${organization.logo}`,
    description: 'Advanced cryptocurrency analytics and blockchain intelligence platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Create organization structured data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: `${siteUrl}${organization.logo}`,
    description: 'Leading provider of cryptocurrency analytics and blockchain intelligence solutions',
    foundingDate: '2024',
    industry: 'Financial Technology',
    serviceArea: {
      '@type': 'Place',
      name: 'Global'
    },
    offers: {
      '@type': 'Offer',
      name: 'Cryptocurrency Analytics Platform',
      description: 'Professional crypto analytics tools and real-time market intelligence'
    }
  };

  // Create article structured data if it's an article
  const articleStructuredData = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: seoImage,
    url: currentUrl,
    datePublished: article.publishedTime || new Date().toISOString(),
    dateModified: article.modifiedTime || article.publishedTime || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || 'CryptoWebb Team'
    },
    publisher: {
      '@type': 'Organization',
      name: organization.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${organization.logo}`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    },
    keywords: keywords.concat(article.tags || []).join(', ')
  } : null;

  // Create breadcrumb structured data
  const breadcrumbStructuredData = breadcrumb ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.item}`
    }))
  } : null;

  // Enhanced meta title with branding
  const metaTitle = title.includes('CryptoWebb') ? title : `${title} | CryptoWebb`;

  useEffect(() => {
    // Update document title
    document.title = metaTitle;

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

    // Helper function to set or update link tags
    const setLinkTag = (rel: string, href: string, crossOrigin?: string) => {
      let link = document.querySelector(`link[rel="${rel}"][href="${href}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        if (crossOrigin) {
          link.setAttribute('crossorigin', crossOrigin);
        }
        document.head.appendChild(link);
      }
    };

    // Basic HTML Meta Tags
    setMetaTag('description', description);
    if (keywords.length > 0) setMetaTag('keywords', keywords.join(', '));
    setMetaTag('author', organization.name);
    
    // Robots and Indexing
    setMetaTag('robots', noindex ? 'noindex,nofollow' : robots);
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }
    
    // Viewport and Mobile
    setMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');
    setMetaTag('theme-color', '#0d9488');
    setMetaTag('msapplication-TileColor', '#0d9488');
    
    // Open Graph Meta Tags
    setMetaTag('og:title', metaTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', seoImage, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', organization.name, true);
    setMetaTag('og:locale', 'en_US', true);
    
    // Article specific Open Graph tags
    if (article) {
      if (article.publishedTime) setMetaTag('article:published_time', article.publishedTime, true);
      if (article.modifiedTime) setMetaTag('article:modified_time', article.modifiedTime, true);
      if (article.author) setMetaTag('article:author', article.author, true);
      if (article.section) setMetaTag('article:section', article.section, true);
      
      // Remove existing article tags first
      const existingTags = document.querySelectorAll('meta[property="article:tag"]');
      existingTags.forEach(tag => tag.remove());
      
      // Add new article tags
      article.tags?.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.setAttribute('content', tag);
        document.head.appendChild(meta);
      });
    }
    
    // Twitter Card Meta Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', metaTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', seoImage);
    setMetaTag('twitter:site', '@CryptoWebb');
    setMetaTag('twitter:creator', '@CryptoWebb');
    
    // Additional Meta Tags for Crypto/Finance Industry
    setMetaTag('industry', 'Financial Technology');
    setMetaTag('coverage', 'Worldwide');
    setMetaTag('distribution', 'Global');
    setMetaTag('rating', 'General');
    
    // App-specific meta tags
    setMetaTag('application-name', 'CryptoWebb');
    setMetaTag('apple-mobile-web-app-title', 'CryptoWebb');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    
    // Structured Data - remove existing scripts first
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());
    
    // Add new structured data scripts
    const scripts: any[] = [websiteStructuredData, organizationStructuredData];
    if (articleStructuredData) scripts.push(articleStructuredData);
    if (breadcrumbStructuredData) scripts.push(breadcrumbStructuredData);
    
    scripts.forEach(data => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    // Preconnect and DNS prefetch links
    setLinkTag('preconnect', 'https://fonts.googleapis.com');
    setLinkTag('preconnect', 'https://fonts.gstatic.com', 'anonymous');
    setLinkTag('preconnect', 'https://api.cryptowebb.com');
    setLinkTag('dns-prefetch', '//www.google-analytics.com');
    setLinkTag('dns-prefetch', '//www.googletagmanager.com');
  }, [
    metaTitle, description, keywords, seoImage, currentUrl, type, organization, 
    article, noindex, robots, canonicalUrl, websiteStructuredData, 
    organizationStructuredData, articleStructuredData, breadcrumbStructuredData
  ]);

  return null; // This component only manages document metadata
};