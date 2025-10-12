import React from 'react';
import Link from 'next/link';
import {
  FaGithub,
  FaLinkedin,
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaEnvelope,
  FaCalculator,
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const { locale, toggleLocale } = useLanguage();
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
        language: 'Idioma',
      }
    : {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        calculator: 'Estimator',
        contact: 'Contact',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        language: 'Language',
      };

  return (
    <header className="bg-gray-800 text-gray-100 p-4">
      <nav className="flex justify-center space-x-4">
        <Link href="/" className="menu-item" aria-label={labels.home} title={labels.home}>
          <FaHome className="text-2xl" />
        </Link>
        <Link href="/about" className="menu-item" aria-label={labels.about} title={labels.about}>
          <FaUser className="text-2xl" />
        </Link>
        <Link
          href="/projects"
          className="menu-item"
          aria-label={labels.projects}
          title={labels.projects}
        >
          <FaProjectDiagram className="text-2xl" />
        </Link>
        <Link
          href="/calculator"
          className="menu-item"
          aria-label={labels.calculator}
          title={labels.calculator}
        >
          <FaCalculator className="text-2xl" />
        </Link>
        <Link
          href="/contact"
          className="menu-item"
          aria-label={labels.contact}
          title={labels.contact}
        >
          <FaEnvelope className="text-2xl" />
        </Link>
        <Link
          href="https://github.com/atariki-haoa"
          className="menu-item"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.github}
          title={labels.github}
        >
          <FaGithub className="text-2xl" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/arieloboshaoa/"
          className="menu-item"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.linkedin}
          title={labels.linkedin}
        >
          <FaLinkedin className="text-2xl" />
        </Link>
        <button
          type="button"
          onClick={toggleLocale}
          className="menu-item text-sm font-semibold px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={labels.language}
          title={labels.language}
        >
          {isSpanish ? 'EN' : 'ES'}
        </button>
      </nav>
    </header>
  );
};

export default Header;
