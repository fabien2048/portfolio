import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'motion/react';
import { useParams, useNavigationType } from 'react-router-dom';
import { optimizeCloudinary, getVideoPosterWebp } from '../utils/cloudinary';
import PageTransition from '../components/PageTransition';
import { projects } from '../data/projects';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useLenis } from 'lenis/react';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';

import { VideoPlayer } from '../components/VideoPlayer';



// Génère un poster WebP optimisé depuis la vidéo Cloudinary (1ère frame).
// Retourne undefined pour les vidéos non-Cloudinary (le navigateur gère #t=0.001)
const getVideoPoster = (url: string) => getVideoPosterWebp(url) || undefined;

// ── FadeMedia (Remplace FadeImage pour supporter images et vidéos)
function FadeMedia({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const isVideo = src.includes('.mp4') || src.includes('.webm') || src.includes('.mov');

  // Optimisation Mobile : 800px max
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const optimizedSrc = optimizeCloudinary(src, isMobile ? 800 : undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (el instanceof HTMLImageElement && el.complete) setReady(true);

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (el instanceof HTMLVideoElement) el.play().catch(() => { });
        } else {
          if (el instanceof HTMLVideoElement) el.pause();
        }
      },
      {
        threshold: isVideo ? 0.5 : 0,
        rootMargin: isVideo ? '0px' : '80px'
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isVideo]);

  const cls = `transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${(ready || isVideo) && inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className ?? ''}`;

  if (isVideo) {
    return (
      <video ref={ref as React.RefObject<HTMLVideoElement>} src={optimizedSrc}
        onLoadedData={() => setReady(true)}
        className={cls} loop muted playsInline preload={priority ? "metadata" : "none"}
        aria-label={alt}
        itemScope itemType="https://schema.org/VideoObject"
        itemProp="contentUrl"
        {...(priority ? ({ fetchpriority: 'high' } as any) : {})}
      >
        <meta itemProp="name" content={alt} />
        <meta itemProp="uploadDate" content={new Date().toISOString().split('T')[0]} />
      </video>
    );
  }

  return (
    <img ref={ref as React.RefObject<HTMLImageElement>} src={optimizedSrc} alt={alt}
      onLoad={() => setReady(true)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cls}
      {...(priority ? ({ fetchpriority: 'high' } as any) : {})}
    />
  );
}

import Meta from '../components/Meta';

