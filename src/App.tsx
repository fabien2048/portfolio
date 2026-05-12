import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import gsap from 'gsap';
import Layout from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Project = lazy(() => import('./pages/Project'));
const Playground = lazy(() => import('./pages/Playground'));
import Intro from './pages/Intro';
const Sona  = lazy(() => import('./pages/Sona'));
const MotionDesignerFreelance = lazy(() => import('./pages/MotionDesignerFreelance'));
const BlogMotionLuxe = lazy(() => import('./pages/BlogMotionLuxe'));
const SecretMenu = lazy(() => import('./pages/SecretMenu'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { SeoMotion3D, SeoDirectionArtistique, SeoMoodtapes, SeoLuxeBeaute } from './pages/SeoPages';
import { BlogMarquesLuxe, GuideCosmetiques, ArticleMoodtape, BlogMotionVsAnimation, BlogDirectionArtistique, GuideFreelance2026 } from './pages/BlogArticles';
import { HelmetProvider, Helmet } from 'react-helmet-async';

export default function App() {
  const location = useLocation();
  const navType = useNavigationType();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [showIntro, setShowIntro] = useState(false);
  const [introKey, setIntroKey] = useState(0);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Fabien Bouadi",
    "url": "https://www.fabienbouadi.com",
    "jobTitle": "Directeur Artistique & Motion Designer Luxe",
    "description": "Directeur Artistique et Motion Designer 3D basé à Paris, expert en artisanat numérique pour le secteur du luxe.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Paris",
      "addressCountry": "FR"
    },
    "sameAs": [
      "https://www.linkedin.com/in/fabienbouadi",
      "https://www.instagram.com/fabienbouadi",
      "https://www.behance.net/fabienbouadi"
    ],
    "knowsAbout": ["Motion Design", "3D Animation", "Art Direction", "Luxury Branding", "Cosmetics Advertising"]
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Fabien Bouadi | Studio Motion Design Luxe Paris",
    "image": "https://www.fabienbouadi.com/images/hero-poster.jpg",
    "url": "https://www.fabienbouadi.com",
    "telephone": "+33000000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Quartier du Luxe",
      "addressLocality": "Paris",
      "postalCode": "75008",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.8708,
      "longitude": 2.3056
    },
    "description": "Expert Motion Designer Freelance à Paris. Spécialisé dans la création de contenus 3D et vidéos exclusifs pour les marques de Luxe, Cosmétiques et Haute Horlogerie. Direction Artistique haut de gamme.",
    "priceRange": "€€€",
    "areaServed": "Paris, France, Worldwide",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    }
  };

  useEffect(() => {
    const TEN_MINUTES = 10 * 60 * 1000;
    const lastPlayed = localStorage.getItem('oddRitualIntroLastPlayed');
    const now = Date.now();

    if (!lastPlayed || (now - parseInt(lastPlayed, 10)) >= TEN_MINUTES) {
      setShowIntro(true);
    }
  }, []);

  // Synchronisation des boutons Précédent/Suivant du navigateur (V62)
  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    if (navType === 'POP') {
      // Si c'est un bouton navigateur, on force la transition de sortie Alpha
      const container = document.getElementById('page-transition-container');
      const lenis = (window as any).__lenis;
      
      if (container) {
        if (lenis) lenis.stop();
        
        // Figer le conteneur visuellement pour absorber tout saut natif de Safari/Chrome
        const currentScrollY = window.scrollY;
        const bodyHeight = document.body.scrollHeight;
        
        document.body.style.minHeight = `${bodyHeight}px`;
        container.style.position = 'fixed';
        container.style.top = `-${currentScrollY}px`;
        container.style.left = '0';
        container.style.width = '100%';
        container.style.zIndex = '10';

        gsap.to(container, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            container.style.position = '';
            container.style.top = '';
            container.style.left = '';
            container.style.width = '';
            container.style.zIndex = '';
            document.body.style.minHeight = '';
            
            setDisplayLocation(location);
            if (lenis) lenis.start();
            // On retire window.scrollTo(0,0) ici pour laisser le navigateur ou la page gérer son scroll restoration
          }
        });
      } else {
        setDisplayLocation(location);
        if (lenis) lenis.start();
      }
    } else {
      setDisplayLocation(location);
    }
  }, [location, navType, displayLocation.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        localStorage.removeItem('oddRitualIntroLastPlayed');
        localStorage.removeItem('lastSeenHeroReveal');
        setIntroKey(prev => prev + 1);
        setShowIntro(true);
        window.dispatchEvent(new Event('intro-reset'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    window.dispatchEvent(new Event('intro-finished'));
  };

  return (
    <HelmetProvider>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(businessSchema)}
        </script>
      </Helmet>
      {showIntro && <Intro key={introKey} onComplete={handleIntroComplete} />}
      <Layout>
      {/* Utilisation de displayLocation pour différer le rendu des Routes lors d'un POP */}
        <Suspense fallback={null}>
          <Routes location={displayLocation} key={displayLocation.pathname}>
            <Route path="/"            element={<Home />} />
            <Route path="/about"       element={<About />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/playground"  element={<Playground />} />
            <Route path="/sona"        element={<Sona />} />
            <Route path="/motion-designer-freelance-paris" element={<MotionDesignerFreelance />} />
            <Route path="/blog-motion-luxe" element={<BlogMotionLuxe />} />
            
            <Route path="/secret-menu" element={<SecretMenu />} />
            <Route path="/motion-design-3d" element={<SeoMotion3D />} />
            <Route path="/direction-artistique" element={<SeoDirectionArtistique />} />
            <Route path="/moodtapes" element={<SeoMoodtapes />} />
            <Route path="/luxe-beaute-cosmetiques" element={<SeoLuxeBeaute />} />
            
            <Route path="/blog/motion-design-marques-luxe" element={<BlogMarquesLuxe />} />
            <Route path="/guide/animation-3d-cosmetiques" element={<GuideCosmetiques />} />
            <Route path="/article/qu-est-ce-qu-une-moodtape" element={<ArticleMoodtape />} />
            <Route path="/blog/motion-design-vs-animation" element={<BlogMotionVsAnimation />} />
            <Route path="/blog/direction-artistique-video-paris" element={<BlogDirectionArtistique />} />
            <Route path="/guide/freelance-motion-designer-2026" element={<GuideFreelance2026 />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </HelmetProvider>
  );
}
