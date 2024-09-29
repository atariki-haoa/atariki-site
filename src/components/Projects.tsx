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
                Proyecto 1
              </h3>
              <p className="mb-4">
                Descripción del proyecto 1. Este proyecto involucró el uso de tecnologías como Node.js, React y MongoDB para crear una aplicación web robusta y escalable.
              </p>
              <FaStar className="text-yellow-500 mx-auto my-4 animate-bounce" />
            </div>
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaServer className="inline-block w-6 h-6 mr-2" />
                Proyecto 2
              </h3>
              <p className="mb-4">
                Descripción del proyecto 2. En este proyecto, trabajé en la implementación de un sistema de gestión de bases de datos utilizando SQL y optimización de consultas.
              </p>
              <FaRocket className="text-red-500 mx-auto my-4 animate-bounce" />
            </div>
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaDatabase className="inline-block w-6 h-6 mr-2" />
                Proyecto 3
              </h3>
              <p className="mb-4">
                Descripción del proyecto 3. Este proyecto se centró en la creación de una API RESTful utilizando Node.js y Express, con autenticación y autorización de usuarios.
              </p>
              <FaCogs className="text-green-500 mx-auto my-4 animate-bounce" />
            </div>
            <div className="p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                <FaLaptopCode className="inline-block w-6 h-6 mr-2" />
                Proyecto 4
              </h3>
              <p className="mb-4">
                Descripción del proyecto 4. Este proyecto involucró el desarrollo de una aplicación móvil utilizando React Native y Firebase.
              </p>
              <FaRocket className="text-blue-500 mx-auto my-4 animate-bounce" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Projects;
