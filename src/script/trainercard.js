/* Enhanced 3D flip animation for TrainerCard */
export function setupCardFlip() {
  const cardContainer = document.querySelector('.trainer-card');
  const cardImage = document.querySelector('.trainer-card-image');
  const cardSwapButton = document.querySelector('.card-swap-button');

  let isFront = true; // Track which side is currently visible

  cardSwapButton.addEventListener('click', () => {
    cardContainer.style.transition = 'transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)'; // Enhanced easing for 3D effect
    cardContainer.style.transform = 'rotateY(180deg) scale(1.1)'; // Add scaling for a more dynamic effect

    setTimeout(() => {
      if (isFront) {
        cardImage.src = '/assets/aboutme/trainercard_back.svg';
      } else {
        cardImage.src = '/assets/aboutme/trainercard.svg';
      }
      isFront = !isFront;
      cardContainer.style.transition = 'transform 0.6s ease-out'; // Smooth return transition
      cardContainer.style.transform = 'rotateY(0deg) scale(1)';
    }, 500); // Wait for half the rotation to swap the image
  });
}