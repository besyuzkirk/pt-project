import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap } from 'lucide-react';
import './About.css';
import actionImg from '../../assets/images/action_bg.png';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const features = [
    {
      icon: <Award size={36} className="feature-icon" />,
      title: "BİLİMSEL METOD",
      description: "Kulaktan dolma bilgilerle değil, güncel anatomi ve fizyoloji bilimine dayalı antrenman planları hazırlıyoruz."
    },
    {
      icon: <Target size={36} className="feature-icon" />,
      title: "KİŞİYE ÖZEL",
      description: "Yaşam tarzınız, genetiğiniz ve hedefleriniz doğrultusunda tamamen size özel beslenme ve antrenman kurgusu."
    },
    {
      icon: <Zap size={36} className="feature-icon" />,
      title: "MAX PERFORMANS",
      description: "Potansiyelinizin sınırlarını zorlarken sakatlık riskini sıfıra indirerek sürdürülebilir gelişim sağlıyoruz."
    }
  ];

  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        <div className="about-grid">
          {/* Image Content with frame animation */}
          <motion.div 
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img src={actionImg} alt="Cem Çağlayan Antrenman Odak" className="about-img" />
            <div className="about-img-accent"></div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-subtitle">BİZ KİMİZ?</span>
            <h2 className="section-title text-gradient-red">SINIRLARINIZI <br /> YENİDEN ÇİZİN</h2>
            <p className="about-text">
              PT Cem Çağlayan Studio, sadece bir spor salonu değil; fiziksel ve zihinsel bir değişim merkezidir. 
              2023 yılından beri vizyonumuz, üyelerimizin sadece daha iyi görünmelerini sağlamak değil, 
              aynı zamanda hayat boyu sürdürebilecekleri güçlü bir disiplin ve yüksek performans standardı kazanmalarını sağlamaktır.
            </p>
            <p className="about-text">
              Burada her setin bir amacı, her tekrarın bir felsefesi vardır. Kendinizi profesyonel ellere teslim edin.
            </p>
            
            <div className="about-stat">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Memnuniyet</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">300+</span>
                <span className="stat-label">Değişim Hikayesi</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values Cards Grid */}
        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feat, idx) => (
            <motion.div 
              key={idx} 
              className="feature-card glass-card"
              variants={slideUp}
            >
              <div className="icon-wrapper">
                {feat.icon}
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
