import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import './Footer.css';
import logoImg from '../../assets/brand/cemcaglayanlogo.png';

const Instagram = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Footer Brand */}
        <div className="footer-brand-section">
          <div className="footer-logo-wrapper">
            <img src={logoImg} alt="PT Cem Çağlayan" className="footer-logo" />
            <span className="footer-brand-name">PT. CEM ÇAĞLAYAN</span>
          </div>
          <p className="footer-brand-tagline">
            Bilim, Disiplin ve Maksimum Performans. 2023'ten beri hayatları dönüştürüyoruz.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="mailto:info@cemcaglayanpt.com" className="footer-social-link" aria-label="Eposta">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4 className="footer-col-title">HIZLI MENÜ</h4>
            <ul className="footer-list">
              <li><a href="#home">Ana Sayfa</a></li>
              <li><a href="#about">Hakkımızda</a></li>
              <li><a href="#services">Hizmetler</a></li>
              <li><a href="#contact">İletişim</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">HİZMETLER</h4>
            <ul className="footer-list">
              <li><a href="#services">Birebir PT</a></li>
              <li><a href="#services">Online Koçluk</a></li>
              <li><a href="#services">Beslenme Danışmanlığı</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="container footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} Cem Çağlayan PT Studio. Tüm Hakları Saklıdır.
        </p>
        <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Yukarı Çık">
          <span>BAŞA DÖN</span>
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
