import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Birebir PT',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Deep link dynamically to WhatsApp to actually submit the data instead of backend
    const waMessage = `Merhaba, İletişim formundan ulaşıyorum.%0AAd Soyad: ${formData.name}%0ATelefon: ${formData.phone}%0Aİlgi Alanı: ${formData.service}%0AMesaj: ${formData.message}`;
    window.open(`https://wa.me/905000000000?text=${waMessage}`, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Telefon",
      value: "+90 500 000 00 00",
      link: "tel:+905000000000"
    },
    {
      icon: <Mail size={24} />,
      title: "E-posta",
      value: "info@cemcaglayanpt.com",
      link: "mailto:info@cemcaglayanpt.com"
    },
    {
      icon: <Instagram size={24} />,
      title: "Instagram",
      value: "@cemcaglayan.pt",
      link: "https://instagram.com"
    },
    {
      icon: <MapPin size={24} />,
      title: "Stüdyo Konumu",
      value: "Caddebostan, Bağdat Cd. No:123 Kadıköy / İstanbul",
      link: "https://maps.google.com"
    }
  ];

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">İLETİŞİM</span>
          <h2 className="section-title text-gradient-red">HAREKETE GEÇİN</h2>
        </div>

        <div className="contact-grid">
          {/* Contact Cards / Details */}
          <motion.div 
            className="contact-details"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="contact-subheading">SORULARINIZ MI VAR?</h3>
            <p className="contact-text">
              Size en uygun programı seçmek, fiyat bilgisi almak veya deneme seansı rezervasyonu yapmak için bizimle iletişime geçin. Ekibimiz 24 saat içinde dönüş yapacaktır.
            </p>

            <div className="contact-cards-list">
              {contactInfo.map((info, i) => (
                <a 
                  href={info.link} 
                  key={i} 
                  className="contact-info-card glass-card"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div className="contact-icon-circle">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="info-card-title">{info.title}</h4>
                    <p className="info-card-value">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="contact-form-wrapper glass-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="form-heading">BİLGİ TALEP FORMU</h3>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">ADINIZ SOYADINIZ</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  placeholder="Örn: Ahmet Yılmaz" 
                  className="form-input" 
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">TELEFON NUMARANIZ</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  placeholder="Örn: 0530 000 0000" 
                  className="form-input" 
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="service" className="form-label">İLGİLENDİĞİNİZ HİZMET</label>
                <select 
                  id="service" 
                  name="service"
                  className="form-input select-input"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="Birebir PT">Birebir PT (Yüz Yüze)</option>
                  <option value="Online Koçluk">Online Koçluk (Uzaktan)</option>
                  <option value="Beslenme Planlama">Beslenme Planlaması</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">MESAJINIZ (OPSİYONEL)</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows="4" 
                  placeholder="Hedeflerinizden kısaca bahsedin..." 
                  className="form-input textarea-input"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block submit-btn">
                <span>GÖNDER</span>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
