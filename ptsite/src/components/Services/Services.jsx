import React from 'react';
import { motion } from 'framer-motion';
import { Check, Dumbbell, Globe, Apple } from 'lucide-react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <Dumbbell size={40} />,
      title: "Birebir PT",
      subtitle: "Bireysel Antrenman",
      description: "Stüdyomuzda, tamamen sizin hedeflerinize ve biyomekaniğinize odaklanan, her saniyesi gözetim altında geçen birebir eğitim programı.",
      features: [
        "Kişiye Özel Antrenman Planlaması",
        "Hareket Formu ve Postür Analizi",
        "Birebir Eğitmen Gözetimi",
        "Detaylı Vücut Kompozisyon Ölçümü",
        "Gelişim ve Performans Takibi"
      ],
      highlight: true,
      delay: 0.1
    },
    {
      icon: <Globe size={40} />,
      title: "Online Koçluk",
      subtitle: "Uzaktan Eğitim",
      description: "Nerede olursanız olun, Cem Çağlayan güvencesiyle profesyonel rehberlik. Akıllı planlama ile hedefinize kendi salonunuzda ulaşın.",
      features: [
        "Haftalık Program Güncellemeleri",
        "Uygulama Üzerinden Video Takibi",
        "7/24 Soru-Cevap ve İletişim",
        "Form Analizi ve Geri Bildirimler",
        "Motivasyon Desteği"
      ],
      highlight: false,
      delay: 0.3
    },
    {
      icon: <Apple size={40} />,
      title: "Beslenme Planlama",
      subtitle: "Diyet & Supplement",
      description: "Antrenmanın gücünü doğru yakıtla birleştirin. Sürdürülebilir, sevdiğiniz yiyeceklerden oluşan, hedefinizi destekleyen kalori planlaması.",
      features: [
        "Makro ve Kalori Hesaplamaları",
        "Alternatifli Besin Tabloları",
        "Supplement (Ek Gıda) Rehberliği",
        "Haftalık Form Kontrolü",
        "Yaşam Tarzına Uygun Entegrasyon"
      ],
      highlight: false,
      delay: 0.5
    }
  ];

  return (
    <section id="services" className="services-section section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">NE SUNUYORUZ?</span>
          <h2 className="section-title">HİZMETLERİMİZ</h2>
          <p className="section-desc-center">
            Her birey farklıdır. Sizin için en etkili olacak programı seçin ve dönüşüme bugün başlayın.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`service-card ${service.highlight ? 'highlighted' : 'glass-card'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: service.delay }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              {service.highlight && <div className="card-badge">EN ÇOK TERCİH EDİLEN</div>}

              <div className="service-header">
                <div className="service-icon-box">
                  {service.icon}
                </div>
                <div>
                  <h3 className="service-card-title">{service.title}</h3>
                  <span className="service-card-subtitle">{service.subtitle}</span>
                </div>
              </div>

              <p className="service-description">{service.description}</p>

              <div className="service-divider"></div>

              <ul className="service-features-list">
                {service.features.map((feat, fIndex) => (
                  <li key={fIndex} className="service-feature-item">
                    <Check size={16} className="check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/905000000000?text=Merhaba,%20${encodeURIComponent(service.title)}%20hizmetiniz%20hakkında%20bilgi%20almak%20istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-block service-btn ${service.highlight ? 'btn-primary' : 'btn-outline'}`}
              >
                DETAYLI BİLGİ AL
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
