import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/start.css';
import styles from '../styles/start.module.css';

// IMPORTAÇÃO CORRETA DOS ASSETS
import startVideo from '../assets/videos/start.mp4';
import pressStartImg from '../assets/videos/pressStart.svg';
import rayquazaCry from '../assets/sounds/rayquaza-cry.mp3';

const StartPage = () => {
  const navigate = useNavigate();
  const [isShading, setIsShading] = useState(false);

  const handleStart = () => {
    setIsShading(true); // Adiciona a classe de animação

    const audio = new Audio(rayquazaCry);
    audio.play();

    audio.onended = () => {
      setTimeout(() => {
        setIsShading(false); // Remove a classe de animação
        navigate('/home'); // Redireciona para /home após o som e animação
      }, 500); // Aguarda o término da animação
    };
  };

  return (
    <div className={`${styles['start-page']} ${isShading ? styles['shade-effect'] : ''}`}>
      {/* VIDEO DE FUNDO */}
      <video
        className={styles['background-video']}
        autoPlay
        loop
        muted
        playsInline // importante para mobile
      >
        <source src={startVideo} type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>

      {/* BOTÃO CENTRAL */}
      <button className={styles['start-button']} onClick={handleStart}>
        <img src={pressStartImg} alt="Press Start" />
      </button>
    </div>
  );
};

export default StartPage;
