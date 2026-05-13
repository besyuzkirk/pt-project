import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import './NavBar.css';
import logoImg from '../../assets/brand/cemcaglayanlogo.png';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Sayfa', href: '#home' },
    { name: 'Hakkımızda', href: '#about' },
    { name: 'Hizmetler', href: '#services' },
    { name: 'İletişim', href: '#contact' },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container navbar-container">
        {/* Logo */}
        <a href="#home" className="navbar-brand">
          <img src={logoImg} alt="Cem Çağlayan PT Studio" className="navbar-logo" />
          <span className="navbar-title">PT. CEM ÇAĞLAYAN</span>
        </a>

        {/* Desktop Menu */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm navbar-cta">
          <Phone size={16} />
          <span>İLETİŞİME GEÇ</span>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/905000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Phone size={18} />
              <span>İLETİŞİME GEÇ</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
