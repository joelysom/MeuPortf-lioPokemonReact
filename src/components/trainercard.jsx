/* Ensure TrainerCard styles are applied */
import './styles/trainercard.css';
import { useEffect } from 'react';
import { setupCardFlip } from '../script/trainercard';

/* Configured TrainerCard to display the requested image */
const TrainerCard = () => {
  useEffect(() => {
    setupCardFlip();
  }, []);

  return (
    <div className="trainer-card-container" onClick={(e) => e.stopPropagation()}>
      <img
        src="/assets/UI/cardswap_btn.png"
        alt="Card Swap Button"
        className="card-swap-button"
      />
      <div className="trainer-card">
        <img
          src="/assets/aboutme/trainercard.svg"
          alt="Trainer Card"
          className="trainer-card-image"
        />
      </div>
    </div>
  );
};

export default TrainerCard;