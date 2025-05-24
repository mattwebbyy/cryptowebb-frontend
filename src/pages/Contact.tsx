import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
        <Card className="p-8 px-24 bg-black/90 border border-matrix-green">
          <h1 className="text-4xl mb-8 text-center text-matrix-green font-mono">CONTACT</h1>

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
              <label htmlFor="name" className="block mb-2 text-matrix-green font-mono">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green text-matrix-green font-mono"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-matrix-green font-mono">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green text-matrix-green font-mono"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 text-matrix-green font-mono">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green text-matrix-green font-mono"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Message subject"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-matrix-green font-mono">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full bg-black/50 border border-matrix-green p-2 focus:outline-none focus:ring-2 focus:ring-matrix-green text-matrix-green font-mono resize-none"
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
              className="w-full bg-matrix-green hover:bg-matrix-green/80 text-black font-mono transition-colors duration-200"
            >
              {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 border border-matrix-green text-matrix-green bg-black/50 font-mono text-center"
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
