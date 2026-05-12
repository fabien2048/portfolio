// src/components/HomeAbout.tsx
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';

export default function HomeAbout() {
  const go = useNavigateWithMask();
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax subtil pour les rubans - Plus haut pour éviter le bas
  const ribbonY = useTransform(scrollYProgress, [0, 1], [250, 150]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { setIsActive(e.isIntersecting); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-[100vw] left-1/2 -translate-x-1/2 bg-[#F4F4F0] flex flex-col items-start justify-start pt-12 md:pt-16 pb-40 overflow-hidden"
    >
      {/* ── Content Container (Highest Layer) ── */}
      <div className="relative z-50 px-4 md:px-6 lg:px-8 xl:px-12 max-w-[1920px] mx-auto w-full">

        {/* Title Block - Ferré à gauche et haut */}
        <div className="mb-8 md:mb-12">
          <h2 className="flex flex-col gap-0 items-start text-left">
            <span className="text-[12vw] md:text-[80px] lg:text-[110px] xl:text-[140px] leading-[0.85] font-serif italic text-[#1D1D1B]">
              Art Direction&
            </span>
            <span className="text-[12vw] md:text-[80px] lg:text-[110px] xl:text-[140px] leading-[0.85] font-lausanne font-bold text-[#1D1D1B]">
              Motion Design
            </span>
          </h2>
        </div>

        {/* Text & Button Block */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20 mb-20">
          <div className="space-y-6 text-left max-w-[500px]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[20px] md:text-[22px] lg:text-[24px] font-lausanne leading-[1.4] text-[#1D1D1B]"
            >
              Je travaille actuellement en tant que motion designer indépendant pour des studios et des clients internationaux.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-[20px] md:text-[22px] lg:text-[24px] font-lausanne leading-[1.4] text-[#1D1D1B]"
            >
              Au cours des dernières années, j'ai eu la chance de réaliser des projets pour des marques telles que Dior, Guerlain, Prada, Courrèges, Yves Saint Laurent et d'autres.
            </motion.p>
          </div>

          <motion.button
            onClick={() => go('/about')}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="group relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#E8E8E4] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer border-0 outline-none flex-shrink-0"
          >
            <span className="text-[14px] md:text-[16px] font-lausanne font-bold tracking-[0.25em] text-[#1D1D1B] group-hover:opacity-70 transition-opacity">
              ABOUT
            </span>
          </motion.button>
        </div>

        {/* Tags Block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-start gap-x-16 gap-y-6"
        >
          {['#MOTION DESIGN', '#ART DIRECTION', '#MOODTAPE'].map(tag => (
            <span key={tag} className="text-[12px] md:text-[14px] font-lausanne font-bold text-[#1D1D1B] tracking-[0.3em] uppercase">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Ribbon Image (Middle Layer) ── */}
      <motion.div
        style={{
          y: ribbonY,
          width: '160vw',
          left: '50%',
          translateX: '-50%'
        }}
        className="absolute top-0 h-full z-30 pointer-events-none select-none flex items-center justify-center"
      >
        <img
          src="https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043.webp"
          srcSet="https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043-p-500.webp 500w, https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043-p-800.webp 800w, https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043-p-1080.webp 1080w, https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043-p-1600.webp 1600w, https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043-p-2000.webp 2000w, https://cdn.prod.website-files.com/5dbd309604f8b2d48b6dbe8c/650444a1317e5564df38b2f5_exports0043.webp 2600w"
          sizes="160vw"
          alt=""
          className="w-full h-auto object-cover mix-blend-multiply origin-center scale-[1.05]"
        />
      </motion.div>

      {/* ── Infinite Marquee CONTACT (Bottom Layer) ── */}
      <div className="absolute bottom-0 left-0 w-full h-[40vw] overflow-hidden pointer-events-none select-none z-10 flex items-center opacity-[0.08]">
        <motion.div
          animate={isActive ? { x: ["0%", "-50%"] } : {}}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[35vw] leading-[0.85] font-lausanne font-light uppercase tracking-tighter px-[2vw]">
              CONTACT ✻
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&display=swap');
        .font-serif {
          font-family: 'Cormorant Garamond', serif !important;
        }
      `}</style>
    </section>
  );
}
