import React, { useState } from 'react';
import styles from './styles/tamagochi.module.css';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const Tamagochi = ({ onClose }) => {
  const [showEmote, setShowEmote] = useState(false);

  const handlePikachuClick = () => {
    setShowEmote(true);
    setTimeout(() => setShowEmote(false), 5000); // Hide emote after 5 seconds
  };

  const closeModal = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={styles.tamagochiModal}>
      <button className={styles.closeButton} onClick={closeModal}>
        <MdOutlineArrowBackIosNew />
      </button>
      <div className={styles.tamagochiContent}>
        <img
          src="/assets/tamagochi/house.png"
          alt="Tamagochi House"
          className={styles.tamagochiImage}
        />
        <img
          src="/assets/tamagochi/pikachu.gif"
          alt="Pikachu"
          className={styles.tamagochiPikachu}
          onClick={handlePikachuClick}
        />
        {showEmote && (
          <img
            src="/assets/tamagochi/heart_emote.gif"
            alt="Heart Emote"
            className={styles.tamagochiEmote}
          />
        )}
      </div>
      <div className={styles.dialogueBox}>
        <p>
          Clique no Pikachu!!! portfólio desenvolvido por Joelysom Alcantara.<br />
          Para saber mais como contato, projetos e trabalhos.. volte ao menu principal!!
        </p>
      </div>
    </div>
  );
};

export default Tamagochi;