import type { Locale } from '../types/locale';

export interface SkillData {
  id: number;
  name: string;
  experience: string;
  description: string;
  icon: string;
  color: string;
}

const skillsByLocale: Record<Locale, SkillData[]> = {
  es: [
    {
      id: 1,
      name: 'React JS',
      experience: '4 años',
      description: 'Librería de JavaScript para construir interfaces de usuario.',
      icon: 'FaReact',
      color: '#61DAFB',
    },
    {
      id: 2,
      name: 'NodeJS',
      experience: '6 años',
      description: 'Entorno de ejecución para JavaScript en el backend.',
      icon: 'FaNodeJs',
      color: '#339933',
    },
    {
      id: 3,
      name: 'JavaScript',
      experience: '6 años',
      description: 'Lenguaje de programación utilizado para desarrollo web frontend y backend.',
      icon: 'FaJs',
      color: '#F7DF1E',
    },
    {
      id: 4,
      name: 'TypeScript',
      experience: '5 años',
      description: 'Superset de JavaScript que añade tipado estático opcional.',
      icon: 'SiTypescript',
      color: '#3178C6',
    },
    {
      id: 5,
      name: 'Python',
      experience: '4 años',
      description: 'Lenguaje de programación de propósito general, usado para scripting y backend.',
      icon: 'FaPython',
      color: '#3776AB',
    },
    {
      id: 6,
      name: 'Flutter',
      experience: '3 años',
      description: 'Framework para construir aplicaciones móviles multiplataforma.',
      icon: 'SiFlutter',
      color: '#02569B',
    },
  ],
  en: [
    {
      id: 1,
      name: 'React JS',
      experience: '4 years',
      description: 'JavaScript library focused on building modern user interfaces.',
      icon: 'FaReact',
      color: '#61DAFB',
    },
    {
      id: 2,
      name: 'NodeJS',
      experience: '6 years',
      description: 'JavaScript runtime environment for building backend services.',
      icon: 'FaNodeJs',
      color: '#339933',
    },
    {
      id: 3,
      name: 'JavaScript',
      experience: '6 years',
      description: 'Programming language for frontend and backend web development.',
      icon: 'FaJs',
      color: '#F7DF1E',
    },
    {
      id: 4,
      name: 'TypeScript',
      experience: '5 years',
      description: 'JavaScript superset that brings optional static typing.',
      icon: 'SiTypescript',
      color: '#3178C6',
    },
    {
      id: 5,
      name: 'Python',
      experience: '4 years',
      description: 'General-purpose programming language for scripting and backend solutions.',
      icon: 'FaPython',
      color: '#3776AB',
    },
    {
      id: 6,
      name: 'Flutter',
      experience: '3 years',
      description: 'Framework for building cross-platform mobile applications.',
      icon: 'SiFlutter',
      color: '#02569B',
    },
  ],
};

export const getSkillsData = (locale: Locale): SkillData[] =>
  skillsByLocale[locale] || skillsByLocale.es;
