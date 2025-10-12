import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaHome, FaUser, FaProjectDiagram, FaEnvelope, FaCalculator, FaFileInvoiceDollar, FaDollarSign, FaChartLine } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-gray-100 p-4">
      <nav className="flex justify-center space-x-4">
        <Link href="/" className="menu-item" aria-label="Inicio" title="Inicio">
          <FaHome className="text-2xl" />
        </Link>
        <Link href="/about" className="menu-item" aria-label="Sobre mí" title="Sobre mí">
          <FaUser className="text-2xl" />
        </Link>
        <Link href="/projects" className="menu-item" aria-label="Proyectos" title="Proyectos">
          <FaProjectDiagram className="text-2xl" />
        </Link>
        <Link href="/calculator" className="menu-item" aria-label="Cotizador" title="Cotizador">
          <FaCalculator className="text-2xl" />
        </Link>
        <Link href="/contact" className="menu-item" aria-label="Contacto" title="Contacto">
          <FaEnvelope className="text-2xl" />
        </Link>
        <Link href="https://github.com/atariki-haoa" className="menu-item" target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-tip="GitHub">
          <FaGithub className="text-2xl" />
        </Link>
        <Link href="https://www.linkedin.com/in/arieloboshaoa/" className="menu-item" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
          <FaLinkedin className="text-2xl" />
        </Link>
      </nav>
      <ReactTooltip />
    </header>
  );
};

export default Header;