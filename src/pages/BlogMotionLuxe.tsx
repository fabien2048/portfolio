import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { optimizeCloudinary } from '../utils/cloudinary';

const articles = [
  {
    id: 1,
    title: "L'Art de l'Animation 3D dans l'Horlogerie de Luxe",
    category: "3D & Horlogerie",
    date: "Mars 2024",
    image: "/images/projects/thumbnails/cartier-horlogerie-motion-design-luxe.webp",
    excerpt: "Comment les rendus photoréalistes transforment la perception de la mécanique de précision et subliment chaque rouage en une œuvre d'art numérique."
  },
  {
    id: 2,
    title: "Comment le Motion Design 2D Réinvente la Cosmétique",
    category: "2D & Beauté",
    date: "Février 2024",
    image: "/images/projects/thumbnails/ysl-beauty-motion-design-freelance.webp",
    excerpt: "L'utilisation de la typographie cinétique et des animations vectorielles pour créer des campagnes dynamiques et subversives adaptées aux nouveaux codes sociaux."
  },
  {
    id: 3,
    title: "La Frontière Floue entre Réalité et CGI dans le Parfum",
    category: "CGI & Parfums",
    date: "Janvier 2024",
    image: "/images/projects/thumbnails/dior-snow-cosmetiques-motion-design.webp",
    excerpt: "L'évolution fulgurante des simulations de fluides et de réfractions lumineuses pour représenter l'essence même des fragrances de luxe sans utiliser de caméra."
  },
  {
    id: 4,
    title: "L'Impact des Réseaux Sociaux sur la Direction Artistique",
    category: "Socials & Luxe",
    date: "Novembre 2023",
    image: "/images/projects/thumbnails/nuxe-cosmetiques-motion-design-paris.jpg",
    excerpt: "L'adaptation des formats et l'émergence des contenus premium ultra-courts pour capter l'attention sur des plateformes comme Instagram et TikTok."
  },
  {
    id: 5,
    title: "Le Futur de la Haute Joaillerie : Rendu Temps Réel et Metaverse",
    category: "Web3 & Luxe",
    date: "Octobre 2023",
    image: "/images/projects/thumbnails/martell-metavers-luxe-3d-animation.png",
    excerpt: "L'intégration des parures dans des espaces virtuels et l'expérience client repensée par le motion design immersif et interactif."
  }
];

import { useEffect } from 'react';
import { useNavigationType } from 'react-router-dom';

export default function BlogMotionLuxe() {
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== 'POP') window.scrollTo(0, 0);
  }, [navType]);

  return (
    <PageTransition>
      <Helmet>
        <title>Blog Motion Design Luxe — Fabien Bouadi</title>
        <meta name="description" content="Découvrez nos articles sur l'impact du motion design 2D et 3D dans l'industrie du luxe, de l'horlogerie à la cosmétique." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Le Journal - Motion & Luxe",
            "description": "Réflexions, tendances et analyses sur l'artisanat numérique, l'animation 3D et le motion design 2D au service des grandes Maisons.",
            "url": "https://www.fabienbouadi.com/blog-motion-luxe",
            "author": {
              "@type": "Person",
              "name": "Fabien Bouadi"
            },
            "blogPost": articles.map(a => ({
              "@type": "BlogPosting",
              "headline": a.title,
              "description": a.excerpt,
              "image": `https://www.fabienbouadi.com${a.image}`,
              "datePublished": a.date,
              "author": {
                "@type": "Person",
                "name": "Fabien Bouadi"
              }
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#F4F4F0] text-[#1A1A1A] pt-32 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1920px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 md:mb-24"
          >
            <h1 className="text-[clamp(40px,8vw,120px)] font-lausanne font-light tracking-tighter leading-none mb-6 uppercase">
              Le Journal. <br />Motion & Luxe
            </h1>
            <p className="text-[16px] md:text-[22px] font-presura max-w-2xl opacity-70 leading-relaxed">
              Réflexions, tendances et analyses sur l'artisanat numérique, l'animation 3D et le motion design 2D au service des grandes Maisons.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {articles.map((article, index) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className={`group cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div 
                  className={`overflow-hidden squircle bg-[#EBEBEB] mb-6 relative ${index === 0 ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-[4/3] md:aspect-[3/2]'}`}
                  style={{ '--squircle-radius': '16px' } as React.CSSProperties}
                >
                  <img 
                    src={optimizeCloudinary(article.image, 1200)} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex items-center gap-4 mb-4 font-presura text-[10px] md:text-[12px] uppercase tracking-widest opacity-50">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span>{article.date}</span>
                </div>
                <h2 className="text-[20px] md:text-[28px] lg:text-[32px] font-lausanne font-medium tracking-tight leading-[1.15] mb-4 group-hover:opacity-70 transition-opacity">
                  {article.title}
                </h2>
                <p className="text-[14px] md:text-[16px] font-lausanne opacity-70 max-w-xl leading-relaxed">
                  {article.excerpt}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
