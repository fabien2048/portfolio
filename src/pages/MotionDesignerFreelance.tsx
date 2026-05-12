// src/pages/MotionDesignerFreelance.tsx
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import { Link } from 'react-router-dom';
import { SplitText } from '../utils/text';
import LuxuryTitle from '../components/LuxuryTitle';
import { cn } from '../utils/cn';
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

// ── Expertise item (L'œil / Le mouvement / La réactivité) ─────
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

// ── Page ──────────────────────────────────────────────────────
export default function MotionDesignerFreelance() {
  useNavigateWithMask();
  const go = useNavigateWithMask();
  const heroRef = useRef<HTMLElement>(null);
  const [isHeroActive, setIsHeroActive] = useState(false);

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
    <PageTransition>
      <Helmet>
        {/* ── SEO ── */}
        <title>Motion Designer Freelance Paris — Fabien Bouadi | Luxe & 3D</title>
        <meta name="description" content="Motion designer freelance à Paris spécialisé luxe et 3D. Fabien Bouadi crée des films de marque pour Dior, Guerlain, Ruinart — artisanat numérique et direction artistique premium." />
        <meta name="keywords" content="motion designer freelance, motion designer freelance Paris, motion design luxe, direction artistique 3D, artiste 3D Paris, motion designer luxe" />
        <link rel="canonical" href="https://www.fabienbouadi.com/motion-designer-freelance-paris" />

        {/* ── Open Graph ── */}
        <meta property="og:title" content="Motion Designer Freelance Paris — Fabien Bouadi" />
        <meta property="og:description" content="Depuis quinze ans, je cherche le rythme juste qui donne au luxe sa respiration digitale." />
        <meta property="og:url" content="https://www.fabienbouadi.com/motion-designer-freelance-paris" />
        <meta property="og:type" content="website" />

        {/* ── Schema.org ── */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Fabien Bouadi",
            "jobTitle": "Motion Designer Freelance",
            "description": "Motion designer freelance à Paris spécialisé dans le luxe, la 3D et la direction artistique pour grandes maisons.",
            "url": "https://www.fabienbouadi.com",
            "address": { "@type": "PostalAddress", "addressLocality": "Paris", "addressCountry": "FR" },
            "knowsAbout": ["Motion Design", "Direction Artistique", "3D", "After Effects", "Octane Render", "Redshift", "Luxe", "Parfumerie"],
            "worksFor": [
              { "@type": "Organization", "name": "Dior" },
              { "@type": "Organization", "name": "Guerlain" },
              { "@type": "Organization", "name": "Ruinart" }
            ]
          })}
        </script>
      </Helmet>

      <article ref={heroRef} className="bg-[#F4F4F0] text-[#1A1A1A] font-sans select-none">

        {/* ── HERO ── */}
        <header className="px-4 md:px-6 lg:px-8 xl:px-12 pt-32 md:pt-48 pb-10 md:pb-14">
          <div className="pb-2">
            <h1 className="text-[clamp(52px,16vw,240px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
              <LuxuryTitle text="Motion" isActive={isHeroActive} />
            </h1>
          </div>
          <div className="pb-2 mb-8 md:mb-16">
            <div className="text-[clamp(44px,13vw,200px)] leading-[1.05] font-lausanne font-light italic tracking-tight">
              <LuxuryTitle text="designer" isActive={isHeroActive} delay={0.2} />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
              <p className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[520px] pb-2">
                Paris, le mouvement en héritage. Depuis quinze ans, je cherche le rythme juste qui donne au luxe sa <em className="not-italic font-medium text-[#1A1A1A]">respiration digitale</em>.
              </p>
              <div className="text-[12px] uppercase tracking-[0.25em] font-presura opacity-40">
                Freelance · Paris · Luxe & 3D
              </div>
            </div>
          </motion.div>
        </header>

        {/* ── IMAGE PLEINE LARGEUR ── */}
        <ParallaxImage
          src="https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=2400"
          alt="Atelier motion designer freelance Paris — Fabien Bouadi direction artistique luxe"
          className="w-full h-[55vw] md:h-[70vh]"
        />

        {/* ── 01. PARIS, LE MOUVEMENT ── */}
        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-presura font-medium opacity-40 pt-1">01.</div>
            <Reveal>
              <h2 className="text-[clamp(32px,6vw,80px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
                L'art de la rencontre :<br />
                <em className="font-light italic">Entre la Place Vendôme<br />et le Faubourg</em>
              </h2>
            </Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex flex-col md:flex-row gap-6 md:gap-16 flex-1">
              <Reveal delay={60} className="flex-1 max-w-[600px] space-y-5 text-[18px] md:text-[20px] font-lausanne leading-relaxed text-[#1A1A1A]/60 text-pretty">
                <p>
                  Le luxe ne s'explique pas, il se ressent. Et souvent, il se décide autour d'une table, là où les idées prennent vie. En tant que <strong>freelance animation video paris</strong>, mon terrain de jeu favori n'est pas un bureau clos, mais ce <span className="font-medium text-[#1A1A1A]">triangle d'or</span> où battent les cœurs des plus grandes maisons.
                </p>
                <p>
                  Qu'il s'agisse d'un café dans le 1<sup>er</sup> arrondissement ou d'un briefing à l'ombre des avenues du 8<sup>ème</sup>, je crois à la valeur d'un regard partagé. Être présent physiquement, c'est capter l'indicible d'un projet, cette étincelle qui fera la différence entre une simple vidéo et une <em className="not-italic font-medium text-[#1A1A1A]">œuvre de marque</em>, affirmant ainsi une véritable <strong>direction artistique video paris</strong>.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── IMAGE INTERMÉDIAIRE + CITATION ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 border-t border-[#1A1A1A]/10">
          <ParallaxImage
            src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Artisanat numérique 3D — motion designer freelance luxe Paris"
            className="aspect-[4/3] md:aspect-auto md:min-h-[60vh]"
          />
          <div className="px-4 md:px-8 lg:px-12 py-12 md:py-20 flex flex-col justify-center gap-8">
            <Reveal>
              <blockquote className="border-l-2 border-[#1A1A1A]/20 pl-6">
                <p className="text-[clamp(20px,2.5vw,32px)] font-lausanne font-light italic leading-[1.3] tracking-tight text-[#1A1A1A]/70">
                  "Le luxe, c'est ce qui ne se voit pas, mais qui se ressent dans la fluidité du geste."
                </p>
              </blockquote>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-sm font-lausanne text-[#1A1A1A]/40 uppercase tracking-widest">
                — Fabien Bouadi, motion designer freelance Paris
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 02. LA MAIN ET LA MACHINE ── */}
        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-presura font-medium opacity-40 pt-1">02.</div>
            <Reveal>
              <h2 className="text-[clamp(32px,6vw,80px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
                La main<br />
                <em className="font-light italic">et la machine</em>
              </h2>
            </Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 flex-1">
              <Reveal delay={60} className="flex-1 max-w-[600px] space-y-5 text-[18px] md:text-[20px] font-lausanne leading-relaxed text-[#1A1A1A]/60 text-pretty">
                <p className="font-medium text-[#1A1A1A]">Dans mon atelier numérique, le geste est celui d'un artisan.</p>
                <p>
                  Je traite la 3D comme on draperait une soie sauvage : avec patience et précision. De mes collaborations avec des noms comme <span className="font-medium text-[#1A1A1A]">Dior, Guerlain ou Ruinart</span>, j'ai gardé une obsession : celle du détail invisible.
                </p>
                <p>
                  Un reflet sur un flacon, la fluidité d'un drapé, la lumière qui caresse une texture… Je mets la technologie au service de l'émotion. Mes outils <span className="font-medium text-[#1A1A1A]">(After Effects, Octane, Redshift)</span> ne sont que mes pinceaux ; l'objectif reste de traduire votre vision en une chorégraphie élégante.
                </p>
              </Reveal>
              <Reveal delay={120} className="flex-shrink-0">
                <div className="text-[12px] uppercase tracking-widest font-presura opacity-40 mb-4">[Outils & Expertise]</div>
                {['After Effects', 'Cinema 4D', 'Octane Render', 'Redshift', 'Simulation physique', 'Packshot 3D', 'Photoréalisme', 'Joaillerie & Horlogerie'].map(tool => (
                  <div key={tool} className="flex items-center gap-2 text-sm font-lausanne font-medium py-[3px]">
                    <span className="opacity-40">→</span>{tool}
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── IMAGE PLEINE LARGEUR ── */}
        <ParallaxImage
          src="https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=2400"
          alt="Motion design luxe Paris — packshot 3D et direction artistique pour grandes maisons"
          className="w-full h-[45vw] md:h-[60vh]"
        />

        {/* ── 03. UNE SIGNATURE ── */}
        <section className="px-4 md:px-6 lg:px-8 xl:px-12 py-16 md:py-28 border-t border-[#1A1A1A]/10">
          <div className="flex gap-4 md:gap-8 mb-8 md:mb-16">
            <div className="w-8 md:w-20 flex-shrink-0 text-[12px] font-presura font-medium opacity-40 pt-1">03.</div>
            <Reveal>
              <h2 className="text-[clamp(32px,6vw,80px)] leading-[1.05] font-lausanne font-medium tracking-tight uppercase">
                Une signature,<br />
                <em className="font-light italic">pas une prestation</em>
              </h2>
            </Reveal>
          </div>
          <div className="flex gap-4 md:gap-8">
            <div className="w-8 md:w-20 flex-shrink-0" />
            <div className="flex-1">
              <Reveal delay={60} className="mb-10 md:mb-16">
                <p className="text-[18px] md:text-[20px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-[600px]">
                  Travailler ensemble, c'est s'offrir le luxe de la simplicité. Pas de structures lourdes, juste un dialogue direct entre votre direction de création et mon savoir-faire.
                </p>
              </Reveal>
              <div>
                <ExpertiseItem
                  number="—"
                  title="L'œil"
                  body="Quinze années de Direction Artistique pour comprendre, avant même de créer, l'élégance d'une courbe. C'est l'essence de mon travail de motion designer freelance paris."
                />
                <ExpertiseItem
                  number="—"
                  title="Le mouvement"
                  body="Une approche sur mesure en animation 3d produits beauté et motion design pour marques luxe qui ne cherche pas la performance technique pour elle-même, mais la justesse du récit."
                />
                <ExpertiseItem
                  number="—"
                  title="La réactivité"
                  body="La souplesse d'un indépendant qui connaît les codes, les silences et les urgences des agences parisiennes."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="border-t border-[#1A1A1A]/10 grid grid-cols-1 md:grid-cols-2">
          <ParallaxImage
            src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Freelance motion designer Paris — Fabien Bouadi disponible pour missions luxe"
            className="aspect-[4/3] md:aspect-auto md:min-h-[60vh]"
          />
          <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-20 flex flex-col justify-between gap-10">
            <Reveal>
              <h2 className="text-[10vw] md:text-[3.8vw] leading-[1.1] font-lausanne font-medium tracking-tight uppercase">
                Écrivons<br />
                <em className="font-light italic">la suite</em>
              </h2>
            </Reveal>
            <Reveal delay={80} className="space-y-6 text-sm font-lausanne text-[#1A1A1A]/60">
              <p className="text-[16px] leading-relaxed">
                Une campagne, un lancement, un souffle nouveau pour vos réseaux ? Je ne suis jamais bien loin du Faubourg Saint-Honoré ou des jardins du Palais-Royal.
              </p>
              <p>
                Si votre projet mérite une mise en mouvement qui a du sens, rencontrons-nous. Vous pouvez également consulter mon <Link to="/guide/freelance-motion-designer-2026" className="underline hover:text-black">guide sur le métier de motion designer en 2026</Link>.
              </p>
              <div className="flex flex-col items-start gap-8 pt-4">
                <StudioButton 
                  label="Me contacter pour un échange" 
                  href="mailto:f.bouadi@gmail.com" 
                />
                <StudioButton 
                  label="Parcourir les projets" 
                  onClick={() => go('/')} 
                />
              </div>
            </Reveal>
          </div>
        </section>

      </article>
    </PageTransition>
  );
}
