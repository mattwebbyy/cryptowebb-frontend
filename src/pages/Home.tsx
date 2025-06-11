import { Link } from 'react-router-dom';
import { FloatingIcons } from '@/components/matrix/FloatingIcons';

const Home = () => {
  return (
    <>
      <FloatingIcons />

      <h1
        className="text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 opacity-0 glitch-in hover-glow text-center"
        style={{
          animationDelay: '0.5s',
          textShadow: '0 0 10px #33ff33',
        }}
      >
        WELCOME TO THE CryptoWebb
      </h1>

      <nav className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 fade-in px-4 sm:px-0" style={{ animationDelay: '1s' }}>
        <Link
          to="/about"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border border-[#33ff33] relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
        >
          ABOUT
        </Link>
        <Link
          to="/projects"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border border-[#33ff33] relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
        >
          PROJECTS
        </Link>
        <Link
          to="/contact"
          className="matrix-link px-4 sm:px-6 py-3 sm:py-2 border border-[#33ff33] relative overflow-hidden transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
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
          className="matrix-link px-6 sm:px-8 py-3 border border-[#33ff33] relative overflow-hidden transition-all duration-300 text-center bg-[#33ff33]/10 hover:bg-[#33ff33]/20 min-h-[44px] flex items-center justify-center w-full sm:w-auto max-w-xs"
        >
          Start Free Trial
        </Link>
      </div>

      <div
        className="max-w-2xl mx-auto text-left p-4 md:p-6 border border-[#33ff33] bg-[#001400]/30 opacity-0 type-in relative overflow-hidden mx-4 sm:mx-auto"
        style={{ animationDelay: '1.5s' }}
      >
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-[#33ff33]/70 text-sm sm:text-base">
          Initializing secure connection...
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-[#33ff33]/70 text-sm sm:text-base">
          Access granted
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-[#33ff33]/70 text-sm sm:text-base">
          Enter the digital realm where possibilities are infinite
        </p>
        <span className="inline-block w-2.5 h-[1.2em] bg-[#33ff33] align-middle ml-2 blink"></span>
      </div>
    </>
  );
};

export default Home;
