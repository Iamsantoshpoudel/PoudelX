import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Astronaut SVG (you can replace this with a real image if preferred)
const AstronautSVG = () => (
  <svg
    className="w-40 md:w-60"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="#1a202c" opacity="0.8" />
    <circle cx="100" cy="80" r="40" fill="#e2e8f0" />
    <circle cx="100" cy="80" r="30" fill="#a0aec0" />
    <rect x="80" y="60" width="40" height="20" rx="10" fill="#4a5568" />
    <circle cx="90" cy="70" r="5" fill="#000" />
    <circle cx="110" cy="70" r="5" fill="#000" />
    <path
      d="M60 120 Q80 140 100 120 Q120 140 140 120"
      stroke="#e2e8f0"
      strokeWidth="4"
      fill="none"
    />
    <path
      d="M70 150 L60 180 M130 150 L140 180"
      stroke="#e2e8f0"
      strokeWidth="4"
      fill="none"
    />
  </svg>
);

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Animation for the astronaut
  const astronautVariants = {
    initial: { opacity: 0, y: 50, rotate: 10 },
    animate: {
      opacity: 1,
      y: 0,
      rotate: [-10, 10, -10],
      transition: {
        duration: 1.5,
        ease: "easeOut",
        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
      },
    },
  };

  // Animation for text
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay },
    }),
  };

  // Button hover animation
  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0 10px 20px rgba(0, 255, 255, 0.3)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black font-orbitron text-white py-6 md:py-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Astronaut Illustration */}
          <motion.div
            variants={astronautVariants}
            initial="initial"
            animate="animate"
            className="mb-8 md:mb-12"
          >
            <AstronautSVG />
          </motion.div>

          {/* Text Content */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
            variants={textVariants}
            initial="initial"
            animate="animate"
            custom={0.2}
          >
            Error: 404 Signal Lost
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-md"
            variants={textVariants}
            initial="initial"
            animate="animate"
            custom={0.4}
          >
            You’ve drifted into uncharted space. This page doesn’t exist in our galaxy!
          </motion.p>
          <motion.a
            href="/"
            className="inline-block bg-cyan-500 text-black font-medium py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm md:text-base"
            variants={buttonVariants}
            whileHover="hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6 } }}
          >
            Navigate Back to Earth
          </motion.a>
        </div>
      </div>

      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default NotFound;