document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-counter').forEach(counter => {
        const cardId = counter.getAttribute('data-card-id');
        const quantitySpan = counter.querySelector('.quantity');
        const incrementButton = counter.querySelector('.increment');
        const decrementButton = counter.querySelector('.decrement');

        const updateQuantity = async (cardId, quantity) => {
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
            let quantity = parseInt(quantitySpan.textContent, 10) || 0;
            quantity++;
            quantitySpan.textContent = quantity;
            await updateQuantity(cardId, quantity);
        });

        decrementButton.addEventListener('click', async () => {
            let quantity = parseInt(quantitySpan.textContent, 10) || 0;
            if (quantity > 0) {
                quantity--;
                quantitySpan.textContent = quantity;
                await updateQuantity(cardId, quantity);
            }
        });
    });
});