import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaEnvelope,
  FaCalculator,
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const { locale, toggleLocale, availableLocales } = useLanguage();
  const router = useRouter();
  const isSpanish = locale === 'es';

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

        <nav className="flex items-center gap-0.5 flex-wrap">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
