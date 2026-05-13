import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import './Hero.css';
import nameLogoImg from '../../assets/brand/namelogo.png';
import heroBgImg from '../../assets/images/hero_bg.png';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Image with Overlay */}
      <div 
        className="hero-background" 
        style={{ backgroundImage: `url(${heroBgImg})` }}
      >
        <div className="hero-overlay"></div>
      </div>

      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Name Logo Asset */}
          <motion.div className="hero-logo-wrapper" variants={itemVariants}>
            <img src={nameLogoImg} alt="PT Cem Çağlayan Personal Training Studio" className="hero-name-logo" />
          </motion.div>

          <motion.span className="hero-badge" variants={itemVariants}>
            SINCE 2023 | PERSONAL TRAINING STUDIO
          </motion.span>

          <motion.h1 className="hero-title" variants={itemVariants}>
            POTANSİYELİNİ <br />
            <span className="text-gradient-red">KEŞFET,</span> SINIRLARI <br />
            <span>ZORLA.</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={itemVariants}>
            Sıradan antrenmanları geride bırak. Cem Çağlayan PT Studio ile tamamen sana özel, 
            bilimsel temellere dayanan ve hedeflerine en hızlı şekilde ulaşmanı sağlayan premium koçluk deneyimi.
          </motion.p>

          <motion.div className="hero-actions" variants={itemVariants}>
            <a href="#contact" className="btn btn-primary btn-lg">
              <span>HEMEN BAŞLA</span>
              <ChevronRight size={20} />
            </a>
            <a href="#services" className="btn btn-outline btn-lg">
              <span>HİZMETLERİMİZ</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom subtle scroll indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="scroll-text">KAYDIRIN</span>
        <div className="scroll-line"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
