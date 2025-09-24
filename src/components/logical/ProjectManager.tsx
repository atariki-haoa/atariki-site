import React, { useState, useCallback } from 'react';
import ProjectGrid from '../ui/ProjectGrid';
import { ProjectData } from '../../types/project';

interface ProjectManagerProps {
  projects: ProjectData[];
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects }) => {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const toggleCardExpansion = useCallback((cardIndex: number) => {
    setExpandedCards(prev => 
      prev.includes(cardIndex) 
        ? prev.filter(index => index !== cardIndex)
        : [...prev, cardIndex]
    );
  }, []);

  return (
    <ProjectGrid
      projects={projects}
      expandedCards={expandedCards}
      onToggleExpand={toggleCardExpansion}
      delay={1}
    />
  );
};

export default ProjectManager;
