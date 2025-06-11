import { Link } from 'react-router-dom';
import { FloatingIcons } from '@/components/matrix/FloatingIcons';
import { useTheme } from '@/contexts/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  
  // Color classes based on theme - always use teal in light mode
  const getColorClasses = () => {
    if (theme.mode === 'light') {
      return {
        primary: '#059669', // teal-600
        border: '#0d9488', // teal-600
        bg: 'rgba(13, 148, 136, 0.1)', // teal with opacity
        hoverBg: 'rgba(13, 148, 136, 0.2)',
        shadow: '0 0 10px #0d9488'
      };
    } else {
      return {
        primary: '#33ff33', // matrix green
        border: '#33ff33',
        bg: 'rgba(51, 255, 51, 0.1)',
        hoverBg: 'rgba(51, 255, 51, 0.2)',
        shadow: '0 0 10px #33ff33'
      };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <>
      <FloatingIcons />

      <h1
        className={`text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 opacity-0 glitch-in hover-glow text-center`}
        style={{
          animationDelay: '0.5s',
          textShadow: colorClasses.shadow,
          color: colorClasses.primary
        }}
      >
        WELCOME TO THE CryptoWebb
      </h1>

      <nav className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 fade-in px-4 sm:px-0" style={{ animationDelay: '1s' }}>
        <Link
          to="/about"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
          style={{
            borderColor: colorClasses.border,
            color: colorClasses.primary
          }}
        >
          ABOUT
        </Link>
        <Link
          to="/projects"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
          style={{
            borderColor: colorClasses.border,
            color: colorClasses.primary
          }}
        >
          PROJECTS
        </Link>
        <Link
          to="/contact"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
          style={{
            borderColor: colorClasses.border,
            color: colorClasses.primary
          }}
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
          className="matrix-link px-6 sm:px-8 py-3 border relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center w-full sm:w-auto max-w-xs"
          style={{
            borderColor: colorClasses.border,
            backgroundColor: colorClasses.bg,
            color: colorClasses.primary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorClasses.hoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colorClasses.bg;
          }}
        >
          Start Free Trial
        </Link>
      </div>

      <div
        className="max-w-2xl mx-auto text-left p-4 md:p-6 border opacity-0 type-in relative overflow-hidden mx-4 sm:mx-auto"
        style={{ 
          animationDelay: '1.5s',
          borderColor: colorClasses.border,
          backgroundColor: theme.mode === 'light' ? 'rgba(13, 148, 136, 0.05)' : 'rgba(0, 20, 0, 0.3)',
          color: colorClasses.primary
        }}
      >
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 text-sm sm:text-base" style={{ color: `${colorClasses.primary}CC` }}>
          Initializing secure connection...
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 text-sm sm:text-base" style={{ color: `${colorClasses.primary}CC` }}>
          Access granted
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 text-sm sm:text-base" style={{ color: `${colorClasses.primary}CC` }}>
          Enter the digital realm where possibilities are infinite
        </p>
        <span className="inline-block w-2.5 h-[1.2em] align-middle ml-2 blink" style={{ backgroundColor: colorClasses.primary }}></span>
      </div>
    </>
  );
};

export default Home;
