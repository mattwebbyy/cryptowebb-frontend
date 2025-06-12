// src/pages/About.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card'; // Use your existing Card component
import { TypeAnimation } from 'react-type-animation';
import React from 'react';
// Shiba ASCII Art Component
const ShibaAsciiArt = () => {
  const art = `
                      ▄       ▄
                    ▌▒█     ▄▀▒▌
                    ▌▒▒█   ▄▀▒▒▒▐
                   ▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
                 ▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
               ▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
              ▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌
              ▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
             ▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌
             ▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌
            ▌▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐
           ▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
           ▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐
            ▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌
            ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐
             ▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌
               ▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀
                 ▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀
                     ▒▒▒▒▒▒▒▒▒▒▀▀



[ SYSTEM_INFO // NODE_AB84 ]

 > Connection Status:  SECURE [TLSv1.3]
 > Data Integrity:     VERIFIED [SHA-256]
 > Node Uptime:        481d 11h 07m 52s
 > Core Temp:          31.8°C
 > Access Level:       USER_AUTHENTICATED
 +------------------------------------------+
 |   Initializing analysis protocols...     |
 |   Data streams synchronizing...          |
 |   Awaiting operator input.               |
 +------------------------------------------+
`;

  return (
    <motion.pre
      variants={itemVariants} // Use variants from parent
      className="text-xs font-mono text-teal-600/90 dark:text-matrix-green/90 overflow-x-auto whitespace-pre leading-tight mb-6 bg-teal-600/10 dark:bg-black/20 p-3 rounded border border-teal-600/30 dark:border-matrix-green/30 shadow-inner shadow-teal-600/10 dark:shadow-matrix-green/10 text-center"
    >
      {art}
    </motion.pre>
  );
};

// Matrix System Info ASCII Art Component
const MatrixSystemInfoArt = () => {
  const art = `


`;
  return (
    <motion.pre
      variants={itemVariants} // Use variants from parent
      className="text-xs md:text-sm font-mono text-matrix-green/80 overflow-x-auto whitespace-pre leading-relaxed mt-8 mb-6 bg-black/30 p-4 rounded-md border border-matrix-green/30 shadow-inner shadow-matrix-green/10"
    >
      {art}
    </motion.pre>
  );
};

// Animation variants defined once
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Adjust stagger timing
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const About = () => {
  // Using Tailwind's dark: modifier instead of custom theme logic
  
  // Define the full sequence of text for height calculation and animation
  const fullTextSequence = [
    "Welcome, operator. You've accessed the informational node for the CRYPTOWEBB Analysis Core.",
    'This terminal provides high-fidelity insights derived from complex data streams across the digital ether.',
    `Our architecture leverages quantum entanglement processors (simulated) and neural network heuristics\nto decode market volatility, identify subterranean trends, and project potential futures within the cryptocurrency landscape.`,
    `Data integrity is paramount; all feeds are cross-referenced and validated against decentralized oracles.`,
    `Navigate the available dashboards and data sources using the sidebar matrix. Configure your parameters,\nvisualize the flow, and extract the signal from the noise.`,
    `Remember, the data flows constantly; adapt or be deprecated.`,
  ].join('\n'); // Join with newlines to mimic final structure

  // Create the sequence array for TypeAnimation
  const animationSequence = [
    'Welcome, operator.',
    1000,
    "Welcome, operator. You've accessed the informational node for the CRYPTOWEBB Analysis Core.",
    1000,
    "Welcome, operator. You've accessed the informational node for the CRYPTOWEBB Analysis Core.\nThis terminal provides high-fidelity insights derived from complex data streams across the digital ether.",
    2000,
    `Our architecture leverages quantum entanglement processors (simulated) and neural network heuristics\nto decode market volatility, identify subterranean trends, and project potential futures within the cryptocurrency landscape.`,
    1500,
    `Our architecture leverages quantum entanglement processors (simulated) and neural network heuristics\nto decode market volatility, identify subterranean trends, and project potential futures within the cryptocurrency landscape.\nData integrity is paramount; all feeds are cross-referenced and validated against decentralized oracles.`,
    2500,
    `Navigate the available dashboards and data sources using the sidebar matrix. Configure your parameters,\nvisualize the flow, and extract the signal from the noise.`,
    1500,
    `Navigate the available dashboards and data sources using the sidebar matrix. Configure your parameters,\nvisualize the flow, and extract the signal from the noise.\nRemember, the data flows constantly; adapt or be deprecated.`,
    5000,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/90 dark:bg-black/80 border-teal-600 dark:border-matrix-green border-2 shadow-lg shadow-teal-600/20 dark:shadow-matrix-green/20 text-teal-600 dark:text-matrix-green font-mono backdrop-blur-sm p-6 md:p-8 overflow-hidden">
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold tracking-wider text-center border-b border-teal-600/30 dark:border-matrix-green/30 pb-4 mb-6"
          >
            ABOUT THE SYSTEM
          </motion.h1>

          {/* Shiba ASCII Art */}
          <ShibaAsciiArt />

          {/* Content Section Wrapper with Min Height */}
          <motion.div
            variants={itemVariants}
            // Set min-height to prevent card resize. Adjust value as needed.
            // Tailwind classes like min-h-[200px] or min-h-[16rem] can work.
            // Or use inline style for precise pixel values.
            // We'll use an arbitrary class here, adjust the value based on final text height.
            className="space-y-4 text-teal-600/70 dark:text-matrix-green/70 leading-relaxed text-sm md:text-base min-h-[180px] md:min-h-[150px]" // Example min-height
          >
            {/* Hidden text block to establish the full height needed */}
            <p className="invisible h-0 overflow-hidden whitespace-pre-line" aria-hidden="true">
              {fullTextSequence}
            </p>

            {/* Typing Animation */}
            <TypeAnimation
              sequence={animationSequence}
              wrapper="div" // Use div to contain the paragraphs correctly
              cursor={true}
              repeat={0}
              style={{ whiteSpace: 'pre-line', display: 'block' }}
              speed={80} // Slightly slower typing
              deletionSpeed={90}
            />
          </motion.div>

          {/* Matrix System Info Art */}

          {/* Footer line */}
          <motion.p
            variants={itemVariants}
            className="text-teal-600/60 dark:text-matrix-green/60 text-xs md:text-sm border-t border-teal-600/30 dark:border-matrix-green/30 pt-4 mt-8"
          >
            // System Version: 3.14.1-GAMMA // Secure Connection Established // END_OF_TRANSMISSION
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
};

export default About;
