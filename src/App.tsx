// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home       from './pages/Home';
import About      from './pages/About';
import Project    from './pages/Project';
import Playground from './pages/Playground';
import Intro      from './pages/Intro';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  const location = useLocation();

  if (location.pathname === '/intro') {
    return <Intro />;
  }

  return (
    <HelmetProvider>
      <Layout>
      {/* key={location.pathname} nécessaire pour que PageTransition se relance
          à chaque navigation, y compris projet → projet (même route, id différent) */}
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<Home />} />
        <Route path="/about"       element={<About />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/playground"  element={<Playground />} />
      </Routes>
    </Layout>
    </HelmetProvider>
  );
}
