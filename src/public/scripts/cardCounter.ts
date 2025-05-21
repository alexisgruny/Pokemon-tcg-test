document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll<HTMLElement>('.card-counter');

  counters.forEach((counter) => {
    const cardId = counter.getAttribute('data-card-id');
    const quantitySpan = counter.querySelector<HTMLSpanElement>('.quantity');
    const incrementButton = counter.querySelector<HTMLButtonElement>('.increment');
    const decrementButton = counter.querySelector<HTMLButtonElement>('.decrement');

    if (!cardId || !quantitySpan || !incrementButton || !decrementButton) return;

    const updateQuantity = async (cardId: string, quantity: number): Promise<void> => {
      try {
        const response = await fetch('/cards/addOrUpdate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId, quantity }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour.');
        }
      } catch (error) {
        console.error(error);
        alert('Une erreur est survenue.');
      }
    };

    incrementButton.addEventListener('click', async () => {
      let quantity = parseInt(quantitySpan.textContent || '0', 10);
      quantity++;
      quantitySpan.textContent = quantity.toString();
      await updateQuantity(cardId, quantity);
    });

    decrementButton.addEventListener('click', async () => {
      let quantity = parseInt(quantitySpan.textContent || '0', 10);
      if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity.toString();
        await updateQuantity(cardId, quantity);
      }
    });
  });
});