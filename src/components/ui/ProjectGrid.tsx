import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { ProjectData } from '../../types/project';

interface ProjectGridProps {
  projects: ProjectData[];
  expandedCards: number[];
  onToggleExpand: (index: number) => void;
  delay?: number;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  expandedCards,
  onToggleExpand,
  delay = 0
}) => {
  if (projects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="text-gray-400 text-lg">
          No se encontraron proyectos con los filtros seleccionados
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          isExpanded={expandedCards.includes(index)}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
