import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import "../styles/pokedex.css";

interface PortfolioItem {
  id: number;
  title: string;
  type: string;
  description: string;
  skills: string[];
  level: number;
  link?: string;
  icon?: JSX.Element;
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: "Instagram",
    type: "Social Network",
    description: "Siga-me no Instagram e acompanhe meus projetos, ideias criativas e inspirações diárias.",
    skills: ["@joelysom.agiossitri", "Design Criativo", "Projetos Visuais", "Estilo Próprio"],
    level: 95,
    link: "https://instagram.com/joelysom.agiossitri",
    icon: <Instagram size={32} color="#0f380f" />
  },
  {
    id: 2,
    title: "LinkedIn",
    type: "Professional Network",
    description: "Conecte-se comigo no LinkedIn e acompanhe minha jornada profissional em tecnologia e inovação.",
    skills: ["Joelysom Alcântara", "ADS", "Inovação", "Conexões Profissionais"],
    level: 90,
    link: "https://www.linkedin.com/in/joelysom-alcantara",
    icon: <Linkedin size={32} color="#0f380f" />
  },
  {
    id: 3,
    title: "WhatsApp",
    type: "Contato Direto",
    description: "Entre em contato comigo pelo WhatsApp para colaborações, ideias e novos projetos.",
    skills: ["(xx) 9xxxx-xxxx", "Comunicação Rápida", "Networking", "Feedback Ágil"],
    level: 88,
    link: "https://wa.me/55xxxxxxxxxx", // coloque seu número aqui no formato 55DDDNÚMERO
    icon: <MessageCircle size={32} color="#0f380f" />
  },
  {
    id: 4,
    title: "Sobre Mim",
    type: "Perfil Pessoal",
    description: "Sou Joelysom Alcântara, estudante de Análise e Desenvolvimento de Sistemas (ADS). Apaixonado por tecnologia, programação e design criativo.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Python"],
    level: 92
  },
  {
    id: 5,
    title: "Missão Profissional",
    type: "Visão & Propósito",
    description: "Busco unir tecnologia e criatividade para desenvolver soluções que inspirem pessoas e transformem ideias em impacto real.",
    skills: ["UI/UX", "Front-end", "Prototipagem", "Empreendedorismo"],
    level: 87
  },
  {
    id: 6,
    title: "Projetos & Paixões",
    type: "Portfólio Criativo",
    description: "Exploro novas abordagens visuais, interfaces modernas e conceitos de design intuitivo para entregar experiências marcantes.",
    skills: ["Animações CSS", "React Hooks", "Interatividade", "Estética Minimalista"],
    level: 89
  },
  {
    id: 7,
    title: "Objetivos Futuros",
    type: "Crescimento Pessoal",
    description: "Meu objetivo é consolidar minha carreira na área de tecnologia, criando projetos que inspirem, eduquem e evoluam junto comigo.",
    skills: ["Liderança", "Inovação", "Estudo Contínuo", "Comunicação"],
    level: 93
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

                    {/* Ícones clicáveis */}
                    {currentItem.link && (
                      <div className="social-link">
                        <a href={currentItem.link} target="_blank" rel="noopener noreferrer">
                          {currentItem.icon}
                        </a>
                      </div>
                    )}
                    
                    <div className="skills-section">
                      <div className="skills-label">INFO:</div>
                      <div className="skills-list">
                        {currentItem.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="level-section">
                      <div className="level-label">CONEXÃO</div>
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
