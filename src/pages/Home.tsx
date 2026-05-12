// src/pages/Home.tsx
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import PageTransition from '../components/PageTransition';
import HomeAbout from '../components/HomeAbout';
import { projects } from '../data/projects';
import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { cn } from '../utils/cn';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import { useNavigationType, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { optimizeCloudinary } from '../utils/cloudinary';
import { useLazyVideo } from '../hooks/useLazyVideo';
import { X } from 'lucide-react';
import LuxuryTitle from '../components/LuxuryTitle';
import { VideoPlayer } from '../components/VideoPlayer';
import Meta from '../components/Meta';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  'Parfums & Beauté', 'Luxe', 'Moodtapes', 
  'Animation 3D', 'Direction Artistique', 'Socials', 'Cosmétiques'
];

const categoryTitles: Record<string, string> = {
  'Parfums & Beauté': 'Projets Parfums & Beauté — Packshots 3D et motion design pour maisons de beauté | Fabien Bouadi',
  'Luxe':              'Projets Luxe — Direction artistique premium, artisanat numérique pour grandes maisons | Fabien Bouadi',
  'Moodtapes':         'Moodtapes — Films atmosphériques et montages créatifs pour marques de luxe | Fabien Bouadi',
  'Animation 3D':      'Animation 3D — Simulation physique, photoréalisme et modélisation avancée | Fabien Bouadi',
  'Direction Artistique': 'Direction Artistique — Identité visuelle et concept créatif pour marques premium | Fabien Bouadi',
  'Socials':           'Socials — Contenus digitaux et formats réseaux sociaux pour marques de luxe | Fabien Bouadi',
  'Cosmétiques':       'Cosmétiques — Packshots animés, textures et rendu photoréaliste cosmétique | Fabien Bouadi',
};

