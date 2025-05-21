document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector<HTMLElement>('.carousel-track');
  const items = document.querySelectorAll<HTMLElement>('.carousel-item');

  if (!track || items.length === 0) return;

  let currentIndex = 0;

  const updateCarousel = (): void => {
    items.forEach((item, index) => {
      const offset = index - currentIndex;

      // Applique une transformation en fonction de la position relative
      if (offset === 2) {
        item.style.transform = 'translateZ(50px) scale(1)';
      } else if (offset === 1 || offset === 3) {
        item.style.transform = 'translateZ(0px) scale(0.9)';
      } else {
        item.style.transform = 'translateZ(-50px) scale(0.8)';
      }
    });
  };

  const moveCarousel = (): void => {
    currentIndex = (currentIndex + 1) % items.length;
    track.style.transform = `translateX(-${currentIndex * 20}%)`;
    updateCarousel();
  };

  updateCarousel();
  setInterval(moveCarousel, 2000);
});