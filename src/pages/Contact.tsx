import React, { useState, useEffect } from 'react'; // Import useEffect
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming Button component handles disabled state styling
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Using Card parts for structure
import { Label } from '@/components/ui/label'; // Assuming shadcn/ui structure
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui structure
import { Textarea } from '@/components/ui/textarea'; // Assuming shadcn/ui structure
import { AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react'; // Import icons

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse {
  success?: boolean;
  message: string; // Ensure backend always sends a message
  id?: string;
  error?: string; // Backend might send error message here
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState(''); // Combined state for success/error messages

  // Clear success message after a delay
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setResponseMessage('');
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount or status change
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setResponseMessage(''); // Clear previous messages

    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      console.log('Using API URL:', API_URL);

      const response = await fetch(`${API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Try to parse JSON regardless of status code for more informative errors
      let data: ApiResponse;
      const responseText = await response.text(); // Get text first for debugging
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('Failed to parse server response:', responseText);
        // Use status text or a generic message if parsing fails
        throw new Error(`Server returned an unexpected response (${response.status})`);
      }

      if (!response.ok) {
         // Prefer backend's error message if available
         throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }

      // Assuming success if response is ok and has a success message or ID
      if (data.success === false) { // Handle cases where success might be explicitly false
          throw new Error(data.message || 'Submission failed.');
      }

      setStatus('success');
      setResponseMessage(data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form

    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setResponseMessage(message);
      console.error('Contact form submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Optionally clear error when user starts typing again
    if (status === 'error') {
        setStatus('idle');
        setResponseMessage('');
    }
  };

  return (
    // Use padding on the outer div, not inside the card unless needed
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 pb-12 bg-gradient-to-b from-black via-gray-900 to-black"> {/* Added gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Increased max-width, let mx-auto center it
        className="w-full max-w-4xl" // Changed max-w-2xl to max-w-4xl
      >
        {/* Using Card component parts for better structure (assuming shadcn/ui structure) */}
        {/* Reduced internal padding, especially horizontal */}
        <Card className="bg-black/80 border-2 border-matrix-green shadow-lg shadow-matrix-green/20 text-matrix-green font-mono backdrop-blur-sm">
          <CardHeader className="text-center border-b border-matrix-green/30 pb-4">
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-wider">CONTACT US</CardTitle>
             <p className="text-matrix-green/70 text-sm pt-2">Send us a transmission. We'll respond shortly.</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8"> {/* Adjusted padding */}

            {/* Status Messages */}
            <AnimatePresence>
              {status === 'error' && responseMessage && (
                <motion.div
                  key="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 border border-red-500/50 text-red-400 bg-red-900/20 rounded-md flex items-center gap-3"
                  role="alert"
                >
                   <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{responseMessage}</span>
                </motion.div>
              )}
              {status === 'success' && responseMessage && (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                   className="mb-6 p-4 border border-matrix-green/50 text-matrix-green bg-green-900/20 rounded-md flex items-center gap-3"
                  role="alert"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{responseMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hide form on success */}
            {status !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Grid layout for Name and Email on medium screens and up */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                       <Input
                         type="text"
                         id="name"
                         name="name"
                         className="bg-black/60 border-matrix-green/50 focus:border-matrix-green focus:ring-matrix-green" // Adjusted styles
                         value={formData.name}
                         onChange={handleChange}
                         required
                         maxLength={100}
                         placeholder="Your name"
                       />
                     </div>
                     <div className="space-y-2">
                         <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                         <Input
                             type="email"
                             id="email"
                             name="email"
                             className="bg-black/60 border-matrix-green/50 focus:border-matrix-green focus:ring-matrix-green" // Adjusted styles
                             value={formData.email}
                             onChange={handleChange}
                             required
                             maxLength={100}
                             placeholder="your.email@example.com"
                         />
                     </div>
                 </div>


                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    className="bg-black/60 border-matrix-green/50 focus:border-matrix-green focus:ring-matrix-green" // Adjusted styles
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="Message subject"
                  />
                </div>

                <div className="space-y-2">
                   <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6} // Increased rows
                    className="bg-black/60 border-matrix-green/50 focus:border-matrix-green focus:ring-matrix-green resize-y" // Allow vertical resize
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={5000} // Keep maxLength reasonable
                    placeholder="Your message here..."
                  />
                   {/* Optional: Character counter */}
                   <p className="text-xs text-right text-matrix-green/60">
                       {formData.message.length} / 5000 characters
                   </p>
                </div>

                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  // Consistent button styling
                   className="w-full bg-matrix-green hover:bg-matrix-green/80 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait" // Added flex for icon
                >
                  {status === 'submitting' ? (
                     <Loader2 className="h-5 w-5 animate-spin" /> // Loading spinner
                  ) : (
                     <Send className="h-5 w-5" /> // Send icon
                  )}
                  <span>
                      {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                  </span>
                </Button>
              </form>
             )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Contact;