import React, { useMemo } from 'react';
import StatsCard from '../ui/StatsCard';
import { ProjectData, ProjectStats as ProjectStatsType } from '../../types/project';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectStatsProps {
  projects: ProjectData[];
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ projects }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const stats = useMemo<ProjectStatsType>(
    () => ({
      total: projects.length,
      completed: projects.filter(project => project.statusKey === 'completed').length,
      active: projects.filter(project => project.statusKey === 'in_progress').length,
      featured: projects.filter(project => project.featured).length,
    }),
    [projects]
  );

  const labels = useMemo(
    () =>
      isSpanish
        ? {
            total: 'Total Proyectos',
            completed: 'Completados',
            active: 'En Desarrollo',
            featured: 'Destacados',
          }
        : {
            total: 'Total Projects',
            completed: 'Completed',
            active: 'In Progress',
            featured: 'Featured',
          },
    [isSpanish]
  );

  return (
    <div className="flex justify-center gap-8 flex-wrap mb-8 p-[18px] bg-term-panel border border-term-border rounded-xl">
      <StatsCard
        value={stats.total}
        label={labels.total}
        color="blue"
        delay={0.6}
      />
      <StatsCard
        value={stats.completed}
        label={labels.completed}
        color="green"
        delay={0.7}
      />
      <StatsCard
        value={stats.active}
        label={labels.active}
        color="blue"
        delay={0.8}
      />
      <StatsCard
        value={stats.featured}
        label={labels.featured}
        color="amber"
        delay={0.9}
      />
    </div>
  );
};

export default ProjectStats;
