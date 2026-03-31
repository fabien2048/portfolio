// src/components/LenisProvider.tsx
import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

function LenisSync() {
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      (window as unknown as Record<string, unknown>).__lenis = lenis;
    }
  }, [lenis]);
  return null;
}

// detroitEasing — Courbe Expo Out (Lisse, incisif au début, longue traîne très fluide)
const detroitEasing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

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
