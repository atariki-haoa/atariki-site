export interface ProjectData {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  status: string;
  featured: boolean;
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
  role: string;
  teamSize: number;
  metrics: Record<string, string | number>;
}

export interface ProjectStats {
  total: number;
  completed: number;
  active: number;
  featured: number;
}

export interface FilterOptions {
  categories: string[];
  statuses: string[];
}

export type ProjectStatus = 'Completado' | 'En desarrollo' | 'Mantenimiento' | 'Pausado';
export type ProjectCategory = 'Frontend' | 'Backend' | 'DevOps' | 'Data Science' | 'Mobile' | 'Full Stack';
