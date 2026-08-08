import React, { useCallback, useState, useMemo } from 'react';
import ExperienceCard from '../ui/ExperienceCard';
import { useLanguage } from '../../context/LanguageContext';
import { getExperienceData } from '../../data/experience';

const Experience: React.FC = () => {
  const [expandedCards, setExpandedCards] = useState<number[]>([0]);
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const experienceData = useMemo(() => getExperienceData(locale), [locale]);

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            heading: 'Experiencia Profesional',
            subtitle:
              'Más de 10 años construyendo soluciones tecnológicas y liderando equipos de desarrollo',
            summaryHeading: 'Resumen de Carrera',
            stats: [
              { value: '14+', label: 'Años de experiencia', color: 'text-term-blue' },
              { value: '6', label: 'Empresas', color: 'text-term-green' },
              { value: '13+', label: 'Tecnologías', color: 'text-term-purple' },
              { value: 'B1', label: 'Nivel de inglés', color: 'text-term-amber' },
            ],
            skillTags: [
              'JavaScript · 6 años',
              'Node.js · 6 años',
              'TypeScript · 5 años',
              'React · 4 años',
              'Linux · 10+ años',
            ],
          }
        : {
            heading: 'Professional Experience',
            subtitle: 'Over 10 years building tech solutions and leading development teams',
            summaryHeading: 'Career Summary',
            stats: [
              { value: '14+', label: 'Years of experience', color: 'text-term-blue' },
              { value: '6', label: 'Companies', color: 'text-term-green' },
              { value: '13+', label: 'Technologies', color: 'text-term-purple' },
              { value: 'B1', label: 'English level', color: 'text-term-amber' },
            ],
            skillTags: [
              'JavaScript · 6 years',
              'Node.js · 6 years',
              'TypeScript · 5 years',
              'React · 4 years',
              'Linux · 10+ years',
            ],
          },
    [isSpanish]
  );

  const toggleCardExpansion = useCallback((cardIndex: number) => {
    setExpandedCards(prev =>
      prev.includes(cardIndex) ? prev.filter(index => index !== cardIndex) : [...prev, cardIndex]
    );
  }, []);

  return (
    <section className="max-w-[900px] mx-auto px-6 py-14 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-[34px] font-bold mb-3">{copy.heading}</h1>
        <p className="text-term-muted text-base max-w-[560px] mx-auto">{copy.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3.5 mb-12">
        {experienceData.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            index={index}
            isExpanded={expandedCards.includes(index)}
            onToggleExpand={toggleCardExpansion}
          />
        ))}
      </div>

      <div
        className="rounded-2xl border border-term-border p-8"
        style={{ background: 'linear-gradient(120deg, #3f6fe022, #8b6ff022)' }}
      >
        <h3 className="text-center text-[19px] font-bold mb-6">{copy.summaryHeading}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-7">
          {copy.stats.map(stat => (
            <div key={stat.label}>
              <div className={`text-[26px] font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-term-sub text-[12.5px]">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {copy.skillTags.map(tag => (
            <span
              key={tag}
              className="bg-term-panelAlt border border-term-border text-term-sub text-xs px-3.5 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
