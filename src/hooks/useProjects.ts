import { useState, useMemo, useCallback } from 'react';
import { ProjectData, ProjectStats, FilterOptions } from '../types/project';

export const useProjects = (initialProjects: ProjectData[]) => {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const toggleCardExpansion = useCallback((cardIndex: number) => {
    setExpandedCards(prev => 
      prev.includes(cardIndex) 
        ? prev.filter(index => index !== cardIndex)
        : [...prev, cardIndex]
    );
  }, []);

  const filterOptions: FilterOptions = useMemo(() => ({
    categories: ['all', ...Array.from(new Set(initialProjects.map(p => p.category)))],
    statuses: ['all', ...Array.from(new Set(initialProjects.map(p => p.status)))]
  }), [initialProjects]);

  const filteredProjects = useMemo(() => {
    const filtered = initialProjects.filter(project => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      return matchesCategory && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [initialProjects, selectedCategory, selectedStatus]);

  const stats: ProjectStats = useMemo(() => ({
    total: initialProjects.length,
    completed: initialProjects.filter(p => p.status === 'Completado').length,
    active: initialProjects.filter(p => p.status === 'En desarrollo').length,
    featured: initialProjects.filter(p => p.featured).length
  }), [initialProjects]);

  return {
    expandedCards,
    toggleCardExpansion,
    filterOptions,
    filteredProjects,
    stats,
    selectedCategory,
    selectedStatus,
    setSelectedCategory,
    setSelectedStatus
  };
};
