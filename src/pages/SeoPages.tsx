// src/pages/SeoPages.tsx
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import LuxuryTitle from '../components/LuxuryTitle';
import StudioButton from '../components/StudioButton';

// ── Reveal scroll ─────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.9s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.9s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Image avec parallax légère ─────────────────────────────────
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) return;
    const container = ref.current;
    const img = imgRef.current;
    if (!container || !img) return;
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const y = Math.max(-30, Math.min(30, (rect.top / window.innerHeight) * 40));
      img.style.transform = `scale(1.08) translateY(${y}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover"
        style={{
          transform: isMobile ? 'none' : 'scale(1.08) translateY(30px)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s',
          willChange: isMobile ? 'auto' : 'transform',
        }}
      />
    </div>
  );
}

function ExpertiseItem({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <Reveal>
      <div className="flex gap-4 md:gap-8 py-6 md:py-8 border-b border-[#1A1A1A]/10 last:border-0">
        <span className="text-[12px] font-presura font-medium opacity-40 pt-1 flex-shrink-0 w-8">{number}</span>
        <div>
          <p className="font-lausanne font-medium text-[18px] md:text-[22px] tracking-tight mb-2">{title}</p>
          <p className="font-lausanne text-sm md:text-base text-[#1A1A1A]/60 leading-relaxed">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ──────────────────────────────────────────────────────────────
// 1. MOTION DESIGN 3D
// ──────────────────────────────────────────────────────────────
export function SeoMotion3D() {
  const go = useNavigateWithMask();
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroActive, setIsHeroActive] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsHeroActive(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Motion Design 3D Paris — Fabien Bouadi | Réalisations Haut de Gamme</title>
        <meta name="description" content="Expert en Motion Design 3D à Paris. Création d'animations 3D photoréalistes, packshots et visuels créatifs pour les marques de luxe et campagnes premium." />
        <meta name="keywords" content="motion design 3d, animation 3d paris, studio 3d, motion designer 3d freelance, packshot 3d, photoréalisme 3d" />
      </Helmet>

      <article ref={heroRef} className="bg-[#F4F4F0] text-[#1A1A1A] font-sans select-none">
        <header className="px-4 md:px-6 lg:px-8 xl:px-12 pt-32 md:pt-48 pb-10 md:pb-14">
          <div className="pb-2">
            <h1 className="text-[clamp(52px,16vw,240px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
              <LuxuryTitle text="Motion" isActive={isHeroActive} />
            </h1>
          </div>
          <div className="pb-2 mb-8 md:mb-16">
            <div className="text-[clamp(44px,13vw,200px)] leading-[1.05] font-lausanne font-light italic tracking-tight">
              <LuxuryTitle text="Design 3D" isActive={isHeroActive} delay={0.2} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45 }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
              <p className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[520px] pb-2">
                Repousser les limites du photoréalisme. J'utilise la 3D pour créer des univers visuels immersifs et tangibles.
              </p>
              <div className="text-[12px] uppercase tracking-[0.25em] font-presura opacity-40">Expertise · Animation 3D</div>
            </div>
          </motion.div>
        </header>

        <ParallaxImage src="https://images.pexels.com/photos/3151304/pexels-photo-3151304.jpeg?auto=compress&cs=tinysrgb&w=2400" alt="Motion Design 3D" className="w-full h-[55vw] md:h-[70vh]" />

        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-presura opacity-40 pt-1">01.</div>
            <Reveal><h2 className="text-[clamp(32px,6vw,80px)] leading-[1.05] font-lausanne font-medium uppercase">Artisanat <em className="font-light italic">Numérique</em></h2></Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex flex-col md:flex-row gap-6 md:gap-16 flex-1">
              <Reveal delay={60} className="flex-1 max-w-[600px] space-y-5 text-[18px] md:text-[20px] font-lausanne text-[#1A1A1A]/60">
                <p>La 3D n'est pas qu'une prouesse technique, c'est un outil narratif. En tant que <strong>motion designer luxe paris</strong>, chaque simulation de tissu, chaque reflet de verre est méticuleusement pensé pour sublimer le produit, offrant une <strong>animation 3d paris freelance</strong> de très haute volée pour vos campagnes.</p>
              </Reveal>
            </div>
          </div>
        </section>

import StudioButton from '../components/StudioButton';

// ... (dans chaque section)
        <section className="border-t border-[#1A1A1A]/10 px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-20 flex flex-col justify-center items-center text-center gap-10">
          <Reveal>
            <h2 className="text-[32px] md:text-[50px] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
              Prêt à donner du volume<br /><em className="font-light italic">à vos idées ?</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <StudioButton label="Discutons de votre projet" href="mailto:f.bouadi@gmail.com" />
          </Reveal>
        </section>
      </article>
    </PageTransition>
  );
}

// ──────────────────────────────────────────────────────────────
// 2. DIRECTION ARTISTIQUE
// ──────────────────────────────────────────────────────────────
export function SeoDirectionArtistique() {
  const go = useNavigateWithMask();
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroActive, setIsHeroActive] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsHeroActive(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Directeur Artistique Freelance Paris — Fabien Bouadi | Luxe & Image</title>
        <meta name="description" content="Direction artistique freelance à Paris. Conception visuelle, image de marque et direction créative pour des campagnes publicitaires et de luxe." />
        <meta name="keywords" content="directeur artistique freelance, direction artistique paris, DA luxe, image de marque, conception visuelle, création publicitaire" />
      </Helmet>

      <article ref={heroRef} className="bg-[#F4F4F0] text-[#1A1A1A] font-sans select-none">
        <header className="px-4 md:px-6 lg:px-8 xl:px-12 pt-32 md:pt-48 pb-10 md:pb-14">
          <div className="pb-2">
            <h1 className="text-[clamp(52px,16vw,240px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
              <LuxuryTitle text="Direction" isActive={isHeroActive} />
            </h1>
          </div>
          <div className="pb-2 mb-8 md:mb-16">
            <div className="text-[clamp(44px,13vw,200px)] leading-[1.05] font-lausanne font-light italic tracking-tight">
              <LuxuryTitle text="Artistique" isActive={isHeroActive} delay={0.2} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45 }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
              <p className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[520px] pb-2">
                Penser l'image avant de la créer. Une direction artistique rigoureuse pour des marques exigeantes.
              </p>
              <div className="text-[12px] uppercase tracking-[0.25em] font-presura opacity-40">Expertise · Image & Vision</div>
            </div>
          </motion.div>
        </header>

        <ParallaxImage src="https://images.pexels.com/photos/1578161/pexels-photo-1578161.jpeg?auto=compress&cs=tinysrgb&w=2400" alt="Direction Artistique" className="w-full h-[55vw] md:h-[70vh]" />

        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-presura opacity-40 pt-1">01.</div>
            <Reveal><h2 className="text-[clamp(32px,6vw,80px)] leading-[1.05] font-lausanne font-medium uppercase">La justesse <em className="font-light italic">du récit</em></h2></Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex flex-col md:flex-row gap-6 md:gap-16 flex-1">
              <Reveal delay={60} className="flex-1 max-w-[600px] space-y-5 text-[18px] md:text-[20px] font-lausanne text-[#1A1A1A]/60">
                <p>Mon approche de la direction artistique repose sur l'épure et la précision. Identifier l'essence d'une campagne et l'exprimer à travers une esthétique forte et mémorable.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1A1A1A]/10 px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-20 flex flex-col justify-center items-center text-center gap-10">
          <Reveal>
            <h2 className="text-[32px] md:text-[50px] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
              Donnons du souffle<br /><em className="font-light italic">à votre marque</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <StudioButton label="Discutons de votre projet" href="mailto:f.bouadi@gmail.com" />
          </Reveal>
        </section>
      </article>
    </PageTransition>
  );
}

// ──────────────────────────────────────────────────────────────
// 3. MOODTAPES
// ──────────────────────────────────────────────────────────────
export function SeoMoodtapes() {
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroActive, setIsHeroActive] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsHeroActive(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Réalisation de Moodtapes — Fabien Bouadi | Films d'Inspiration</title>
        <meta name="description" content="Création de moodtapes, films manifestes et vidéos d'intention pour pitchs d'agence et directions de marque. Un montage rythmé pour transmettre une vision." />
        <meta name="keywords" content="moodtapes, moodtape freelance, film manifeste, vidéo d'intention, montage moodboard, réalisateur moodtape" />
      </Helmet>

      <article ref={heroRef} className="bg-[#F4F4F0] text-[#1A1A1A] font-sans select-none">
        <header className="px-4 md:px-6 lg:px-8 xl:px-12 pt-32 md:pt-48 pb-10 md:pb-14">
          <div className="pb-2">
            <h1 className="text-[clamp(52px,16vw,240px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
              <LuxuryTitle text="Création de" isActive={isHeroActive} />
            </h1>
          </div>
          <div className="pb-2 mb-8 md:mb-16">
            <div className="text-[clamp(44px,13vw,200px)] leading-[1.05] font-lausanne font-light italic tracking-tight">
              <LuxuryTitle text="Moodtapes" isActive={isHeroActive} delay={0.2} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45 }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
              <p className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[520px] pb-2">
                Le montage au service de l'émotion. Condenser une intention créative dans un film percutant pour convaincre et inspirer. Avec une <strong>moodtape paris</strong> sur mesure, vos pitchs prennent une tout autre dimension.
              </p>
              <div className="text-[12px] uppercase tracking-[0.25em] font-presura opacity-40">Expertise · Pitch & Manifeste</div>
            </div>
          </motion.div>
        </header>

        <ParallaxImage src="https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=2400" alt="Moodtapes" className="w-full h-[55vw] md:h-[70vh]" />

        <section className="border-t border-[#1A1A1A]/10 px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-20 flex flex-col justify-center items-center text-center gap-10">
          <Reveal>
            <h2 className="text-[32px] md:text-[50px] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
              Une vision à transmettre ?<br /><em className="font-light italic">Pitchons ensemble</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <StudioButton label="Démarrer une moodtape" href="mailto:f.bouadi@gmail.com" />
          </Reveal>
        </section>
      </article>
    </PageTransition>
  );
}

// ──────────────────────────────────────────────────────────────
// 4. LUXE, BEAUTÉ, COSMÉTIQUES
// ──────────────────────────────────────────────────────────────
export function SeoLuxeBeaute() {
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroActive, setIsHeroActive] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsHeroActive(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>Motion Design Luxe, Beauté & Cosmétiques — Fabien Bouadi</title>
        <meta name="description" content="Spécialiste du motion design pour les secteurs du luxe, de la beauté et des cosmétiques. Des réalisations 3D élégantes pour parfums, soins et maquillage." />
        <meta name="keywords" content="motion design luxe, motion design cosmétiques, animation 3d beauté, pub parfum 3d, création digitale luxe, packshot cosmétique" />
      </Helmet>

      <article ref={heroRef} className="bg-[#F4F4F0] text-[#1A1A1A] font-sans select-none">
        <header className="px-4 md:px-6 lg:px-8 xl:px-12 pt-32 md:pt-48 pb-10 md:pb-14">
          <div className="pb-2">
            <h1 className="text-[clamp(52px,16vw,240px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
              <LuxuryTitle text="Luxe &" isActive={isHeroActive} />
            </h1>
          </div>
          <div className="pb-2 mb-8 md:mb-16">
            <div className="text-[clamp(44px,13vw,200px)] leading-[1.05] font-lausanne font-light italic tracking-tight">
              <LuxuryTitle text="Beauté" isActive={isHeroActive} delay={0.2} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45 }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
              <p className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[520px] pb-2">
                Comprendre les codes de la haute parfumerie et de la cosmétique pour concevoir des campagnes digitales à l'esthétique irréprochable. Mon expertise en <strong>animation 3d cosmétiques freelance</strong> permet de traduire vos concepts en expériences visuelles uniques.
              </p>
              <div className="text-[12px] uppercase tracking-[0.25em] font-presura opacity-40">Secteur · Cosmétiques</div>
            </div>
          </motion.div>
        </header>

        <ParallaxImage src="https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=2400" alt="Luxe et Beauté" className="w-full h-[55vw] md:h-[70vh]" />

        <section className="border-t border-[#1A1A1A]/10 px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-20 flex flex-col justify-center items-center text-center gap-10">
          <Reveal>
            <h2 className="text-[32px] md:text-[50px] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
              Sublimer vos produits<br /><em className="font-light italic">par le mouvement</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <StudioButton label="Me contacter" href="mailto:f.bouadi@gmail.com" />
          </Reveal>
        </section>
      </article>
    </PageTransition>
  );
}
