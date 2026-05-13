import React from 'react';
import NavBar from './components/NavBar/NavBar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import Gallery from './components/Gallery/Gallery';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <>
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Sections */}
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp CTA */}
      <motion.a
        href="https://wa.me/905000000000?text=Merhaba%20bilgi%20almak%20istiyorum"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp ile İletişime Geç"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="whatsapp-pulse"></div>
        {/* We use Lucide MessageSquare or generate a simple SVG for WhatsApp icon */}
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.063 5.264 5.325 0 11.783 0c3.13.001 6.071 1.221 8.284 3.436 2.212 2.214 3.43 5.157 3.43 8.287 0 6.461-5.262 11.723-11.72 11.723-2.007-.001-3.978-.517-5.717-1.497L0 24zm6.05-3.373l.363.216c1.648.978 3.543 1.495 5.48 1.496 5.732 0 10.397-4.664 10.399-10.397.001-2.779-1.081-5.391-3.048-7.359-1.966-1.967-4.58-3.05-7.363-3.051-5.735 0-10.401 4.666-10.403 10.399-.001 2.174.643 4.299 1.86 6.12l.24.359-1.001 3.655 3.737-.98zm12.179-9.363c-.316-.158-1.87-.922-2.16-.1.027-.291-.158-.316-.233s-.55-.709-.817-.817c-.266-.108-.44-.158-.626.125-.187.283-.72.9-.881 1.083-.162.184-.324.208-.64.05-.316-.158-1.337-.493-2.546-1.571-.941-.84-1.576-1.878-1.76-2.194-.184-.317-.02-.488.138-.644.142-.141.316-.367.475-.55.158-.183.21-.313.316-.522.106-.21.053-.392-.026-.55-.079-.158-.72-1.733-.986-2.374-.26-.625-.525-.54-.72-.55-.186-.01-.399-.012-.612-.012s-.56.08-.852.4c-.293.32-1.119 1.094-1.119 2.669 0 1.576 1.147 3.1 1.306 3.312.159.212 2.258 3.449 5.47 4.838.764.331 1.36.529 1.824.677.769.244 1.468.21 2.02.127.617-.092 1.87-.765 2.134-1.504.264-.74.264-1.373.185-1.503-.078-.131-.292-.209-.608-.368z" />
        </svg>
      </motion.a>
    </>
  );
}

export default App;
