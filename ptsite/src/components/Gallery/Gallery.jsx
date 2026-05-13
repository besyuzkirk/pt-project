import React from 'react';
import { motion } from 'framer-motion';
import './Gallery.css';

// Import all generated visual assets
import img1 from '../../assets/images/hero_bg.png';
import img2 from '../../assets/images/action_bg.png';
import img3 from '../../assets/images/cardio.png';
import img4 from '../../assets/images/functional.png';

const Gallery = () => {
  const images = [
    {
      src: img1,
      title: "Ana Antrenman Alanı",
      category: "Güç",
      size: "large"
    },
    {
      src: img3,
      title: "Kardiyo Parkuru",
      category: "Kondisyon",
      size: "small"
    },
    {
      src: img4,
      title: "Fonksiyonel Alan",
      category: "Mobilite",
      size: "small"
    },
    {
      src: img2,
      title: "Serbest Ağırlık",
      category: "Odak",
      size: "large"
    }
  ];

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">STÜDYO</span>
          <h2 className="section-title text-gradient-red">ATMOSFERİ YAŞAYIN</h2>
        </div>

        <div className="gallery-grid">
          {images.map((item, index) => (
            <motion.div
              key={index}
              className={`gallery-item ${item.size}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <div className="gallery-img-wrapper">
                <img src={item.src} alt={item.title} className="gallery-img" />
                <div className="gallery-overlay">
                  <span className="gallery-tag">{item.category}</span>
                  <h3 className="gallery-item-title">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
