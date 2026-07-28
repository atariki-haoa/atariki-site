import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronDown,
  FaStar,
  FaCode,
  FaDatabase,
  FaCog,
  FaRocket,
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import type { ProjectData, ProjectCategoryKey, ProjectStatusKey } from '../../types/project';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  isExpanded?: boolean;
  onToggleExpand?: (index: number) => void;
}

const CATEGORY_ACCENT: Record<ProjectCategoryKey, string> = {
  frontend: '#5b93ff',
  backend: '#4ade80',
  devops: '#a68bfa',
  data_science: '#fbbf24',
  mobile: '#5b93ff',
  full_stack: '#a68bfa',
};

const STATUS_ACCENT: Record<ProjectStatusKey, string> = {
  in_progress: '#5b93ff',
  completed: '#4ade80',
  maintenance: '#fbbf24',
  paused: '#8b93a3',
};

const CATEGORY_ICON: Record<ProjectCategoryKey, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  frontend: FaCode,
  backend: FaDatabase,
  devops: FaCog,
  data_science: FaRocket,
  mobile: FaCode,
  full_stack: FaRocket,
};

const getCategoryAccent = (category: ProjectCategoryKey) => CATEGORY_ACCENT[category] ?? '#5b93ff';
const getStatusAccent = (status: ProjectStatusKey) => STATUS_ACCENT[status] ?? '#8b93a3';
const getCategoryIcon = (category: ProjectCategoryKey) => CATEGORY_ICON[category] ?? FaCode;

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isExpanded = false, onToggleExpand }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const categoryAccent = getCategoryAccent(project.categoryKey);
  const statusAccent = getStatusAccent(project.statusKey);
  const CategoryIcon = getCategoryIcon(project.categoryKey);

  const dateFormatter = useMemo(() => {
    const language = isSpanish ? 'es-CL' : 'en-US';
    return new Intl.DateTimeFormat(language, { month: 'short', year: 'numeric' });
  }, [isSpanish]);

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            featured: 'Destacado',
            expand: 'Ver detalles',
            collapse: 'Ver menos',
            longDescription: 'Descripción Detallada',
            info: 'Información del Proyecto',
            metrics: 'Métricas',
            durationLabel: 'Duración:',
            highlights: 'Aspectos Destacados',
            technologies: 'Tecnologías Utilizadas',
            viewCode: 'Código',
            viewDemo: 'Ver Demo',
            moreTechnologies: (count: number) => `+${count} más`,
            present: 'Presente',
            durationSingle: '1 mes',
            durationPlural: (months: number) => `${months} meses`,
            ongoing: 'En curso',
            teamLabel: (count: number) => `persona${count === 1 ? '' : 's'}`,
          }
        : {
            featured: 'Featured',
            expand: 'View details',
            collapse: 'View less',
            longDescription: 'Detailed Description',
            info: 'Project Information',
            metrics: 'Metrics',
            durationLabel: 'Duration:',
            highlights: 'Highlights',
            technologies: 'Technologies Used',
            viewCode: 'Code',
            viewDemo: 'View Demo',
            moreTechnologies: (count: number) => `+${count} more`,
            present: 'Present',
            durationSingle: '1 month',
            durationPlural: (months: number) => `${months} months`,
            ongoing: 'Ongoing',
            teamLabel: (count: number) => (count === 1 ? 'person' : 'people'),
          },
    [isSpanish]
  );

  const toggleExpanded = () => {
    if (onToggleExpand) {
      onToggleExpand(index);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const numericMonth = parseInt(month ?? '', 10);
    if (!year || Number.isNaN(numericMonth)) {
      return dateStr;
    }
    const date = new Date(Number(year), numericMonth - 1);
    return dateFormatter.format(date);
  };

  const getDuration = () => {
    if (!project.endDate) {
      return copy.ongoing;
    }
    const [startYear, startMonth] = project.startDate.split('-').map(Number);
    const [endYear, endMonth] = project.endDate.split('-').map(Number);
    if (
      Number.isNaN(startYear) ||
      Number.isNaN(startMonth) ||
      Number.isNaN(endYear) ||
      Number.isNaN(endMonth)
    ) {
      return copy.ongoing;
    }
    const months = (endYear - startYear) * 12 + (endMonth - startMonth);
    if (months <= 1) {
      return copy.durationSingle;
    }
    return copy.durationPlural(months);
  };

  const formattedTechnologiesPreview = useMemo(() => {
    const preview = project.technologies.slice(0, 4);
    const remaining = project.technologies.length - preview.length;
    return {
      preview,
      remainingLabel: remaining > 0 ? copy.moreTechnologies(remaining) : null,
    };
  }, [project.technologies, copy]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-term-panel border border-term-border rounded-2xl overflow-hidden"
    >
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-term-amber text-term-bg px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
            <FaStar size={10} />
            {copy.featured}
          </div>
        </div>
      )}

      <div className="p-[22px] pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: `${categoryAccent}1c` }}
          >
            <CategoryIcon style={{ color: categoryAccent }} size={18} />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-term-text">{project.title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12.5px] text-term-dim">{project.categoryLabel}</span>
              <span className="w-[5px] h-[5px] rounded-full" style={{ background: statusAccent }} />
              <span className="text-xs" style={{ color: statusAccent }}>
                {project.statusLabel}
              </span>
            </div>
          </div>
        </div>

        <p className="text-term-sub text-[13.5px] leading-relaxed mb-3.5">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {formattedTechnologiesPreview.preview.map((tech, techIndex) => (
            <span key={techIndex} className="px-2.5 py-1 bg-term-panelAlt text-term-sub text-[11px] rounded-md">
              {tech}
            </span>
          ))}
          {formattedTechnologiesPreview.remainingLabel && (
            <span className="px-2.5 py-1 bg-term-panelAlt text-term-dim text-[11px] rounded-md">
              {formattedTechnologiesPreview.remainingLabel}
            </span>
          )}
        </div>

        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-center gap-1.5 border-t border-term-border pt-3 pb-0.5 text-term-dim hover:text-term-sub transition-colors duration-200 text-[13px]"
        >
          {isExpanded ? copy.collapse : copy.expand}
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FaChevronDown size={12} />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-term-border"
          >
            <div className="p-[22px] pt-4 space-y-4">
              <div>
                <h4 className="text-[13px] font-bold text-term-sub mb-2">{copy.longDescription}</h4>
                <p className="text-term-sub text-[13.5px] leading-relaxed">{project.longDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[13px] font-bold text-term-sub mb-2">{copy.info}</h4>
                  <div className="space-y-1.5 text-[13px] text-term-muted">
                    <div>
                      {formatDate(project.startDate)} — {project.endDate ? formatDate(project.endDate) : copy.present}
                    </div>
                    <div>
                      {project.role} · {project.teamSize} {copy.teamLabel(project.teamSize)}
                    </div>
                    <div>
                      <span className="text-term-dim">{copy.durationLabel}</span> {getDuration()}
                    </div>
                  </div>
                </div>

                {project.metrics.length > 0 && (
                  <div>
                    <h4 className="text-[13px] font-bold text-term-sub mb-2">{copy.metrics}</h4>
                    <div className="space-y-1">
                      {project.metrics.map(metric => (
                        <div key={metric.label} className="flex justify-between text-[13px]">
                          <span className="text-term-dim">{metric.label}:</span>
                          <span className="text-term-sub font-medium">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-term-sub mb-2">{copy.highlights}</h4>
                <ul className="space-y-1">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="text-[13px] text-term-sub flex items-start">
                      <span className="text-term-blue mr-2 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-term-sub mb-2">{copy.technologies}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2.5 py-1 bg-term-panelAlt text-term-sub text-[11px] rounded-md border border-term-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-term-panelAlt text-term-sub rounded-lg text-[12.5px]"
                >
                  <FaGithub size={14} />
                  {copy.viewCode}
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-[12.5px]"
                    style={{ background: 'linear-gradient(120deg,#3f6fe0,#8b6ff0)' }}
                  >
                    <FaExternalLinkAlt size={14} />
                    {copy.viewDemo}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;
