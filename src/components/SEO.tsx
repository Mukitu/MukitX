import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: object;
}

export default function SEO({ title, description, canonical, jsonLd }: SEOProps) {
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MukitX",
    "description": "MukitX - Your partner for web development, mobile apps, and digital solutions.",
    "url": "https://mukitx.com"
  };

  const finalJsonLd = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      <title>{title === 'Home' ? 'MukitX' : `${title} | MukitX`}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <script type="application/ld+json">
        {JSON.stringify(finalJsonLd)}
      </script>
    </Helmet>
  );
}
