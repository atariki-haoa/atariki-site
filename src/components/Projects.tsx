import React from 'react';
import Head from 'next/head';
import { FaProjectDiagram, FaCode, FaLaptopCode, FaServer, FaDatabase, FaStar, FaRocket, FaCogs } from 'react-icons/fa';

const Projects: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
      <Head>
        <title>Proyectos - Ariel Lobos Haoa</title>
        <meta name="description" content="Proyectos - Ariel Lobos Haoa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-8">
        <section className="p-8 bg-gray-800 text-gray-100 rounded-lg my-8">
          <h2 className="text-2xl font-bold text-blue-500 mb-4">
            <FaProjectDiagram className="inline-block w-6 h-6 mr-2" />
            Proyectos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaCode className="inline-block w-6 h-6 mr-2" />
                Sitio Personal de Ariel Lobos
              </h3>
              <p className="mb-4">
              Este es el repositorio del sitio personal de Ariel Lobos Haoa, desarrollado con Next.js. El sitio muestra mis habilidades, proyectos y pasiones.
              </p>
              <a href="https://github.com/atariki-haoa/atariki-site" target="_blank" rel="noopener noreferrer">
                <FaStar className="text-yellow-500 mx-auto my-4 animate-bounce" />
              </a>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaServer className="inline-block w-6 h-6 mr-2" />
                API REST para bares con MongoDB
              </h3>
              <p className="mb-4">
              API RESTful desarrollada en Node.js y MongoDB para la gestión de un bar, proporcionando endpoints para manejar operaciones como la creación, actualización, eliminación y consulta de datos relacionados con el bar.
              </p>
              <a href="https://github.com/atariki-haoa/ApiRestBar_MongoDB" target="_blank" rel="noopener noreferrer">
                <FaRocket className="text-red-500 mx-auto my-4 animate-bounce" />
              </a>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaDatabase className="inline-block w-6 h-6 mr-2" />
                Plantilla base en Next.js
              </h3>
              <p className="mb-4">
               Proyecto para crear un sistema base para proyectos en Next.js utilizando TypeScript.
              </p>
              <a href="https://github.com/atariki-haoa/next-base-system" target="_blank" rel="noopener noreferrer">
                <FaCogs className="text-green-500 mx-auto my-4 animate-bounce" />
              </a>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaLaptopCode className="inline-block w-6 h-6 mr-2" />
                Chile en GeoJSON format
              </h3>
              <p className="mb-4">
                Proyecto para exportar los datos de Chile a GeoJSON format.
              </p>
              <a href="https://github.com/atariki-haoa/geo" target="_blank" rel="noopener noreferrer">
                <FaRocket className="text-blue-500 mx-auto my-4 animate-bounce" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Projects;
