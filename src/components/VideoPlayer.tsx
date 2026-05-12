import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';

// ── CSS — supprime tous les controls natifs (stricte) ───────────
const NO_CTRL = `
  video::-webkit-media-controls,
  video::-webkit-media-controls-panel,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-overlay-play-button,
  video::-webkit-media-controls-enclosure,
  video::-webkit-media-controls-start-playback-button,
  video::-internal-media-controls-button-bar,
  video::-internal-media-controls-overflow-button,
  video::-webkit-media-controls-picture-in-picture-button,
  video::-webkit-media-controls-remote-playback-button { 
    display: none !important; 
    -webkit-appearance: none !important;
  }
`;

export function VideoPlayer({ 
  src, 
  srcLow,
  srcMedium,
  srcHigh,
  poster, 
  priority = false, 
  title,
  description,
  onError 
}: { 
  src?: string; 
  srcLow?: string;
  srcMedium?: string;
  srcHigh?: string;
  poster?: string; 
  priority?: boolean;
  title?: string;
  description?: string;
  onError?: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);  // progress bar
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const timeLabelRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const lenis = useLenis();

  const [tick, bump] = useState(0);
  const rerender = () => bump(n => n + 1);

  // Source adaptative
  const [activeSrc, setActiveSrc] = useState<string | undefined>(src);
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedLocal, setIsPausedLocal] = useState(true);

  useEffect(() => {
    if (srcLow && srcMedium && srcHigh) {
      let speedMbps: number | null = null;
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn && conn.downlink) {
        speedMbps = conn.downlink;
      }
      
      // Fallback très basique si l'API n'est pas dispo
      if (!speedMbps) speedMbps = 3.0;

      if (speedMbps < 1.5) setActiveSrc(srcLow);
      else if (speedMbps > 5.0) setActiveSrc(srcHigh);
      else setActiveSrc(srcMedium);
    } else {
      setActiveSrc(src);
    }
  }, [src, srcLow, srcMedium, srcHigh]);

  // State en refs → pas de re-render parasite pour la progress bar
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
      ([e]) => { 
        if (e.isIntersecting) {
          v.play().catch(() => { });
        } else {
          v.pause();
        }
      },
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
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress.current})`;
        if (headRef.current) headRef.current.style.left = `${progress.current * 100}%`;
        if (timeLabelRef.current) timeLabelRef.current.innerText = fmt(v.currentTime);
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const playEvt = () => { 
      isPlaying = true; 
      setIsPausedLocal(false);
      loop(); 
    };
    const pauseEvt = () => { 
      isPlaying = false; 
      setIsPausedLocal(true);
      cancelAnimationFrame(rafRef.current); 
    };
    const updateEvt = () => {
      if (!isPlaying) {
        curTime.current = v.currentTime;
        progress.current = v.duration ? v.currentTime / v.duration : 0;
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress.current})`;
        if (headRef.current) headRef.current.style.left = `${progress.current * 100}%`;
        if (timeLabelRef.current) timeLabelRef.current.innerText = fmt(v.currentTime);
      }
    };
    const onMeta = () => { durTotal.current = v.duration; rerender(); };

    setIsPausedLocal(v.paused);

    v.addEventListener('play', playEvt);
    v.addEventListener('pause', pauseEvt);
    v.addEventListener('timeupdate', updateEvt);
    v.addEventListener('loadedmetadata', onMeta);

    // ── MediaSession API — Neutralise les contrôles système (Génie) ──
    if ('mediaSession' in navigator && v) {
      navigator.mediaSession.playbackState = v.paused ? 'paused' : 'playing';
      
      // On bloque les actions de saut en définissant des handlers vides
      const noop = () => {};
      navigator.mediaSession.setActionHandler('play', () => v.play().catch(() => {}));
      navigator.mediaSession.setActionHandler('pause', () => v.pause());
      navigator.mediaSession.setActionHandler('seekbackward', noop);
      navigator.mediaSession.setActionHandler('seekforward', noop);
      navigator.mediaSession.setActionHandler('seekto', noop);
      
      // Trick : En déclarant une durée infinie, on force souvent le retrait du bouton rewind/seek
      try {
        navigator.mediaSession.setPositionState({
          duration: Infinity,
          playbackRate: 1,
          position: 0
        });
      } catch (e) { /* ignore */ }
    }

    return () => {
      isPlaying = false;
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('play', playEvt);
      v.removeEventListener('pause', pauseEvt);
      v.removeEventListener('timeupdate', updateEvt);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  // Cleanup de sécurité
  useEffect(() => {
    return () => {
      if (isFS.current) {
        document.body.style.overflow = '';
        document.body.classList.remove('is-video-fullscreen');
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
        document.body.classList.remove('is-video-fullscreen');
        lenis?.start();
        rerender();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lenis]);

  const lastTapRef = useRef<number>(0);
  const [isClickedDuringHover, setIsClickedDuringHover] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClickedDuringHover(true);
    const v = videoRef.current; if (!v) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        isFS.current ? closeFS(e) : openFS(e);
        v.paused ? v.play().catch(() => {}) : v.pause();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
        v.paused ? v.play().catch(() => {}) : v.pause();
      }
    } else {
      v.paused ? v.play().catch(() => {}) : v.pause();
    }
  };

  const isDragging = useRef(false);
  const wasPlayingBeforeDrag = useRef(false);

  const updateSeek = (clientX: number) => {
    const v = videoRef.current; const bar = barRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const r = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = r * v.duration;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    isDragging.current = true;
    wasPlayingBeforeDrag.current = !v.paused;
    v.pause();
    updateSeek(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updateSeek(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const v = videoRef.current;
    if (v && wasPlayingBeforeDrag.current) {
      v.play().catch(() => {});
    }
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
    document.body.classList.add('is-video-fullscreen');
    lenis?.stop();
    rerender();
  };

  const closeFS = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    isFS.current = false;
    document.body.style.overflow = '';
    document.body.classList.remove('is-video-fullscreen');
    lenis?.start();
    rerender();
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
      <div 
        className="flex-1 h-[44px] flex items-center cursor-pointer group" 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <div ref={barRef} className={`w-full h-[1px] relative ${dark ? 'bg-white/30' : 'bg-[#1A1A1A]/20'}`}>
          <div ref={fillRef}
            className={`absolute left-0 top-0 h-full origin-left ${dark ? 'bg-white' : 'bg-[#1A1A1A]/70'}`}
            style={{ width: '100%', transform: `scaleX(${progress.current})`, willChange: 'transform' }}
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

      {fs && <div style={{ aspectRatio: '16/9', background: 'black' }} />}

      <div
        style={fs
          ? { position: 'fixed', inset: 0, zIndex: 99999, background: 'black', display: 'flex', flexDirection: 'column' }
          : { position: 'relative', width: '100%' }
        }
      >
        <div
          ref={wrapperRef}
          onMouseEnter={() => { setIsHovered(true); setIsClickedDuringHover(false); }}
          onMouseLeave={() => setIsHovered(false)}
          className={fs ? 'group' : 'group squircle border border-[#1A1A1A]/10 overflow-hidden'}
          style={fs 
            ? { flex: 1, overflow: 'hidden', cursor: 'pointer', position: 'relative', '--squircle-radius': '0px' } as React.CSSProperties
            : { aspectRatio: '16/9', overflow: 'hidden', cursor: 'pointer', '--squircle-radius': '12px' } as React.CSSProperties
          }
          onClick={togglePlay}
          onDoubleClick={fs ? closeFS : openFS}
          itemScope={!!title} 
          itemType={title ? "https://schema.org/VideoObject" : undefined}
        >
          {title && (
            <>
              <meta itemProp="name" content={title} />
              <meta itemProp="uploadDate" content={new Date().toISOString().split('T')[0]} />
              {description && <meta itemProp="description" content={description} />}
              {poster && <meta itemProp="thumbnailUrl" content={poster} />}
            </>
          )}
          {fs && (
            <button
              onClick={closeFS}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors border-0 cursor-pointer flex items-center justify-center"
              aria-label="Exit Fullscreen"
            >
              <X size={24} strokeWidth={2} />
            </button>
          )}
          <video
            ref={videoRef}
            src={activeSrc}
            poster={poster}
            aria-label={title || "Video player"}
            itemProp={title ? "contentUrl" : undefined}
            loop muted playsInline preload="metadata"
            {...(priority ? ({ fetchpriority: 'high' } as any) : {})}
            disablePictureInPicture
            disableRemotePlayback
            {...({ 
              'x-webkit-airplay': 'deny', 
              'webkit-playsinline': 'true',
              'disablevideopopout': 'true' 
            } as any)}
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate noseek nopip"
            onContextMenu={e => e.preventDefault()}
            onError={onError}
            className="pointer-events-none select-none"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: fs ? 'contain' : 'cover', 
              display: 'block' 
            }}
          />

          {/* Overlay "Génie" - Bloque physiquement la détection d'Opera/Safari au rollover */}
          <div 
            className="absolute inset-0 z-20 bg-transparent cursor-pointer"
            onClick={togglePlay}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Centered Play/Pause Button Overlay */}
          <button
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full border border-white/40 text-white transition-all duration-300 pointer-events-none",
              isHovered && !isClickedDuringHover && !fs ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
            style={{ zIndex: 30 }}
          >
            {isPausedLocal ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>
        </div>

        {fs && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-4">
            {renderBar(true)}
          </div>
        )}
      </div>

      {!fs && renderBar(false)}
    </>
  );
}
