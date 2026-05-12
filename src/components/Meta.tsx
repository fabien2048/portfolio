import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
  canonical?: string;
  schema?: object;
  noindex?: boolean;
}

const DEFAULT_TITLE = "Fabien Bouadi — Motion Designer & Directeur Artistique Paris";
const DEFAULT_DESCRIPTION = "Motion Designer et Directeur Artistique freelance à Paris, spécialisé dans l'univers du luxe. 3D, Motion Design, Direction Artistique pour Dior, Guerlain, Lancôme, Prada, Cartier.";
const DEFAULT_IMAGE = "https://cdn.prod.website-files.com/5dcafff3c897156f8d1805ac/64bfcd1d67c1cb95256bd305_5e258df9b2b6454d2e14fc2c_Dior_Backstage_direction_artistique.webp";
const SITE_URL = "https://www.fabienbouadi.com";

export default function Meta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
  keywords,
  canonical,
  schema,
  noindex = false,
}: MetaProps) {
  const fullTitle = title.includes('Fabien Bouadi') ? title : `${title} — Fabien Bouadi`;
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const canonicalUrl = canonical || fullUrl;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content="Fabien Bouadi" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
