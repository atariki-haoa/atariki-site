import React, { useMemo } from 'react';
import Layout from '../components/functional/Layout';
import ProjectsSection from '../components/logical/ProjectsSection';
import { useLanguage } from '../context/LanguageContext';
import { getProjectsData } from '../data/projects';

const ProjectsPage: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const projects = useMemo(() => getProjectsData(locale), [locale]);

  const seoCopy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Proyectos - Ariel Lobos Haoa',
            description: 'Portfolio de proyectos de desarrollo software liderados por Ariel Lobos Haoa.',
            keywords:
              'proyectos desarrollo, portfolio, Node.js, React, TypeScript, backend, frontend, Chile, Ariel Lobos Haoa',
            sectionTitle: 'Portfolio de Proyectos',
            sectionDescription:
              'Selección de proyectos que reflejan mi experiencia full-stack: APIs robustas, interfaces modernas y automatización de procesos.',
          }
        : {
            title: 'Projects - Ariel Lobos Haoa',
            description: 'Software development projects led by Ariel Lobos Haoa, from backend services to frontend experiences.',
            keywords:
              'software projects, portfolio, Node.js, React, TypeScript, backend, frontend, Chile, Ariel Lobos Haoa',
            sectionTitle: 'Project Portfolio',
            sectionDescription:
              'A curated set of projects showcasing full-stack expertise: robust APIs, modern interfaces, and process automation.',
          },
    [isSpanish]
  );

  return (
    <Layout title={seoCopy.title} description={seoCopy.description} canonicalUrl="/projects" keywords={seoCopy.keywords}>
      <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
        <main className="flex-1 p-4 md:p-8">
          <ProjectsSection projects={projects} title={seoCopy.sectionTitle} description={seoCopy.sectionDescription} />
        </main>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
