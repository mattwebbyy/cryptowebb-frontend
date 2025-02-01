// src/pages/Contact.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Add your form submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8">
          <h1 className="text-4xl mb-8 text-center">CONTACT</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full"
            >
              {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-matrix-green"
              >
                Message sent successfully!
              </motion.p>
            )}
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Contact;