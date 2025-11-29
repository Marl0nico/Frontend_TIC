import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const LandinPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="bg-white px-10 md:px-20 lg:px-40 dark:bg-gray-800 min-h-screen transition-colors duration-300">
        <section>
          <nav className="p-10 mb-12 flex justify-between">
            <h1 className="text-2xl font-bold dark:text-white">U-Connect</h1>
            <ul className="flex items-center gap-4">
              <li>
                <motion.button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    rotate: darkMode ? 360 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {darkMode ? (
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </motion.button>
              </li>
              <li>
                <Link
                  to="/login"
                  className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors duration-300"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl py-2 text-teal-600 font-medium md:text-6xl">
              U-Connect
            </h2>
            <h3 className="text-2xl py-2 md:text-3xl dark:text-white">
              Tu Comunidad Universitaria Digital
            </h3>
            <p className="text-md py-5 leading-8 text-gray-800 md:text-xl max-w-2xl mx-auto dark:text-white">
              Conecta con estudiantes de PUCE, Salesiana y EPN en tiempo real.
              Comparte experiencias, recursos y construye una red académica más
              fuerte.
            </p>
          </div>

          <div className="flex justify-center gap-8 py-8">
            <div className="text-center p-4">
              {darkMode ? (
                <img
                  src="/images/puce.png"
                  alt="PUCE"
                  className="rounded-3xl border-4 border-teal-500 mx-auto"
                  width={200}
                  height={200}
                />
              ) : (
                <img
                  src="/images/pucelight.png"
                  alt="PUCE"
                  className="rounded-3xl border-4 border-teal-500 mx-auto"
                  width={200}
                  height={200}
                />
              )}
              <p className="mt-2 font-medium dark:text-white">PUCE</p>
            </div>
            <div className="text-center p-4">
              {darkMode ? (
                <img
                  src="/images/salesiana.png"
                  alt="salesiana"
                  className="rounded-3xl aspect-auto border-4 border-teal-500 mx-auto"
                  width={200}
                  height={200}
                />
              ) : (
                <img
                  src="/images/salesianalight.jpg"
                  alt="salesiana"
                  className="rounded-3xl aspect-square border-4 border-teal-500 mx-auto"
                  width={200}
                  height={200}
                />
              )}
              <p className="mt-2 font-medium dark:text-white">UPS</p>
            </div>
            <div className="text-center p-4">
              {darkMode ? (
                <img
                  src="/images/logo-epn-web.svg"
                  alt="EPN"
                  className="rounded-3xl aspect-square border-4 border-teal-500 mx-auto"
                  width={200}
                  height={200}
                />
              ) : (
                <img
                  src="/images/epnlight.png"
                  alt="EPN"
                  className="rounded-3xl aspect-square border-4 border-teal-500 mx-auto"
                  width={200}
                  height={200}
                />
              )}
              <p className="mt-2 font-medium dark:text-white">EPN</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl py-1 dark:text-white">
              Características Principales
            </h3>
            <p className="text-md py-2 leading-8 text-gray-800 dark:text-white">
              Descubre una nueva forma de conectar con tu comunidad
              universitaria a través de nuestra plataforma diseñada
              específicamente para estudiantes de la {" "}
              <span className="text-teal-500">PUCE</span>,{" "}
              <span className="text-teal-500">Salesiana</span> y{" "}
              <span className="text-teal-500">EPN</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">
                Chat en Tiempo Real
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comunícate instantáneamente con otros estudiantes de tu
                universidad o participa en chats interuniversitarios.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">
                Recursos Compartidos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comparte y accede a recursos académicos, apuntes y materiales de
                estudio específicos de tu universidad.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">
                Comunidades Exclusivas
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Únete a grupos específicos de tu carrera o intereses, y conecta
                con estudiantes que comparten tus objetivos.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl mb-8 dark:text-white">
              ¿Listo para conectar?
            </h3>
            <Link
              to="/register"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-teal-700 transition-colors duration-300"
            >
              Únete Ahora
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandinPage;
