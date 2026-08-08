import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaEnvelope,
  FaCalculator,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const { locale, toggleLocale, availableLocales } = useLanguage();
  const router = useRouter();
  const isSpanish = locale === 'es';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  const labels = isSpanish
    ? {
        home: 'Inicio',
        about: 'Sobre mí',
        projects: 'Proyectos',
        calculator: 'Cotizador',
        contact: 'Contacto',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        language: 'Cambiar idioma',
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú',
      }
    : {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        calculator: 'Quote',
        contact: 'Contact',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        language: 'Switch language',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      };

  const navItems = [
    { href: '/', label: labels.home, Icon: FaHome },
    { href: '/about', label: labels.about, Icon: FaUser },
    { href: '/projects', label: labels.projects, Icon: FaProjectDiagram },
    { href: '/calculator', label: labels.calculator, Icon: FaCalculator },
    { href: '/contact', label: labels.contact, Icon: FaEnvelope },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d0f15dd] backdrop-blur-md border-b border-term-border">
      <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center text-term-text text-[15px] font-semibold tracking-tight"
        >
          ariel<span className="text-term-green">@</span>atariki
          <span className="text-term-dim">:~$</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 flex-wrap">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-200 ${
                  isActive ? 'bg-[#1a1d26] text-term-text' : 'text-term-muted hover:text-term-text'
                }`}
              >
                <Icon className="text-base" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/atariki-haoa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.github}
            title={labels.github}
            className="w-8 h-8 rounded-lg border border-term-border flex items-center justify-center text-[10px] font-bold text-term-sub"
          >
            GH
          </Link>
          <Link
            href="https://www.linkedin.com/in/arieloboshaoa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.linkedin}
            title={labels.linkedin}
            className="w-8 h-8 rounded-lg border border-term-border flex items-center justify-center text-[10px] font-bold text-term-sub"
          >
            in
          </Link>
          {availableLocales.length > 1 && (
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={labels.language}
              title={labels.language}
              className="w-8 h-8 rounded-lg border border-term-border bg-transparent flex items-center justify-center text-[11px] font-bold text-term-sub"
            >
              {isSpanish ? 'EN' : 'ES'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? labels.closeMenu : labels.openMenu}
            aria-expanded={isMenuOpen}
            className="md:hidden w-8 h-8 rounded-lg border border-term-border bg-transparent flex items-center justify-center text-term-sub"
          >
            {isMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden border-t border-term-border px-6 py-2 flex flex-col">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2.5 px-2 py-3 rounded-lg text-[13px] transition-colors duration-200 ${
                  isActive ? 'bg-[#1a1d26] text-term-text' : 'text-term-muted hover:text-term-text'
                }`}
              >
                <Icon className="text-base" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;
