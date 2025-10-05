import { Link } from 'react-router-dom';
import { FloatingIcons } from '@/components/matrix/FloatingIcons';

const Home = () => {
  // Using Tailwind's dark: modifier and CSS custom properties for complex effects

  return (
    <>
      <FloatingIcons />

      <h1
        className="text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 opacity-0 glitch-in hover-glow text-center text-teal-600 dark:text-matrix-green"
        style={{
          animationDelay: '0.5s',
          textShadow: '0 0 10px currentColor',
        }}
      >
        WELCOME TO THE CryptoWebb
      </h1>

      <nav className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 fade-in px-4 sm:px-0" style={{ animationDelay: '1s' }}>
        <Link
          to="/about"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border border-teal-600 dark:border-matrix-green relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center text-teal-600 dark:text-matrix-green"
        >
          ABOUT
        </Link>
        <Link
          to="/projects"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border border-teal-600 dark:border-matrix-green relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center text-teal-600 dark:text-matrix-green"
        >
          PROJECTS
        </Link>
        <Link
          to="/contact"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border border-teal-600 dark:border-matrix-green relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center text-teal-600 dark:text-matrix-green"
        >
          CONTACT
        </Link>
      </nav>

      {/* New free trial button */}
      <div
        className="mb-6 md:mb-8 flex justify-center opacity-0 fade-in px-4 sm:px-0"
        style={{ animationDelay: '1.2s' }}
      >
        <Link
          to="/trial"
          className="matrix-link px-6 sm:px-8 py-3 border border-teal-600 dark:border-matrix-green bg-teal-600/10 dark:bg-matrix-green/10 hover:bg-teal-600/20 dark:hover:bg-matrix-green/20 relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center w-full sm:w-auto max-w-xs text-teal-600 dark:text-matrix-green"
        >
          Start Free Trial
        </Link>
      </div>

      <div
        className="max-w-2xl mx-auto text-left p-4 md:p-6 border border-teal-600 dark:border-matrix-green opacity-0 type-in relative overflow-hidden mx-4 sm:mx-auto bg-teal-600/5 dark:bg-green-900/30 text-teal-600 dark:text-matrix-green"
        style={{ 
          animationDelay: '1.5s'
        }}
      >
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 text-sm sm:text-base text-teal-600/80 dark:text-matrix-green/80">
          Initializing secure connection...
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 text-sm sm:text-base text-teal-600/80 dark:text-matrix-green/80">
          Access granted
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 text-sm sm:text-base text-teal-600/80 dark:text-matrix-green/80">
          Enter the digital realm where possibilities are infinite
        </p>
        <span className="inline-block w-2.5 h-[1.2em] align-middle ml-2 blink bg-teal-600 dark:bg-matrix-green"></span>
      </div>
    </>
  );
};

export default Home;
