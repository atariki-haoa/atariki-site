import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectsHeader from '../ui/ProjectsHeader';
import ProjectStats from './ProjectStats';
import ProjectFilters from './ProjectFilters';
import ProjectManager from './ProjectManager';
import { ProjectData } from '../../types/project';

interface ProjectsSectionProps {
  projects: ProjectData[];
  title?: string;
  description?: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  projects,
  title,
  description
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
      <ProjectsHeader title={title || ''} description={description || ''} />
      
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
