// src/components/Layout.tsx
import { ReactNode, useRef } from 'react';
import Navbar from './Navbar';
import LenisProvider from './LenisProvider';
import TransitionContext from '../context/TransitionContext';

export default function Layout({ children }: { children: ReactNode }) {
  const maskRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionContext.Provider value={{ maskRef }}>
      <LenisProvider>
        <div className="bg-[#F4F4F0] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F4F4F0] flex flex-col relative">
          <div
            ref={maskRef}
            className="fixed inset-0 bg-[#F4F4F0] pointer-events-none"
            style={{ zIndex: 999, opacity: 0, visibility: 'hidden' }}
          />
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
        </div>
      </LenisProvider>
    </TransitionContext.Provider>
  );
}
