import React, { useState, useMemo } from 'react';
import FilterSection from '../ui/FilterSection';
import { ProjectData } from '../../types/project';

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

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(projects.map(p => p.category)))], 
    [projects]
  );

  const statuses = useMemo(() => 
    ['all', ...Array.from(new Set(projects.map(p => p.status)))], 
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
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
      categories={categories}
      statuses={statuses}
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
