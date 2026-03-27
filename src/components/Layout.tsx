import React from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  Trophy, 
  Info, 
  User, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { path: '/', icon: Compass, label: 'Inicio' },
  { path: '/info', icon: Info, label: 'Guía' },
  { path: '/map', icon: MapIcon, label: 'Mapa' },
  { path: '/leaderboard', icon: Trophy, label: 'Ranking' },
  { path: '/profile', icon: User, label: 'Perfil' },
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#1A1A1A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-[#5A5A40] rounded-lg group-hover:rotate-12 transition-transform">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif italic text-lg leading-none">Búsqueda de Tesoros</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">IES Lucía de Medrano</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#5A5A40]",
                    location.pathname === item.path ? "text-[#5A5A40]" : "text-[#1A1A1A]/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-20"
          >
            <nav className="flex flex-col items-center gap-8 p-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-2xl font-serif italic transition-colors",
                    location.pathname === item.path ? "text-[#5A5A40]" : "text-[#1A1A1A]/40"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#1A1A1A]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#5A5A40]" />
              <span className="font-serif italic">Educación Física</span>
            </div>
            <p className="text-sm text-[#1A1A1A]/60">
              Diseñado por José Carlos Tejedor Lorenzo
            </p>
          </div>
          <div className="flex gap-6 text-xs uppercase tracking-widest font-semibold opacity-40">
            <span>IES Lucía de Medrano</span>
            <span>Salamanca</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
