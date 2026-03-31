import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { optimizeCloudinary } from '../utils/cloudinary';
import PageTransition from '../components/PageTransition';
import { projects } from '../data/projects';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useLenis } from 'lenis/react';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';

// ── CSS — supprime tous les controls natifs ───────────────────
const NO_CTRL = `
  video::-webkit-media-controls,
  video::-webkit-media-controls-panel,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-overlay-play-button,
  video::-internal-media-controls-button-bar,
  video::-internal-media-controls-overflow-button { display:none!important; }
`;

// ── VideoPlayer ───────────────────────────────────────────────
// Principe : UNE SEULE vidéo, toujours montée.
// En fullscreen → le conteneur parent passe en position:fixed via style inline.
// La vidéo ne se recharge jamais → sync parfaite.
function VideoPlayer({ src, poster, priority = false }: { src: string; poster?: string; priority?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null); // sentinel pour IntersectionObserver
  const barRef = useRef<HTMLDivElement>(null);  // progress bar
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const timeLabelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const lenis = useLenis();

  const [tick, bump] = useState(0);
  const rerender = () => bump(n => n + 1);

  // State en refs → pas de re-render parasite
  const isFS = useRef(false);
  const isMuted = useRef(true);
  const progress = useRef(0);
  const curTime = useRef(0);
  const durTotal = useRef(0);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  // CSS natif supprimé
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = NO_CTRL;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // Autoplay inView
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? v.play().catch(() => { }) : v.pause(); },
      { threshold: 0.5 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  // Events vidéo - Boucle rAF fluide 60fps
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    
    let isPlaying = false;

    const loop = () => {
      if (!v) return;
      if (isPlaying) {
        curTime.current = v.currentTime;
        progress.current = v.duration ? v.currentTime / v.duration : 0;
        if (fillRef.current) fillRef.current.style.width = `${progress.current * 100}%`;
        if (headRef.current) headRef.current.style.left = `${progress.current * 100}%`;
        if (timeLabelRef.current) timeLabelRef.current.innerText = fmt(v.currentTime);
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const playEvt = () => { isPlaying = true; loop(); };
    const pauseEvt = () => { isPlaying = false; cancelAnimationFrame(rafRef.current); };
    const updateEvt = () => {
       if (!isPlaying) {
         curTime.current = v.currentTime;
         progress.current = v.duration ? v.currentTime / v.duration : 0;
         if (fillRef.current) fillRef.current.style.width = `${progress.current * 100}%`;
         if (headRef.current) headRef.current.style.left = `${progress.current * 100}%`;
         if (timeLabelRef.current) timeLabelRef.current.innerText = fmt(v.currentTime);
       }
    };
    const onMeta = () => { durTotal.current = v.duration; rerender(); };

    v.addEventListener('play', playEvt);
    v.addEventListener('pause', pauseEvt);
    v.addEventListener('timeupdate', updateEvt);
    v.addEventListener('loadedmetadata', onMeta);
    return () => {
      isPlaying = false;
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('play', playEvt);
      v.removeEventListener('pause', pauseEvt);
      v.removeEventListener('timeupdate', updateEvt);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  // Cleanup de sécurité (si on change de page alors que la vidéo était en plein écran)
  useEffect(() => {
    return () => {
      if (isFS.current) {
        document.body.style.overflow = '';
        lenis?.start();
      }
    };
  }, [lenis]);

  // Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFS.current) { 
        isFS.current = false; 
        document.body.style.overflow = ''; 
        lenis?.start(); 
        rerender(); 
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lenis]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current; if (!v) return;
    v.paused ? v.play().catch(() => { }) : v.pause();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted;
    isMuted.current = v.muted;
    rerender();
  };

  const openFS = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    isFS.current = true; 
    document.body.style.overflow = 'hidden'; 
    lenis?.stop(); 
    rerender();
  };

  const closeFS = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    isFS.current = false; 
    document.body.style.overflow = ''; 
    lenis?.start(); 
    rerender();
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = videoRef.current; const bar = barRef.current;
    if (!v || !bar || !v.duration) return;
    const r = Math.max(0, Math.min(1, (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth));
    v.currentTime = r * v.duration;
  };

  const btn = (dark: boolean) =>
    `relative text-[12px] uppercase tracking-widest bg-transparent border-0 cursor-pointer p-0 flex-shrink-0 font-sans
     transition-colors duration-300
     min-h-[44px] min-w-[44px] inline-flex items-center justify-center
     after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-1 after:left-0 after:bg-current
     after:transition-transform after:duration-[550ms] after:ease-[cubic-bezier(.785,.135,.15,.86)]
     after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left
     ${dark ? 'text-white hover:text-white/60' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'}`;

  const renderBar = (dark: boolean) => (
    <div
      className={`flex items-center gap-5 select-none ${dark ? 'px-6 pb-6 pt-2' : 'pt-4 pb-2'}`}
      style={{ isolation: 'isolate' }}
      onClick={e => e.stopPropagation()}
    >
      <button onClick={toggleMute} className={btn(dark)}>
        {isMuted.current ? 'Unmute' : 'Mute'}
      </button>
      <span ref={timeLabelRef} className={`text-[12px] uppercase font-lausanne tabular-nums flex-shrink-0 opacity-50 ${dark ? 'text-white' : 'text-[#1A1A1A]'}`} style={{ marginBottom: '-1px' }}>
        {fmt(curTime.current)}
      </span>
      <div className="flex-1 h-[44px] flex items-center cursor-pointer group" onClick={seekTo}>
        <div ref={barRef} className={`w-full h-[1px] relative ${dark ? 'bg-white/30' : 'bg-[#1A1A1A]/20'}`}>
          <div ref={fillRef}
            className={`absolute left-0 top-0 h-full ${dark ? 'bg-white' : 'bg-[#1A1A1A]/70'}`}
            style={{ width: `${progress.current * 100}%`, willChange: 'width' }}
          />
          <div ref={headRef}
            className={`absolute top-1/2 w-px h-[18px] -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${dark ? 'bg-white' : 'bg-[#1A1A1A]'}`}
            style={{ left: `${progress.current * 100}%`, willChange: 'left' }}
          />
        </div>
      </div>
      <span className={`text-[12px] uppercase font-lausanne tabular-nums flex-shrink-0 opacity-50 ${dark ? 'text-white' : 'text-[#1A1A1A]'}`} style={{ marginBottom: '-1px' }}>
        {fmt(durTotal.current)}
      </span>
      <button onClick={dark ? closeFS : openFS} className={btn(dark)}>
        {dark ? 'Exit' : 'Fullscreen'}
      </button>
    </div>
  );

  const fs = isFS.current;

  return (
    <>
      <style>{NO_CTRL}</style>

      {/* Placeholder — garde la hauteur quand la vidéo est en fixed */}
      {fs && <div style={{ aspectRatio: '16/9', background: 'black' }} />}

      {/* Conteneur vidéo unique — fixed en FS, normal sinon */}
      <div
        style={fs
          ? { position: 'fixed', inset: 0, zIndex: 99999, background: 'black', display: 'flex', flexDirection: 'column' }
          : { position: 'relative', width: '100%' }
        }
      >
        {/* Zone vidéo cliquable */}
        <div
          className={fs ? '' : 'rounded-lg border border-[#1A1A1A]/10'}
          style={fs ? { flex: 1, overflow: 'hidden', cursor: 'pointer' } : { aspectRatio: '16/9', overflow: 'hidden', cursor: 'pointer' }}
          onClick={togglePlay}
          onDoubleClick={fs ? closeFS : openFS}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            loop muted playsInline preload="metadata"
            {...(priority ? ({ fetchpriority: 'high' } as any) : {})}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            onContextMenu={e => e.preventDefault()}
            style={{ width: '100%', height: '100%', objectFit: fs ? 'contain' : 'cover', display: 'block' }}
          />
        </div>

        {/* Barre en fullscreen — overlay en bas avec blend mode */}
        {fs && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, mixBlendMode: 'difference' }}>
            {renderBar(true)}
          </div>
        )}
      </div>

      {/* Barre en mode normal — sous la vidéo */}
      {!fs && renderBar(false)}
    </>
  );
}


