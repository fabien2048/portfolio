// src/components/Navbar.tsx
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import gsap from 'gsap';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';
import { useLenis } from 'lenis/react';

export default function Navbar() {
  const [isOpen, setIsOpen]       = useState(false);
  const location                  = useLocation();
  const go                        = useNavigateWithMask();
  const menuRef                   = useRef<HTMLDivElement>(null);
  const linksRef                  = useRef<(HTMLDivElement | null)[]>([]);
  const contactRef                = useRef<HTMLDivElement>(null);
  const logoSvgRef                = useRef<HTMLSpanElement>(null);
  const logoTextRef               = useRef<HTMLSpanElement>(null);

  const isProject = location.pathname.startsWith('/project/');
  const prevIsProject = useRef(isProject);

  // Init positions au montage
  useEffect(() => {
    const svgEl = logoSvgRef.current;
    const txtEl = logoTextRef.current;
    if (!svgEl || !txtEl) return;
    const words = txtEl.querySelectorAll('.logo-word');

    if (isProject) {
      gsap.set(svgEl, { y: '-110%' });
      gsap.set(words, { y: '0%' });
    } else {
      gsap.set(svgEl, { y: '0%' });
      gsap.set(words, { y: '110%' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation séquentielle au changement de page
  useEffect(() => {
    const svgEl = logoSvgRef.current;
    const txtEl = logoTextRef.current;
    if (!svgEl || !txtEl) return;
    
    // NodeList des mots animables
    const words = Array.from(txtEl.querySelectorAll('.logo-word'));

    if (isProject && !prevIsProject.current) {
      gsap.killTweensOf([svgEl, ...words]);
      gsap.timeline()
        .to(svgEl, { y: '-100%', duration: 1.0, ease: 'expo.inOut' })
        .fromTo(words, 
          { y: '110%' }, 
          { y: '0%', duration: 1.4, ease: 'expo.out', stagger: 0.12 }, 
          '-=0.5'
        );
    } else if (!isProject && prevIsProject.current) {
      gsap.killTweensOf([svgEl, ...words]);
      gsap.timeline()
        .to(words, { y: '-110%', duration: 0.9, ease: 'expo.inOut', stagger: 0.06 })
        .fromTo(svgEl, 
          { y: '100%' }, 
          { y: '0%', duration: 1.2, ease: 'expo.out' }, 
          '-=0.5'
        );
    }
    prevIsProject.current = isProject;
  }, [isProject]);

  useEffect(() => { setIsOpen(false); }, [location]);

  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      gsap.set(menuRef.current, { visibility: 'visible' });
      const tl = gsap.timeline();
      tl.fromTo(menuRef.current, { y: '-100%' }, { y: '0%', duration: 0.9, ease: 'power4.inOut' });
      tl.fromTo(
        linksRef.current.filter(Boolean),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
        '-=0.5'
      );
      tl.fromTo(
        contactRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      );
    } else {
      lenis?.start();
      if (menuRef.current) {
        gsap.timeline({
          onComplete: () => { gsap.set(menuRef.current, { visibility: 'hidden' }); },
        }).to(menuRef.current, { y: '-100%', duration: 0.7, ease: 'power4.inOut' });
      }
    }
  }, [isOpen, lenis]);

  // Nuances gris → noir (pas d'opacité, vraies couleurs)
  const linkClass = (path: string) => cn(
    'relative py-3 px-0 cursor-pointer bg-transparent border-0 outline-none font-lausanne font-medium text-[22px]', 
    'after:content-[\'\'] after:absolute after:w-full after:h-[1px] after:bottom-2 after:left-0',
    'after:bg-current after:transition-transform after:duration-[550ms] after:ease-[cubic-bezier(.785,.135,.15,.86)]',
    'transition-colors duration-300',
    location.pathname === path
      ? 'text-white after:scale-x-100 after:origin-left'
      : 'text-white/40 hover:text-white after:scale-x-0 after:origin-left'
  );

  const handleNav = (to: string) => { setIsOpen(false); go(to); };

  return (
    <>
      {/* ── Barre principale ── */}
      <nav className="fixed top-0 left-0 w-full z-[1000] pointer-events-none mix-blend-difference text-white">
        <div className="relative flex items-center w-full pointer-events-none
          px-4 py-6
          md:px-6 md:py-7
          lg:px-8
          xl:px-12">

          {/* Logo — desktop + mobile */}
          <div className="flex-1 flex pointer-events-none">
            <button
              onClick={() => handleNav('/')}
              className="bg-transparent border-0 outline-none cursor-pointer shrink hover:opacity-50 transition-opacity duration-300 pointer-events-auto flex items-center min-h-[44px] w-full max-w-[280px] md:max-w-[420px]"
              style={{ overflow: 'hidden', position: 'relative' }}
              aria-label="Accueil"
            >
              <span ref={logoSvgRef} className="absolute inset-y-0 left-0 flex items-center justify-start w-[219px] md:w-[212px]" style={{ height: '100%' }}>
                <svg className="w-full h-auto text-current" fill="none" viewBox="0 0 1352 182" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="M43.25 49.75H68V68H43.5V179H21.5V68H0V49.75H21.5V25.25C21.5 11 32.5 0.5 49.75 0.5H66.5V19.25H53.75C46.75 19.25 43.25 22.25 43.25 28.5V49.75Z" fill="currentColor"></path><path d="M186.078 92.25V161.5C186.078 168.75 186.828 174.5 188.078 179H165.578C164.828 174.5 164.578 165 164.578 150.25H164.328C160.328 171 143.828 182 119.078 182C79.5781 182 72.0781 161.25 72.0781 144.75C72.0781 128.5 80.5781 117 93.5781 112C100.328 109.5 106.578 107.75 112.828 106.5C119.078 105.25 125.578 104.25 132.578 103.5C139.828 102.75 144.578 102 146.828 101.25C161.578 97 163.578 93.75 163.578 84C163.578 72 152.578 65.25 133.328 65.25C120.328 65.25 111.578 69 107.828 75.25C104.578 81.25 104.328 83 103.578 87.75H81.0781C82.0781 79.5 83.5781 73.5 85.8281 69.25C93.5781 54.25 109.328 46.75 132.828 46.75C151.578 46.75 165.828 52.25 172.828 58.5C176.578 61.75 179.328 65.5 181.328 70.25C185.578 79.25 186.078 85 186.078 92.25ZM163.578 119V98.25C161.328 109.5 151.578 113.75 127.828 118.5C104.828 122.75 95.3281 128.25 95.3281 144.25C95.3281 156.25 105.328 164.5 121.578 164.5C149.328 164.5 163.578 151.75 163.578 119Z" fill="currentColor"></path><path d="M268.338 46.75C287.338 46.75 301.838 53.25 311.838 66.25C322.088 79 327.088 95.25 327.088 114.75C327.088 134 322.088 150.25 311.838 163C301.588 175.75 287.088 182 268.088 182C248.338 182 234.588 172.75 226.338 154.25H225.838V179H204.088V0.5H226.838L226.338 75.5H227.088C231.838 56.75 249.088 46.75 268.338 46.75ZM265.338 163.25C278.838 163.25 288.588 158.5 294.838 149C301.088 139.25 304.088 127.5 304.088 113.25C304.088 100 300.838 88.75 294.088 79.75C287.588 70.5 277.838 66 264.838 66C240.588 66 226.838 84.25 226.088 111V112.5C226.088 126.75 229.088 139 235.088 148.75C241.338 158.5 251.338 163.25 265.338 163.25Z" fill="currentColor"></path><path d="M362.619 0.5V26.5H339.619V0.5H362.619ZM339.869 179V49.75H362.369V179H339.869Z" fill="currentColor"></path><path d="M439.098 46.75C485.848 46.75 500.848 89.5 499.348 121H397.098C399.348 149.25 413.598 163.25 439.848 163.25C458.098 163.25 471.348 154.75 475.098 138H497.098C491.348 166.25 469.848 182 439.848 182C398.848 182 375.848 155 374.598 114C374.598 94.75 380.848 78.75 393.098 66C405.348 53.25 420.848 46.75 439.098 46.75ZM397.848 102H476.598C475.348 81 460.348 65.25 439.098 65.25C418.098 65.25 401.848 80 397.848 102Z" fill="currentColor"></path><path d="M574.996 46.75C607.746 46.75 624.246 65 624.246 94V179H601.746V96.25C601.746 73.5 590.996 65.5 571.996 65.5C546.746 65.5 533.746 78.25 533.746 110.5V179H511.246V49.75H532.496V77.75H532.996C538.996 57 554.996 46.75 574.996 46.75Z" fill="currentColor"></path><path d="M734.48 46.75C753.48 46.75 767.98 53.25 777.98 66.25C788.23 79 793.23 95.25 793.23 114.75C793.23 134 788.23 150.25 777.98 163C767.73 175.75 753.23 182 734.23 182C714.48 182 700.73 172.75 692.48 154.25H691.98V179H670.23V0.5H692.98L692.48 75.5H693.23C697.98 56.75 715.23 46.75 734.48 46.75ZM731.48 163.25C744.98 163.25 754.73 158.5 760.98 149C767.23 139.25 770.23 127.5 770.23 113.25C770.23 100 766.98 88.75 760.23 79.75C753.73 70.5 743.98 66 730.98 66C706.73 66 692.98 84.25 692.23 111V112.5C692.23 126.75 695.23 139 701.23 148.75C707.48 158.5 717.48 163.25 731.48 163.25Z" fill="currentColor"></path><path d="M797.762 114.5C797.762 94.75 803.512 78.75 814.762 66C826.012 53.25 841.762 46.75 861.512 46.75C881.262 46.75 897.012 53.25 908.262 66C919.512 78.75 925.262 94.75 925.262 114.5C925.262 134 919.512 150.25 908.262 163C897.012 175.75 881.262 182 861.512 182C841.762 182 826.012 175.75 814.762 163C803.512 150.25 797.762 134 797.762 114.5ZM902.762 114.5C902.762 99.25 898.762 87.25 890.762 78.5C883.012 69.75 873.262 65.25 861.512 65.25C849.762 65.25 840.012 69.75 832.012 78.5C824.262 87.25 820.262 99.25 820.262 114.5C820.262 129.5 824.262 141.5 832.012 150.25C840.012 159 849.762 163.25 861.512 163.25C873.262 163.25 883.012 159 890.762 150.25C898.762 141.5 902.762 129.5 902.762 114.5Z" fill="currentColor"></path><path d="M1028.8 118.25V49.75H1051.3V179H1030.05V151H1029.55C1023.55 171.75 1007.55 182 987.555 182C954.805 182 938.305 163.75 938.305 134.75V49.75H960.805V132.5C960.805 155.25 971.555 163.25 990.555 163.25C1015.8 163.25 1028.8 150.5 1028.8 118.25Z" fill="currentColor"></path><path d="M1176.19 92.25V161.5C1176.19 168.75 1176.94 174.5 1178.19 179H1155.69C1154.94 174.5 1154.69 165 1154.69 150.25H1154.44C1150.44 171 1133.94 182 1109.19 182C1069.69 182 1062.19 161.25 1062.19 144.75C1062.19 128.5 1070.69 117 1083.69 112C1090.44 109.5 1096.69 107.75 1102.94 106.5C1109.19 105.25 1115.69 104.25 1122.69 103.5C1129.94 102.75 1134.69 102 1136.94 101.25C1151.69 97 1153.69 93.75 1153.69 84C1153.69 72 1142.69 65.25 1123.44 65.25C1110.44 65.25 1101.69 69 1097.94 75.25C1094.69 81.25 1094.44 83 1093.69 87.75H1071.19C1072.19 79.5 1073.69 73.5 1075.94 69.25C1083.69 54.25 1099.44 46.75 1122.94 46.75C1141.69 46.75 1155.94 52.25 1162.94 58.5C1166.69 61.75 1169.44 65.5 1171.44 70.25C1175.69 79.25 1176.19 85 1176.19 92.25ZM1153.69 119V98.25C1151.44 109.5 1141.69 113.75 1117.94 118.5C1094.94 122.75 1085.44 128.25 1085.44 144.25C1085.44 156.25 1095.44 164.5 1111.69 164.5C1139.44 164.5 1153.69 151.75 1153.69 119Z" fill="currentColor"></path><path d="M1288.7 75.5L1288.2 0.5H1310.7V179H1288.95V154.25H1288.45C1280.2 172.75 1266.45 182 1246.7 182C1227.7 182 1213.2 175.75 1202.95 163C1192.7 150.25 1187.7 134 1187.7 114.75C1187.7 95.25 1192.7 79 1202.7 66.25C1212.95 53.25 1227.45 46.75 1246.45 46.75C1265.7 46.75 1282.95 56.75 1287.7 75.5H1288.7ZM1249.45 163.25C1263.45 163.25 1273.45 158.5 1279.45 148.75C1285.7 139 1288.7 126.75 1288.7 112.5V110.75C1287.95 84 1274.2 66 1249.95 66C1236.95 66 1227.2 70.5 1220.45 79.75C1213.95 88.75 1210.7 100 1210.7 113.25C1210.7 127.5 1213.7 139.25 1219.95 149C1226.2 158.5 1235.95 163.25 1249.45 163.25Z" fill="currentColor"></path><path className="path-6" d="M1351.75 0.5V26.5H1328.75V0.5H1351.75ZM1329 179V49.75H1351.5V179H1329Z" fill="currentColor"></path></svg>
              </span>
              {/* Texte page projet */}
              <span ref={logoTextRef}
                className="text-[22px] font-lausanne font-medium text-white whitespace-nowrap"
                style={{ position: 'absolute', top: 0, left: 0, height: '100%', display: 'flex', alignItems: 'center', gap: '0.45em' }}>
                <span style={{ overflow: 'hidden', display: 'flex' }}>
                  <span className="logo-word block">3D,</span>
                </span>
                <span style={{ overflow: 'hidden', display: 'flex' }}>
                  <span className="logo-word block">Motion,</span>
                </span>
                <span style={{ overflow: 'hidden', display: 'flex' }}>
                  <span className="logo-word block">Art direction</span>
                </span>
              </span>
            </button>
          </div>

          {/* Liens centre — desktop */}
          <div className="hidden md:flex items-center justify-center gap-[11px] lg:gap-[15px] text-[22px] font-lausanne flex-shrink-0 pointer-events-auto">
            <button onClick={() => handleNav('/')}           className={linkClass('/')}>Works</button>
            <button onClick={() => handleNav('/about')}      className={linkClass('/about')}>About</button>
            <button onClick={() => handleNav('/playground')} className={linkClass('/playground')}>Playground</button>
          </div>

          {/* Email — droite desktop */}
          <div className="hidden md:flex items-center justify-end ml-auto flex-1 pointer-events-none">
            <a
              href="mailto:f.bouadi@gmail.com"
              style={{ textDecoration: 'none' }}
              className={cn(
                'pointer-events-auto relative py-1 text-[22px] font-lausanne font-medium no-underline',
                'text-white transition-colors duration-500 ease-out hover:text-white/40',
                'after:content-[""] after:absolute after:w-full after:h-px after:bottom-0 after:left-0',
                'after:bg-current after:scale-x-100'
              )}
            >
              Send me a message
            </a>
          </div>

          {/* Menu mobile — bouton */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className={cn(
              'pointer-events-auto md:hidden ml-auto bg-transparent border-0 outline-none cursor-pointer',
              'text-[18px] font-sans font-medium tracking-tight h-[44px] flex items-center px-4', // added h-44px and px-4
              'transition-opacity duration-300',
              isOpen ? 'opacity-0 invisible' : 'opacity-100 visible text-white/40 hover:text-white'
            )}
          >
            Menu
          </button>
        </div>
      </nav>

      {/* ── Menu mobile fullscreen ── */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-[#1A1A1A] text-[#F4F4F0] flex flex-col justify-center pointer-events-auto invisible"
        style={{ zIndex: 1001, transform: 'translateY(-100%)' }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-0 md:top-8 md:right-8 bg-transparent border-0 outline-none cursor-pointer text-[18px] font-sans font-medium tracking-tight text-[#F4F4F0] h-[44px] flex items-center px-4"
        >
          Close
        </button>

        <div className="px-4 md:px-6 lg:px-8 xl:px-12 pb-14">
          <nav className="flex flex-col gap-0">
            {([
              { label: 'Works',      to: '/'           },
              { label: 'About',      to: '/about'       },
              { label: 'Playground', to: '/playground'  },
            ] as const).map(({ label, to }, i) => (
              <div key={to} ref={el => { linksRef.current[i] = el; }}>
                <button
                  onClick={() => handleNav(to)}
                  className={cn(
                    'block bg-transparent border-0 cursor-pointer text-left w-full',
                    'text-[13vw] leading-[0.9] font-sans font-medium tracking-tighter uppercase',
                    'transition-colors duration-300',
                    location.pathname === to
                      ? 'text-[#F4F4F0] italic'
                      : 'text-[#F4F4F0]/30 hover:text-[#F4F4F0]'
                  )}
                >
                  {label}
                </button>
              </div>
            ))}
          </nav>

          <div ref={contactRef} className="mt-14 pt-6 border-t border-[#F4F4F0]/10 flex justify-between items-end">
            <a
              href="mailto:f.bouadi@gmail.com"
              style={{ textDecoration: 'none' }}
              className="text-[15px] font-sans font-medium text-[#F4F4F0]/50 hover:text-[#F4F4F0] transition-colors duration-300"
            >
              f.bouadi@gmail.com
            </a>
            <span className="text-[12px] font-lausanne text-[#F4F4F0]/30 uppercase tracking-widest">Paris, FR</span>
          </div>

          <div className="mt-10 w-full overflow-hidden">
            <svg className="w-full h-auto text-current" fill="none" viewBox="0 0 1352 182" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="M43.25 49.75H68V68H43.5V179H21.5V68H0V49.75H21.5V25.25C21.5 11 32.5 0.5 49.75 0.5H66.5V19.25H53.75C46.75 19.25 43.25 22.25 43.25 28.5V49.75Z" fill="currentColor"></path><path d="M186.078 92.25V161.5C186.078 168.75 186.828 174.5 188.078 179H165.578C164.828 174.5 164.578 165 164.578 150.25H164.328C160.328 171 143.828 182 119.078 182C79.5781 182 72.0781 161.25 72.0781 144.75C72.0781 128.5 80.5781 117 93.5781 112C100.328 109.5 106.578 107.75 112.828 106.5C119.078 105.25 125.578 104.25 132.578 103.5C139.828 102.75 144.578 102 146.828 101.25C161.578 97 163.578 93.75 163.578 84C163.578 72 152.578 65.25 133.328 65.25C120.328 65.25 111.578 69 107.828 75.25C104.578 81.25 104.328 83 103.578 87.75H81.0781C82.0781 79.5 83.5781 73.5 85.8281 69.25C93.5781 54.25 109.328 46.75 132.828 46.75C151.578 46.75 165.828 52.25 172.828 58.5C176.578 61.75 179.328 65.5 181.328 70.25C185.578 79.25 186.078 85 186.078 92.25ZM163.578 119V98.25C161.328 109.5 151.578 113.75 127.828 118.5C104.828 122.75 95.3281 128.25 95.3281 144.25C95.3281 156.25 105.328 164.5 121.578 164.5C149.328 164.5 163.578 151.75 163.578 119Z" fill="currentColor"></path><path d="M268.338 46.75C287.338 46.75 301.838 53.25 311.838 66.25C322.088 79 327.088 95.25 327.088 114.75C327.088 134 322.088 150.25 311.838 163C301.588 175.75 287.088 182 268.088 182C248.338 182 234.588 172.75 226.338 154.25H225.838V179H204.088V0.5H226.838L226.338 75.5H227.088C231.838 56.75 249.088 46.75 268.338 46.75ZM265.338 163.25C278.838 163.25 288.588 158.5 294.838 149C301.088 139.25 304.088 127.5 304.088 113.25C304.088 100 300.838 88.75 294.088 79.75C287.588 70.5 277.838 66 264.838 66C240.588 66 226.838 84.25 226.088 111V112.5C226.088 126.75 229.088 139 235.088 148.75C241.338 158.5 251.338 163.25 265.338 163.25Z" fill="currentColor"></path><path d="M362.619 0.5V26.5H339.619V0.5H362.619ZM339.869 179V49.75H362.369V179H339.869Z" fill="currentColor"></path><path d="M439.098 46.75C485.848 46.75 500.848 89.5 499.348 121H397.098C399.348 149.25 413.598 163.25 439.848 163.25C458.098 163.25 471.348 154.75 475.098 138H497.098C491.348 166.25 469.848 182 439.848 182C398.848 182 375.848 155 374.598 114C374.598 94.75 380.848 78.75 393.098 66C405.348 53.25 420.848 46.75 439.098 46.75ZM397.848 102H476.598C475.348 81 460.348 65.25 439.098 65.25C418.098 65.25 401.848 80 397.848 102Z" fill="currentColor"></path><path d="M574.996 46.75C607.746 46.75 624.246 65 624.246 94V179H601.746V96.25C601.746 73.5 590.996 65.5 571.996 65.5C546.746 65.5 533.746 78.25 533.746 110.5V179H511.246V49.75H532.496V77.75H532.996C538.996 57 554.996 46.75 574.996 46.75Z" fill="currentColor"></path><path d="M734.48 46.75C753.48 46.75 767.98 53.25 777.98 66.25C788.23 79 793.23 95.25 793.23 114.75C793.23 134 788.23 150.25 777.98 163C767.73 175.75 753.23 182 734.23 182C714.48 182 700.73 172.75 692.48 154.25H691.98V179H670.23V0.5H692.98L692.48 75.5H693.23C697.98 56.75 715.23 46.75 734.48 46.75ZM731.48 163.25C744.98 163.25 754.73 158.5 760.98 149C767.23 139.25 770.23 127.5 770.23 113.25C770.23 100 766.98 88.75 760.23 79.75C753.73 70.5 743.98 66 730.98 66C706.73 66 692.98 84.25 692.23 111V112.5C692.23 126.75 695.23 139 701.23 148.75C707.48 158.5 717.48 163.25 731.48 163.25Z" fill="currentColor"></path><path d="M797.762 114.5C797.762 94.75 803.512 78.75 814.762 66C826.012 53.25 841.762 46.75 861.512 46.75C881.262 46.75 897.012 53.25 908.262 66C919.512 78.75 925.262 94.75 925.262 114.5C925.262 134 919.512 150.25 908.262 163C897.012 175.75 881.262 182 861.512 182C841.762 182 826.012 175.75 814.762 163C803.512 150.25 797.762 134 797.762 114.5ZM902.762 114.5C902.762 99.25 898.762 87.25 890.762 78.5C883.012 69.75 873.262 65.25 861.512 65.25C849.762 65.25 840.012 69.75 832.012 78.5C824.262 87.25 820.262 99.25 820.262 114.5C820.262 129.5 824.262 141.5 832.012 150.25C840.012 159 849.762 163.25 861.512 163.25C873.262 163.25 883.012 159 890.762 150.25C898.762 141.5 902.762 129.5 902.762 114.5Z" fill="currentColor"></path><path d="M1028.8 118.25V49.75H1051.3V179H1030.05V151H1029.55C1023.55 171.75 1007.55 182 987.555 182C954.805 182 938.305 163.75 938.305 134.75V49.75H960.805V132.5C960.805 155.25 971.555 163.25 990.555 163.25C1015.8 163.25 1028.8 150.5 1028.8 118.25Z" fill="currentColor"></path><path d="M1176.19 92.25V161.5C1176.19 168.75 1176.94 174.5 1178.19 179H1155.69C1154.94 174.5 1154.69 165 1154.69 150.25H1154.44C1150.44 171 1133.94 182 1109.19 182C1069.69 182 1062.19 161.25 1062.19 144.75C1062.19 128.5 1070.69 117 1083.69 112C1090.44 109.5 1096.69 107.75 1102.94 106.5C1109.19 105.25 1115.69 104.25 1122.69 103.5C1129.94 102.75 1134.69 102 1136.94 101.25C1151.69 97 1153.69 93.75 1153.69 84C1153.69 72 1142.69 65.25 1123.44 65.25C1110.44 65.25 1101.69 69 1097.94 75.25C1094.69 81.25 1094.44 83 1093.69 87.75H1071.19C1072.19 79.5 1073.69 73.5 1075.94 69.25C1083.69 54.25 1099.44 46.75 1122.94 46.75C1141.69 46.75 1155.94 52.25 1162.94 58.5C1166.69 61.75 1169.44 65.5 1171.44 70.25C1175.69 79.25 1176.19 85 1176.19 92.25ZM1153.69 119V98.25C1151.44 109.5 1141.69 113.75 1117.94 118.5C1094.94 122.75 1085.44 128.25 1085.44 144.25C1085.44 156.25 1095.44 164.5 1111.69 164.5C1139.44 164.5 1153.69 151.75 1153.69 119Z" fill="currentColor"></path><path d="M1288.7 75.5L1288.2 0.5H1310.7V179H1288.95V154.25H1288.45C1280.2 172.75 1266.45 182 1246.7 182C1227.7 182 1213.2 175.75 1202.95 163C1192.7 150.25 1187.7 134 1187.7 114.75C1187.7 95.25 1192.7 79 1202.7 66.25C1212.95 53.25 1227.45 46.75 1246.45 46.75C1265.7 46.75 1282.95 56.75 1287.7 75.5H1288.7ZM1249.45 163.25C1263.45 163.25 1273.45 158.5 1279.45 148.75C1285.7 139 1288.7 126.75 1288.7 112.5V110.75C1287.95 84 1274.2 66 1249.95 66C1236.95 66 1227.2 70.5 1220.45 79.75C1213.95 88.75 1210.7 100 1210.7 113.25C1210.7 127.5 1213.7 139.25 1219.95 149C1226.2 158.5 1235.95 163.25 1249.45 163.25Z" fill="currentColor"></path><path className="path-6" d="M1351.75 0.5V26.5H1328.75V0.5H1351.75ZM1329 179V49.75H1351.5V179H1329Z" fill="currentColor"></path></svg>
          </div>
        </div>
      </div>
    </>
  );
}
