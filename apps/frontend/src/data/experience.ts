import type { Locale } from '../types/locale';

export interface ExperienceData {
  id: number;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  metrics?: string[];
}

const experienceByLocale: Record<Locale, ExperienceData[]> = {
  es: [
    {
      id: 1,
      company: 'Tubesoft SpA',
      position: 'Developer & Team Leader',
      period: 'Julio 2021 - Presente',
      location: 'Santiago, Chile',
      description:
        'Fábrica de software que proporciona desarrollo de software y soluciones TI. Rol integral como desarrollador full-stack, líder de equipo y gestor de proyectos.',
      achievements: [
        'Gestión de proyectos asegurando correcta aplicación y viabilidad técnica',
        'Liderazgo de equipo de desarrolladores con metodologías ágiles',
        'Consultoría TI e investigación en nuevas tecnologías',
        'Desarrollo full-stack de soluciones empresariales',
      ],
      technologies: ['Node.js', 'React', 'TypeScript', 'MongoDB', 'Git', 'Agile'],
      metrics: ['3+ años liderazgo', '10+ proyectos', 'Metodología ágil'],
    },
    {
      id: 2,
      company: 'Cotalker SpA',
      position: 'Project Manager',
      period: 'Febrero 2020 - Septiembre 2020',
      location: 'Santiago, Chile',
      description:
        'Empresa de soluciones TI para procesos empresariales. Gestión de proyectos con metodologías ágiles y facilitación de comunicación entre áreas técnicas y de negocio.',
      achievements: [
        'Gestión de proyectos nuevos con metodología ágil',
        'Facilitador de soluciones TI analizando complejidades e implementando servicios backend',
        'Facilitador de comunicación en equipo de ingeniería',
        'Líder de equipo de soporte y gestión de tickets de mejora',
      ],
      technologies: ['Node.js', 'AngularJS', 'Project Management', 'Backend Services'],
      metrics: ['8 meses', 'Metodología ágil', 'Equipos multi-área'],
    },
    {
      id: 3,
      company: 'Cotalker SpA',
      position: 'Key Account Manager & Full Stack Developer',
      period: 'Febrero 2018 - Enero 2020',
      location: 'Santiago, Chile',
      description:
        'Evolución desde desarrollador full-stack hasta Key Account Manager, manejando procesos de clientes empresariales y desarrollo técnico.',
      achievements: [
        'Gestión de cuentas de clientes empresariales',
        'Desarrollo backend en NodeJS para nuevas funcionalidades y refactoring',
        'Desarrollo frontend en AngularJS con refactoring de código legacy',
        'Soporte técnico de alto nivel',
      ],
      technologies: ['Node.js', 'AngularJS', 'Backend Development', 'Client Management'],
      metrics: ['2 años', 'Clientes enterprise', 'Full-stack + mgmt'],
    },
    {
      id: 4,
      company: 'JRB Inversiones',
      position: 'Developer & IT Consultant',
      period: 'Mayo 2015 - Enero 2021',
      location: 'Viña del Mar, Chile',
      description:
        'Holding de restaurantes en Viña del Mar. Desarrollo de sistemas POS y consultoría externa especializada.',
      achievements: [
        'Desarrollo en C# para sistemas POS en NodeJS',
        'Consultoría TI externa e investigación para nuevas implementaciones',
        'Soporte técnico de alto nivel para operaciones del negocio',
      ],
      technologies: ['C#', 'Node.js', 'POS Systems', 'IT Consulting'],
      metrics: ['6 años', 'Sistemas POS', 'Multi-restaurantes'],
    },
    {
      id: 5,
      company: 'AGENSA LTDA.',
      position: 'SysAdmin & Technical Support Coordinator',
      period: 'Junio 2015 - Mayo 2016',
      location: 'Valparaíso, Chile',
      description:
        'Agencia aduanera. Administración de sistemas y coordinación de soporte técnico a nivel nacional.',
      achievements: [
        'Gestión de sistemas de la agencia, responsable de documentos digitales según ley del país',
        'Administración y gestión de compras digitales y proyectos de reestructuración',
        'Coordinación de soporte técnico, gestión de reparaciones de equipos en sucursales nacionales',
      ],
      technologies: ['System Administration', 'Digital Documentation', 'Technical Support'],
      metrics: ['1 año admin', 'Nacional', 'Compliance legal'],
    },
    {
      id: 6,
      company: 'ABI LTDA.',
      position: 'Developer & External Consultant',
      period: 'Febrero 2010 - Enero 2019',
      location: 'Viña del Mar, Chile',
      description:
        'Empresa de ingeniería acústica para certificaciones y mediciones. Desarrollo de sistemas de monitoreo acústico ambiental.',
      achievements: [
        'Desarrollo de sistema de medición acústica en stack M.E.A.N.',
        'Monitoreo de ruido acústico ambiental en áreas industrializadas',
        'Soporte técnico y consultoría externa para licitación de nuevos proyectos',
      ],
      technologies: ['MongoDB', 'Express', 'Angular', 'Node.js', 'Acoustic Systems'],
      metrics: ['9 años', 'Stack M.E.A.N.', 'Sistemas acústicos'],
    },
  ],
  en: [
    {
      id: 1,
      company: 'Tubesoft SpA',
      position: 'Developer & Team Leader',
      period: 'July 2021 - Present',
      location: 'Santiago, Chile',
      description:
        'Software factory delivering custom applications and IT solutions. End-to-end role combining full-stack development, team leadership, and project management.',
      achievements: [
        'Led project governance to ensure technical feasibility and delivery quality',
        'Managed cross-functional developer teams using agile practices',
        'Provided technology consulting and research on emerging tools',
        'Built full-stack enterprise solutions from discovery to deployment',
      ],
      technologies: ['Node.js', 'React', 'TypeScript', 'MongoDB', 'Git', 'Agile'],
      metrics: ['3+ years leading teams', '10+ shipped projects', 'Agile methodologies'],
    },
    {
      id: 2,
      company: 'Cotalker SpA',
      position: 'Project Manager',
      period: 'February 2020 - September 2020',
      location: 'Santiago, Chile',
      description:
        'Enterprise process automation platform. Managed agile projects and facilitated alignment between technical and business stakeholders.',
      achievements: [
        'Steered new initiatives through agile planning and execution',
        'Analyzed technical complexity and implemented backend services',
        'Acted as communication bridge across the engineering organization',
        'Coordinated support teams and continuous improvement requests',
      ],
      technologies: ['Node.js', 'AngularJS', 'Project Management', 'Backend Services'],
      metrics: ['8 months', 'Agile delivery', 'Multi-area coordination'],
    },
    {
      id: 3,
      company: 'Cotalker SpA',
      position: 'Key Account Manager & Full Stack Developer',
      period: 'February 2018 - January 2020',
      location: 'Santiago, Chile',
      description:
        'Progressed from full-stack developer to key account manager, balancing enterprise client management with technical delivery.',
      achievements: [
        'Owned enterprise accounts and high-impact client relationships',
        'Implemented backend features in Node.js with continuous refactoring',
        'Improved AngularJS frontends by modernizing legacy code',
        'Provided senior technical support for mission-critical systems',
      ],
      technologies: ['Node.js', 'AngularJS', 'Backend Development', 'Client Management'],
      metrics: ['2 years', 'Enterprise clients', 'Full-stack + management'],
    },
    {
      id: 4,
      company: 'JRB Inversiones',
      position: 'Developer & IT Consultant',
      period: 'May 2015 - January 2021',
      location: 'Viña del Mar, Chile',
      description:
        'Restaurant holding group in Viña del Mar. Delivered POS systems and specialized external consulting.',
      achievements: [
        'Developed POS solutions migrating from C# to Node.js services',
        'Provided external IT consulting and technology scouting',
        'Delivered high-availability technical support for daily operations',
      ],
      technologies: ['C#', 'Node.js', 'POS Systems', 'IT Consulting'],
      metrics: ['6 years', 'POS platforms', 'Multi-restaurant rollout'],
    },
    {
      id: 5,
      company: 'AGENSA LTDA.',
      position: 'SysAdmin & Technical Support Coordinator',
      period: 'June 2015 - May 2016',
      location: 'Valparaíso, Chile',
      description:
        'Customs agency operating nationwide. Responsible for systems administration and technical support coordination.',
      achievements: [
        'Oversaw mission-critical systems and compliance with national digital document regulations',
        'Managed digital procurement and infrastructure modernization projects',
        'Coordinated nationwide support tickets and hardware maintenance',
      ],
      technologies: ['System Administration', 'Digital Documentation', 'Technical Support'],
      metrics: ['1 year admin', 'Nationwide coverage', 'Legal compliance'],
    },
    {
      id: 6,
      company: 'ABI LTDA.',
      position: 'Developer & External Consultant',
      period: 'February 2010 - January 2019',
      location: 'Viña del Mar, Chile',
      description:
        'Acoustic engineering firm specialized in certifications and measurements. Built environmental monitoring systems.',
      achievements: [
        'Created acoustic measurement platform using the MEAN stack',
        'Implemented environmental noise monitoring for industrial zones',
        'Delivered technical consulting for new project bids and tenders',
      ],
      technologies: ['MongoDB', 'Express', 'Angular', 'Node.js', 'Acoustic Systems'],
      metrics: ['9 years', 'MEAN stack', 'Acoustic monitoring'],
    },
  ],
};

export const getExperienceData = (locale: Locale): ExperienceData[] =>
  experienceByLocale[locale] || experienceByLocale.es;
