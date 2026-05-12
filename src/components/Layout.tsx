// src/components/Layout.tsx
import { ReactNode, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import LenisProvider from './LenisProvider';
import TransitionContext from '../context/TransitionContext';
import { cn } from '../utils/cn';

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Raccourci clavier : touche 'r' → page Motion Designer Freelance
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ignore si l'utilisateur est en train de taper dans un champ
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === 'm' || e.key === 'M') {
        navigate('/motion-designer-freelance-paris');
      }
      if (e.key === 'l' || e.key === 'L') {
        navigate('/secret-menu');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  const isHome = location.pathname === '/';

  return (
    <LenisProvider>
      <div className="bg-[#F4F4F0] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F4F4F0] flex flex-col relative">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </div>
    </LenisProvider>
  );
}
