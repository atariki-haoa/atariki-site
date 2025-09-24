import React, { useState, useCallback, useEffect } from 'react';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaRocket, FaUsers, FaCode, FaChevronDown } from 'react-icons/fa';

interface ExperienceData {
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

const experienceData: ExperienceData[] = [
  {
    id: 1,
    company: "Tubesoft SpA",
    position: "Developer & Team Leader",
    period: "Julio 2021 - Presente",
    location: "Santiago, Chile",
    description: "Fábrica de software que proporciona desarrollo de software y soluciones TI. Rol integral como desarrollador full-stack, líder de equipo y gestor de proyectos.",
    achievements: [
      "Gestión de proyectos asegurando correcta aplicación y viabilidad técnica",
      "Liderazgo de equipo de desarrolladores con metodologías ágiles",
      "Consultoría TI e investigación en nuevas tecnologías",
      "Desarrollo full-stack de soluciones empresariales"
    ],
    technologies: ["Node.js", "React", "TypeScript", "MongoDB", "Git", "Agile"],
    metrics: [
      "3+ años liderazgo",
      "10+ proyectos",
      "Metodología ágil"
    ]
  },
  {
    id: 2,
    company: "Cotalker SpA",
    position: "Project Manager",
    period: "Febrero 2020 - Septiembre 2020",
    location: "Santiago, Chile",
    description: "Empresa de soluciones TI para procesos empresariales. Gestión de proyectos con metodologías ágiles y facilitación de comunicación entre áreas técnicas y de negocio.",
    achievements: [
      "Gestión de proyectos nuevos con metodología ágil",
      "Facilitador de soluciones TI analizando complejidades e implementando servicios backend",
      "Facilitador de comunicación en equipo de ingeniería",
      "Líder de equipo de soporte y gestión de tickets de mejora"
    ],
    technologies: ["Node.js", "AngularJS", "Project Management", "Backend Services"],
    metrics: [
      "8 meses",
      "Metodología ágil",
      "Equipos multi-área"
    ]
  },
  {
    id: 3,
    company: "Cotalker SpA",
    position: "Key Account Manager & Full Stack Developer",
    period: "Febrero 2018 - Enero 2020",
    location: "Santiago, Chile",
    description: "Evolución desde desarrollador full-stack hasta Key Account Manager, manejando procesos de clientes empresariales y desarrollo técnico.",
    achievements: [
      "Gestión de cuentas de clientes empresariales",
      "Desarrollo backend en NodeJS para nuevas funcionalidades y refactoring",
      "Desarrollo frontend en AngularJS con refactoring de código legacy",
      "Soporte técnico de alto nivel"
    ],
    technologies: ["Node.js", "AngularJS", "Backend Development", "Client Management"],
    metrics: [
      "2 años",
      "Clientes enterprise",
      "Full-stack + mgmt"
    ]
  },
  {
    id: 4,
    company: "JRB Inversiones",
    position: "Developer & IT Consultant",
    period: "Mayo 2015 - Enero 2021",
    location: "Viña del Mar, Chile",
    description: "Holding de restaurantes en Viña del Mar. Desarrollo de sistemas POS y consultoría externa especializada.",
    achievements: [
      "Desarrollo en C# para sistemas POS en NodeJS",
      "Consultoría TI externa e investigación para nuevas implementaciones",
      "Soporte técnico de alto nivel para operaciones del negocio"
    ],
    technologies: ["C#", "Node.js", "POS Systems", "IT Consulting"],
    metrics: [
      "6 años",
      "Sistemas POS",
      "Multi-restaurantes"
    ]
  },
  {
    id: 5,
    company: "AGENSA LTDA.",
    position: "SysAdmin & Technical Support Coordinator",
    period: "Junio 2015 - Mayo 2016",
    location: "Valparaíso, Chile",
    description: "Agencia aduanera. Administración de sistemas y coordinación de soporte técnico a nivel nacional.",
    achievements: [
      "Gestión de sistemas de la agencia, responsable de documentos digitales según ley del país",
      "Administración y gestión de compras digitales y proyectos de reestructuración",
      "Coordinación de soporte técnico, gestión de reparaciones de equipos en sucursales nacionales"
    ],
    technologies: ["System Administration", "Digital Documentation", "Technical Support"],
    metrics: [
      "1 año admin",
      "Nacional",
      "Compliance legal"
    ]
  },
  {
    id: 6,
    company: "ABI LTDA.",
    position: "Developer & External Consultant",
    period: "Febrero 2010 - Enero 2019",
    location: "Viña del Mar, Chile",
    description: "Empresa de ingeniería acústica para certificaciones y mediciones. Desarrollo de sistemas de monitoreo acústico ambiental.",
    achievements: [
      "Desarrollo de sistema de medición acústica en stack M.E.A.N.",
      "Monitoreo de ruido acústico ambiental en áreas industrializadas",
      "Soporte técnico y consultoría externa para licitación de nuevos proyectos"
    ],
    technologies: ["MongoDB", "Express", "Angular", "Node.js", "Acoustic Systems"],
    metrics: [
      "9 años",
      "Stack M.E.A.N.",
      "Sistemas acústicos"
    ]
  }
];

const Experience: React.FC = () => {
  const scrollToNextCard = useCallback((currentIndex: number) => {
    if (currentIndex < experienceData.length - 1) {
      // Ir a la siguiente tarjeta
      const nextCardElement = document.getElementById(`experience-card-${currentIndex + 1}`);
      if (nextCardElement) {
        nextCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
            Experiencia Profesional
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Más de 10 años construyendo soluciones tecnológicas innovadoras y liderando equipos de desarrollo
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transform md:-translate-x-1/2"></div>

          {experienceData.map((exp, index) => (
            <div key={exp.id} id={`experience-card-${index}`} className={`relative mb-8 ${index % 2 === 0 ? 'md:ml-auto md:pl-6' : 'md:mr-auto md:pr-6'} md:w-1/2`}>
              {/* Timeline Dot */}
              <div className={`absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 top-4 ${index % 2 === 0 ? 'left-6 md:left-auto md:-right-2' : 'left-6 md:right-auto md:-left-2'}`}></div>

              {/* Experience Card */}
              <div className="ml-12 md:ml-0 bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:transform hover:scale-102">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-200 flex-1">{exp.position}</h3>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <FaCalendarAlt className="inline mr-1" />
                      {exp.period}
                    </span>
                  </div>
                  <h4 className="text-base text-blue-400 font-semibold mb-1">{exp.company}</h4>
                  <p className="text-gray-400 flex items-center text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    {exp.location}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">{exp.description}</p>

                {/* Achievements */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                    <FaTrophy className="mr-1 text-yellow-500" size={12} />
                    Logros Principales
                  </h5>
                  <ul className="space-y-1">
                    {exp.achievements.slice(0, 3).map((achievement, i) => (
                      <li key={i} className="text-gray-300 flex items-start text-xs">
                        <FaRocket className="mr-2 mt-0.5 text-blue-400 flex-shrink-0" size={10} />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                {exp.metrics && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                      <FaUsers className="mr-1 text-green-500" size={12} />
                      Métricas
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                      {exp.metrics.map((metric, i) => (
                        <div key={i} className="bg-gray-700 rounded-md p-2 text-center">
                          <span className="text-green-400 font-semibold text-xs break-words leading-tight">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                    <FaCode className="mr-1 text-purple-500" size={12} />
                    Tecnologías
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.slice(0, 6).map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-purple-600 hover:text-white transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-center pt-3">
                  <button
                    onClick={() => scrollToNextCard(index)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 group"
                    aria-label={index < experienceData.length - 1 ? "Ver siguiente experiencia" : "Ver sección Sobre mí"}
                    title={index < experienceData.length - 1 ? "Ver siguiente experiencia" : "Ver sección Sobre mí"}
                  >
                    <FaChevronDown size={12} className="group-hover:animate-bounce" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-center text-gray-200 mb-6">Resumen de Carrera</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">14+</div>
              <div className="text-gray-300 text-sm">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">6</div>
              <div className="text-gray-300 text-sm">Empresas Diferentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">13+</div>
              <div className="text-gray-300 text-sm">Tecnologías Dominadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">B1</div>
              <div className="text-gray-300 text-sm">Nivel de Inglés</div>
            </div>
          </div>
          
          {/* Technical Skills Highlight */}
          <div className="mt-6 text-center">
            <h4 className="text-base font-semibold text-gray-200 mb-3">Especialidades Técnicas Destacadas</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">JavaScript (6 años)</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Node.js (6 años)</span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">TypeScript (5 años)</span>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">React (4 años)</span>
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">Linux (10+ años)</span>
              <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs">Git (7 años)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
