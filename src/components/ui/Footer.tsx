import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';
  const year = useMemo(() => new Date().getFullYear(), []);

  const text = isSpanish
    ? `© ${year} Ariel Lobos Haoa. Todos los derechos reservados.`
    : `© ${year} Ariel Lobos Haoa. All rights reserved.`;

  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <p>{text}</p>
    </footer>
  );
};

export default Footer;
