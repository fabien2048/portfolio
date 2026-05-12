// src/pages/SecretMenu.tsx
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function SecretMenu() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F4F0] text-[#1A1A1A] font-lausanne px-4 py-32 flex flex-col items-center">
        <h1 className="text-4xl font-medium uppercase mb-12">Menu Secret SEO</h1>
        <ul className="space-y-6 text-xl text-center">
          <li>
            <Link to="/motion-design-3d" className="hover:opacity-50 transition-opacity">
              Motion Design 3D
            </Link>
          </li>
          <li>
            <Link to="/direction-artistique" className="hover:opacity-50 transition-opacity">
              Direction Artistique
            </Link>
          </li>
          <li>
            <Link to="/moodtapes" className="hover:opacity-50 transition-opacity">
              Création de Moodtapes
            </Link>
          </li>
          <li>
            <Link to="/luxe-beaute-cosmetiques" className="hover:opacity-50 transition-opacity">
              Luxe, Beauté & Cosmétiques
            </Link>
          </li>
          <li>
            <Link to="/guide/freelance-motion-designer-2026" className="hover:opacity-50 transition-opacity">
              Guide Freelance 2026
            </Link>
          </li>
          <li className="pt-8">
            <Link to="/motion-designer-freelance-paris" className="hover:opacity-50 transition-opacity text-sm opacity-50">
              Expertise (Page existante)
            </Link>
          </li>
        </ul>
      </div>
    </PageTransition>
  );
}
