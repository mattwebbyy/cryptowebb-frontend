// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

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

    return (
        <Helmet>
            {/* Basic metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={`${siteUrl}${slug ? `/blog/${slug}` : ''}`} />
            <meta property="og:type" content={article ? 'article' : 'website'} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Article specific metadata */}
            {article && (
                <>
                    <meta property="article:published_time" content={new Date().toISOString()} />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: title,
                            description: description,
                            image: image || defaultImage,
                            url: `${siteUrl}/blog/${slug}`,
                            datePublished: new Date().toISOString(),
                        })}
                    </script>
                </>
            )}
        </Helmet>
    );
};