import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUsers,
  FaChevronDown,
  FaStar,
  FaCode,
  FaRocket,
  FaDatabase,
  FaCog,
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import type { ProjectData, ProjectCategoryKey, ProjectStatusKey } from '../../types/project';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  isExpanded?: boolean;
  onToggleExpand?: (index: number) => void;
}

const getCategoryIcon = (category: ProjectCategoryKey) => {
  switch (category) {
    case 'frontend':
      return FaCode;
    case 'backend':
      return FaDatabase;
    case 'devops':
      return FaCog;
    case 'data_science':
      return FaRocket;
    default:
      return FaCode;
  }
};

const getCategoryColor = (category: ProjectCategoryKey) => {
  switch (category) {
    case 'frontend':
      return 'from-blue-600 to-cyan-600';
    case 'backend':
      return 'from-green-600 to-emerald-600';
    case 'devops':
      return 'from-orange-600 to-red-600';
    case 'data_science':
      return 'from-purple-600 to-pink-600';
    default:
      return 'from-gray-600 to-gray-700';
  }
};

const getStatusColor = (status: ProjectStatusKey) => {
  switch (status) {
    case 'completed':
      return 'bg-green-600';
    case 'in_progress':
      return 'bg-blue-600';
    case 'maintenance':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isExpanded = false, onToggleExpand }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const CategoryIcon = getCategoryIcon(project.categoryKey);
  const categoryGradient = getCategoryColor(project.categoryKey);
  const statusColor = getStatusColor(project.statusKey);

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
            viewCode: 'Ver Código',
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
            collapse: 'Show less',
            longDescription: 'Detailed Description',
            info: 'Project Information',
            metrics: 'Metrics',
            durationLabel: 'Duration:',
            highlights: 'Highlights',
            technologies: 'Technologies Used',
            viewCode: 'View Code',
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
      className={`relative bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ${
        project.featured ? 'ring-2 ring-yellow-500/20' : ''
      }`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <FaStar className="mr-1" size={10} />
            {copy.featured}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryGradient}`}>
              <CategoryIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-100 leading-tight">{project.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-400">{project.categoryLabel}</span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${statusColor}`}>
                  {project.statusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">{project.description}</p>

        {/* Technologies Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {formattedTechnologiesPreview.preview.map((tech, techIndex) => (
            <span key={techIndex} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
              {tech}
            </span>
          ))}
          {formattedTechnologiesPreview.remainingLabel && (
            <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded-md">
              {formattedTechnologiesPreview.remainingLabel}
            </span>
          )}
        </div>

        {/* Expand Button */}
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          <span className="text-sm mr-2">{isExpanded ? copy.collapse : copy.expand}</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <FaChevronDown size={12} />
          </motion.div>
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-700"
          >
            <div className="p-6 pt-4 space-y-4">
              {/* Long Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">{copy.longDescription}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{project.longDescription}</p>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">{copy.info}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                      <span>
                        {formatDate(project.startDate)} -{' '}
                        {project.endDate ? formatDate(project.endDate) : copy.present}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaUsers className="mr-2 text-gray-400" size={12} />
                      <span>
                        {project.role} • {project.teamSize} {copy.teamLabel(project.teamSize)}
                      </span>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">{copy.durationLabel}</span> {getDuration()}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                {project.metrics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200 mb-2">{copy.metrics}</h4>
                    <div className="space-y-1">
                      {project.metrics.map(metric => (
                        <div key={metric.label} className="flex justify-between text-sm">
                          <span className="text-gray-400">{metric.label}:</span>
                          <span className="text-gray-300 font-medium">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">{copy.highlights}</h4>
                <ul className="space-y-1">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Technologies */}
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">{copy.technologies}</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200 text-sm"
                >
                  <FaGithub className="mr-2" size={14} />
                  {copy.viewCode}
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center px-4 py-2 bg-gradient-to-r ${categoryGradient} hover:opacity-90 text-white rounded-lg transition-opacity duration-200 text-sm`}
                  >
                    <FaExternalLinkAlt className="mr-2" size={14} />
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
