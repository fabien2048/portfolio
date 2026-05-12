// src/components/PageTransition.tsx
// Transition fluide pour l'arrivée sur une nouvelle page.
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { useNavigationType, useLocation } from 'react-router-dom';
import Footer from './Footer';

interface PageTransitionProps {
  children: ReactNode;
  scrollToTop?: boolean;
}

let isInitialLoad = true;

export default function PageTransition({
  children,
  scrollToTop = false,
}: PageTransitionProps) {
  const lenis        = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const navType      = useNavigationType();
  const location     = useLocation();

  // Bloque le double-fire de React StrictMode (dev uniquement)
  const hasRun = useRef(false);

  useLayoutEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const container = containerRef.current;
    if (!container) return;

    const isFirst = isInitialLoad;
    isInitialLoad = false;
    const isBackForward = navType === 'POP' && !isFirst;

    // FORCER le scroll en haut de page systématiquement lors d'un changement de pathname
    // Sauf si c'est explicitement un retour arrière que l'on veut préserver (optionnel, ici on force quand même car demandé)
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    }
    
    // Sécurité supplémentaire différée pour écraser les restaurations tardives du navigateur
    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    }, 100);

    const ctx = gsap.context(() => {
      // Contenu invisible au départ (pas de décalage y pour préserver l'animation du header HP)
      gsap.set(container, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (isBackForward) {
        // Retour navigateur : opacité uniquement (durée identique au load classique)
        tl.to(container, {
          opacity: 1,
          duration: 0.45,
          delay: 0,
          ease: 'power2.inOut',
        });
      } else {
        // ENTER : fade in luxueux du conteneur (Inspiré par la transition .fade-overlay)
        tl.to(container, {
          opacity: 1,
          duration: 0.6,
          delay: 0,
          ease: "power2.inOut", // Approximation de l'easing cubique
        });

        // Animations des sous-éléments [data-anim] (titres, images...)
        tl.call(() => animatePageContent(container), [], 0.05);
      }

    }, container);

    return () => {
      ctx.revert();
      clearTimeout(scrollTimeout);
    };
  }, [lenis, scrollToTop, navType, location.pathname]);

  return (
    <div
      id="page-transition-container"
      ref={containerRef}
      className="w-full flex-grow flex flex-col"
      style={{ opacity: 0 }}
    >
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// animatePageContent — stagger des éléments data-anim
// Ajouter data-anim="tag|title|bottom|content|item" dans vos pages
// ─────────────────────────────────────────────────────────────────
function animatePageContent(container: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  const tag     = container.querySelector<HTMLElement>('[data-anim="tag"]');
  const title   = container.querySelector<HTMLElement>('[data-anim="title"]');
  const bottom  = container.querySelector<HTMLElement>('[data-anim="bottom"]');
  const content = container.querySelectorAll<HTMLElement>('[data-anim="content"]');
  const items   = container.querySelectorAll<HTMLElement>('[data-anim="item"]');

  let t = 0;

  if (tag) {
    tl.fromTo(tag,   { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, t);
    t += 0.08;
  }
  if (title) {
    tl.fromTo(title, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, t);
    t += 0.1;
  }
  if (bottom) {
    tl.fromTo(bottom, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, t);
  }
  if (content.length) {
    tl.fromTo(content, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07 }, t);
  }
  if (items.length) {
    tl.fromTo(items,   { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.05 }, t + 0.08);
  }
}
