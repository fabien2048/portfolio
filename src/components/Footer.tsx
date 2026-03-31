// src/components/Footer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigateWithMask } from '../hooks/useNavigateWithMask';

const LogoSVG = ({ className }: { className?: string }) => (
  <svg className="w-full h-auto text-current" fill="none" viewBox="0 0 1352 182" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="M43.25 49.75H68V68H43.5V179H21.5V68H0V49.75H21.5V25.25C21.5 11 32.5 0.5 49.75 0.5H66.5V19.25H53.75C46.75 19.25 43.25 22.25 43.25 28.5V49.75Z" fill="currentColor"></path><path d="M186.078 92.25V161.5C186.078 168.75 186.828 174.5 188.078 179H165.578C164.828 174.5 164.578 165 164.578 150.25H164.328C160.328 171 143.828 182 119.078 182C79.5781 182 72.0781 161.25 72.0781 144.75C72.0781 128.5 80.5781 117 93.5781 112C100.328 109.5 106.578 107.75 112.828 106.5C119.078 105.25 125.578 104.25 132.578 103.5C139.828 102.75 144.578 102 146.828 101.25C161.578 97 163.578 93.75 163.578 84C163.578 72 152.578 65.25 133.328 65.25C120.328 65.25 111.578 69 107.828 75.25C104.578 81.25 104.328 83 103.578 87.75H81.0781C82.0781 79.5 83.5781 73.5 85.8281 69.25C93.5781 54.25 109.328 46.75 132.828 46.75C151.578 46.75 165.828 52.25 172.828 58.5C176.578 61.75 179.328 65.5 181.328 70.25C185.578 79.25 186.078 85 186.078 92.25ZM163.578 119V98.25C161.328 109.5 151.578 113.75 127.828 118.5C104.828 122.75 95.3281 128.25 95.3281 144.25C95.3281 156.25 105.328 164.5 121.578 164.5C149.328 164.5 163.578 151.75 163.578 119Z" fill="currentColor"></path><path d="M268.338 46.75C287.338 46.75 301.838 53.25 311.838 66.25C322.088 79 327.088 95.25 327.088 114.75C327.088 134 322.088 150.25 311.838 163C301.588 175.75 287.088 182 268.088 182C248.338 182 234.588 172.75 226.338 154.25H225.838V179H204.088V0.5H226.838L226.338 75.5H227.088C231.838 56.75 249.088 46.75 268.338 46.75ZM265.338 163.25C278.838 163.25 288.588 158.5 294.838 149C301.088 139.25 304.088 127.5 304.088 113.25C304.088 100 300.838 88.75 294.088 79.75C287.588 70.5 277.838 66 264.838 66C240.588 66 226.838 84.25 226.088 111V112.5C226.088 126.75 229.088 139 235.088 148.75C241.338 158.5 251.338 163.25 265.338 163.25Z" fill="currentColor"></path><path d="M362.619 0.5V26.5H339.619V0.5H362.619ZM339.869 179V49.75H362.369V179H339.869Z" fill="currentColor"></path><path d="M439.098 46.75C485.848 46.75 500.848 89.5 499.348 121H397.098C399.348 149.25 413.598 163.25 439.848 163.25C458.098 163.25 471.348 154.75 475.098 138H497.098C491.348 166.25 469.848 182 439.848 182C398.848 182 375.848 155 374.598 114C374.598 94.75 380.848 78.75 393.098 66C405.348 53.25 420.848 46.75 439.098 46.75ZM397.848 102H476.598C475.348 81 460.348 65.25 439.098 65.25C418.098 65.25 401.848 80 397.848 102Z" fill="currentColor"></path><path d="M574.996 46.75C607.746 46.75 624.246 65 624.246 94V179H601.746V96.25C601.746 73.5 590.996 65.5 571.996 65.5C546.746 65.5 533.746 78.25 533.746 110.5V179H511.246V49.75H532.496V77.75H532.996C538.996 57 554.996 46.75 574.996 46.75Z" fill="currentColor"></path><path d="M734.48 46.75C753.48 46.75 767.98 53.25 777.98 66.25C788.23 79 793.23 95.25 793.23 114.75C793.23 134 788.23 150.25 777.98 163C767.73 175.75 753.23 182 734.23 182C714.48 182 700.73 172.75 692.48 154.25H691.98V179H670.23V0.5H692.98L692.48 75.5H693.23C697.98 56.75 715.23 46.75 734.48 46.75ZM731.48 163.25C744.98 163.25 754.73 158.5 760.98 149C767.23 139.25 770.23 127.5 770.23 113.25C770.23 100 766.98 88.75 760.23 79.75C753.73 70.5 743.98 66 730.98 66C706.73 66 692.98 84.25 692.23 111V112.5C692.23 126.75 695.23 139 701.23 148.75C707.48 158.5 717.48 163.25 731.48 163.25Z" fill="currentColor"></path><path d="M797.762 114.5C797.762 94.75 803.512 78.75 814.762 66C826.012 53.25 841.762 46.75 861.512 46.75C881.262 46.75 897.012 53.25 908.262 66C919.512 78.75 925.262 94.75 925.262 114.5C925.262 134 919.512 150.25 908.262 163C897.012 175.75 881.262 182 861.512 182C841.762 182 826.012 175.75 814.762 163C803.512 150.25 797.762 134 797.762 114.5ZM902.762 114.5C902.762 99.25 898.762 87.25 890.762 78.5C883.012 69.75 873.262 65.25 861.512 65.25C849.762 65.25 840.012 69.75 832.012 78.5C824.262 87.25 820.262 99.25 820.262 114.5C820.262 129.5 824.262 141.5 832.012 150.25C840.012 159 849.762 163.25 861.512 163.25C873.262 163.25 883.012 159 890.762 150.25C898.762 141.5 902.762 129.5 902.762 114.5Z" fill="currentColor"></path><path d="M1028.8 118.25V49.75H1051.3V179H1030.05V151H1029.55C1023.55 171.75 1007.55 182 987.555 182C954.805 182 938.305 163.75 938.305 134.75V49.75H960.805V132.5C960.805 155.25 971.555 163.25 990.555 163.25C1015.8 163.25 1028.8 150.5 1028.8 118.25Z" fill="currentColor"></path><path d="M1176.19 92.25V161.5C1176.19 168.75 1176.94 174.5 1178.19 179H1155.69C1154.94 174.5 1154.69 165 1154.69 150.25H1154.44C1150.44 171 1133.94 182 1109.19 182C1069.69 182 1062.19 161.25 1062.19 144.75C1062.19 128.5 1070.69 117 1083.69 112C1090.44 109.5 1096.69 107.75 1102.94 106.5C1109.19 105.25 1115.69 104.25 1122.69 103.5C1129.94 102.75 1134.69 102 1136.94 101.25C1151.69 97 1153.69 93.75 1153.69 84C1153.69 72 1142.69 65.25 1123.44 65.25C1110.44 65.25 1101.69 69 1097.94 75.25C1094.69 81.25 1094.44 83 1093.69 87.75H1071.19C1072.19 79.5 1073.69 73.5 1075.94 69.25C1083.69 54.25 1099.44 46.75 1122.94 46.75C1141.69 46.75 1155.94 52.25 1162.94 58.5C1166.69 61.75 1169.44 65.5 1171.44 70.25C1175.69 79.25 1176.19 85 1176.19 92.25ZM1153.69 119V98.25C1151.44 109.5 1141.69 113.75 1117.94 118.5C1094.94 122.75 1085.44 128.25 1085.44 144.25C1085.44 156.25 1095.44 164.5 1111.69 164.5C1139.44 164.5 1153.69 151.75 1153.69 119Z" fill="currentColor"></path><path d="M1288.7 75.5L1288.2 0.5H1310.7V179H1288.95V154.25H1288.45C1280.2 172.75 1266.45 182 1246.7 182C1227.7 182 1213.2 175.75 1202.95 163C1192.7 150.25 1187.7 134 1187.7 114.75C1187.7 95.25 1192.7 79 1202.7 66.25C1212.95 53.25 1227.45 46.75 1246.45 46.75C1265.7 46.75 1282.95 56.75 1287.7 75.5H1288.7ZM1249.45 163.25C1263.45 163.25 1273.45 158.5 1279.45 148.75C1285.7 139 1288.7 126.75 1288.7 112.5V110.75C1287.95 84 1274.2 66 1249.95 66C1236.95 66 1227.2 70.5 1220.45 79.75C1213.95 88.75 1210.7 100 1210.7 113.25C1210.7 127.5 1213.7 139.25 1219.95 149C1226.2 158.5 1235.95 163.25 1249.45 163.25Z" fill="currentColor"></path><path className="path-6" d="M1351.75 0.5V26.5H1328.75V0.5H1351.75ZM1329 179V49.75H1351.5V179H1329Z" fill="currentColor"></path></svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'' | 'submitting' | 'success'>('');
  const go = useNavigateWithMask();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/f/xzdjadzq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), 6000);
      } else {
        setStatus('');
        alert('Erreur, réessayez.');
      }
    } catch {
      setStatus('');
      alert('Erreur réseau.');
    }
  };

  useEffect(() => {
    const updateClock = () => {
      const parisTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(parisTime);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Desktop Footer ── */}
      <footer className="hidden md:block relative z-30 bg-[#F4F4F0] text-[#1A1A1A] pt-12 lg:pt-20 overflow-hidden">
        <div className="px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-3 items-center text-[19px] font-medium tracking-tight font-sans">
            <div className="flex items-center gap-0 justify-start">
              <span className="whitespace-nowrap">Paris, FR&nbsp;{time}</span>
            </div>
            <div className="text-center whitespace-nowrap">
              Copyright © Fabien Bouadi {currentYear}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:opacity-50 transition-opacity whitespace-nowrap"
              >
                ↑ Back to top
              </button>
            </div>
          </div>

          {/* Logo SVG pleine largeur */}
          <div className="mt-10 lg:mt-16 pb-8 lg:pb-12 w-full">
            <button
              onClick={() => go('/')}
              className="block w-full text-[#1A1A1A] hover:opacity-50 transition-opacity duration-500 bg-transparent border-0 cursor-pointer p-0"
            >
              <LogoSVG className="w-full h-auto fill-current" />
            </button>
          </div>
        </div>
      </footer>

      {/* ── Mobile Footer ── */}
      <footer className="block md:hidden relative z-30 bg-[#1A1A1A] text-[#F4F4F0] pt-12 pb-8 px-2">
        <div className="flex justify-between items-start mb-24">
          <div className="flex flex-col gap-2">
            <button onClick={() => go('/')} className="text-4xl font-sans font-medium tracking-tighter bg-transparent border-0 text-[#F4F4F0] cursor-pointer text-left">Home</button>
            <button onClick={() => go('/')} className="text-4xl font-sans font-medium tracking-tighter bg-transparent border-0 text-[#F4F4F0] cursor-pointer text-left">Work</button>
            <button onClick={() => go('/about')} className="text-4xl font-sans font-medium tracking-tighter bg-transparent border-0 text-[#F4F4F0] cursor-pointer text-left">About</button>
            <button onClick={() => go('/playground')} className="text-4xl font-sans font-medium tracking-tighter bg-transparent border-0 text-[#F4F4F0] cursor-pointer text-left">Playground</button>
            <a href="mailto:f.bouadi@gmail.com" className="text-4xl font-sans font-medium tracking-tighter text-[#F4F4F0]">Contact</a>
          </div>
          <div className="flex flex-col gap-6 text-sm font-sans text-right">
            <div className="flex flex-col gap-1">
              <a href="https://www.instagram.com/fabien_bouadi/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-end gap-1 opacity-80">Instagram ↗</a>
              <a href="https://www.linkedin.com/in/fabienbouadi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-end gap-1 opacity-80">LinkedIn ↗</a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="opacity-40">New Business:</span>
              <a href="mailto:f.bouadi@gmail.com" className="opacity-80">f.bouadi@gmail.com</a>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <span className="opacity-40">©2013—{currentYear}</span>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <p className="text-sm opacity-80 mb-4">Sign up for our newsletter<br />(No spam)</p>
          <form onSubmit={handleSubscribe} className="relative border-b border-[#F4F4F0]/30 pb-4">
            <div className="flex justify-between items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={status === 'submitting'}
                required
                className="bg-transparent border-none outline-none text-[#F4F4F0] placeholder:text-[#F4F4F0]/30 w-full font-sans disabled:opacity-50"
              />
              <button type="submit" disabled={status === 'submitting'} className="text-xl disabled:opacity-50 transition-opacity">
                {status === 'submitting' ? '...' : '→'}
              </button>
            </div>
            {status === 'success' && (
              <span className="text-xs text-[#F4F4F0]/70 absolute -bottom-6 left-0">
                Confirmation sent!
              </span>
            )}
          </form>
        </div>

        {/* Logo SVG mobile */}
        <button
          onClick={() => go('/')}
          className="block w-full text-[#F4F4F0] hover:opacity-50 transition-opacity duration-500 mt-16 bg-transparent border-0 cursor-pointer p-0"
        >
          <LogoSVG className="w-full h-auto fill-current" />
        </button>
      </footer>
    </>
  );
}
