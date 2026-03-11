/* Ensure TrainerCard styles are applied */
import './styles/trainercard.css';
import { useEffect } from 'react';
import { setupCardFlip } from '../script/trainercard';

/* Configured TrainerCard to display the requested image */
const TrainerCard = () => {
  const isMobile = window.innerWidth <= 568;
  const cardImage = isMobile ? '/assets/aboutme/FullStackJoey.svg' : '/assets/aboutme/trainercard.svg';

  useEffect(() => {
    setupCardFlip();
  }, []);

  return (
    <>
      <img
        src="/assets/UI/cardswap_btn.png"
        alt="Card Swap Button"
        className="card-swap-button"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="trainer-card-container" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-card">
          <img
            src={cardImage}
            alt="Trainer Card"
            className="trainer-card-image"
          />
          {isMobile && (
            <video
              src="/assets/aboutme/Fullstackjoey_back.mp4"
              className="trainer-card-video"
              loop
              muted
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerCard;