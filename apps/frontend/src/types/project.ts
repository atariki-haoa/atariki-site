export type ProjectStatusKey = 'completed' | 'in_progress' | 'maintenance' | 'paused';

export type ProjectCategoryKey =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'data_science'
  | 'mobile'
  | 'full_stack';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  categoryKey: ProjectCategoryKey;
  categoryLabel: string;
  statusKey: ProjectStatusKey;
  statusLabel: string;
  featured: boolean;
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
  role: string;
  teamSize: number;
  metrics: ProjectMetric[];
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
