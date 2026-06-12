import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { API_BASE_URL } from '@/lib/config';

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
      const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const textResponse = await response.text();

      let data: ApiResponse;
      try {
        data = JSON.parse(textResponse);
      } catch {
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
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">
          {/* Info panel */}
          <div className="space-y-6 lg:pt-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get in touch</h1>
              <p className="mt-3 text-text-secondary text-base leading-relaxed">
                Questions about plans, the API, or anything else? Send us a message and
                we&rsquo;ll get back to you within one business day.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email us</div>
                  <div className="text-sm text-text-secondary">
                    Use the form — it goes straight to the team.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-medium">Support</div>
                  <div className="text-sm text-text-secondary">
                    Include your account email for billing or API issues.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-medium">Response time</div>
                  <div className="text-sm text-text-secondary">Typically within 24 hours.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="p-6 md:p-8" hover={false}>
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-success" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold">Message sent</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Thanks for reaching out — we&rsquo;ll get back to you soon.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg border border-error/40 bg-error/10 text-error text-sm"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    placeholder="Tell us how we can help…"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'submitting'}
                  isLoading={status === 'submitting'}
                  className="w-full sm:w-auto"
                >
                  Send message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
