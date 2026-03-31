// src/pages/Playground.tsx
import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/PageTransition';
import { playgroundItems } from '../data/playground';

function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Repart depuis le début à chaque fois qu'il entre dans la vue
          el.currentTime = 0;
          if (!el.src) el.src = src;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      preload="none"
      className="w-full h-auto block"
    />
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

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[12px] text-[#1A1A1A]/50 uppercase tracking-widest font-lausanne mb-14 md:mb-20"
        >
          Expérimentations et travaux personnels,<br />
          collectés au fil des années{' '}
          <span className="font-medium text-[#1A1A1A]">[ 2018 — 2025 ]</span>
        </motion.p>

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
              <div className="w-full overflow-hidden bg-[#EBEBEB] border border-[#1A1A1A]/10 rounded-lg">
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
