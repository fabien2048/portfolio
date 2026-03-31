// src/components/PageTransition.tsx
// Système masque Ross Mason — zéro double animation
//
// 3 causes résolues :
//   1. AnimatePresence supprimé dans App.tsx (gardait 2 composants montés en même temps)
//   2. hasRun ref → bloque le double-fire de React StrictMode en dev
//   3. Navbar récrite avec useNavigateWithMask (plus de <Link> qui naviguent sans masque)
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import Footer from './Footer';
import { useTransitionMask } from '../context/TransitionContext';

interface PageTransitionProps {
  children: ReactNode;
  scrollToTop?: boolean;
}

export default function PageTransition({
  children,
  scrollToTop = true,
}: PageTransitionProps) {
  const lenis        = useLenis();
  const { maskRef }  = useTransitionMask();
  const containerRef = useRef<HTMLDivElement>(null);

  // Bloque le double-fire de React StrictMode (dev uniquement)
  // En prod, useLayoutEffect ne tourne qu'une fois — ce ref est no-op
  const hasRun = useRef(false);

  useLayoutEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const mask      = maskRef.current;
    const container = containerRef.current;
    if (!container) return;

    // Reset scroll immédiat
    if (scrollToTop) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }

    // gsap.context → cleanup automatique et propre de tous les tweens du scope
    const ctx = gsap.context(() => {

      // Contenu invisible au départ
      gsap.set(container, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (mask) {
        // Masque (mis visible par useNavigateWithMask) → disparaît
        tl.to(mask, {
          opacity: 0,
          duration: 0.38,
          ease: 'power2.inOut',
          onComplete: () => { gsap.set(mask, { visibility: 'hidden' }); },
        }, 0);
      }

      // Contenu fade in pendant que le masque disparaît
      tl.to(container, {
        opacity: 1,
        duration: 0.3,
      }, mask ? 0.08 : 0);

      // Animations des éléments [data-anim]
      tl.call(() => animatePageContent(container), [], mask ? 0.2 : 0.05);

    }, container);

    return () => {
      ctx.revert();
      hasRun.current = false;
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
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
