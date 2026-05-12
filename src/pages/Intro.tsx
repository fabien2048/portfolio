// src/pages/Intro.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';

const INTRO_IMAGES = [
  "images/projects/thumbnails/yves-saint-laurent-motion-design-luxe.webp",
  "images/projects/thumbnails/dior-backstage-motion-design-paris.webp",
  "images/projects/thumbnails/cartier-horlogerie-motion-design-luxe.webp",
  "images/projects/thumbnails/prada-moodtape-motion-design.webp",
  "images/projects/thumbnails/lancome-beauty-motion-design-paris.webp"
];

export default function Intro({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const blueLineRef = useRef<HTMLDivElement>(null);
  const imgCardRef = useRef<HTMLDivElement>(null);
  const blueWipeBarRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    // Lock lenis scroll
    if (lenis) lenis.stop();

    const ctx = gsap.context(() => {
      // Configuration initiale propre pour GSAP
      gsap.set(logoTextRef.current, { xPercent: -50, yPercent: -50 });
      gsap.set(blueLineRef.current, { xPercent: -50 });
      gsap.set(imgCardRef.current, { xPercent: -50, yPercent: -50 });

      // Slideshow ultra-rapide en boucle indépendante
      const slideshowTl = gsap.timeline({ repeat: -1 });
      const slideshowImages = gsap.utils.toArray<HTMLElement>('.intro-slideshow-img');
      if (slideshowImages.length > 0) {
        slideshowImages.forEach((img) => {
          slideshowTl.set(slideshowImages, { opacity: 0 });
          slideshowTl.set(img, { opacity: 1 });
          slideshowTl.to({}, { duration: 0.15 }); // 150ms par image
        });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          localStorage.setItem('oddRitualIntroLastPlayed', Date.now().toString());
          if (lenis) lenis.start();
          if (onComplete) onComplete();
        }
      });

      // Phase 1 : silence (0ms -> 400ms)
      tl.to({}, { duration: 0.4 });

      // Phase 2 : logo ghost (400ms -> 1000ms)
      tl.to(logoTextRef.current, {
        opacity: 0.08,
        duration: 0.6,
        ease: "cubic-bezier(0.4, 0, 0.2, 1)"
      });

      // Phase 3 : logo full blanc (1000ms -> 1500ms)
      tl.to(logoTextRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "cubic-bezier(0.4, 0, 0.2, 1)"
      });

      // Phase 4 : ligne bleue (1500ms -> 1800ms)
      tl.to(blueLineRef.current, {
        opacity: 1,
        scaleX: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.1");

      // Phase 5 : wipe image (1800ms -> 2600ms)
      tl.to(imgCardRef.current, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.8,
        ease: "cubic-bezier(0.76, 0, 0.24, 1)",
        onUpdate: function() {
          const progress = this.progress();
          const barPos = (1 - progress) * 100;
          gsap.set(blueWipeBarRef.current, { bottom: `${barPos}%` });
        }
      }, "+=0.0");

      // Masquer la ligne bleue au début du wipe (exactement sync avec Phase 5)
      tl.to(blueLineRef.current, { opacity: 0, duration: 0.15 }, "<");

      // Phase 6 : pause + masquer wipe bar (2600ms -> 3000ms)
      tl.to(blueWipeBarRef.current, { opacity: 0, duration: 0.15 });
      tl.to(logoTextRef.current, { opacity: 0, duration: 0.2 }, "<");
      tl.to({}, { duration: 0.4 }); // Pause pour atteindre 3000ms

      // Phase 7 : expansion fullscreen (3000ms -> 4000ms)
      tl.to(imgCardRef.current, {
        width: "100vw",
        height: "100vh",
        duration: 1.0,
        ease: "expo.inOut" // Easing très lent au début, explosif à la fin
      });

      // L'intro passe en arrière-plan et déclenche le wipe de la vidéo par-dessus le slideshow
      tl.call(() => {
        gsap.set(containerRef.current, { zIndex: -10, backgroundColor: 'transparent' });
        window.dispatchEvent(new Event('intro-start-wipe'));
      });

      // On attend que le wipe de la vidéo (0.75s) se termine avant de unmount l'intro
      tl.to({}, { duration: 1.0 });

    }, containerRef);

    // Sécurité au cas où GSAP ne se lancerait pas
    const fallback = setTimeout(() => {
      if (containerRef.current && containerRef.current.style.opacity !== '0') {
        console.warn("Intro: Fallback triggered.");
        if (onComplete) onComplete();
      }
    }, 6000);

    return () => {
      clearTimeout(fallback);
      ctx.revert();
      if (lenis) lenis.start();
    };
  }, [lenis, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden"
    >
      {/* === LOGO === */}
      {/* === LOGO === */}
      <div 
        className="fixed z-[1010] pointer-events-none"
        style={{ top: '58%', left: '50%' }}
      >
        <span 
          ref={logoTextRef}
          className="text-[#00FF66] opacity-0 flex items-center justify-center w-[200px] md:w-[300px]"
          style={{ 
            transform: 'translate(-50%, -50%)',
          }}
        >
          <svg className="w-full h-auto text-current" viewBox="0 0 1840 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.73" d="M1.02755 283.76V282.658C15.3559 278.984 15.7233 273.84 15.7233 224.609V116.228H0.660156V114.758C13.8864 112.554 15.7233 108.513 15.7233 80.2232V72.8754C15.7233 21.8075 40.3387 5.64209 62.7498 5.64209C77.0782 5.64209 89.937 10.4182 89.937 20.3379C89.937 25.8488 87.3653 30.2576 80.3848 30.2576C73.0369 30.2576 70.0977 26.951 68.9955 20.7053C67.1586 10.4182 67.1586 7.11167 59.4433 7.11167C47.6866 7.11167 42.9105 17.7661 42.9105 54.873V114.758H76.3434V116.228H42.9105V224.609C42.9105 273.84 43.2779 278.616 62.7498 282.658V283.76H1.02755Z" fill="currentColor"/>
            <path opacity="0.73" d="M121.457 285.23C97.9435 285.23 80.3086 273.473 80.3086 249.96C80.3086 221.303 106.026 219.099 136.153 205.505L149.379 199.627C171.422 189.707 175.464 177.951 175.464 169.133V145.987C175.464 118.065 157.461 113.657 143.133 113.657C124.763 113.657 121.824 117.698 117.783 124.678C113.007 133.496 108.598 140.844 99.7805 140.844C92.8 140.844 89.8609 136.435 89.8609 130.924C89.8609 119.168 117.048 112.187 143.5 112.187C172.525 112.187 202.651 118.433 202.651 152.6V231.59C202.651 274.208 205.223 281.923 216.245 281.923C220.653 281.923 225.429 280.454 228.736 277.882L229.103 278.617C226.532 281.189 220.653 285.597 207.06 285.597C183.547 285.597 175.464 273.841 175.464 258.043L169.953 263.554C156.359 276.78 143.5 285.23 121.457 285.23ZM108.231 245.551C108.231 268.697 116.313 280.454 132.846 280.454C146.072 280.454 155.625 275.678 169.953 262.084L175.464 256.573V175.746C173.994 182.727 168.483 192.279 149.746 200.729L136.52 206.607C114.476 216.527 108.231 229.386 108.231 245.551Z" fill="currentColor"/>
            <path opacity="0.73" d="M315.49 287.067C278.385 287.067 262.954 268.697 250.83 268.697C246.054 268.697 244.584 272.371 243.482 274.943H242.38V72.5084C242.38 19.6035 242.747 22.1753 226.582 22.1753V21.0731L269.567 0.499023V150.396L279.487 139.374C299.692 117.331 315.123 112.187 329.818 112.187C365.823 112.187 399.256 143.048 399.256 195.586C399.256 254.001 358.843 287.067 315.49 287.067ZM277.282 275.678C287.202 281.556 298.224 285.597 315.49 285.597C341.575 285.597 370.599 266.86 370.599 201.097C370.599 130.557 346.719 115.494 324.675 115.494C312.918 115.494 299.692 119.168 279.487 141.211L269.567 152.233V255.838C269.567 265.758 270.302 271.636 277.282 275.678Z" fill="currentColor"/>
            <path opacity="0.73" d="M441.201 80.5911C432.384 80.5911 425.403 73.6106 425.403 64.7931C425.403 55.9756 432.384 48.9951 441.201 48.9951C450.019 48.9951 456.999 55.9756 456.999 64.7931C456.999 73.6106 450.019 80.5911 441.201 80.5911ZM413.279 283.76V282.658C427.608 278.984 427.975 273.841 427.975 224.61V184.564C427.975 135.7 427.975 134.598 414.381 134.598V133.496L455.162 110.35V224.61C455.162 273.841 455.53 278.617 471.328 282.658V283.76H413.279Z" fill="currentColor"/>
            <path opacity="0.73" d="M573.961 286.332C530.976 286.332 486.521 256.573 486.521 197.79C486.521 140.844 530.241 111.452 565.511 111.452C593.801 111.452 622.457 128.352 630.173 162.52H517.75C515.546 172.072 514.443 183.462 514.443 196.688C514.443 263.186 545.672 283.76 579.84 283.76C598.944 283.76 615.477 276.78 627.601 266.86L628.703 267.962C615.844 278.249 598.577 286.332 573.961 286.332ZM565.511 112.922C548.611 112.922 526.935 125.046 518.117 161.05H607.027C605.19 125.781 583.881 112.922 565.511 112.922Z" fill="currentColor"/>
            <path opacity="0.73" d="M642.543 283.76V282.658C656.871 278.984 657.239 273.84 657.239 224.609V184.563C657.239 136.435 657.239 134.598 643.645 134.598V133.495L683.691 110.35V150.028L694.713 139.741C717.124 119.167 733.657 112.187 749.822 112.187C777.744 112.187 792.807 125.045 792.807 156.274V224.609C792.807 273.84 792.807 278.616 807.503 282.658V283.76H750.19V282.658C765.988 278.616 766.355 273.84 766.355 224.609V151.13C766.355 125.045 757.538 115.861 741.74 115.861C729.983 115.861 717.124 121.004 694.713 141.578L683.691 151.865V224.609C683.691 273.84 684.059 278.616 699.857 282.658V283.76H642.543Z" fill="currentColor"/>
            <path opacity="0.73" d="M982.111 287.067C945.004 287.067 929.573 268.697 917.449 268.697C912.673 268.697 911.203 272.371 910.101 274.943H908.999V72.5084C908.999 19.6035 909.367 22.1753 893.201 22.1753V21.0731L936.186 0.499023V150.396L946.106 139.374C966.313 117.331 981.743 112.187 996.439 112.187C1032.44 112.187 1065.88 143.048 1065.88 195.586C1065.88 254.001 1025.46 287.067 982.111 287.067ZM943.902 275.678C953.821 281.556 964.843 285.597 982.111 285.597C1008.2 285.597 1037.22 266.86 1037.22 201.097C1037.22 130.557 1013.34 115.494 991.295 115.494C979.539 115.494 966.313 119.168 946.106 141.211L936.186 152.233V255.838C936.186 265.758 936.921 271.636 943.902 275.678Z" fill="currentColor"/>
            <path opacity="0.73" d="M1165.09 287.067C1129.45 287.067 1083.9 257.675 1083.9 200.729C1083.9 144.15 1129.45 111.084 1165.09 111.084C1201.1 111.084 1246.65 144.15 1246.65 200.729C1246.65 257.675 1201.1 287.067 1165.09 287.067ZM1165.09 285.597C1191.54 285.597 1218 265.39 1218 200.729C1218 136.435 1191.54 112.554 1165.09 112.554C1139.01 112.554 1112.55 136.435 1112.55 200.729C1112.55 265.39 1139.01 285.597 1165.09 285.597Z" fill="currentColor"/>
            <path opacity="0.73" d="M1320.54 286.332C1292.62 286.332 1277.19 273.473 1277.19 242.244V191.911C1277.19 136.067 1277.19 134.598 1263.59 134.598V133.495L1304.37 110.35V254.736C1304.37 276.779 1313.56 282.658 1328.62 282.658C1338.17 282.658 1351.77 280.821 1376.02 258.41L1386.67 248.857V191.911C1386.67 136.067 1386.67 134.598 1373.08 134.598V133.495L1413.86 110.35V224.609C1413.86 273.84 1413.86 278.984 1432.23 282.658V283.76H1386.67V250.694L1376.02 260.247C1352.87 281.556 1336.34 286.332 1320.54 286.332Z" fill="currentColor"/>
            <path opacity="0.73" d="M1483.76 285.23C1460.25 285.23 1442.61 273.473 1442.61 249.96C1442.61 221.303 1468.33 219.099 1498.46 205.505L1511.68 199.627C1533.73 189.707 1537.77 177.951 1537.77 169.133V145.987C1537.77 118.065 1519.76 113.657 1505.44 113.657C1487.07 113.657 1484.13 117.698 1480.09 124.678C1475.31 133.496 1470.9 140.844 1462.08 140.844C1455.1 140.844 1452.16 136.435 1452.16 130.924C1452.16 119.168 1479.35 112.187 1505.8 112.187C1534.83 112.187 1564.95 118.433 1564.95 152.6V231.59C1564.95 274.208 1567.53 281.923 1578.55 281.923C1582.96 281.923 1587.73 280.454 1591.04 277.882L1591.41 278.617C1588.83 281.189 1582.96 285.597 1569.36 285.597C1545.85 285.597 1537.77 273.841 1537.77 258.043L1532.26 263.554C1518.66 276.78 1505.8 285.23 1483.76 285.23ZM1470.53 245.551C1470.53 268.697 1478.62 280.454 1495.15 280.454C1508.37 280.454 1517.93 275.678 1532.26 262.084L1537.77 256.573V175.746C1536.3 182.727 1530.79 192.279 1512.05 200.729L1498.82 206.607C1476.78 216.527 1470.53 229.386 1470.53 245.551Z" fill="currentColor"/>
            <path opacity="0.73" d="M1668.65 285.965C1633.38 285.965 1595.91 258.41 1595.91 202.566C1595.91 144.15 1632.28 112.187 1677.47 112.187C1691.8 112.187 1708.7 118.433 1725.23 132.761V72.5084C1725.23 23.2775 1725.6 22.1753 1709.43 22.1753V21.0731L1752.42 0.499023V224.61C1752.42 273.841 1752.42 278.984 1770.79 282.658V283.76H1725.23V252.899L1720.82 258.41C1706.49 276.045 1691.06 285.965 1668.65 285.965ZM1624.56 197.055C1624.56 271.269 1654.32 282.291 1673.8 282.291C1691.43 282.291 1705.76 275.31 1720.82 256.573L1725.23 251.062V134.598C1706.49 118.8 1691.06 113.657 1677.47 113.657C1649.92 113.657 1624.56 131.292 1624.56 197.055Z" fill="currentColor"/>
            <path opacity="0.73" d="M1809.6 80.5911C1800.79 80.5911 1793.81 73.6106 1793.81 64.7931C1793.81 55.9756 1800.79 48.9951 1809.6 48.9951C1818.42 48.9951 1825.4 55.9756 1825.4 64.7931C1825.4 73.6106 1818.42 80.5911 1809.6 80.5911ZM1781.68 283.76V282.658C1796.01 278.984 1796.38 273.841 1796.38 224.61V184.564C1796.38 135.7 1796.38 134.598 1782.78 134.598V133.496L1823.56 110.35V224.61C1823.56 273.841 1823.93 278.617 1839.73 282.658V283.76H1781.68Z" fill="currentColor"/>
          </svg>
        </span>
      </div>

      {/* === LIGNE BLEUE === */}
      <div 
        ref={blueLineRef}
        className="fixed z-[1005] bg-[#0018FF] opacity-0"
        style={{
          top: '35%',
          left: '50%',
          width: '220px',
          height: '3px',
          transform: 'scaleX(0)',
          transformOrigin: 'center'
        }}
      />

      {/* === CARTE IMAGE === */}
      <div 
        ref={imgCardRef}
        className="fixed z-[1005] overflow-hidden"
        style={{
          top: '50%',
          left: '50%',
          width: '220px',
          height: '270px',
          clipPath: 'inset(0 0 100% 0)'
        }}
      >
        {/* === BARRE BLEUE WIPE === */}
        <div 
          ref={blueWipeBarRef}
          className="absolute left-0 w-full bg-[#0018FF] z-10"
          style={{ bottom: '100%', height: '4px' }}
        />
        {/* === SLIDESHOW PRODUITS (statique, pas d'effet de zoom) === */}
        {INTRO_IMAGES.map((src, index) => (
          <div 
            key={src}
            className="intro-slideshow-img absolute bg-[#C4B49A] bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${src})`,
              width: '100vw',
              height: '100vh',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: index === 0 ? 1 : 0
            }}
          />
        ))}
      </div>
    </div>
  );
}
