// src/pages/Playground.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useLenis } from 'lenis/react';
import { useNavigationType } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { playgroundItems } from '../data/playground';
import { useLazyVideo } from '../hooks/useLazyVideo';

function LazyVideo({ src }: { src: string }) {
  const { videoRef, shouldLoad } = useLazyVideo({
    threshold: 0.15,
    rootMargin: '200px 0px',
  });

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        loop
        muted
        playsInline
        preload="none"
        title={src.split('/').pop()?.split('-')[0] || "Animation Playground"}
        {...({ 
          disablePictureInPicture: true, 
          disableRemotePlayback: true,
          'x-webkit-airplay': 'deny', 
          'webkit-playsinline': 'true',
          'disablevideopopout': 'true'
        } as any)}
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate noseek nopip"
        className="w-full h-auto block pointer-events-none select-none"
      />
      {/* Overlay protecteur anti-Opera/Safari */}
      <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" onContextMenu={e => e.preventDefault()} />
    </div>
  );
}

function SimpleImage({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => { if (ref.current?.complete) setReady(true); }, []);
  return (
    <img ref={ref} src={src} alt={alt} decoding="async"
      onLoad={() => setReady(true)} onError={() => setReady(true)}
      className={`w-full h-auto block transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

export default function Playground() {
  const lenis = useLenis();

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [lenis]);

  const navType = useNavigationType();
  
  useEffect(() => {
    if (navType === 'POP') return;
    // Reset robuste au montage de la page
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    // Petit délai de sécurité pour surcharger react-router s'il tente une restauration
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    }, 50);
    return () => clearTimeout(t);
  }, [lenis, navType]);

  return (
    <PageTransition>
      <Helmet>
        <title>Playground — Fabien Bouadi | Expérimentations 3D & Motion</title>
        <meta name="description" content="Espace d'expérimentation visuelle : 3D, motion design et recherches graphiques par Fabien Bouadi." />
        <meta property="og:title" content="Playground — Fabien Bouadi" />
        <meta property="og:description" content="Laboratoire créatif et archives de projets personnels." />
      </Helmet>

      <div className="min-h-screen pt-40 pb-24 px-4 md:px-6 lg:px-8 xl:px-12">

        <div className="overflow-hidden pb-4 mb-12 md:mb-16">
          <motion.h1
            initial={{ y: '110%' }} animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[8vw] md:text-[6.5vw] leading-[0.95] font-lausanne font-medium tracking-tighter"
          >
            Playground
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(18px,2vw,22px)] text-[#1A1A1A] font-lausanne leading-[1.3] mb-14 md:mb-20"
        >
          <p>
            Experiments and personal<br />
            work collected over the years
          </p>
          <p className="mt-4 opacity-70">
            [2018 — 2026]
          </p>
        </motion.div>

        {/* Masonry CSS columns — 2 colonnes desktop, 1 mobile */}
        <div style={{
          columns: 'var(--cols, 1)',
          columnGap: '16px',
        }}
          className="[--cols:1] md:[--cols:2]"
        >
          {playgroundItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ breakInside: 'avoid', marginBottom: '16px', display: 'inline-block', width: '100%' }}
            >
              <div 
                className="w-full overflow-hidden bg-[#EBEBEB] border border-[#1A1A1A]/10 squircle"
                style={{ '--squircle-radius': '12px' } as React.CSSProperties}
              >
                {item.type === 'video'
                  ? <LazyVideo src={item.src} />
                  : <SimpleImage src={item.src} alt={item.title} />
                }
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
