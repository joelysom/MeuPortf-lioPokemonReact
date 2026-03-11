import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/portfolioselection.css';
import profileImg from '../assets/profile/Pikachu.png';

const PortfolioSelection = () => {
  const navigate = useNavigate();
  const [starCount, setStarCount] = useState(50);

  useEffect(() => {
    const handleResize = () => {
      // Reduzir drasticamente em mobile
      setStarCount(window.innerWidth <= 768 ? 8 : 50);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClassicPortfolio = () => {
    navigate('/portfolio-simple');
  };

  const handleThemedPortfolio = () => {
    navigate('/start');
  };

  return (
    <div className="portfolio-selection">
      {/* Shooting Stars Background */}
      <div className="night">
        {[...Array(starCount)].map((_, i) => (
          <div key={i} className="shooting_star"></div>
        ))}
      </div>

      <div className="selection-container">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="neon-circle">
            <img src={profileImg} alt="Profile" className="profile-img" />
          </div>
          <h1 className="profile-name">Joelyson Alcantara da Silva</h1>
          <p className="profile-subtitle">Desenvolvedor | FullStack</p>
        </div>

        {/* Options Section */}
        <div className="options-section">
          <button 
            className="portfolio-btn classic-btn"
            onClick={handleClassicPortfolio}
          >
            <span className="btn-label">Portfólio Clássico</span>
            <span className="btn-description">Interface limpa e profissional</span>
          </button>

          <button 
            className="portfolio-btn themed-btn"
            onClick={handleThemedPortfolio}
          >
            <span className="btn-label">Portfólio Imersivo</span>
            <span className="btn-description">Experiência interativa e dinâmica</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSelection;
