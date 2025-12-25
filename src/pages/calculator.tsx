import React, { useMemo } from 'react';
import Layout from '../components/functional/Layout';
import QuoteManager from '../components/logical/QuoteManager';
import { useLanguage } from '../context/LanguageContext';

const CalculatorPage: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Cotización de Proyectos - Ariel Lobos Haoa',
            description:
              'Solicita una cotización personalizada para tu proyecto web o móvil. Presupuestos desde $1.000.000 CLP.',
            keywords:
              'cotización, presupuesto, desarrollo web, aplicación móvil, proyecto, Ariel Lobos Haoa',
            heading: 'Cotización de Proyectos',
            subheading:
              'Completa el formulario y recibe una cotización personalizada para tu proyecto. Trabajamos con presupuestos desde $1.000.000 CLP y ofrecemos soluciones web y móviles.',
          }
        : {
            title: 'Project Estimator - Ariel Lobos Haoa',
            description:
              'Request a tailored estimate for your web or mobile project. Engagements start at $1,000,000 CLP.',
            keywords:
              'project estimate, pricing, web development, mobile app, software project, Ariel Lobos Haoa',
            heading: 'Project Estimator',
            subheading:
              'Fill out the form to receive an initial estimate for your project. Engagements start at $1,000,000 CLP and cover web and mobile solutions.',
          },
    [isSpanish]
  );

  return (
    <Layout 
      title={copy.title}
      description={copy.description}
      canonicalUrl="/calculator"
      keywords={copy.keywords}
    >
      <div className="min-h-screen py-12">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gradient-blue mb-6 animate-fadeInDown">
              {copy.heading}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp">
              {copy.subheading}
            </p>
          </div>
          
          <QuoteManager />
        </div>
      </div>
    </Layout>
  );
};

export default CalculatorPage;
