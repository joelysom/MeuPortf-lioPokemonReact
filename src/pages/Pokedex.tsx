import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/pokedex.css";

interface PortfolioItem {
  id: number;
  title: string;
  type: string;
  description: string;
  skills: string[];
  level: number;
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    type: "Web Application",
    description: "Plataforma completa de e-commerce com carrinho, pagamentos e painel administrativo.",
    skills: ["React", "Node.js", "MongoDB", "Stripe"],
    level: 85
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    type: "Mobile Development",
    description: "Aplicativo de fitness com tracking de exercícios e planos personalizados.",
    skills: ["React Native", "Firebase", "Redux"],
    level: 78
  },
  {
    id: 3,
    title: "AI Chatbot",
    type: "Machine Learning",
    description: "Chatbot inteligente com processamento de linguagem natural para atendimento.",
    skills: ["Python", "TensorFlow", "NLP", "FastAPI"],
    level: 92
  },
  {
    id: 4,
    title: "Dashboard Analytics",
    type: "Data Visualization",
    description: "Dashboard interativo com visualizações de dados em tempo real.",
    skills: ["TypeScript", "D3.js", "React", "WebSocket"],
    level: 88
  },
  {
    id: 5,
    title: "Blockchain DApp",
    type: "Web3 Development",
    description: "Aplicação descentralizada para NFT marketplace com smart contracts.",
    skills: ["Solidity", "Web3.js", "Ethereum", "React"],
    level: 75
  }
];

const Pokedex = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ledBlink, setLedBlink] = useState(false);
  const navigate = useNavigate();
  const currentItem = portfolioData[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setLedBlink(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolioData.length);
      setIsLoading(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + portfolioData.length) % portfolioData.length);
      setIsLoading(false);
    }, 300);
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className="pokedex">
      <div className="pokedex-top">
        <div className="led-lights">
          <div className={`led led-main ${ledBlink ? 'blink' : ''}`}></div>
          <div className="led led-small led-red"></div>
          <div className="led led-small led-yellow"></div>
          <div className="led led-small led-green"></div>
        </div>
        
        <div className="screen-container">
          <div className="screen-border">
            <div className={`screen ${isLoading ? 'loading' : ''}`}> 
              {!isLoading && (
                <>
                  <div className="screen-header">
                    <div className="project-number">#{String(currentItem.id).padStart(3, '0')}</div>
                    <div className="project-type">{currentItem.type}</div>
                  </div>
                  
                  <div className="screen-content">
                    <h2 className="project-title">{currentItem.title}</h2>
                    <p className="project-description">{currentItem.description}</p>
                    
                    <div className="skills-section">
                      <div className="skills-label">SKILLS:</div>
                      <div className="skills-list">
                        {currentItem.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="level-section">
                      <div className="level-label">EXPERTISE</div>
                      <div className="level-bar">
                        <div 
                          className="level-fill" 
                          style={{ width: `${currentItem.level}%` }}
                        ></div>
                      </div>
                      <div className="level-value">{currentItem.level}%</div>
                    </div>
                  </div>
                  
                  <div className="screen-scanlines"></div>
                </>
              )}
              {isLoading && (
                <div className="loading-text">LOADING...</div>
              )}
            </div>
          </div>
          
          <div className="mini-leds">
            <div className="mini-led"></div>
            <div className="mini-led"></div>
          </div>
        </div>
      </div>
      
      <div className="pokedex-bottom">
        <div className="controls-left">
          <div className="dpad">
            <button className="dpad-button dpad-up" onClick={handlePrev}>▲</button>
            <button className="dpad-button dpad-left">◄</button>
            <div className="dpad-center"></div>
            <button className="dpad-button dpad-right">►</button>
            <button className="dpad-button dpad-down" onClick={handleNext}>▼</button>
          </div>
        </div>
        
        <div className="controls-right">
          <div className="action-buttons">
            <button className="action-btn btn-red" onClick={handleHome}></button>
            <button className="action-btn btn-blue"></button>
          </div>
          
          <div className="screen-mini">
            <div className="mini-display">
              {currentIndex + 1} / {portfolioData.length}
            </div>
          </div>
          
          <div className="bottom-buttons">
            <button className="bottom-btn"></button>
            <button className="bottom-btn"></button>
            <button className="bottom-btn"></button>
            <button className="bottom-btn"></button>
            <button className="bottom-btn"></button>
          </div>
        </div>
      </div>
      
      <div className="hinge"></div>
    </div>
  );
};

export default Pokedex;
