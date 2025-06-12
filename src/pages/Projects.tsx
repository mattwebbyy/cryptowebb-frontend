// src/pages/Projects.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Neural Network Visualizer',
    description: 'A real-time visualization of neural network processing using WebGL',
    tags: ['TypeScript', 'WebGL', 'React', 'Three.js'],
  },
  {
    id: 2,
    title: 'Quantum Encryption System',
    description: 'End-to-end encrypted messaging system with quantum-resistant algorithms',
    tags: ['Rust', 'WebAssembly', 'React', 'Node.js'],
  },
  // Add more projects as needed
];

const Projects = () => {
  // Using Tailwind's dark: modifier instead of custom theme logic

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl mb-8 text-center text-teal-600 dark:text-matrix-green">PROJECTS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: project.id * 0.2 }}
            >
              <Card className="h-full">
                <h2 className="text-2xl mb-4 text-teal-600 dark:text-matrix-green">{project.title}</h2>
                <p className="mb-4 text-teal-600/80 dark:text-matrix-green/80">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm border border-teal-600/50 dark:border-matrix-green/50 rounded-sm text-teal-600/80 dark:text-matrix-green/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Projects;
