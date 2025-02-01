// src/pages/About.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

const About = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto">
          <h1 className="text-3xl mb-6">About The System</h1>
          <div className="space-y-4">
            <p>Your journey through the digital realm begins here...</p>
            {/* Add more content */}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default About;
