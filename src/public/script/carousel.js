document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    const updateCarousel = () => {
        items.forEach((item, index) => {
            const offset = index - currentIndex;

            // Applique une transformation en fonction de la position relative
            if (offset === 2) {
                item.style.transform = 'translateZ(50px) scale(1)';
            } else if (offset === 2 || offset === -items.length + 1) {
                item.style.transform = 'translateZ(0px) scale(0.9)';
            } else {
                item.style.transform = 'translateZ(-50px) scale(0.8)';
            }
        });
    };

    const moveCarousel = () => {
        currentIndex = (currentIndex + 1) % items.length;
        track.style.transform = `translateX(-${currentIndex * 20}%)`;
        updateCarousel();
    };

    // Initialise le carrousel
    updateCarousel();

    // Change de carte toutes les 3 secondes
    setInterval(moveCarousel, 3000);
});