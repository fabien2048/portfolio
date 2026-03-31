// src/hooks/useNavigateWithMask.ts
// À utiliser PARTOUT à la place de <Link> ou useNavigate()
// Séquence : mask apparaît (leave) → navigate → PageTransition fait disparaître le mask (enter)
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useTransitionMask } from '../context/TransitionContext';

export function useNavigateWithMask() {
  const navigate    = useNavigate();
  const { maskRef } = useTransitionMask();

  return useCallback((to: string) => {
    // Même page → rien
    if (window.location.pathname === to) return;

    const mask = maskRef.current;

    if (!mask) {
      navigate(to);
      return;
    }

    // LEAVE : masque beige apparaît (0.32s) → puis navigation
    gsap.set(mask, { visibility: 'visible' });
    gsap.to(mask, {
      opacity: 1,
      duration: 0.32,
      ease: 'power2.inOut',
      onComplete: () => navigate(to),
    });
  }, [navigate, maskRef]);
}
