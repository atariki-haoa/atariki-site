import React, { useMemo } from 'react';
import Layout from '../components/functional/Layout';
import { FaReact, FaNodeJs, FaJs, FaPython } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';

const skills = [
  { icon: FaReact, color: '#61DAFB' },
  { icon: FaNodeJs, color: '#339933' },
  { icon: FaJs, color: '#F7DF1E' },
  { icon: SiTypescript, color: '#3178C6' },
  { icon: FaPython, color: '#3776AB' }
];

const SkillsPage: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const meta = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Habilidades - Ariel Lobos Haoa',
            description: 'Principales tecnologías y herramientas utilizadas por Ariel Lobos Haoa.',
          }
        : {
            title: 'Skills - Ariel Lobos Haoa',
            description: 'Core technologies and tools used by Ariel Lobos Haoa.',
          },
    [isSpanish]
  );

  return (
    <Layout title={meta.title} description={meta.description} canonicalUrl="/skills">
      <div className="skills-container flex flex-wrap justify-center items-center py-8">
        {skills.map((skill, index) => {
          const IconComponent = skill.icon;
          return (
            <div key={index} className="m-4">
              <IconComponent size={50} color={skill.color} />
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default SkillsPage;
