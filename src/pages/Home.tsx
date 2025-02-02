import { Link } from 'react-router-dom';
import { FloatingIcons } from '@/components/matrix/FloatingIcons';

const Home = () => {
  return (
    <>
      {/* Add this div for the auth buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 fade-in"
           style={{ animationDelay: '0.3s' }}>
        <Link 
          to="/login"
          className="text-sm px-4 py-1.5 border border-matrix-green bg-black/50 hover:bg-matrix-green/20 transition-all duration-300 flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></span>
          INITIALIZE
        </Link>
        <Link 
          to="/signup"
          className="text-sm px-4 py-1.5 border border-matrix-green/50 hover:border-matrix-green bg-black/30 hover:bg-matrix-green/10 transition-all duration-300"
        >
          REQUEST ACCESS
        </Link>
      </div>

      <FloatingIcons />
      
      <h1 className="text-5xl mb-8 opacity-0 glitch-in hover-glow"
          style={{ 
            animationDelay: '0.5s',
            textShadow: '0 0 10px #33ff33'
          }}>
        WELCOME TO THE CryptoWebb
      </h1>
      
      {/* Rest of your code remains the same */}
      <nav className="mb-8 flex gap-4 opacity-0 fade-in"
           style={{ animationDelay: '1s' }}>
        <Link to="/about" 
              className="matrix-link px-6 py-2 border border-[#33ff33] relative overflow-hidden transition-all duration-300">
          ABOUT
        </Link>
        <Link to="/projects"
              className="matrix-link px-6 py-2 border border-[#33ff33] relative overflow-hidden transition-all duration-300">
          PROJECTS
        </Link>
        <Link to="/contact"
              className="matrix-link px-6 py-2 border border-[#33ff33] relative overflow-hidden transition-all duration-300">
          CONTACT
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto text-left p-4 border border-[#33ff33] bg-[#001400]/30 opacity-0 type-in relative overflow-hidden"
           style={{ animationDelay: '1.5s' }}>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-[#33ff33]/70">
          Initializing secure connection...
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-[#33ff33]/70">
          Access granted
        </p>
        <p className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-[#33ff33]/70">
          Enter the digital realm where possibilities are infinite
        </p>
        <span className="inline-block w-2.5 h-[1.2em] bg-[#33ff33] align-middle ml-2 blink"></span>
      </div>
    </>
  );
};

export default Home;