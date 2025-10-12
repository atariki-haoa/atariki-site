import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import ExperienceCard from '../ui/ExperienceCard';
import { useLanguage } from '../../context/LanguageContext';
import { getExperienceData, type ExperienceData } from '../../data/experience';

const Experience: React.FC = () => {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const experienceData = useMemo(() => getExperienceData(locale), [locale]);

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            heading: 'Experiencia Profesional',
            subtitle:
              'Más de 10 años construyendo soluciones tecnológicas innovadoras y liderando equipos de desarrollo',
            summaryHeading: 'Resumen de Carrera',
            stats: [
              { value: '14+', label: 'Años de Experiencia', color: 'text-blue-400' },
              { value: '6', label: 'Empresas Diferentes', color: 'text-green-400' },
              { value: '13+', label: 'Tecnologías Dominadas', color: 'text-purple-400' },
              { value: 'B1', label: 'Nivel de Inglés', color: 'text-yellow-400' },
            ],
            skillsHeading: 'Especialidades Técnicas Destacadas',
            skillTags: [
              { label: 'JavaScript (6 años)', colorClass: 'bg-blue-600' },
              { label: 'Node.js (6 años)', colorClass: 'bg-green-600' },
              { label: 'TypeScript (5 años)', colorClass: 'bg-purple-600' },
              { label: 'React (4 años)', colorClass: 'bg-red-600' },
              { label: 'Linux (10+ años)', colorClass: 'bg-yellow-600' },
              { label: 'Git (7 años)', colorClass: 'bg-cyan-600' },
            ],
          }
        : {
            heading: 'Professional Experience',
            subtitle:
              'Over 10 years building innovative technology solutions and leading high-impact engineering teams',
            summaryHeading: 'Career Snapshot',
            stats: [
              { value: '14+', label: 'Years of Experience', color: 'text-blue-400' },
              { value: '6', label: 'Companies', color: 'text-green-400' },
              { value: '13+', label: 'Technologies Mastered', color: 'text-purple-400' },
              { value: 'B1', label: 'English Level', color: 'text-yellow-400' },
            ],
            skillsHeading: 'Highlighted Technical Expertise',
            skillTags: [
              { label: 'JavaScript (6 years)', colorClass: 'bg-blue-600' },
              { label: 'Node.js (6 years)', colorClass: 'bg-green-600' },
              { label: 'TypeScript (5 years)', colorClass: 'bg-purple-600' },
              { label: 'React (4 years)', colorClass: 'bg-red-600' },
              { label: 'Linux (10+ years)', colorClass: 'bg-yellow-600' },
              { label: 'Git (7 years)', colorClass: 'bg-cyan-600' },
            ],
          },
    [isSpanish]
  );

  // Actualizar el año automáticamente
  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear());
    };

    // Actualizar inmediatamente
    updateYear();

    // Configurar intervalo para verificar cada minuto
    const interval = setInterval(updateYear, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleCardExpansion = useCallback((cardIndex: number) => {
    setExpandedCards(prev => 
          prev.includes(cardIndex) 
            ? prev.filter(index => index !== cardIndex)
            : [...prev, cardIndex]
    );
  }, []);

  const scrollToNextCard = useCallback((currentIndex: number) => {
    if (currentIndex < experienceData.length - 1) {
      const nextIndex = currentIndex + 1;
      
      // Expandir la siguiente tarjeta
      setExpandedCards(prev => 
        prev.includes(nextIndex) ? prev : [...prev, nextIndex]
      );
      
      // Hacer scroll a la siguiente tarjeta
      setTimeout(() => {
        const nextCardElement = document.getElementById(`experience-card-${nextIndex}`);
        if (nextCardElement) {
          nextCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100); // Pequeño delay para que la expansión comience primero
    } else {
      // Si es la última tarjeta, ir a la sección "Sobre mí"
      const aboutSection = document.querySelector('section:last-child');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-200 mb-3">
            <FaBriefcase className="inline-block w-6 h-6 mr-2 text-blue-400" />
            {copy.heading}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line - Centered */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 md:transform md:-translate-x-1/2"></div>

          {/* Current Year Indicator - At the top of timeline */}
          <div className="relative mb-6">
            <div className="ml-8 md:ml-0 md:text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                <span className="text-sm">{currentYear}</span>
              </div>
            </div>
          </div>

          {experienceData.map((exp, index) => (
            <div key={exp.id} id={`experience-card-${index}`}>
              <ExperienceCard
                experience={exp}
                index={index}
                isLast={index === experienceData.length - 1}
                onNext={scrollToNextCard}
                isLeft={index % 2 === 0}
                isExpanded={expandedCards.includes(index)}
                onToggleExpand={toggleCardExpansion}
              />
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-center text-gray-200 mb-6">{copy.summaryHeading}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {copy.stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Technical Skills Highlight */}
          <div className="mt-6 text-center">
            <h4 className="text-base font-semibold text-gray-200 mb-3">{copy.skillsHeading}</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {copy.skillTags.map(tag => (
                <span
                  key={tag.label}
                  className={`${tag.colorClass} text-white px-3 py-1 rounded-full text-xs`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
