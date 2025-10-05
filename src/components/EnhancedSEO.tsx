// src/components/EnhancedSEO.tsx
import { Helmet } from 'react-helmet-async';

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

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={organization.name} />
      
      {/* Robots and Indexing */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : robots} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#0d9488" />
      <meta name="msapplication-TileColor" content="#0d9488" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={organization.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@CryptoWebb" />
      <meta name="twitter:creator" content="@CryptoWebb" />
      
      {/* Additional Meta Tags for Crypto/Finance Industry */}
      <meta name="industry" content="Financial Technology" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* App-specific meta tags */}
      <meta name="application-name" content="CryptoWebb" />
      <meta name="apple-mobile-web-app-title" content="CryptoWebb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      
      {articleStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
      )}
      
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.cryptowebb.com" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};