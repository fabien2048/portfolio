import { useEffect, useState } from 'react';
import PageTransition from '../components/PageTransition';
import { Helmet } from 'react-helmet-async';
import { SplitText } from '../utils/text';
import { cn } from '../utils/cn';

export default function Sona() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Délai plus long pour attendre la fin de la transition de page
    const timer = setTimeout(() => setIsActive(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <Helmet>
        <title>SONA — Luxury Reveal | Fabien Bouadi</title>
        <meta name="description" content="Film publicitaire et motion design pour Sona. Une approche luxe, 3D et direction artistique par Fabien Bouadi." />
        <meta property="og:title" content="SONA — Luxury Reveal | Fabien Bouadi" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div 
        className="w-full min-h-screen flex items-center justify-center bg-black text-white select-none"
      >
        <h1 
          className={cn(
            "uppercase m-0 leading-none split-title",
            isActive && "is-active"
          )}
          style={{ 
            fontFamily: '"Cormorant Garamond", serif', 
            fontSize: '9rem', 
            letterSpacing: '0.05em',
            fontWeight: 300
          }}
        >
          <SplitText text="SONA" />
        </h1>
      </div>
    </PageTransition>
  );
}
