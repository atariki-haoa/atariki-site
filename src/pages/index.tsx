import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/functional/Layout';
import {
  FaReact,
  FaNodeJs,
  FaJs,
  FaPython,
  FaArrowDown,
  FaCode,
  FaRocket,
  FaDownload,
} from 'react-icons/fa';
import { SiTypescript, SiFlutter } from 'react-icons/si';
import SkillPopup from '../components/ui/SkillPopup';
import Terminal from '../components/ui/Terminal';
import { PersonStructuredData, WebsiteStructuredData } from '../components/ui/StructuredData';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { getSkillsData, type SkillData } from '../data/skills';

interface SkillWithIcon {
  id: number;
  color: string;
  IconComponent: React.ComponentType<any>;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  FaReact,
  FaNodeJs,
  FaJs,
  SiTypescript,
  FaPython,
  SiFlutter,
};

const Home: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const skillsData = useMemo(() => getSkillsData(locale), [locale]);

  const skillsWithIcons = useMemo<SkillWithIcon[]>(() => {
    return skillsData
      .map(skill => {
        const IconComponent = iconMap[skill.icon];
        if (!IconComponent) {
          return null;
        }
        return {
          id: skill.id,
          color: skill.color,
          IconComponent,
        };
      })
      .filter((skill): skill is SkillWithIcon => skill !== null);
  }, [skillsData]);

  const heroCopy = useMemo(
    () =>
      isSpanish
        ? {
            greeting: '¡Hola! Soy',
            role: 'Ingeniero en Computación & Desarrollador Full Stack',
            projectsCta: 'Ver Mis Proyectos',
            contactCta: 'Contactar',
            techLabel: 'Tecnologías principales:',
            scrollLabel: 'Desplázate hacia abajo',
          }
        : {
            greeting: "Hi! I'm",
            role: 'Computer Engineer & Full Stack Developer',
            projectsCta: 'View My Projects',
            contactCta: 'Get in Touch',
            techLabel: 'Core technologies:',
            scrollLabel: 'Scroll down',
          },
    [isSpanish]
  );

  const aboutCopy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Sobre Mí',
            intro:
              'Con más de 10 años de experiencia en desarrollo de software, me especializo en crear soluciones robustas que conectan equipos técnicos y no técnicos. Mi enfoque combina liderazgo empático con expertise técnico sólido.',
            highlights: [
              {
                title: 'Desarrollo Full Stack',
                description: 'React, Node.js, TypeScript, Python',
                Icon: FaCode,
                colorClass: 'text-blue-400',
              },
              {
                title: 'Liderazgo Técnico',
                description: 'Gestión de equipos y proyectos',
                Icon: FaRocket,
                colorClass: 'text-purple-400',
              },
              {
                title: 'Innovación',
                description: 'IA, Impresión 3D, Automatización',
                Icon: FaDownload,
                colorClass: 'text-green-400',
              },
            ],
            cta: 'Conocer Más Sobre Mí',
          }
        : {
            title: 'About Me',
            intro:
              'With more than 10 years of software experience, I specialize in building robust solutions that connect technical and non-technical teams. I pair empathetic leadership with solid technical expertise.',
            highlights: [
              {
                title: 'Full Stack Development',
                description: 'React, Node.js, TypeScript, Python',
                Icon: FaCode,
                colorClass: 'text-blue-400',
              },
              {
                title: 'Technical Leadership',
                description: 'Team and project management',
                Icon: FaRocket,
                colorClass: 'text-purple-400',
              },
              {
                title: 'Innovation',
                description: 'AI, 3D printing, Automation',
                Icon: FaDownload,
                colorClass: 'text-green-400',
              },
            ],
            cta: 'Read More About Me',
          },
    [isSpanish]
  );

  const seoCopy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Ariel Atariki Lobos Haoa - Desarrollador Full Stack | React, Node.js, TypeScript',
            description:
              'Desarrollador Full Stack especializado en React, Node.js, TypeScript y Python. Portfolio profesional con experiencia en desarrollo web moderno, liderazgo técnico y soluciones escalables.',
            keywords:
              'desarrollador full stack, React, Node.js, TypeScript, Python, desarrollador web, portfolio, Chile, Santiago, liderazgo técnico',
            personJobTitle: 'Desarrollador Full Stack',
            personDescription:
              'Desarrollador Full Stack especializado en React, Node.js, TypeScript y Python con experiencia liderando equipos y creando soluciones escalables.',
            websiteDescription:
              'Portfolio profesional de Ariel Atariki Lobos Haoa, desarrollador Full Stack especializado en tecnologías modernas.',
          }
        : {
            title: 'Ariel Atariki Lobos Haoa - Full Stack Developer | React, Node.js, TypeScript',
            description:
              'Full Stack Developer specialized in React, Node.js, TypeScript, and Python. Portfolio showcasing modern web development, technical leadership, and scalable solutions.',
            keywords:
              'full stack developer, React, Node.js, TypeScript, Python, web developer, portfolio, Chile, Santiago, technical leadership',
            personJobTitle: 'Full Stack Developer',
            personDescription:
              'Full Stack Developer focused on React, Node.js, TypeScript, and Python with experience leading teams and delivering scalable solutions.',
            websiteDescription:
              'Professional portfolio of Ariel Atariki Lobos Haoa, a Full Stack Developer specialized in modern technologies.',
          },
    [isSpanish]
  );

  const handleSkillClick = useCallback(
    (skillId: number) => {
      const skillData = skillsData.find(skill => skill.id === skillId);
      setSelectedSkill(skillData ?? null);
    },
    [skillsData]
  );

  const handleClosePopup = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  const handleScrollDown = useCallback(() => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      <PersonStructuredData
        name="Ariel Atariki Lobos Haoa"
        jobTitle={seoCopy.personJobTitle}
        description={seoCopy.personDescription}
        url="https://atariki.dev"
        image="https://atariki.dev/profile-image.jpg"
        sameAs={['https://github.com/atariki-haoa', 'https://linkedin.com/in/atariki-haoa']}
        address={{
          addressCountry: 'Chile',
          addressLocality: 'Santiago',
        }}
      />

      <WebsiteStructuredData
        name="Ariel Atariki Lobos Haoa - Portfolio"
        description={seoCopy.websiteDescription}
        url="https://atariki.dev"
        author={{ name: 'Ariel Atariki Lobos Haoa', url: 'https://atariki.dev' }}
        inLanguage={locale}
        copyrightYear={2024}
      />

      <Layout
        title={seoCopy.title}
        description={seoCopy.description}
        canonicalUrl="/"
        keywords={seoCopy.keywords}
        ogImage="/og-home.jpg"
      >
        <div className="min-h-screen">
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

            <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-6">
                    <span className="text-blue-400 text-lg font-medium tracking-wide">{heroCopy.greeting}</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    Ariel Lobos
                  </h1>

                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-300 mb-4">{heroCopy.role}</h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
                      {isSpanish ? (
                        <>
                          Especialista en <span className="text-blue-400 font-semibold">React</span>,{' '}
                          <span className="text-green-400 font-semibold">Node.js</span> y{' '}
                          <span className="text-blue-300 font-semibold">TypeScript</span>. Apasionado por crear
                          soluciones tecnológicas innovadoras y liderar equipos hacia el éxito.
                        </>
                      ) : (
                        <>
                          Specialist in <span className="text-blue-400 font-semibold">React</span>,{' '}
                          <span className="text-green-400 font-semibold">Node.js</span>, and{' '}
                          <span className="text-blue-300 font-semibold">TypeScript</span>. Passionate about building
                          innovative solutions and leading teams to success.
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                    <Link
                      href="/projects"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    >
                      <FaRocket className="group-hover:animate-bounce" />
                      {heroCopy.projectsCta}
                    </Link>
                    <Link
                      href="/contact"
                      className="group border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <FaCode className="group-hover:animate-pulse" />
                      {heroCopy.contactCta}
                    </Link>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-4">{heroCopy.techLabel}</p>
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6">
                      {skillsWithIcons.map(({ id, IconComponent, color }) => (
                        <div
                          key={id}
                          onClick={() => handleSkillClick(id)}
                          className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-6"
                        >
                          <IconComponent
                            size={40}
                            color={color}
                            className="group-hover:drop-shadow-lg transition-all duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 flex-shrink-0 flex justify-center lg:justify-end">
                  <Terminal />
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
              <button
                onClick={handleScrollDown}
                className="flex flex-col items-center text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer group bg-transparent border-none p-2"
                aria-label={heroCopy.scrollLabel}
              >
                <FaArrowDown className="text-xl animate-bounce group-hover:animate-none" />
              </button>
            </div>
          </section>

          <section id="about-section" className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-200 mb-8">{aboutCopy.title}</h3>
              <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">{aboutCopy.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {aboutCopy.highlights.map(({ title, description, Icon, colorClass }) => (
                    <div key={title} className="bg-gray-700 rounded-lg p-6">
                      <Icon className={`${colorClass} text-3xl mx-auto mb-3`} />
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">{title}</h4>
                      <p className="text-gray-400 text-sm">{description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {aboutCopy.cta}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {selectedSkill && (
              <SkillPopup key={`skill-${selectedSkill.id}`} skill={selectedSkill} onClose={handleClosePopup} />
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </>
  );
};

export default Home;
