import React from 'react';
import StatsCard from '../ui/StatsCard';
import { ProjectData, ProjectStats as ProjectStatsType } from '../../types/project';

interface ProjectStatsProps {
  projects: ProjectData[];
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ projects }) => {
  const calculateStats = (): ProjectStatsType => {
    return {
      total: projects.length,
      completed: projects.filter(p => p.status === 'Completado').length,
      active: projects.filter(p => p.status === 'En desarrollo').length,
      featured: projects.filter(p => p.featured).length
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatsCard
        value={stats.total}
        label="Total Proyectos"
        color="blue"
        delay={0.6}
      />
      <StatsCard
        value={stats.completed}
        label="Completados"
        color="green"
        delay={0.7}
      />
      <StatsCard
        value={stats.active}
        label="En Desarrollo"
        color="yellow"
        delay={0.8}
      />
      <StatsCard
        value={stats.featured}
        label="Destacados"
        color="purple"
        delay={0.9}
      />
    </div>
  );
};

export default ProjectStats;
