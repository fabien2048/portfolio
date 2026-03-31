// src/pages/Home.tsx
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { projects } from '../data/projects';
import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { cn } from '../utils/cn';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import { Helmet } from 'react-helmet-async';
import { optimizeCloudinary } from '../utils/cloudinary';
import { X } from 'lucide-react';

const categories = [
  'Fragrances&Beauty', 'Luxe', 'Moodtapes', 
  '3D Animation', 'Art Direction', 'Socials', 'Cosmetics'
];

const HERO_POSTER = projects[0]?.image ?? '';

type ProjectType = typeof projects[0];

function ProjectThumbnail({
  project,
  onClick,
  isMobile,
}: {
  project: ProjectType;
  onClick: () => void;
  isMobile: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const go = useNavigateWithMask();

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
    go(`/project/${project.id}`);
  };

  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0 },
        visible: { opacity: 1 },
        exit:    { opacity: 0 },
      }}
      className="group relative flex flex-col gap-6 project-thumb snap-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full overflow-hidden rounded-lg aspect-[4/3] relative bg-[#EBEBEB]">
        <a
          href={`/project/${project.id}`}
          onClick={handleClick}
          className="block w-full h-full"
          aria-label={`Voir le projet ${project.title}`}
        >
          <motion.img
            ref={imgRef}
            src={optimizeCloudinary(project.image, isMobile ? 800 : undefined)}
            alt={project.altText || `${project.title} — ${project.category} par Fabien Bouadi`}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {!isMobile && isHovered && project.video && (
              <video
                src={project.video}
                loop
                muted
                playsInline
                autoPlay
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
              />
            )}
          </div>
        </a>
      </div>

      <div>
        <span className="text-[14px] font-lausanne uppercase tracking-widest text-[#1A1A1A]/50 mb-3 block">
          {project.category}
        </span>
        <a
          href={`/project/${project.id}`}
          onClick={handleClick}
          className="p-0 text-left no-underline text-inherit"
        >
          <h2
            className="text-3xl font-lausanne font-medium tracking-tight mb-3 transition-colors duration-300 group-hover:text-[#1A1A1A]/40"
          >
            {project.title}
          </h2>
        </a>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const lenis = useLenis();
  const [activeCategory, setActiveCategory] = useState(() => {
    return sessionStorage.getItem('activeCategory') || 'All';
  });
  const videoRef  = useRef<HTMLVideoElement>(null);
  const heroRef   = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('activeCategory', activeCategory);
  }, [activeCategory]);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    document.documentElement.classList.add('snap-y', 'snap-proximity', 'scroll-pt-32');
    return () => document.documentElement.classList.remove('snap-y', 'snap-proximity', 'scroll-pt-32');
  }, []);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsMobile(window.innerWidth < 768), 150);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(timer); };
  }, []);

  const filterScale = useTransform(scrollYProgress, [0.35, 0.5], [0.8, 1]);
  const filterOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const videoOverlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 0.5]);

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['inset(15% 20% 15% 20% round 20px)', 'inset(0% 0% 0% 0% round 0px)']
  );
  const opacity  = useTransform(scrollYProgress, [0.2, 0.5], [1, 0]);
  const scale    = useTransform(scrollYProgress, [0, 0.5], [0.7, 1]);

  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition && lenis) {
      const pos = parseInt(savedScrollPosition, 10);
      
      lenis.stop();
      lenis.scrollTo(pos, { immediate: true, force: true });
      window.scrollTo(0, pos);
      
      const timer = setTimeout(() => {
        window.scrollTo(0, pos);
        lenis.scrollTo(pos, { immediate: true, force: true });
        lenis.start();
        sessionStorage.removeItem('scrollPosition');
        sessionStorage.removeItem('visibleCount');
      }, 50);

      return () => {
        clearTimeout(timer);
        lenis.start();
      };
    } else if (lenis && !savedScrollPosition) {
      lenis.scrollTo(0, { immediate: true });
    } else if (!lenis && !savedScrollPosition) {
      window.scrollTo(0, 0);
    }
  }, [lenis]);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      const threshold = window.innerHeight * 1.5;
      
      if (window.scrollY >= threshold) {
        if (!videoRef.current.paused) videoRef.current.pause();
      } else {
        if (videoRef.current.paused) videoRef.current.play().catch(() => {});
      }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const INITIAL_COUNT = 24;
  const [visibleCount, setVisibleCount] = useState(() => {
    const savedCount = sessionStorage.getItem('visibleCount');
    return savedCount ? parseInt(savedCount, 10) : INITIAL_COUNT;
  });

  const handleProjectClick = useCallback(() => {
    const scrollPos = lenis ? lenis.scroll : window.scrollY;
    sessionStorage.setItem('scrollPosition', scrollPos.toString());
    sessionStorage.setItem('visibleCount', visibleCount.toString());
  }, [lenis, visibleCount]);

  let filteredProjects = projects.filter(
    project => activeCategory === 'All' || project.category.toUpperCase().includes(activeCategory.toUpperCase())
  );
  if (filteredProjects.length === 0) {
    filteredProjects = projects;
  }

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activeCategory]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <PageTransition scrollToTop={false}>
      <Helmet>
        <title>Fabien Bouadi — Motion Designer & 3D Artist Paris</title>
        <meta name="description" content="Portfolio de Fabien Bouadi, Motion Designer et Directeur Artistique freelance basé à Paris. Spécialisé dans le luxe et la 3D." />
        <meta property="og:title" content="Fabien Bouadi — Motion Designer & 3D Artist Paris" />
        <meta property="og:description" content="Direction Artistique, 3D et Motion Design pour les marques d'exception." />
        <meta property="og:url" content="https://www.fabienbouadi.com/" />
      </Helmet>

      <div ref={heroRef} className="relative w-full text-white">
        {/* Hero fixe */}
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
          <motion.div
            style={isMobile ? { clipPath: 'none', scale: 1 } : { clipPath, scale }}
            className="absolute inset-0 w-full h-full z-0 overflow-hidden hero-video-wrapper"
            onContextMenu={(e) => e.preventDefault()}
          >
            <video
              ref={videoRef}
              loop muted playsInline autoPlay controls={false}
              {...({ fetchpriority: 'high', disableRemotePlayback: true } as any)}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate noseek"
              poster={HERO_POSTER}
              className="w-full h-full object-cover pointer-events-none select-none"
              src={optimizeCloudinary("https://res.cloudinary.com/dyomv38on/video/upload/v1746978194/rwsnrwf0xcriojhktfli.mp4", isMobile ? 720 : undefined)}
              onContextMenu={(e) => e.preventDefault()}
              aria-label="Showreel de Fabien Bouadi, motion designer freelance spécialisé luxe et direction artistique à Paris"
            />
            {/* Overlay invisible bloquant les contrôles natifs du navigateur au hover */}
            <div className="absolute inset-0 z-10" style={{ pointerEvents: 'all' }} />
            <motion.div 
              style={{ opacity: videoOverlayOpacity }}
              className="absolute inset-0 bg-black pointer-events-none" 
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            {!isMobile && <div className="absolute inset-0 border border-white/10 rounded-[20px] pointer-events-none" />}
          </motion.div>

          <motion.div
            style={{ opacity }}
            className="relative z-10 h-full flex flex-col justify-between items-center px-6 py-24"
          >
            <div />
            <div className="max-w-7xl mx-auto w-full text-center">
              <motion.h1
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[18vw] leading-[0.75] font-light tracking-tighter uppercase"
                title="Fabien Bouadi — Motion Designer & Direction Artistique Luxe"
              >
                <span className="sr-only">Fabien Bouadi — Motion Designer & Direction Artistique Luxe</span>
                <div className="hidden md:block text-[22px] font-lausanne font-medium tracking-tight opacity-70" aria-hidden="true">
                  3D, Motion, Art direction
                </div>
              </motion.h1>
            </div>
            <div />
          </motion.div>
        </div>

        {/* Contenu scrollable */}
        <div className="relative z-10 min-h-[100vh]">
          <div ref={spacerRef} className="h-[200vh] pointer-events-none" />

          <div className="relative z-20 bg-[#F4F4F0] w-full py-16 md:py-20 shadow-[0_-50px_100px_rgba(0,0,0,0.1)] text-[#1A1A1A] border-t border-[#1A1A1A]/5 rounded-t-[12px] md:rounded-t-[16px] px-4 md:px-6 lg:px-8 xl:px-12">
            <motion.div 
              style={{ scale: filterScale, opacity: filterOpacity }}
              className="w-full"
            >
              {/* Filtres Centrés Nouveaux */}
              <div className="flex flex-wrap justify-center items-center max-w-[1920px] mx-auto gap-x-8 md:gap-x-12 gap-y-3 md:gap-y-6 mb-12 md:mb-16">
                {categories.map((category) => {
                  const count = projects.filter(p => 
                    p.category.toLowerCase().includes(category.toLowerCase().replace('&', '')) || 
                    p.category.toLowerCase().includes(category.toLowerCase())
                  ).length;

                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        'group flex items-start cursor-pointer transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                      )}
                    >
                      <span className="text-[clamp(24px,4vw,40px)] leading-none font-lausanne font-medium tracking-tight whitespace-nowrap">
                        {category}
                      </span>
                      <sup className="ml-0.5 text-[12px] md:text-[16px] font-lausanne opacity-50">
                        {count}
                      </sup>
                    </button>
                  );
                })}
              </div>

              {/* Bouton "All" séparé - comme avant */}
              <div className="flex justify-center mt-10 md:mt-14 mb-16 md:mb-24">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={cn(
                    'group flex items-center gap-3 cursor-pointer transition-opacity duration-300',
                    activeCategory === 'All' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                  )}
                >
                  <span className="text-[14px] md:text-[18px] font-lausanne uppercase tracking-[0.2em] flex items-center gap-2">
                    All
                    {activeCategory === 'All' && (
                      <X size={14} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    )}
                  </span>
                </button>
              </div>
            </motion.div>

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeCategory}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden:  { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
                    exit:    { opacity: 0, transition: { duration: 0.15 } },
                  }}
                  className="flex flex-wrap gap-y-20 gap-x-8 w-full"
                >
                  {visibleProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] 2xl:w-[calc(25%-24px)] flex-grow flex-shrink-0"
                    >
                      <ProjectThumbnail
                        project={project}
                        onClick={handleProjectClick}
                        isMobile={isMobile}
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Bouton Plus de projets */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-20 flex justify-center"
                >
                  <button
                    onClick={() => setVisibleCount(v => v + 9)}
                    className="group relative text-[16px] font-lausanne font-medium tracking-tight border border-[#1A1A1A]/10 px-10 py-4 rounded-full bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F4F0] transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    Plus de projets
                    <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
    </PageTransition>
  );
}