// Extrait la toute première frame de la vidéo via Cloudinary
const getVideoPoster = (url: string) => {
  if (!url) return undefined;
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    const posterUrl = url.replace(/\.(mp4|webm|mov)$/i, '.jpg');
    if (!posterUrl.includes('f_auto') && !posterUrl.includes('q_auto')) {
      return posterUrl.replace('/upload/', '/upload/f_auto,q_auto,so_0/');
    }
    if (!posterUrl.includes('so_0')) {
      return posterUrl.replace('/upload/', '/upload/so_0/');
    }
    return posterUrl;
  }
  // Si ce n'est pas Cloudinary, on ne passe PAS d'attribut poster (car un .mp4 casserait l'affichage).
  // Le navigateur utilisera nativement la première frame grâce à preload="metadata" ou #t=0.001
  return undefined;
};

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
          if (el instanceof HTMLVideoElement) el.play().catch(() => {});
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
        className={cls} loop muted playsInline preload="metadata"
        {...(priority ? ({ fetchpriority: 'high' } as any) : {})}
      />
    );
  }

  return (
    <img ref={ref as React.RefObject<HTMLImageElement>} src={optimizedSrc} alt={alt}
      onLoad={() => setReady(true)}
      className={cls}
      {...(priority ? ({ fetchpriority: 'high' } as any) : {})}
    />
  );
}

