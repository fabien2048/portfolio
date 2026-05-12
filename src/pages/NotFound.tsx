// src/pages/NotFound.tsx
import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/PageTransition';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import LuxuryTitle from '../components/LuxuryTitle';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const go = useNavigateWithMask();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Petit délai pour déclencher l'animation du titre de façon luxueuse
    const t = setTimeout(() => setIsActive(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageTransition scrollToTop={true}>
      <Helmet>
        <title>Page Introuvable (404) — Fabien Bouadi | Motion Designer Luxe Paris</title>
        <meta name="description" content="La page que vous recherchez semble introuvable. Retournez sur le portfolio de Fabien Bouadi, Motion Designer et Directeur Artistique à Paris." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-[#F4F4F0] text-[#1A1A1A] flex flex-col items-center justify-center px-4 md:px-10 text-center relative overflow-hidden">
        
        {/* Typographie 404 imposante et luxueuse en fond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
          <span className="text-[40vw] font-lausanne font-bold tracking-tighter">404</span>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-[clamp(48px,8vw,100px)] leading-[0.9] font-lausanne font-medium tracking-tight uppercase mb-8">
            <div className="overflow-hidden inline-block">
              <LuxuryTitle text="PAGE" isActive={isActive} />
            </div>
            <br />
            <div className="overflow-hidden inline-block mt-[-0.1em]">
              <em className="font-presura italic lowercase text-[#1A1A1A]">
                <LuxuryTitle text="non trouvée" isActive={isActive} delay={0.2} />
              </em>
            </div>
          </h1>

          <p className="text-[18px] md:text-[22px] font-lausanne leading-relaxed text-[#1A1A1A]/60 max-w-2xl mb-12" style={{ opacity: isActive ? 1 : 0, transition: 'opacity 1s ease 0.6s' }}>
            L'URL que vous avez saisie est introuvable. Explorez d'autres directions créatives ou retournez à l'accueil pour découvrir l'ensemble de mon portfolio en <strong>motion design</strong> et <strong>animation 3D pour le luxe</strong>.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-6 md:gap-10 items-center justify-center"
            style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.8s' }}
          >
            <button
              onClick={() => go('/')}
              className="group relative inline-flex items-center justify-center text-[16px] font-lausanne font-medium tracking-tight border border-[#1A1A1A]/10 px-8 py-3 rounded-full bg-[#1A1A1A] text-[#F4F4F0] hover:bg-transparent hover:text-[#1A1A1A] transition-all duration-300 cursor-pointer pt-[calc(0.75rem+1px)] pb-3"
            >
              Retour au Portfolio
            </button>
            <Link 
              to="/about"
              className="text-[16px] font-lausanne font-medium uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors border-b border-transparent hover:border-[#1A1A1A] pb-1"
            >
              À Propos
            </Link>
            <Link 
              to="/blog/motion-design-marques-luxe"
              className="text-[16px] font-lausanne font-medium uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors border-b border-transparent hover:border-[#1A1A1A] pb-1"
            >
              Expertise Luxe
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
