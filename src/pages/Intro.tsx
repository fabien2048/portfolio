// src/pages/Intro.tsx
// Recréation du scramble text d'intro de iamrossmason.com
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const LINES = ['FABIEN', 'BOUADI'];
const LOCK_DURATION = 1800; // ms pour résoudre toute la ligne
const SCRAMBLE_SPEED = 40;   // ms entre chaque refresh des chars aléatoires
const LINE_STAGGER = 320;  // ms entre le démarrage de chaque ligne

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function useScramble(target: string, startDelay: number, onComplete?: () => void) {
  const [display, setDisplay] = useState(() =>
    target.split('').map(c => (c === ' ' ? ' ' : randomChar()))
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const len = target.length;
      const lockTimes = target.split('').map((_, i) =>
        i === 0 ? 0 : (LOCK_DURATION / Math.max(len - 1, 1)) * i
      );
      const startTs = performance.now();
      let rafId: number;
      let lastRender = 0;

      const tick = (now: number) => {
        if (now - lastRender < SCRAMBLE_SPEED) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        lastRender = now;
        const elapsed = now - startTs;
        const next = target.split('').map((char, i) => {
          if (char === ' ') return ' ';
          return elapsed >= lockTimes[i] ? char : randomChar();
        });
        setDisplay(next);
        const allDone = target.split('').every((char, i) =>
          char === ' ' || elapsed >= lockTimes[i]
        );
        if (allDone) {
          setDisplay(target.split(''));
          onComplete?.();
        } else {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [target, startDelay]);

  return display;
}

function ScrambleLine({ text, delay, onComplete }: {
  text: string;
  delay: number;
  onComplete?: () => void;
}) {
  const chars = useScramble(text, delay, onComplete);
  return (
    <div className="leading-[0.82] overflow-hidden">
      <div className="text-[19vw] md:text-[17vw] font-medium tracking-tighter uppercase text-white select-none whitespace-nowrap">
        {chars.map((char, i) => (
          <span key={i} style={{ display: 'inline-block', minWidth: char === ' ' ? '0.3em' : undefined }}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Intro() {
  const navigate = useNavigate();
  const doneCount = useRef(0);
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('intro-seen')) {
      navigate('/', { replace: true });
    }
  }, []);

  const handleLineDone = () => {
    doneCount.current += 1;
    if (doneCount.current >= LINES.length) {
      setTimeout(() => setExiting(true), 900);
    }
  };

  useEffect(() => {
    if (!exiting) return;
    const el = containerRef.current;
    if (!el) return;
    el.style.transition = 'opacity 0.55s ease-in-out';
    el.style.opacity = '0';
    const t = setTimeout(() => {
      sessionStorage.setItem('intro-seen', '1');
      navigate('/', { replace: true });
    }, 600);
    return () => clearTimeout(t);
  }, [exiting]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2000] bg-[#080808] flex flex-col justify-end"
      style={{ opacity: 1 }}
    >
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 pb-12 md:pb-16">
        {LINES.map((line, i) => (
          <ScrambleLine
            key={line}
            text={line}
            delay={400 + i * LINE_STAGGER}
            onComplete={handleLineDone}
          />
        ))}
        <p className="mt-5 text-white/25 text-[12px] font-lausanne uppercase tracking-[0.35em]">
          Motion · 3D · Art direction
        </p>
      </div>
    </div>
  );
}
