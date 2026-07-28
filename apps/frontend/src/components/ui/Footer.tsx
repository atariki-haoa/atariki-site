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
    <footer className="border-t border-term-border text-center py-6 px-4 text-term-dim text-[13px]">
      <p>{text}</p>
    </footer>
  );
};

export default Footer;
