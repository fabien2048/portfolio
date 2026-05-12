// src/pages/About.tsx
import { motion, AnimatePresence } from 'motion/react';
import Meta from '../components/Meta';
import { useLenis } from 'lenis/react';
import { useEffect, useState, useRef } from 'react';
import PageTransition from '../components/PageTransition';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import { useNavigationType } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LuxuryTitle from '../components/LuxuryTitle';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

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
const PARTNERS = [
  { name: 'Malherbe Design', url: 'https://malherbe.paris' },
  { name: 'Publicis Luxe',   url: 'https://www.publicisluxe.com' },
  { name: 'Onirim',          url: 'https://onirim.com' },
  { name: 'DDB Paris',       url: 'https://www.bbdo.fr' },
  { name: 'Digitas',         url: 'https://www.digitas.com/fr' },
];

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
    <div ref={ref} className={cn("overflow-hidden", className)}>
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

export default function About() {
  const lenis = useLenis();

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [lenis]);
  useNavigateWithMask();
  const navType = useNavigationType();
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroActive, setIsHeroActive] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    if (navType === 'POP') return;
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    }, 50);
    return () => clearTimeout(t);
  }, [lenis, navType]);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsHeroActive(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <PageTransition scrollToTop={true}>
      <Meta 
        title="À Propos"
        description="Découvrez le parcours de Fabien Bouadi, 3D Artist et Motion Designer. 10 ans d'expérience au service du luxe et de l'innovation."
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Fabien Bouadi",
          "jobTitle": "Motion Designer & Directeur Artistique Freelance",
          "url": "https://www.fabienbouadi.com/about",
          "image": "https://www.fabienbouadi.com/images/fabien-bouadi-portrait.png",
          "sameAs": [
            "https://www.instagram.com/fabienbouadi/",
            "https://www.linkedin.com/in/fabienbouadi/",
            "https://vimeo.com/fabienbouadi"
          ],
          "description": "Artiste 3D et Motion Designer avec 10 ans d'expérience au service des marques de luxe (Dior, Prada, YSL). Spécialiste direction artistique vidéo à Paris.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Paris",
            "addressCountry": "FR"
          },
          "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
          }
        }}
      />

      <article ref={heroRef} className="bg-white text-[#1A1A1A] font-sans select-none pb-24">
        
        {/* HERO SECTION */}
        <section className="min-h-screen pt-32 pb-16 flex flex-col justify-between">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 px-4 md:px-10 w-full mx-auto">
            <h1 className="col-span-6 md:col-span-12 text-[15vw] leading-[0.8] uppercase font-lausanne font-medium tracking-tight">
              <div className="overflow-hidden">
                <LuxuryTitle text="3D ARTIST" isActive={isHeroActive} />
              </div>
              <div className="overflow-hidden px-4 md:px-12 -ml-4 md:-ml-12 mt-[-0.1em]">
                <em className="block font-presura italic lowercase text-[#1A1A1A]">
                  <LuxuryTitle text="passionate" isActive={isHeroActive} delay={0.2} />
                </em>
              </div>
            </h1>
          </div>
          
          <div className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 px-4 md:px-10 w-full mx-auto items-end mt-16 md:mt-0">
            <div className="col-span-6 md:col-span-7 flex md:justify-end order-first md:order-last">
              <h2 className="text-[15vw] leading-[0.8] uppercase font-lausanne font-medium flex flex-col md:flex-row items-start md:items-center">
                <motion.figure 
                  initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-[50vw] md:w-[22vw] aspect-[2/1] mt-4 md:mt-6 md:mr-8 mb-4 md:mb-0 overflow-hidden"
                >
                  <img src="images/fabien-bouadi-portrait.png" className="absolute inset-0 w-full h-full object-cover object-top" alt="Fabien Bouadi" />
                </motion.figure>
                <div>
                  <div className="block overflow-hidden"><LuxuryTitle text="ABOUT" isActive={isHeroActive} delay={0.3} /></div>
                  <div className="block mt-[-0.1em] overflow-hidden"><LuxuryTitle text="MOTION" isActive={isHeroActive} delay={0.4} /></div>
                </div>
              </h2>
            </div>
            <div className="col-span-6 md:col-start-1 md:col-span-5 pb-4 order-last md:order-first mt-12 md:mt-0">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                className="max-w-md text-[18px] md:text-[1.2vw] font-lausanne leading-relaxed text-[#1A1A1A]/80"
              >
                Salut, je suis Fabien, Motion Designer devenu artiste 3D. Je donne vie aux marques et aux produits grâce à la puissance de l'image de synthèse. Toujours à la recherche de nouvelles esthétiques.
              </motion.p>
            </div>
          </div>
        </section>

        {/* IMAGE PLEINE LARGEUR */}
        <div className="relative md:px-10 mb-32 md:mb-48">
          <div className="relative overflow-hidden h-[50vh] md:h-screen w-full rounded-none md:rounded-xl">
            <ParallaxImage 
              src="https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=2400" 
              alt="Motion Design" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* 01. PERSONAL STORY */}
        <section className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 px-4 md:px-10 w-full mx-auto items-start mb-32 md:mb-48">
          <div className="col-span-6 md:col-span-3 text-[14px] font-presura font-medium mb-8 md:mb-0">01.</div>
          <div className="col-span-6 md:col-span-9">
            <Reveal>
              <h2 className="text-[10vw] md:text-[4.5vw] leading-[0.9] font-lausanne font-medium uppercase tracking-tight text-balance">
                DU DESIGN GRAPHIQUE À LA <em className="font-presura italic lowercase text-[1.1em] tracking-normal">direction</em> ARTISTIQUE ET AU <em className="font-presura italic lowercase text-[1.1em] tracking-normal">motion</em> 3D
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-9 md:gap-x-10 mt-16 md:mt-24">
              <Reveal delay={100} className="col-span-1 md:col-span-3">
                <h3 className="uppercase text-[12px] font-presura font-medium tracking-widest mb-8 md:mb-0 opacity-40">
                  [Mon parcours]
                </h3>
              </Reveal>
              <Reveal delay={200} className="col-span-1 md:col-span-4 space-y-8 text-[18px] md:text-[1.2vw] font-lausanne leading-relaxed text-[#1A1A1A]/70">
                <p>
                  Directeur Artistique / Graphiste Publicitaire de formation, je termine mon cursus chez BuyBuy (Magazine de mode et de luxe).
                </p>
                <p>
                  Cette expérience confirme mon goût pour l’image. Après plus d’une année passée à l’Agence Vertu comme Graphiste, j’intègre l’agence Malherbe Design en tant que Directeur Artistique / Motion Designer.
                </p>
                <p>
                  Enfin, je m’installe comme Directeur artistique / Motion Designer Freelance et me spécialise dans l’univers du luxe pour des marques telles que :
                </p>
                <p className="text-[#1A1A1A] font-medium">
                  Dior, Guerlain, Lancôme, Prada, Cacharel, Kenzo, Nina Ricci, Yves Saint Laurent, Courrèges, Ruinart…
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 02. SERVICES */}
        <section className="relative px-4 md:px-10 w-full mx-auto mb-32 md:mb-48 z-10">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8">
            <div className="col-span-6 flex flex-col justify-between pb-10">
              <div className="flex flex-col">
                <h4 className="uppercase text-[12px] font-presura font-medium tracking-widest opacity-40 mb-12 md:mb-20">[Services list]</h4>
                <nav className="relative flex flex-col items-start gap-y-6 md:gap-y-10">
                  {SERVICES.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveService(i)} 
                      className={cn(
                        "text-[10vw] md:text-[4vw] leading-[0.9] uppercase font-lausanne font-medium flex relative transition-all duration-300",
                        activeService === i ? 'opacity-100' : 'opacity-20 hover:opacity-60'
                      )}
                    >
                      <span className={cn("border-b-2 transition-colors pb-1", activeService === i ? 'border-[#1A1A1A]' : 'border-transparent')}>{s.label}</span>
                      <div className="absolute top-0 left-full text-[14px] md:text-[0.3em] pl-4 font-presura opacity-50">{s.num}</div>
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="relative w-full mt-24 md:mt-32">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="md:pr-32"
                  >
                    <div className="mb-6 font-lausanne font-medium text-[20px] md:text-[1.5vw]">{SERVICES[activeService].headline}</div>
                    <p className="text-[#1A1A1A]/60 font-lausanne text-[18px] md:text-[1.2vw] leading-relaxed">
                      {SERVICES[activeService].body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            <div className="col-span-6 relative mt-16 md:mt-0">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-[#EBEBEB]">
                {SERVICES.map((s, i) => (
                  <img 
                    key={i} 
                    src={s.image} 
                    alt={s.label} 
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
                      activeService === i ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 03. CLIENT LIST & PARTNERS */}
        <section className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 px-4 md:px-10 w-full mx-auto items-start mb-32 md:mb-48">
          <div className="col-span-6 md:col-span-3 text-[14px] font-presura font-medium mb-8 md:mb-0">03.</div>
          <div className="col-span-6 md:col-span-9 mt-10 md:mt-0">
            <Reveal>
              <h2 className="text-[10vw] md:text-[4.5vw] leading-[0.9] font-lausanne font-medium uppercase tracking-tight">
                CLIENT LIST<br />
                <em className="font-presura italic lowercase text-[1.1em] tracking-normal">and partners</em>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="w-full md:max-w-2xl mt-16 md:mt-24 text-[18px] md:text-[1.2vw] font-lausanne text-[#1A1A1A]/70 leading-relaxed">
                <p><strong className="text-[#1A1A1A] font-medium">Les plus belles maisons.</strong></p>
                <p className="mt-4">Voici une liste non-exhaustive des clients et agences partenaires avec qui j'ai eu l'opportunité de collaborer au fil des années. Discutons ensemble pour ajouter votre nom à cette liste.</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="w-full md:max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 md:mt-24">
                <div>
                  <span className="flex uppercase text-[12px] font-presura font-medium opacity-40 mb-10 tracking-widest">[Client List]</span>
                  <nav className="flex flex-col gap-1">
                    {CLIENTS.map(c => (
                      <div key={c} className="font-lausanne font-medium text-[16px] md:text-[1.2vw] flex items-center overflow-hidden h-10 relative cursor-default group">
                        <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center translate-x-[-1.5rem] group-hover:translate-x-0">
                          <span className="w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                          <span className="group-hover:text-[#1A1A1A] text-[#1A1A1A]/70 transition-colors duration-300">{c}</span>
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>
                <div>
                  <span className="flex uppercase text-[12px] font-presura font-medium opacity-40 mb-10 tracking-widest">[Partners]</span>
                  <nav className="flex flex-col gap-1">
                    {PARTNERS.map(p => (
                      <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="font-lausanne font-medium text-[16px] md:text-[1.2vw] flex items-center overflow-hidden h-10 relative group">
                        <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center translate-x-[-1.5rem] group-hover:translate-x-0">
                          <span className="w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                          <span className="group-hover:text-[#1A1A1A] text-[#1A1A1A]/70 transition-colors duration-300">{p.name}</span>
                        </div>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 04. CONTACT SECTION */}
        <section className="grid grid-cols-6 md:grid-cols-12 gap-x-4 md:gap-x-8 px-4 md:px-10 w-full mx-auto items-start mb-20 md:mb-32">
          <div className="col-span-6 mb-16 md:mb-0">
            <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto md:h-[90vh] w-full rounded-xl">
              <ParallaxImage src="https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Work together" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
          <div className="col-span-6 md:col-start-8 md:col-span-5 md:-mt-8 flex flex-col justify-center">
            <Reveal>
              <h2 className="text-[10vw] md:text-[4vw] leading-[0.9] font-lausanne font-medium uppercase tracking-tight text-balance">
                Want to<br/>
                <em className="font-presura italic lowercase text-[1.1em] tracking-normal">work</em><br/>
                together<br/>
                ON <em className="font-presura italic lowercase text-[1.1em] tracking-normal">your</em><br/>
                PROJECT?
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-10 md:mt-16 text-[18px] md:text-[1.2vw] font-lausanne leading-relaxed text-[#1A1A1A]/70 md:pr-12">
                <p>Vous souhaitez donner vie à votre marque ? Je travaille avec un nombre limité de clients chaque année pour créer quelque chose d'unique et sur mesure. Discutons-en ensemble.</p>
              </div>
              <a href="mailto:f.bouadi@gmail.com" className="inline-block mt-10 md:mt-16 font-lausanne font-medium text-[16px] md:text-[1vw] border-b-2 border-[#1A1A1A] pb-1 w-max hover:opacity-50 transition-opacity uppercase tracking-wide">
                Let's work together
              </a>
            </Reveal>
          </div>
        </section>

      </article>
    </PageTransition>
  );
}
