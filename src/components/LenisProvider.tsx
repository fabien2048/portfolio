import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LenisSync() {
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      (window as unknown as Record<string, unknown>).__lenis = lenis;
      
      lenis.on('scroll', ScrollTrigger.update);

      return () => {
        lenis.off('scroll', ScrollTrigger.update);
      };
    }
  }, [lenis]);
  return null;
}

import { useState } from 'react';

// detroitEasing — Courbe Expo Out (Lisse, incisif au début, longue traîne très fluide)
const detroitEasing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export default function LenisProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration:        1.2,           // Temps de scroll allongé pour le coté luxe "flottant"
        easing:          detroitEasing, // Courbe Expo de Detroit Paris
        wheelMultiplier: 1.0,           // Sensibilité 1:1, non amplifiée, très contrôlée

        touchMultiplier: 2.0,
        smoothWheel:     true,
        syncTouch:       false,
        infinite:        false,
      }}
    >
      <LenisSync />
      {children}
    </ReactLenis>
  );
}
