// src/hooks/useLazyVideo.ts
import { useEffect, useRef, useState, RefObject } from 'react';

interface UseLazyVideoOptions {
  /** Seuil d'intersection (0 à 1) avant de charger. Default: 0.15 */
  threshold?: number;
  /** Margin autour de la zone visible avant de déclencher. Default: '0px' */
  rootMargin?: string;
  /** Respecte la préférence 'Save-Data' et connexions lentes. Default: true */
  respectDataSaver?: boolean;
}

interface UseLazyVideoResult {
  /** Ref à attacher à la balise <video> */
  videoRef: RefObject<HTMLVideoElement>;
  /** true quand la vidéo est dans la zone de charge et la connexion est OK */
  shouldLoad: boolean;
  /** true quand la vidéo est visible à l'écran (pour autoplay) */
  isInView: boolean;
}

/**
 * Hook pour charger et autoplayer les vidéos uniquement :
 * 1. Quand l'élément entre dans le viewport (IntersectionObserver)
 * 2. Quand la connexion réseau est acceptable (pas en Save-Data ou 2G)
 */
export function useLazyVideo({
  threshold = 0.15,
  rootMargin = '200px 0px',
  respectDataSaver = true,
}: UseLazyVideoOptions = {}): UseLazyVideoResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Vérifie la qualité de connexion avant de charger les vidéos
    const isConnectionSlow = (): boolean => {
      if (!respectDataSaver) return false;

      const nav = navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
        mozConnection?: { saveData?: boolean; effectiveType?: string };
        webkitConnection?: { saveData?: boolean; effectiveType?: string };
      };

      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (!conn) return false;

      // Bloque si l'utilisateur a activé "Economie de données"
      if (conn.saveData) return true;

      // Bloque sur les connexions 2G et slow-2g
      const slowTypes = ['slow-2g', '2g'];
      if (conn.effectiveType && slowTypes.includes(conn.effectiveType)) return true;

      return false;
    };

    if (isConnectionSlow()) {
      // Sur connexion lente : ne charge jamais les vidéos
      setShouldLoad(false);
      return;
    }

    const el = videoRef.current;
    if (!el) return;

    // IntersectionObserver avec rootMargin pour pré-charger légèrement avant
    const loadObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObs.disconnect(); // Ne charge qu'une seule fois
        }
      },
      { threshold: 0, rootMargin } // rootMargin: commence à charger avant que l'élément soit visible
    );

    // Deuxième observer strict pour l'autoplay
    const viewObs = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    loadObs.observe(el);
    viewObs.observe(el);

    return () => {
      loadObs.disconnect();
      viewObs.disconnect();
    };
  }, [threshold, rootMargin, respectDataSaver]);

  // Gère l'autoplay/pause selon la visibilité
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoad) return;

    if (isInView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isInView, shouldLoad]);

  return { videoRef, shouldLoad, isInView };
}
