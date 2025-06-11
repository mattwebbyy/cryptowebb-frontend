// src/pages/Projects.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  
  // Color classes based on theme - always use teal in light mode
  const getColorClasses = () => {
    if (theme.mode === 'light') {
      return {
        primary: 'text-teal-600',
        textSecondary: 'text-teal-600/80',
        border: 'border-teal-600/50',
        text: 'text-teal-600'
      };
    } else {
      return {
        primary: 'text-matrix-green',
        textSecondary: 'text-matrix-green/80',
        border: 'border-matrix-green/50',
        text: 'text-matrix-green'
      };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className={`text-4xl mb-8 text-center ${colorClasses.primary}`}>PROJECTS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: project.id * 0.2 }}
            >
              <Card className="h-full">
                <h2 className={`text-2xl mb-4 ${colorClasses.primary}`}>{project.title}</h2>
                <p className={`mb-4 ${colorClasses.textSecondary}`}>{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-sm border ${colorClasses.border} rounded-sm ${colorClasses.textSecondary}`}
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
