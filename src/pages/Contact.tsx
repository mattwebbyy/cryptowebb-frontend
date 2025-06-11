import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse {
  success?: boolean;
  message: string;
  id?: string;
  error?: string;
}

const Contact = () => {
  const { theme } = useTheme();
  
  // Color classes based on theme - always use teal in light mode
  const getColorClasses = () => {
    if (theme.mode === 'light') {
      return {
        primary: 'text-teal-600',
        primaryBg: 'bg-teal-600',
        primaryBorder: 'border-teal-600',
        primaryFocus: 'focus:ring-teal-600',
        surface: 'bg-white/90 border-teal-600',
        input: 'bg-white/70 border-teal-600'
      };
    } else {
      return {
        primary: 'text-matrix-green',
        primaryBg: 'bg-matrix-green',
        primaryBorder: 'border-matrix-green',
        primaryFocus: 'focus:ring-matrix-green',
        surface: 'bg-black/90 border-matrix-green',
        input: 'bg-black/50 border-matrix-green'
      };
    }
  };

  const colorClasses = getColorClasses();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      console.log('Using API URL:', API_URL); // Debug log

      const response = await fetch(`${API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Remove credentials: 'include' since we don't need it for this public endpoint

      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      let data: ApiResponse;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      console.error('Contact form submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className={`p-8 px-24 ${colorClasses.surface}`}>
          <h1 className={`text-4xl mb-8 text-center ${colorClasses.primary} font-mono`}>CONTACT</h1>

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 border border-red-500 text-red-500 bg-black/50 font-mono"
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={`block mb-2 ${colorClasses.primary} font-mono`}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full ${colorClasses.input} p-2 focus:outline-none focus:ring-2 ${colorClasses.primaryFocus} ${colorClasses.primary} font-mono`}
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className={`block mb-2 ${colorClasses.primary} font-mono`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full ${colorClasses.input} p-2 focus:outline-none focus:ring-2 ${colorClasses.primaryFocus} ${colorClasses.primary} font-mono`}
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className={`block mb-2 ${colorClasses.primary} font-mono`}>
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className={`w-full ${colorClasses.input} p-2 focus:outline-none focus:ring-2 ${colorClasses.primaryFocus} ${colorClasses.primary} font-mono`}
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Message subject"
              />
            </div>

            <div>
              <label htmlFor="message" className={`block mb-2 ${colorClasses.primary} font-mono`}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`w-full ${colorClasses.input} p-2 focus:outline-none focus:ring-2 ${colorClasses.primaryFocus} ${colorClasses.primary} font-mono resize-none`}
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={5000}
                placeholder="Your message here..."
              />
            </div>

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full ${colorClasses.primaryBg} ${theme.mode === 'light' ? 'hover:bg-teal-600/80 text-white' : 'hover:bg-matrix-green/80 text-black'} font-mono transition-colors duration-200`}
            >
              {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 p-4 border ${colorClasses.primaryBorder} ${colorClasses.primary} ${theme.mode === 'light' ? 'bg-teal-600/10' : 'bg-black/50'} font-mono text-center`}
              >
                <p>Message sent successfully!</p>
                <p className="text-sm mt-2">We'll get back to you soon.</p>
              </motion.div>
            )}
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Contact;
