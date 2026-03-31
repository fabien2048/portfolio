// src/pages/About.tsx
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useRef } from 'react';
import PageTransition from '../components/PageTransition';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import gsap from 'gsap';

const SERVICES = [
  {
    num: '01.',
    label: '3D Design',
    headline: 'Donnez vie à vos idées',
    body: "Pousser les limites du réel pour créer des visuels impossibles autrement. La 3D permet d'amener vos idées là où le monde physique ne peut pas aller.",
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    num: '02.',
    label: 'Art Direction',
    headline: 'Définir une direction',
    body: "Vous cherchez une esthétique pour votre marque ? Nous travaillons ensemble pour créer quelque chose qui vous ressemble et qui reste en mémoire.",
    image: 'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    num: '03.',
    label: 'Motion',
    headline: 'Faites bouger vos images',
    body: "Dans un monde digital en constante évolution, le mouvement capte l'attention et ajoute une dimension entière à votre marque.",
    image: 'https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const CLIENTS  = ['Dior', 'Guerlain', 'Lancôme', 'Prada', 'Cacharel', 'Kenzo', 'Nina Ricci', 'Yves Saint Laurent', 'Courrèges', 'Ruinart'];
const PARTNERS: { name: string; url: string }[] = [
  { name: 'Malherbe Design', url: 'https://malherbe.paris' },
  { name: 'Publicis Luxe',   url: 'https://www.publicisluxe.com' },
  { name: 'Onirim',          url: 'https://onirim.com' },
  { name: 'DDB Paris',       url: 'https://www.bbdo.fr' },
  { name: 'Digitas',         url: 'https://www.digitas.com/fr' },
];
const SKILLS   = ['Animation / Design', 'Art Direction', 'Motion Design', 'Lighting & Rendering', 'Octane · Redshift · Arnold'];

// ── Reveal scroll CSS ─────────────────────────────────────────
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

// ── ParallaxImage — désactivé sur mobile (touch = janky) ──────
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) return; // ✅ pas de parallax sur mobile
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

// ── Services slider ───────────────────────────────────────────
function ServicesSlider() {
  const [active, setActive] = useState(0);
  const prevRef = useRef(0);
  const containerMobileRef = useRef<HTMLDivElement>(null);
  const containerDesktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = active;
    const prev = prevRef.current;
    
    const animateContainer = (container: HTMLDivElement | null) => {
      if (!container) return;
      const imgs = gsap.utils.toArray<HTMLImageElement>('img', container);
      if (imgs.length === 0) return;
      
      const firstRender = cur === prev && !container.hasAttribute('data-gsap-init');

      if (firstRender) {
        container.setAttribute('data-gsap-init', 'true');
        imgs.forEach((img, i) => {
          gsap.set(img, {
            zIndex: i === cur ? 10 : 1,
            clipPath: i === cur ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)'
          });
        });
        return;
      }

      if (cur === prev) return;

      // On ajuste d'abord les profondeurs
      imgs.forEach((img, i) => {
        if (i === cur) gsap.set(img, { zIndex: 10 });
        else if (i === prev) gsap.set(img, { zIndex: 5 }); // Garder visible sans trou
        else gsap.set(img, { zIndex: 1, clipPath: 'inset(0% 100% 0% 0%)' });
      });

      // Seule l'image courante s'anime (wipes over the previous)
      gsap.killTweensOf(imgs[cur]);
      gsap.fromTo(
        imgs[cur],
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { 
          clipPath: 'inset(0% 0% 0% 0%)', 
          duration: 0.85, 
          ease: 'power3.inOut' 
        }
      );
    };

    animateContainer(containerMobileRef.current);
    animateContainer(containerDesktopRef.current);

    prevRef.current = cur;
  }, [active]);

  return (
    <section className="border-t border-[#1A1A1A]/10 px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28">
      <Reveal>
        <p className="text-[12px] uppercase tracking-widest font-lausanne text-[#1A1A1A]/40 mb-10 md:mb-12">
          [Services List]
        </p>
      </Reveal>

      {/* ── Mobile : image en premier, puis liste ── */}
      <div className="md:hidden mb-8">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-[#EBEBEB]">
          {/* Base Layer — fondu de secours en arrière-plan */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {SERVICES.map((s, i) => (
              <img key={`bg-${s.image}`} src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: active === i ? 1 : 0, transition: 'opacity 0.65s ease-in-out' }} />
            ))}
          </div>
          {/* GSAP Wipe Layer — balayage horizontal premier plan */}
          <div ref={containerMobileRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            {SERVICES.map((s) => (
              <img key={s.image} src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div>
          {/* ── Liste services — tap sur mobile, hover desktop ── */}
          <nav>
            {SERVICES.map((s, i) => (
              <div key={s.num}
                onClick={() => setActive(i)}
                className="group relative flex items-start cursor-pointer">
                <div className="relative overflow-hidden leading-none">
                  <h2 className={[
                    'block text-[11vw] md:text-[5.8vw] font-lausanne font-medium tracking-tighter uppercase leading-[1.12]',
                    'transition-colors duration-500',
                    active === i ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/25',
                  ].join(' ')}>
                    {s.label}
                  </h2>
                  <span className={[
                    'absolute bottom-[4px] left-0 h-[2px] bg-[#1A1A1A]',
                    'transition-all duration-700 ease-[cubic-bezier(.77,0,.175,1)]',
                    active === i ? 'w-full' : 'w-0',
                  ].join(' ')} />
                </div>
                <span className={[
                  'text-[2.8vw] md:text-[1.1vw] font-medium mt-[1.6vw] md:mt-[0.8vw] ml-1 flex-shrink-0',
                  'transition-colors duration-500',
                  active === i ? 'text-[#1A1A1A]/60' : 'text-[#1A1A1A]/20',
                ].join(' ')}>
                  {s.num}
                </span>
              </div>
            ))}
          </nav>

          {/* Description — hauteur auto sur mobile, fixe desktop */}
          <div className="mt-8 md:mt-12 min-h-[4rem] md:h-[5rem] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="md:absolute md:inset-0 space-y-2 text-sm font-lausanne text-[#1A1A1A]/60"
              >
                <p className="font-medium text-[#1A1A1A]">{SERVICES[active].headline}</p>
                <p className="leading-relaxed">{SERVICES[active].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Image desktop uniquement */}
        <div className="hidden md:block relative w-full aspect-[3/4] overflow-hidden bg-[#EBEBEB]">
          {/* Base Layer — fondu de secours en arrière-plan */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {SERVICES.map((s, i) => (
              <img key={`bg-${s.image}`} src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: active === i ? 1 : 0, transition: 'opacity 0.65s ease-in-out' }} />
            ))}
          </div>
          {/* GSAP Wipe Layer — balayage horizontal premier plan */}
          <div ref={containerDesktopRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            {SERVICES.map((s) => (
              <img key={s.image} src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function About() {
  useNavigateWithMask();
  return (
    <PageTransition>
      <Helmet>
        <title>À Propos — Fabien Bouadi | Motion Designer Freelance</title>
        <meta name="description" content="Découvrez le parcours de Fabien Bouadi, 3D Artist et Motion Designer. 10 ans d'expérience au service du luxe et de l'innovation." />
        <meta property="og:title" content="À Propos — Fabien Bouadi" />
        <meta property="og:description" content="Passionné de design et de technologie, je donne vie aux idées à travers le mouvement." />
      </Helmet>

      <article className="bg-[#F4F4F0] text-[#1A1A1A] font-sans select-none">

        {/* HERO */}
        <header className="px-4 md:px-6 lg:px-8 xl:px-12 pt-32 md:pt-40 pb-10 md:pb-14">
          <div className="overflow-hidden pb-2">
            <motion.h1
              initial={{ y: '115%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15vw] md:text-[10.5vw] leading-[0.88] font-lausanne font-medium tracking-tight uppercase"
            >
              3D Artist
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-2 mb-8 md:mb-10">
            <motion.div
              initial={{ y: '115%' }} animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15vw] md:text-[10.5vw] leading-[0.88] font-lausanne font-light italic tracking-tight"
            >
              passionné
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Mobile */}
            <div className="flex flex-col gap-6 md:hidden">
              <p className="text-sm font-lausanne leading-relaxed text-[#1A1A1A]/60">
                Salut, je suis Fabien, Motion Designer devenu artiste 3D. Je donne vie
                aux marques et aux produits grâce à la puissance de l'image de synthèse.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-[52px] h-[68px] overflow-hidden flex-shrink-0">
                  <img src="https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650b1d066d46e0ba9b3802ae_faded.png"
                    alt="Fabien Bouadi" className="w-full h-full object-cover" />
                </div>
                <div className="leading-[0.9] font-medium uppercase tracking-tight">
                  <div className="text-[8vw] font-lausanne">Motion designer</div>
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex items-end justify-between gap-6">
              <p className="text-sm font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[260px]">
                Salut, je suis Fabien, Motion Designer devenu artiste 3D. Je donne vie
                aux marques et aux produits grâce à la puissance de l'image de synthèse.
              </p>
              <div className="flex items-end gap-5 flex-shrink-0">
                <div className="w-[80px] h-[105px] overflow-hidden flex-shrink-0">
                  <img src="https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650b1d066d46e0ba9b3802ae_faded.png"
                    alt="Fabien Bouadi" className="w-full h-full object-cover" />
                </div>
                <div className="leading-[0.85] font-medium uppercase tracking-tight">
                  <div className="text-[6.5vw] font-lausanne">Motion designer</div>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* IMAGE PLEINE LARGEUR */}
        <ParallaxImage
          src="https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=2400"
          alt="Motion Design — Fabien Bouadi"
          className="w-full h-[60vw] md:h-[65vh]"
        />

        {/* 01. PERSONAL STORY */}
        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-lausanne font-medium opacity-40 pt-1">01.</div>
            <Reveal>
              <h2 className="text-[7vw] md:text-[3vw] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
                Des études en design graphique<br/>
                à devenir{' '}<em className="font-light italic">artiste</em>{' '}3D<br/>
                <em className="font-light italic">autodidacte</em>
              </h2>
            </Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 flex-1">
              <div className="md:w-44 flex-shrink-0">
                <span className="text-[12px] uppercase tracking-widest font-lausanne opacity-40">[Histoire personnelle]</span>
              </div>
              <Reveal delay={80} className="flex-1 space-y-4 text-sm font-lausanne leading-relaxed text-[#1A1A1A]/60">
                <p className="font-medium text-[#1A1A1A]">Toujours en train d'apprendre.</p>
                <p>Directeur Artistique / Graphiste Publicitaire de formation, je termine mon cursus chez BuyBuy, magazine de mode et de luxe. Cette expérience confirme mon goût pour l'image.</p>
                <p>Après plus d'une année passée à l'Agence Vertu comme Graphiste, j'intègre l'agence Malherbe Design en tant que Directeur Artistique / Motion Designer.</p>
                <p>Installé désormais comme Directeur Artistique / Motion Designer Freelance, je me spécialise dans l'univers du luxe pour des maisons telles que Dior, Guerlain, Lancôme, Prada, Cacharel, Kenzo, Nina Ricci, Yves Saint Laurent, Courrèges, Ruinart…</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 02. SERVICES */}
        <ServicesSlider />

        {/* 03. CLIENT LIST */}
        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-6 md:mb-10">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-lausanne font-medium opacity-40 pt-1">03.</div>
            <Reveal>
              <div>
                <h2 className="text-[7vw] md:text-[3vw] leading-[1.08] font-lausanne font-medium tracking-tight uppercase">Clients & Agences</h2>
                <h2 className="text-[7vw] md:text-[3vw] leading-[1.08] font-lausanne font-light italic tracking-tight">avec qui j'ai travaillé</h2>
              </div>
            </Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex-1">
              <Reveal delay={60}>
                <p className="text-sm font-lausanne text-[#1A1A1A]/60 mb-8 md:mb-12">
                  <span className="font-medium text-[#1A1A1A]">Plus de 10 ans d'expérience.</span>{' '}
                  Voici quelques maisons et agences avec lesquelles j'ai eu le plaisir de collaborer.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <div className="flex flex-wrap gap-8 md:gap-16">
                  <div>
                    <span className="text-[12px] uppercase tracking-widest font-lausanne opacity-40 block mb-3">[Clients]</span>
                    {CLIENTS.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-sm font-lausanne font-medium py-[3px]">
                        <span className="opacity-40">→</span>{c}
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-[12px] uppercase tracking-widest font-lausanne opacity-40 block mb-3">[Agences & Studios]</span>
                    {PARTNERS.map((p) => (
                      <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-lausanne font-medium py-[3px] hover:opacity-40 transition-opacity">
                        <span className="opacity-40">→</span>{p.name}
                      </a>
                    ))}
                  </div>
                  <div>
                    <span className="text-[12px] uppercase tracking-widest font-lausanne opacity-40 block mb-3">[Compétences]</span>
                    {SKILLS.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm font-lausanne font-medium py-[3px]">
                        <span className="opacity-40">→</span>{s}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* IMAGE + CTA */}
        <section className="border-t border-[#1A1A1A]/10 grid grid-cols-1 md:grid-cols-2">
          <ParallaxImage
            src="https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Studio — Fabien Bouadi"
            className="aspect-[4/3] md:aspect-auto md:min-h-[60vh]"
          />
          <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-20 flex flex-col gap-10 md:justify-between md:min-h-0">
            <Reveal>
              <h2 className="text-[10vw] md:text-[3.8vw] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
                Envie de<br/>
                <em className="font-light italic">travailler</em><br/>
                ensemble<br/>
                sur <em className="font-light italic">votre</em><br/>
                projet ?
              </h2>
            </Reveal>
            <Reveal delay={100} className="space-y-4 text-sm font-lausanne text-[#1A1A1A]/60">
              <p>Vous souhaitez donner vie à votre marque ? Je travaille avec un nombre limité de clients chaque année pour créer quelque chose d'unique.</p>
              <a href="mailto:f.bouadi@gmail.com"
                className="block font-medium text-[#1A1A1A] hover:opacity-40 transition-opacity">
                Travaillons ensemble →
              </a>
            </Reveal>
          </div>
        </section>

      </article>
    </PageTransition>
  );
}
