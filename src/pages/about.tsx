import React, { useMemo } from 'react';
import Layout from '../components/functional/Layout';
import Experience from '../components/logical/Experience';
import { useLanguage } from '../context/LanguageContext';

const AboutPage: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const meta = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Sobre Mí - Ariel Lobos Haoa',
            description: 'Conoce la trayectoria profesional y experiencia de Ariel Lobos Haoa.',
          }
        : {
            title: 'About Me - Ariel Lobos Haoa',
            description: 'Discover the professional background and experience of Ariel Lobos Haoa.',
          },
    [isSpanish]
  );

  return (
    <Layout title={meta.title} description={meta.description} canonicalUrl="/about">
      <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
        <main className="flex-1 p-8">
          <Experience />
        </main>
      </div>
    </Layout>
  );
};

export default AboutPage;
