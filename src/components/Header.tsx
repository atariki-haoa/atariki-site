import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaHome, FaUser, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-gray-100 p-4">
      <nav className="flex justify-center space-x-4">
        <Link href="/" className="menu-item" aria-label="Inicio">
          <FaHome className="text-2xl" />
        </Link>
        <Link href="/about" className="menu-item" aria-label="Sobre mí">
          <FaUser className="text-2xl" />
        </Link>
        <Link href="/projects" className="menu-item" aria-label="Proyectos">
          <FaProjectDiagram className="text-2xl" />
        </Link>
        <Link href="/contact" className="menu-item" aria-label="Contacto">
          <FaEnvelope className="text-2xl" />
        </Link>
        <a href="https://github.com/atariki-haoa" className="menu-item" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub className="text-2xl" />
        </a>
        <a href="https://www.linkedin.com/in/arieloboshaoa/" className="menu-item" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="text-2xl" />
        </a>
      </nav>
    </header>
  );
};

export default Header;