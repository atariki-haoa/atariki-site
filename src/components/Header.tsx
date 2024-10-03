import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaHome, FaUser, FaProjectDiagram, FaEnvelope, FaComments } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-gray-100 p-4">
      <nav className="flex justify-center space-x-4">
        <Link href="/" className="menu-item" aria-label="Inicio" data-tip="Inicio">
          <FaHome className="text-2xl" />
        </Link>
        <Link href="/about" className="menu-item" aria-label="Sobre mí" data-tip="Sobre mí">
          <FaUser className="text-2xl" />
        </Link>
        <Link href="/projects" className="menu-item" aria-label="Proyectos" data-tip="Proyectos">
          <FaProjectDiagram className="text-2xl" />
        </Link>
        <Link href="/contact" className="menu-item" aria-label="Contacto" data-tip="Contacto">
          <FaEnvelope className="text-2xl" />
        </Link>
        <Link href="/chat" className="menu-item" aria-label="Chat" data-tip="Chat">
          <FaComments className="text-2xl" />
        </Link>
        <a href="https://github.com/atariki-haoa" className="menu-item" target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-tip="GitHub">
          <FaGithub className="text-2xl" />
        </a>
        <a href="https://www.linkedin.com/in/arieloboshaoa/" className="menu-item" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-tip="LinkedIn">
          <FaLinkedin className="text-2xl" />
        </a>
      </nav>
      <ReactTooltip place="bottom" type="dark" effect="solid" />
    </header>
  );
};

export default Header;