import { Helmet } from 'react-helmet-async';

// ── Page ──────────────────────────────────────────────────────
export default function Project() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const lenis = useLenis();
  const go = useNavigateWithMask();

  useEffect(() => { if (lenis) lenis.scrollTo(0, { immediate: true }); }, [lenis]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const others = projects.filter(p => p.id !== project.id);
    const seed = (project.id ?? '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return [...others].sort((a, b) => ((a.id.charCodeAt(0) + seed) % 97) - ((b.id.charCodeAt(0) + seed) % 97)).slice(0, 3);
  }, [id, project]);

  const currentIndex = projects.findIndex(p => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-lausanne">Project not found</h1>
      </div>
    );
  }

  const images = project.images ?? [];
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.metaDescription || project.description,
    "image": project.image,
    "author": {
      "@type": "Person",
      "name": "Fabien Bouadi",
      "jobTitle": "Motion Designer",
      "url": "https://www.fabienbouadi.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Fabien Bouadi"
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{project.seoTitle || `${project.title} — Fabien Bouadi`}</title>
        <meta name="description" content={project.metaDescription || project.description || ""} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.metaDescription || project.description || ""} />
        <meta property="og:image" content={project.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.fabienbouadi.com/project/${project.id}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#F4F4F0] text-[#1A1A1A] select-none">

        {/* ── Bouton Close — fixe comme le logo ── */}
        <button
          onClick={() => go('/')}
          className="fixed top-36 md:top-40 right-4 md:right-6 lg:right-8 xl:right-12 z-[900] flex items-center gap-2 text-[16px] uppercase tracking-widest text-white mix-blend-difference hover:opacity-50 transition-opacity bg-transparent border-0 cursor-pointer group font-lausanne min-h-[44px] px-0"
          style={{ mixBlendMode: 'difference' }}
        >
          <span className="opacity-100">Close</span>
          <X size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* ── Header nav ── */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 pt-36 md:pt-40 pb-10 flex justify-between items-center">
          <button onClick={() => document.getElementById('more-projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[16px] uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors bg-transparent border-0 cursor-pointer font-lausanne min-h-[44px] px-0 flex items-center">
            More Projects ↓
          </button>
        </div>

        {/* ── Titre ── */}
        <div className="px-4 md:px-6 lg:px-8 xl:px-12 mb-8 text-center">
        <div className="overflow-hidden pb-3">
              <motion.h1
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(48px,11vw,140px)] md:text-[clamp(64px,8vw,120px)] leading-[0.88] font-lausanne font-medium tracking-tighter"
              >
              {project.title}
            </motion.h1>
          </div>
        </div>

        {/* ── Pills ── */}
        <motion.div className="px-4 md:px-6 lg:px-8 xl:px-12 mb-10 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          {project.category.split('/').map(cat => (
            <span key={cat}
              className="px-5 py-1.5 rounded-full border border-[#1A1A1A]/30 text-[12px] uppercase tracking-widest font-lausanne text-[#1A1A1A]">
              {cat.trim()}
            </span>
          ))}
        </motion.div>

        {/* ── Meta ── */}
        <motion.div className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 mb-16 grid grid-cols-3 gap-6 border-t border-[#1A1A1A]/10 pt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="flex flex-col">
            <span className="block text-[14px] 2xl:text-[16px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40 mb-1">Client</span>
            <span className="text-[17px] 2xl:text-[19px] font-lausanne font-medium">{project.client}</span>
          </div>
          <div className="flex flex-col">
            <span className="block text-[14px] 2xl:text-[16px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40 mb-1">Année</span>
            <span className="text-[17px] 2xl:text-[19px] font-lausanne font-medium">{project.year}</span>
          </div>
          <div className="flex flex-col">
            <span className="block text-[14px] 2xl:text-[16px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40 mb-1">Rôle</span>
            <span className="text-[17px] 2xl:text-[19px] font-lausanne font-medium">Direction artistique<br />Motion design</span>
          </div>
        </motion.div>

        {/* ── Hero video/image ── */}
        <motion.div className="px-4 md:px-6 lg:px-8 xl:px-12 mb-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
          <div className="w-full">
            {project.fullVideo || project.video ? (
              <VideoPlayer 
                src={optimizeCloudinary(project.fullVideo || project.video, typeof window !== 'undefined' && window.innerWidth < 768 ? 720 : undefined) + '#t=0.001'} 
                poster={getVideoPoster(project.video)} 
                priority={true} 
              />
            ) : (
              <div className="w-full aspect-[16/9] border border-[#1A1A1A]/10 rounded-lg overflow-hidden">
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
            <div className="w-full mb-4 overflow-hidden border border-[#1A1A1A]/10 rounded-lg">
              <FadeMedia src={images[0]} alt={project.altText || `${project.title} — Direction artistique par Fabien Bouadi`} className="w-full h-auto block" />
            </div>
            {images.length >= 3 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[images[1], images[2]].map((img, i) => (
                  <div key={i} className="overflow-hidden border border-[#1A1A1A]/10 rounded-lg">
                    <FadeMedia src={img} alt={`${project.title} — Visuel ${i + 2} — Motion Design Fabien Bouadi`} className="w-full h-auto block" />
                  </div>
                ))}
              </div>
            )}
            {images.slice(3).map((img, i) => (
              <div key={i} className="w-full mb-4 overflow-hidden">
                <FadeMedia src={img} alt={`${project.title} — Visuel ${i + 4} — Motion Design Fabien Bouadi`} className="w-full h-auto block" />
              </div>
            ))}
          </div>
        )}

        {/* ── More Projects ── */}
        <div id="more-projects" className="max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 pt-16 mt-16 border-t border-[#1A1A1A]/10">
          <h3 className="text-[12px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40 mb-12">Autres projets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
            {relatedProjects.map((p, i) => (
              <motion.a key={p.id}
                href={`/project/${p.id}`}
                onClick={(e) => { e.preventDefault(); go(`/project/${p.id}`); }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group block w-full text-left no-underline text-inherit p-0">
                <div className="w-full aspect-[4/3] overflow-hidden mb-4 bg-[#EBEBEB] border border-[#1A1A1A]/10 rounded-lg">
                  <FadeMedia src={p.image} alt={p.altText || `${p.title} — Motion Design Fabien Bouadi`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {p.category.split('/').map(cat => (
                    <span key={cat} className="px-3 py-1 rounded-full border border-[#1A1A1A]/20 text-[11px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/60">
                      {cat.trim()}
                    </span>
                  ))}
                </div>
                <h4 className="text-xl font-lausanne font-medium tracking-tight group-hover:text-[#1A1A1A]/40 transition-colors duration-300">{p.title}</h4>
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
