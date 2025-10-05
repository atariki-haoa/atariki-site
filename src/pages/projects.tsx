import React from 'react';
import Layout from '../components/functional/Layout';
import ProjectsSection from '../components/logical/ProjectsSection';
import projectsDataRaw from '../data/projects.json';
import { ProjectData } from '../types/project';

const projectsData: ProjectData[] = projectsDataRaw as unknown as ProjectData[];

const ProjectsPage: React.FC = () => {
  return (
    <Layout title="Proyectos - Ariel Lobos Haoa" description="Portfolio de proyectos de desarrollo - Ariel Lobos Haoa">
      <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
        <main className="flex-1 p-4 md:p-8">
          <ProjectsSection projects={projectsData} />
        </main>
      </div>
    </Layout>
  );
};

export default ProjectsPage;