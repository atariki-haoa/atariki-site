import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import ProjectsHeader from '../ui/ProjectsHeader';
import ProjectStats from '../logical/ProjectStats';
import ProjectFilters from '../logical/ProjectFilters';
import ProjectManager from '../logical/ProjectManager';
import { ProjectData } from '../../types/project';

interface ProjectsSectionProps {
  projects: ProjectData[];
  title?: string;
  description?: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  projects,
  title = "Portfolio de Proyectos",
  description = "Una colección de proyectos que demuestran mi experiencia en desarrollo full-stack, desde APIs robustas hasta interfaces de usuario modernas."
}) => {
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>(projects);

  const handleFilteredProjectsChange = (projects: ProjectData[]) => {
    setFilteredProjects(projects);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <ProjectsHeader title={title} description={description} />
      
      <ProjectStats projects={projects} />
      
      <ProjectFilters 
        projects={projects} 
        onFilteredProjectsChange={handleFilteredProjectsChange}
      />
      
      <ProjectManager projects={filteredProjects} />
    </motion.section>
  );
};

export default ProjectsSection;
