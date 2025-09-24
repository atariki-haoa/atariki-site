import React from 'react';
import Head from 'next/head';
import ProjectsSection from './ProjectsSection';
import projectsDataRaw from '../../data/projects.json';
import { ProjectData } from '../../types/project';

const projectsData: ProjectData[] = projectsDataRaw as unknown as ProjectData[];

const Projects: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
      <Head>
        <title>Proyectos - Ariel Lobos Haoa</title>
        <meta name="description" content="Portfolio de proyectos de desarrollo - Ariel Lobos Haoa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-4 md:p-8">
        <ProjectsSection projects={projectsData} />
      </main>
    </div>
  );
};

export default Projects;