// Composant vidéo de survol — ne charge que si visible + connexion OK
function LazyHoverVideo({ src }: { src: string }) {
  const { videoRef, shouldLoad } = useLazyVideo({
    threshold: 0.1,
    rootMargin: '100px 0px',
  });
  
  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={shouldLoad ? optimizeCloudinary(src) : undefined}
        loop
        muted
        playsInline
        preload="none"
        {...({ 
          disablePictureInPicture: true, 
          disableRemotePlayback: true,
          'x-webkit-airplay': 'deny',
          'webkit-playsinline': 'true',
          'disablevideopopout': 'true'
        } as any)}
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate noseek nopip"
        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out pointer-events-none select-none"
      />
      {/* Overlay "Génie" bloquant la détection Opera/Safari */}
      <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" />
    </div>
  );
}

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
      className="group relative flex flex-col gap-3 project-thumb"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="w-full overflow-hidden squircle aspect-[4/5] md:aspect-[3/2] relative bg-[#EBEBEB]"
        style={{ '--squircle-radius': '12px' } as React.CSSProperties}
      >
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
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ transitionTimingFunction: 'var(--ease-custom)' }}>
            {!isMobile && isHovered && project.video && (
              <LazyHoverVideo src={project.video} />
            )}
          </div>
        </a>
      </div>

      <div className="text-center md:text-left">
        <a
          href={`/project/${project.id}`}
          onClick={handleClick}
          className="p-0 no-underline text-inherit"
        >
          <h2
            className="text-[32px] sm:text-[40px] md:text-[30px] lg:text-[36px] font-lausanne font-medium tracking-tight mb-3 transition-colors duration-200 group-hover:text-[#1A1A1A]/40"
            style={{ transitionTimingFunction: 'var(--ease-custom)' }}
          >
            {project.title}
          </h2>
        </a>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navType = useNavigationType();
  const lenis = useLenis();
  const videoRef  = useRef<HTMLVideoElement>(null);
  const heroRef   = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const titleSectionRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState(() => {
    return sessionStorage.getItem('home_category') || 'All';
  });

  const [hasSeenReveal, setHasSeenReveal] = useState(() => {
    if (typeof window === 'undefined') return false;
    const lastSeen = localStorage.getItem('lastSeenHeroReveal');
    if (!lastSeen) return false;
    
    const now = new Date().getTime();
    const then = parseInt(lastSeen, 10);
    const tenMinutes = 10 * 60 * 1000;
    
    // Si moins de 10 min, on considère que l'utilisateur l'a déjà vue
    return (now - then) < tenMinutes;
  });

  const isTitleInView = useInView(titleSectionRef, { once: true, amount: 0.3 });
  
  // Track last category to detect actual changes (and skip reset on mount)
  const prevCategoryRef = useRef(activeCategory);
  
  const INITIAL_COUNT = 24;
  const [visibleCount, setVisibleCount] = useState(() => {
    const savedCount = sessionStorage.getItem('home_visibleCount');
    return savedCount ? parseInt(savedCount, 10) : INITIAL_COUNT;
  });

  useEffect(() => {
    sessionStorage.setItem('home_category', activeCategory);
    // Reset count ONLY if user manually clicks a different category
    if (prevCategoryRef.current !== activeCategory) {
      setVisibleCount(INITIAL_COUNT);
      prevCategoryRef.current = activeCategory;
    }
  }, [activeCategory]);

  useEffect(() => {
    sessionStorage.setItem('home_visibleCount', visibleCount.toString());
  }, [visibleCount]);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    // Scroll snapping removed
  }, []);

  // Pause video when out of view (or 50% covered)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Ne jouer que si l'animation de reveal est terminée (ou déjà vue)
        const lastSeen = localStorage.getItem('lastSeenHeroReveal');
        if (lastSeen || hasSeenReveal) {
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    }, { 
      threshold: 0,
      rootMargin: '-50% 0px 0px 0px' // La vidéo se met en pause dès que l'overlay couvre 50% de l'écran
    });
    
    if (spacerRef.current) {
      obs.observe(spacerRef.current);
    }
    
    return () => obs.disconnect();
  }, [hasSeenReveal]); // On ajoute hasSeenReveal pour relancer l'observer quand l'état change

  const [shouldAnimateWipe, setShouldAnimateWipe] = useState(() => {
    if (typeof window === 'undefined') return false;
    const lastPlayed = localStorage.getItem('oddRitualIntroLastPlayed');
    if (!lastPlayed) return false;
    const tenMin = 10 * 60 * 1000;
    if (Date.now() - parseInt(lastPlayed, 10) > tenMin) return false;
    return true; // Intro is skipped, we can wipe immediately
  });

  useEffect(() => {
    const handleReset = () => {
      setHasSeenReveal(false);
      setShouldAnimateWipe(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
    const handleFinished = () => {
      setShouldAnimateWipe(true);
      // On ne lance PAS la vidéo ici. Elle sera lancée à la fin du wipe.
    };

    window.addEventListener('intro-reset', handleReset);
    window.addEventListener('intro-finished', handleFinished);

    // Ne pas lancer la vidéo au chargement même si l'intro est skip, on attend le wipe
    return () => {
      window.removeEventListener('intro-reset', handleReset);
      window.removeEventListener('intro-finished', handleFinished);
    };
  }, []);

  // GSAP Clip-path bottom-to-top reveal animation for the video
  useEffect(() => {
    if (videoContainerRef.current && !hasSeenReveal && shouldAnimateWipe) {
      // Set opacity to 1 immediately when we start the wipe so it doesn't flash
      gsap.set(videoContainerRef.current, { opacity: 1 });
      
      // Start hidden with clip-path at the bottom (inset(100% 0 0 0))
      // and reveal by moving the top edge to 0%
      gsap.fromTo(videoContainerRef.current,
        { 
          clipPath: 'inset(100% 0% 0% 0%)',
          webkitClipPath: 'inset(100% 0% 0% 0%)'
        },
        { 
          clipPath: 'inset(0% 0% 0% 0%)',
          webkitClipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.75, 
          ease: 'power4.inOut', 
          delay: 0.1, // Très court délai pour la transition
          onComplete: () => {
            localStorage.setItem('lastSeenHeroReveal', new Date().getTime().toString());
            setHasSeenReveal(true);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }
        }
      );
    } else if (videoContainerRef.current && (!hasSeenReveal && !shouldAnimateWipe)) {
      // Garder invisible tant que l'intro tourne
      gsap.set(videoContainerRef.current, { opacity: 0 });
    } else if (videoContainerRef.current && hasSeenReveal) {
      // Déjà vu, donc complètement visible
      gsap.set(videoContainerRef.current, { 
        opacity: 1, 
        clipPath: 'inset(0% 0% 0% 0%)',
        webkitClipPath: 'inset(0% 0% 0% 0%)' 
      });
    }

    // ── MediaSession API Hero — Neutralise les contrôles système (Génie) ──
    const v = videoRef.current;
    if (v && 'mediaSession' in navigator) {
      const noop = () => {};
      navigator.mediaSession.playbackState = v.paused ? 'paused' : 'playing';
      navigator.mediaSession.setActionHandler('seekbackward', noop);
      navigator.mediaSession.setActionHandler('seekforward', noop);
      navigator.mediaSession.setActionHandler('seekto', noop);
      try {
        navigator.mediaSession.setPositionState({
          duration: Infinity,
          playbackRate: 1,
          position: 0
        });
      } catch (e) {}
    }
  }, [hasSeenReveal, shouldAnimateWipe]);

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

  const filterScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const filterOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  // We removed the shrinking clipPath to keep the video fullscreen as requested
  const clipPath = "inset(0% 0% 0% 0%)"; 
  const scale = 1;

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('home_scrollPosition');
    if (savedScrollPosition && lenis) {
      const pos = parseInt(savedScrollPosition, 10);
      lenis.stop();
      const timer = setTimeout(() => {
        lenis.scrollTo(pos, { immediate: true, force: true });
        window.scrollTo(0, pos);
        lenis.start();
        sessionStorage.removeItem('home_scrollPosition');
      }, 100);
      return () => { clearTimeout(timer); lenis.start(); };
    } else if (lenis && !savedScrollPosition && navType !== 'POP') {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis, navType]);

  useLayoutEffect(() => {
    if (!overlayRef.current || !spacerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 },
        {
          opacity: 0.9,
          ease: "none",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top top",
            end: "center top", // Arrive à 90% quand on a scroll 50% du spacer (bien plus tard)
            scrub: 1.2, // Effet luxueux / lisse
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleProjectClick = useCallback(() => {
    const scrollPos = lenis ? lenis.scroll : window.scrollY;
    sessionStorage.setItem('home_scrollPosition', scrollPos.toString());
  }, [lenis]);

  let filteredProjects = projects.filter(
    project => activeCategory === 'All' || project.category.toUpperCase().includes(activeCategory.toUpperCase())
  );
  if (filteredProjects.length === 0) {
    filteredProjects = projects;
  }



  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <PageTransition scrollToTop={false}>
      <Meta 
        schema={{
          "@context": "https://schema.org",
          "@type": ["Person", "ProfessionalService", "LocalBusiness"],
          "name": "Fabien Bouadi",
          "jobTitle": "Motion Designer & Directeur Artistique Freelance",
          "url": "https://www.fabienbouadi.com",
          "image": HERO_POSTER,
          "description": "Motion Designer et Directeur Artistique freelance à Paris. Spécialisé dans l'artisanat numérique, le luxe, la cosmétique, l'horlogerie et l'animation 3D photoréaliste.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Paris",
            "addressRegion": "Île-de-France",
            "addressCountry": "FR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.8566,
            "longitude": 2.3522
          },
          "priceRange": "€€€",
          "sameAs": [
            "https://www.linkedin.com/in/fabienbouadi"
          ],
          "knowsAbout": [
            "Motion Design", 
            "Direction Artistique", 
            "Animation 3D", 
            "Luxe", 
            "Cosmétiques", 
            "Horlogerie", 
            "Joaillerie", 
            "Packshot 3D",
            "Photoréalisme"
          ]
        }}
      />

      <div className={`w-full min-h-screen ${hasSeenReveal ? 'bg-black' : 'bg-transparent'}`}>
        <div ref={heroRef} className="relative w-full text-white">
          {/* Hero fixe */}
          <div className={`fixed top-0 left-0 w-full h-[100svh] z-0 overflow-hidden pointer-events-none ${hasSeenReveal ? 'bg-black' : 'bg-transparent'}`}>
            <motion.div
            ref={videoContainerRef}
            style={{ 
              clipPath: hasSeenReveal ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', 
              WebkitClipPath: hasSeenReveal ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' 
            } as any}
            className="absolute inset-0 w-full h-full z-0 overflow-hidden hero-video-wrapper"
            onContextMenu={(e) => e.preventDefault()}
            itemScope itemType="https://schema.org/VideoObject"
          >
            <meta itemProp="name" content="Showreel Direction Artistique & Motion Design Luxe — Fabien Bouadi" />
            <meta itemProp="description" content="Découvrez le showreel de Fabien Bouadi, directeur artistique et motion designer freelance à Paris. Expertise en 3D, artisanat numérique et campagnes de luxe." />
            <meta itemProp="uploadDate" content="2024-01-01T08:00:00+01:00" />
            <meta itemProp="thumbnailUrl" content={HERO_POSTER} />
            
            <video
              ref={videoRef}
              loop muted playsInline autoPlay={false}
              disablePictureInPicture
              disableRemotePlayback
              {...({ 
                'x-webkit-airplay': 'deny', 
                'webkit-playsinline': 'true',
                'disablevideopopout': 'true'
              } as any)}
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate noseek nopip"
              poster={HERO_POSTER}
              className="w-full h-full object-cover pointer-events-none select-none"
              src={optimizeCloudinary("https://res.cloudinary.com/dfwhiztck/video/upload/v1746601651/REEL_1_prob4_1_gfqoqw.mp4")}
              onContextMenu={(e) => e.preventDefault()}
              aria-label="Showreel de Fabien Bouadi, motion designer freelance spécialisé luxe et direction artistique à Paris"
              itemProp="contentUrl"
            />

            {/* Overlay invisible bloquant les contrôles natifs du navigateur au hover (Génie) */}
            <div 
              className="absolute inset-0 z-20 bg-transparent pointer-events-auto" 
              onContextMenu={(e) => e.preventDefault()}
            />
            <motion.div 
              ref={overlayRef}
              className="absolute inset-0 bg-black pointer-events-none opacity-0" 
            />
            {!isMobile && (
              <div 
                className="absolute inset-0 border border-white/10 squircle pointer-events-none" 
                style={{ '--squircle-radius': '20px' } as React.CSSProperties}
              />
            )}
          </motion.div>

          <motion.div
            style={{ opacity }}
            className="relative z-10 h-full flex flex-col justify-between items-center px-6 py-24"
          >
            <div />
            <div className="max-w-7xl mx-auto w-full text-center">
              {/* Central text removed from hero, moved to scroll section below */}
            </div>
            
            {/* Bottom Left Logo */}
            <div 
              className="absolute bottom-6 left-4 md:bottom-12 md:left-6 lg:left-8 xl:left-12 w-[84vw] sm:w-[72vw] md:w-[60vw] lg:w-[54vw] max-w-[1100px] min-min-w-[300px] opacity-80 hover:opacity-100 transition-opacity duration-300"
              role="img"
              aria-label="Fabien Bouadi — Motion Designer & Direction Artistique"
            >
              <svg className="w-full h-auto text-white" fill="none" viewBox="0 0 1352 182" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.25 49.75H68V68H43.5V179H21.5V68H0V49.75H21.5V25.25C21.5 11 32.5 0.5 49.75 0.5H66.5V19.25H53.75C46.75 19.25 43.25 22.25 43.25 28.5V49.75Z" fill="currentColor"></path>
                <path d="M186.078 92.25V161.5C186.078 168.75 186.828 174.5 188.078 179H165.578C164.828 174.5 164.578 165 164.578 150.25H164.328C160.328 171 143.828 182 119.078 182C79.5781 182 72.0781 161.25 72.0781 144.75C72.0781 128.5 80.5781 117 93.5781 112C100.328 109.5 106.578 107.75 112.828 106.5C119.078 105.25 125.578 104.25 132.578 103.5C139.828 102.75 144.578 102 146.828 101.25C161.578 97 163.578 93.75 163.578 84C163.578 72 152.578 65.25 133.328 65.25C120.328 65.25 111.578 69 107.828 75.25C104.578 81.25 104.328 83 103.578 87.75H81.0781C82.0781 79.5 83.5781 73.5 85.8281 69.25C93.5781 54.25 109.328 46.75 132.828 46.75C151.578 46.75 165.828 52.25 172.828 58.5C176.578 61.75 179.328 65.5 181.328 70.25C185.578 79.25 186.078 85 186.078 92.25ZM163.578 119V98.25C161.328 109.5 151.578 113.75 127.828 118.5C104.828 122.75 95.3281 128.25 95.3281 144.25C95.3281 156.25 105.328 164.5 121.578 164.5C149.328 164.5 163.578 151.75 163.578 119Z" fill="currentColor"></path>
                <path d="M268.338 46.75C287.338 46.75 301.838 53.25 311.838 66.25C322.088 79 327.088 95.25 327.088 114.75C327.088 134 322.088 150.25 311.838 163C301.588 175.75 287.088 182 268.088 182C248.338 182 234.588 172.75 226.338 154.25H225.838V179H204.088V0.5H226.838L226.338 75.5H227.088C231.838 56.75 249.088 46.75 268.338 46.75ZM265.338 163.25C278.838 163.25 288.588 158.5 294.838 149C301.088 139.25 304.088 127.5 304.088 113.25C304.088 100 300.838 88.75 294.088 79.75C287.588 70.5 277.838 66 264.838 66C240.588 66 226.838 84.25 226.088 111V112.5C226.088 126.75 229.088 139 235.088 148.75C241.338 158.5 251.338 163.25 265.338 163.25Z" fill="currentColor"></path>
                <path d="M362.619 0.5V26.5H339.619V0.5H362.619ZM339.869 179V49.75H362.369V179H339.869Z" fill="currentColor"></path>
                <path d="M439.098 46.75C485.848 46.75 500.848 89.5 499.348 121H397.098C399.348 149.25 413.598 163.25 439.848 163.25C458.098 163.25 471.348 154.75 475.098 138H497.098C491.348 166.25 469.848 182 439.848 182C398.848 182 375.848 155 374.598 114C374.598 94.75 380.848 78.75 393.098 66C405.348 53.25 420.848 46.75 439.098 46.75ZM397.848 102H476.598C475.348 81 460.348 65.25 439.098 65.25C418.098 65.25 401.848 80 397.848 102Z" fill="currentColor"></path>
                <path d="M574.996 46.75C607.746 46.75 624.246 65 624.246 94V179H601.746V96.25C601.746 73.5 590.996 65.5 571.996 65.5C546.746 65.5 533.746 78.25 533.746 110.5V179H511.246V49.75H532.496V77.75H532.996C538.996 57 554.996 46.75 574.996 46.75Z" fill="currentColor"></path>
                <path d="M734.48 46.75C753.48 46.75 767.98 53.25 777.98 66.25C788.23 79 793.23 95.25 793.23 114.75C793.23 134 788.23 150.25 777.98 163C767.73 175.75 753.23 182 734.23 182C714.48 182 700.73 172.75 692.48 154.25H691.98V179H670.23V0.5H692.98L692.48 75.5H693.23C697.98 56.75 715.23 46.75 734.48 46.75ZM731.48 163.25C744.98 163.25 754.73 158.5 760.98 149C767.23 139.25 770.23 127.5 770.23 113.25C770.23 100 766.98 88.75 760.23 79.75C753.73 70.5 743.98 66 730.98 66C706.73 66 692.98 84.25 692.23 111V112.5C692.23 126.75 695.23 139 701.23 148.75C707.48 158.5 717.48 163.25 731.48 163.25Z" fill="currentColor"></path>
                <path d="M797.762 114.5C797.762 94.75 803.512 78.75 814.762 66C826.012 53.25 841.762 46.75 861.512 46.75C881.262 46.75 897.012 53.25 908.262 66C919.512 78.75 925.262 94.75 925.262 114.5C925.262 134 919.512 150.25 908.262 163C897.012 175.75 881.262 182 861.512 182C841.762 182 826.012 175.75 814.762 163C803.512 150.25 797.762 134 797.762 114.5ZM902.762 114.5C902.762 99.25 898.762 87.25 890.762 78.5C883.012 69.75 873.262 65.25 861.512 65.25C849.762 65.25 840.012 69.75 832.012 78.5C824.262 87.25 820.262 99.25 820.262 114.5C820.262 129.5 824.262 141.5 832.012 150.25C840.012 159 849.762 163.25 861.512 163.25C873.262 163.25 883.012 159 890.762 150.25C898.762 141.5 902.762 129.5 902.762 114.5Z" fill="currentColor"></path>
                <path d="M1028.8 118.25V49.75H1051.3V179H1030.05V151H1029.55C1023.55 171.75 1007.55 182 987.555 182C954.805 182 938.305 163.75 938.305 134.75V49.75H960.805V132.5C960.805 155.25 971.555 163.25 990.555 163.25C1015.8 163.25 1028.8 150.5 1028.8 118.25Z" fill="currentColor"></path>
                <path d="M1176.19 92.25V161.5C1176.19 168.75 1176.94 174.5 1178.19 179H1155.69C1154.94 174.5 1154.69 165 1154.69 150.25H1154.44C1150.44 171 1133.94 182 1109.19 182C1069.69 182 1062.19 161.25 1062.19 144.75C1062.19 128.5 1070.69 117 1083.69 112C1090.44 109.5 1096.69 107.75 1102.94 106.5C1109.19 105.25 1115.69 104.25 1122.69 103.5C1129.94 102.75 1134.69 102 1136.94 101.25C1151.69 97 1153.69 93.75 1153.69 84C1153.69 72 1142.69 65.25 1123.44 65.25C1110.44 65.25 1101.69 69 1097.94 75.25C1094.69 81.25 1094.44 83 1093.69 87.75H1071.19C1072.19 79.5 1073.69 73.5 1075.94 69.25C1083.69 54.25 1099.44 46.75 1122.94 46.75C1141.69 46.75 1155.94 52.25 1162.94 58.5C1166.69 61.75 1169.44 65.5 1171.44 70.25C1175.69 79.25 1176.19 85 1176.19 92.25ZM1153.69 119V98.25C1151.44 109.5 1141.69 113.75 1117.94 118.5C1094.94 122.75 1085.44 128.25 1085.44 144.25C1085.44 156.25 1095.44 164.5 1111.69 164.5C1139.44 164.5 1153.69 151.75 1153.69 119Z" fill="currentColor"></path>
                <path d="M1288.7 75.5L1288.2 0.5H1310.7V179H1288.95V154.25H1288.45C1280.2 172.75 1266.45 182 1246.7 182C1227.7 182 1213.2 175.75 1202.95 163C1192.7 150.25 1187.7 134 1187.7 114.75C1187.7 95.25 1192.7 79 1202.7 66.25C1212.95 53.25 1227.45 46.75 1246.45 46.75C1265.7 46.75 1282.95 56.75 1287.7 75.5H1288.7ZM1249.45 163.25C1263.45 163.25 1273.45 158.5 1279.45 148.75C1285.7 139 1288.7 126.75 1288.7 112.5V110.75C1287.95 84 1274.2 66 1249.95 66C1236.95 66 1227.2 70.5 1220.45 79.75C1213.95 88.75 1210.7 100 1210.7 113.25C1210.7 127.5 1213.7 139.25 1219.95 149C1226.2 158.5 1235.95 163.25 1249.45 163.25Z" fill="currentColor"></path>
                <path d="M1351.75 0.5V26.5H1328.75V0.5H1351.75ZM1329 179V49.75H1351.5V179H1329Z" fill="currentColor"></path>
              </svg>
            </div>

            <div className="flex flex-col items-center">
              {isMobile && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  onClick={() => lenis?.scrollTo(window.innerHeight * 2, { duration: 1.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
                  className="group flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer"
                >
                  <motion.div 
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF4F11]" />
                      <span className="text-[13px] font-presura font-medium uppercase tracking-[0.1em] text-[#FF4F11]">
                        Scroll to view more ↓
                      </span>
                    </div>
                  </motion.div>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Contenu scrollable */}
        <div className="relative z-10 min-h-[100svh]">
          <div ref={spacerRef} className="h-[100vh] pointer-events-none" />

          <div className="relative z-20 bg-[#F4F4F0] w-full text-[#1A1A1A] border-t border-[#1A1A1A]/5 rounded-t-[12px] md:rounded-t-[16px] px-4 md:px-6 lg:px-8 xl:px-12">
            <motion.div 
              style={{ scale: filterScale, opacity: filterOpacity }}
              className="w-full pt-20 md:pt-32 pb-10"
            >
              {/* Filtres Centrés Nouveaux - Augmentation padding sur grands écrans */}
              <div className="flex flex-wrap justify-center items-center max-w-[1920px] mx-auto gap-x-8 md:gap-x-12 gap-y-2 md:gap-y-4 mb-6 md:mb-12 lg:px-20 xl:px-40">
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
                      title={categoryTitles[category]}
                      aria-label={categoryTitles[category]}
                      className={cn(
                        'group flex items-baseline cursor-pointer transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                      )}
                    >
                      <span className="text-[clamp(24px,4vw,40px)] leading-none font-lausanne font-medium tracking-tight whitespace-nowrap">
                        {category}
                      </span>
                      <span className="ml-1 text-[12px] md:text-[14px] font-lausanne opacity-50 relative bottom-[0.8em]">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bouton "All" séparé - comme avant */}
              <div className="flex justify-center mt-6 md:mt-10 mb-8 md:mb-16">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={cn(
                    'group flex items-center gap-3 cursor-pointer transition-opacity duration-300',
                    activeCategory === 'All' ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                  )}
                >
                  <span className="text-[14px] md:text-[18px] font-lausanne font-medium uppercase tracking-[0.2em] flex items-center gap-2">
                    Tout
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-20 md:gap-y-14 gap-x-4 md:gap-x-8 w-full"
                >
                  {visibleProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="w-full flex-grow flex-shrink-0"
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
                    className="group relative inline-flex items-center justify-center text-[16px] font-lausanne font-medium tracking-tight border border-[#1A1A1A]/10 px-10 py-4 rounded-full bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F4F0] transition-all duration-300 cursor-pointer leading-none pt-[calc(1rem+1px)] pb-4"
                  >
                    Plus de projets
                    <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </motion.div>
              )}

              {/* Showreel */}
              <div className="mt-24 md:mt-32 pt-12 md:pt-20 border-t border-[#1A1A1A]/10 w-full flex flex-col mb-8 md:mb-16">
                <div className="flex gap-4 md:gap-8 mb-8 md:mb-12">
                  <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-presura font-medium opacity-40 pt-1">02.</div>
                  <div>
                    <h2 className="text-[clamp(32px,4vw,60px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
                      Showreel
                    </h2>
                    <p className="text-[14px] font-presura opacity-40 uppercase tracking-widest mt-2">
                      ( 2024 )
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <VideoPlayer
                    src="https://res.cloudinary.com/dfwhiztck/video/upload/f_auto,vc_auto,q_auto:good/v1746601651/REEL_1_prob4_1_gfqoqw.mp4"
                    srcLow="https://res.cloudinary.com/dfwhiztck/video/upload/f_auto,vc_auto,q_auto:low,w_640/v1746601651/REEL_1_prob4_1_gfqoqw.mp4"
                    srcMedium="https://res.cloudinary.com/dfwhiztck/video/upload/f_auto,vc_auto,q_auto:good,w_1280/v1746601651/REEL_1_prob4_1_gfqoqw.mp4"
                    srcHigh="https://res.cloudinary.com/dfwhiztck/video/upload/f_auto,vc_auto,q_auto:best,w_1920/v1746601651/REEL_1_prob4_1_gfqoqw.mp4"
                    poster={HERO_POSTER}
                  />
                </div>
              </div>

              <HomeAbout />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