// ── Page ──────────────────────────────────────────────────────
export default function Project() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const lenis = useLenis();
  const go = useNavigateWithMask();

  const navType = useNavigationType();

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const others = projects.filter(p => p.id !== project.id);
    return [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [id, project]);

  const currentIndex = projects.findIndex(p => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const [videoError, setVideoError] = useState(false);

  // Reset state and force scroll to top on navigation
  useEffect(() => {
    setVideoError(false);
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [id, lenis]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-lausanne">Project not found</h1>
      </div>
    );
  }

  const images = useMemo(() => {
    if (!project) return [];
    
    // 1. Remove duplicates from the array itself
    const uniqueImages = Array.from(new Set(project.images ?? []));
    
    // 2. Filter out project.image if it exists in the images array.
    // project.image is used as the hero thumbnail/poster and should not repeat in the gallery.
    return uniqueImages.filter(img => img !== project.image);
  }, [project]);

  return (
    <PageTransition>
      <Meta 
        title={project.seoTitle || project.title}
        description={project.metaDescription || project.description}
        image={project.image}
        type="article"
        url={`/project/${project.id}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "headline": project.seoTitle || project.title,
          "description": project.metaDescription || project.description,
          "image": project.image,
          "datePublished": project.year,
          "author": {
            "@type": "Person",
            "name": "Fabien Bouadi",
            "jobTitle": "Motion Designer & Directeur Artistique",
            "url": "https://www.fabienbouadi.com"
          },
          "publisher": {
            "@type": "Person",
            "name": "Fabien Bouadi"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.fabienbouadi.com/project/${project.id}`
          },
          "keywords": project.category
        }}
      />

      <div className="min-h-screen bg-[#F4F4F0] text-[#1A1A1A] select-none">

        {/* ── Bouton Close — fixe comme le logo ── */}
        <button
          onClick={() => go('/')}
          className="fixed top-[72px] md:top-40 right-4 md:right-6 lg:right-8 xl:right-12 z-[900] flex items-center gap-2 text-[16px] uppercase tracking-widest text-white mix-blend-difference hover:opacity-50 transition-opacity bg-transparent border-0 cursor-pointer group font-presura min-h-[44px] px-0"
          style={{ mixBlendMode: 'difference' }}
        >
          <span className="opacity-100">Close</span>
          <X size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>




        {/* ── Titre — char split staggeré (cf. sona.html) ── */}
        <div className="px-4 md:px-6 lg:px-8 xl:px-12 pt-36 md:pt-44 mb-8 text-center">
          <h1 className="text-[clamp(48px,11vw,140px)] md:text-[clamp(64px,8vw,120px)] leading-[1.1] font-lausanne font-medium tracking-tighter">
            {project.title.split(' ').map((word, i) => (
              <span key={i} className="inline-flex mr-[0.25em] last:mr-0">
                <span style={{ 
                  display: 'inline-flex', 
                  overflow: 'hidden', 
                  verticalAlign: 'bottom', 
                  padding: '0.15em 0.15em',
                  margin: '-0.15em -0.15em'
                }}>
                  <motion.span
                    style={{ display: 'inline-flex' }}
                    initial={{ y: '120%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.5,
                      ease: [0.075, 0.82, 0.165, 1],
                      delay: 0.1 + i * 0.1,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* ── Pills ── */}
        <motion.div className="px-4 md:px-6 lg:px-8 xl:px-12 mb-10 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          {project.category.split('/').map(cat => (
            <span key={cat}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#1A1A1A]/30 text-[12px] uppercase tracking-widest font-presura text-[#1A1A1A] leading-none pt-[calc(0.625rem+1px)] pb-[0.625rem]">
              {cat.trim()}
            </span>
          ))}
        </motion.div>

        {/* ── Meta ── */}
        <motion.div className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 mb-16 grid grid-cols-3 gap-6 border-t border-[#1A1A1A]/10 pt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="flex flex-col">
            <span className="block text-[14px] 2xl:text-[16px] uppercase tracking-widest font-presura text-[#1A1A1A]/40 mb-1">Agence</span>
            {project.agencyUrl ? (
              <a 
                href={project.agencyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  "relative w-fit text-[17px] 2xl:text-[19px] font-lausanne font-medium transition-colors duration-300",
                  "text-[#1A1A1A] hover:text-[#1A1A1A]/60",
                  "after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-2px] after:left-0",
                  "after:bg-current after:transition-transform after:duration-[550ms] after:ease-[cubic-bezier(.785,.135,.15,.86)]",
                  "after:scale-x-0 after:origin-left hover:after:scale-x-100"
                )}
              >
                {project.agency}
              </a>
            ) : (
              <span className="text-[17px] 2xl:text-[19px] font-presura font-medium">{project.agency}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="block text-[14px] 2xl:text-[16px] uppercase tracking-widest font-presura text-[#1A1A1A]/40 mb-1">Client</span>
            <span className="text-[17px] 2xl:text-[19px] font-presura font-medium">{project.year}</span>
          </div>
          <div className="flex flex-col">
            <span className="block text-[14px] 2xl:text-[16px] uppercase tracking-widest font-presura text-[#1A1A1A]/40 mb-1">Rôle</span>
            <span className="text-[17px] 2xl:text-[19px] font-presura font-medium">Direction artistique<br />Motion design</span>
          </div>
        </motion.div>

        {/* ── Hero video/image ── */}
        <motion.div className="px-4 md:px-6 lg:px-8 xl:px-12 mb-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
          <div className="w-full">
            {!videoError && project.fullVideo ? (
              <VideoPlayer
                src={optimizeCloudinary(project.fullVideo, typeof window !== 'undefined' && window.innerWidth < 768 ? 720 : undefined)}
                poster={getVideoPoster(project.video)}
                priority={true}
                title={project.seoTitle || `${project.title} — Fabien Bouadi`}
                description={project.metaDescription || project.description || ""}
                onError={() => setVideoError(true)}
              />
            ) : (
              <div 
                className="w-full aspect-[16/9] border border-[#1A1A1A]/10 squircle overflow-hidden bg-[#EBEBEB]"
                style={{ '--squircle-radius': '10px' } as React.CSSProperties}
              >
                <FadeMedia src={project.image} alt={project.altText || project.title} className="w-full h-full object-cover" priority={true} />
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Intro + description ── */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 mb-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
            <h2 className="text-[clamp(24px,4vw,48px)] font-lausanne font-medium tracking-tighter leading-[1.1]">
              {project.intro ? (
                project.intro.split('. ').map((sentence, i, arr) => (
                  <span key={i} className="block">
                    {sentence}{i < arr.length - 1 ? '.' : ''}
                  </span>
                ))
              ) : (
                `Le projet ${project.title}.`
              )}
            </h2>
            <div className="text-base 2xl:text-lg text-[#1A1A1A]/60 leading-relaxed space-y-5 text-pretty max-w-[500px]">
              {project.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        {images.length > 0 && (
          <div className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
            <div 
              className="w-full mb-4 overflow-hidden squircle"
              style={{ '--squircle-radius': '10px' } as React.CSSProperties}
            >
              <FadeMedia src={images[0]} alt={project.altText || `${project.title} — Direction artistique par Fabien Bouadi`} className="w-full h-auto block" />
            </div>
            {images.length >= 3 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[images[1], images[2]].map((img, i) => (
                  <div 
                    key={i} 
                    className="overflow-hidden squircle"
                    style={{ '--squircle-radius': '10px' } as React.CSSProperties}
                  >
                    <FadeMedia src={img} alt={`${project.title} — Visuel ${i + 2} — Motion Design Fabien Bouadi`} className="w-full h-auto block" />
                  </div>
                ))}
              </div>
            )}
            {images.slice(3).map((img, i) => (
              <div 
                key={i} 
                className="w-full mb-4 overflow-hidden squircle"
                style={{ '--squircle-radius': '10px' } as React.CSSProperties}
              >
                <FadeMedia src={img} alt={`${project.title} — Visuel ${i + 4} — Motion Design Fabien Bouadi`} className="w-full h-auto block" />
              </div>
            ))}
          </div>
        )}

        {/* ── More Projects ── */}
        <div id="more-projects" className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 pt-16 mt-16 border-t border-[#1A1A1A]/10">
          <h3 className="text-[12px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40 mb-12">Autres projets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedProjects.map((p, i) => (
              <motion.a key={p.id}
                href={`/project/${p.id}`}
                onClick={(e) => { e.preventDefault(); go(`/project/${p.id}`); }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group block w-full text-left no-underline text-inherit p-0">
                <div 
                  className="w-full aspect-[4/3] overflow-hidden mb-4 bg-[#EBEBEB] squircle border border-[#1A1A1A]/10"
                  style={{ '--squircle-radius': '10px' } as React.CSSProperties}
                >
                  <FadeMedia src={p.image} alt={p.altText || `${p.title} — Motion Design Fabien Bouadi`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {p.category.split('/').map(cat => (
                    <span key={cat} className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-[#1A1A1A]/20 text-[11px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/60 leading-none pt-[calc(0.5rem+1px)] pb-[0.5rem]">
                      {cat.trim()}
                    </span>
                  ))}
                </div>
                <h4 className="text-2xl md:text-3xl font-lausanne font-medium tracking-tight group-hover:text-[#1A1A1A]/40 transition-colors duration-300">{p.title}</h4>
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── Prev / Next ── */}
        {(prevProject || nextProject) && (
          <div className="px-4 md:px-6 lg:px-8 xl:px-12 mt-24 pt-10 border-t border-[#1A1A1A]/10 flex justify-between items-start pb-16">
            {prevProject ? (
              <a href={`/project/${prevProject.id}`}
                onClick={(e) => { e.preventDefault(); go(`/project/${prevProject.id}`); }}
                className="group flex flex-col items-start gap-3 no-underline text-inherit p-0 text-left">
                <span className="text-[12px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40">← Projet précédent</span>
                <span className="text-[7vw] md:text-[3.5vw] font-lausanne font-medium tracking-tighter leading-[1] text-[#1A1A1A] group-hover:text-[#1A1A1A]/40 transition-colors duration-300">{prevProject.title}</span>
              </a>
            ) : <div />}
            {nextProject ? (
              <a href={`/project/${nextProject.id}`}
                onClick={(e) => { e.preventDefault(); go(`/project/${nextProject.id}`); }}
                className="group flex flex-col items-end gap-3 no-underline text-inherit p-0 text-right">
                <span className="text-[12px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40">Projet suivant →</span>
                <span className="text-[7vw] md:text-[3.5vw] font-lausanne font-medium tracking-tighter leading-[1] text-[#1A1A1A] group-hover:text-[#1A1A1A]/40 transition-colors duration-300">{nextProject.title}</span>
              </a>
            ) : <div />}
          </div>
        )}

      </div>
    </PageTransition>
  );
}
