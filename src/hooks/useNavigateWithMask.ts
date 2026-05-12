// src/hooks/useNavigateWithMask.ts
// Transition fluide pour changer de page sans flash.
// Séquence : le conteneur courant disparaît en douceur (leave) → navigation → le nouveau conteneur apparaît (enter)
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export function useNavigateWithMask() {
  const navigate = useNavigate();

  return useCallback((to: string) => {
    // Même page → on ne fait rien
    if (window.location.pathname === to) return;

    // On cible le conteneur principal de la page courante
    const container = document.getElementById('page-transition-container');

    if (!container) {
      navigate(to);
      return;
    }

    // Tuer le momentum de scroll pour éviter d'atterrir au milieu de la nouvelle page
    const lenis = (window as any).__lenis;
    if (lenis) lenis.stop();

    // LEAVE : Transition de sortie luxueuse du contenu actuel (Inspiré par .fade-overlay-leave-active)
    gsap.to(container, {
      opacity: 0,
      duration: 0.6,
      delay: 0.3, // Délai de 300ms en sortie comme demandé
      ease: 'power2.inOut',
      onComplete: () => {
        // Le conteneur est maintenant invisible (opacity 0)
        // On remonte le scroll tout en haut AVANT de monter la nouvelle page
        // Cela garantit qu'aucune race condition ne maintiendra le scroll au milieu
        window.scrollTo(0, 0);
        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true });
          lenis.start(); // On le relance pour la nouvelle page
        }
        
        navigate(to);
      },
    });
  }, [navigate]);
}
