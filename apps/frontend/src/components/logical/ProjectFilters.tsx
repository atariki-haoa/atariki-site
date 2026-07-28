import React, { useState, useMemo } from 'react';
import FilterSection from '../ui/FilterSection';
import { ProjectData } from '../../types/project';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectFiltersProps {
  projects: ProjectData[];
  onFilteredProjectsChange: (projects: ProjectData[]) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ 
  projects, 
  onFilteredProjectsChange 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach(project => {
      if (!map.has(project.categoryKey)) {
        map.set(project.categoryKey, project.categoryLabel);
      }
    });
    const allLabel = isSpanish ? 'Todas las categorías' : 'All categories';
    return [
      { value: 'all', label: allLabel },
      ...Array.from(map.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [projects, isSpanish]);

  const statusOptions = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach(project => {
      if (!map.has(project.statusKey)) {
        map.set(project.statusKey, project.statusLabel);
      }
    });
    const allLabel = isSpanish ? 'Todos los estados' : 'All statuses';
    return [
      { value: 'all', label: allLabel },
      ...Array.from(map.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [projects, isSpanish]);

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesCategory =
        selectedCategory === 'all' || project.categoryKey === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' || project.statusKey === selectedStatus;
      return matchesCategory && matchesStatus;
    });

    const sorted = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    return sorted;
  }, [projects, selectedCategory, selectedStatus]);

  React.useEffect(() => {
    onFilteredProjectsChange(filteredProjects);
  }, [filteredProjects, onFilteredProjectsChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <FilterSection
      categories={categoryOptions}
      statuses={statusOptions}
      selectedCategory={selectedCategory}
      selectedStatus={selectedStatus}
      onCategoryChange={handleCategoryChange}
      onStatusChange={handleStatusChange}
      filteredCount={filteredProjects.length}
      totalCount={projects.length}
      delay={0.8}
    />
  );
};

export default ProjectFilters;
