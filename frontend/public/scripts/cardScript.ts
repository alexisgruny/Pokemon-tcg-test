document.addEventListener("DOMContentLoaded", () => {
  // ==== RÉFÉRENCES DOM ====
  const counters = document.querySelectorAll<HTMLElement>('.card-counter');
  const searchInput = document.getElementById("search") as HTMLInputElement;
  const autoCompleteList = document.getElementById("autocomplete-results") as HTMLDivElement;
  const cardsContainer = document.getElementById("cards-container") as HTMLElement;
  const sortButtons = document.querySelectorAll("#filter-buttons button") as NodeListOf<HTMLButtonElement>;
  const filterToggles = document.querySelectorAll(".filter-toggle") as NodeListOf<HTMLButtonElement>;
  const allCards: HTMLElement[] = Array.from(cardsContainer.querySelectorAll(".card-item"));

  // Critère de tri par défaut
  let selectedSort = "number";

  // Stocke les boutons et les sélections de chaque filtre
  const filterGroups = {
    types: { buttons: document.querySelectorAll("#type-buttons button"), selected: [] as string[] },
    rarity: { buttons: document.querySelectorAll("#rarity-buttons button"), selected: [] as string[] },
    sort: { buttons: document.querySelectorAll("#sort-buttons button"), selected: [] as string[] },
    set: { buttons: document.querySelectorAll("#set-buttons button"), selected: [] as string[] }
  };

  // ==== INITIALISATION DES CARTES POSSEDER ====
  function highlightOwnedCards() {
    allCards.forEach(card => {
      const owned = card.getAttribute('data-owned');
      if (owned === "true" || owned === "1") {
        card.classList.remove("not-owned");
      } else {
        card.classList.add("not-owned");
      }
    });
  }

  // ==== INITIALISATION DES COMPTEURS ====
  counters.forEach((counter) => {
    const cardId = counter.getAttribute('data-card-id');
    const quantitySpan = counter.querySelector<HTMLSpanElement>('.quantity');
    const incrementButton = counter.querySelector<HTMLButtonElement>('.increment');
    const decrementButton = counter.querySelector<HTMLButtonElement>('.decrement');

    if (!cardId || !quantitySpan || !incrementButton || !decrementButton) return;

    // Met à jour la quantité d’une carte sur le serveur
    const updateQuantity = async (cardId: string, quantity: number): Promise<void> => {
      try {
        const response = await fetch('/cards/addOrUpdate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId, quantity }),
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour.');
      } catch (error) {
        console.error(error);
        alert('Une erreur est survenue.');
      }
    };

    // Incrémente la quantité
    incrementButton.addEventListener('click', async () => {
      let quantity = parseInt(quantitySpan.textContent || '0', 10);
      quantity++;
      quantitySpan.textContent = quantity.toString();
      counter.setAttribute('data-owned', quantity > 0 ? "true" : "false");
      counter.closest('.card-item')?.setAttribute('data-owned', quantity > 0 ? "true" : "false");
      await updateQuantity(cardId, quantity);
      highlightOwnedCards();
    });

    // Décrémente la quantité
    decrementButton.addEventListener('click', async () => {
      let quantity = parseInt(quantitySpan.textContent || '0', 10);
      if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity.toString();
        counter.setAttribute('data-owned', quantity > 0 ? "true" : "false");
        counter.closest('.card-item')?.setAttribute('data-owned', quantity > 0 ? "true" : "false");
        await updateQuantity(cardId, quantity);
        highlightOwnedCards();
      }
    });
  });

  // ==== GESTION DE L’AFFICHAGE DES BLOCS DE FILTRES ====
  filterToggles.forEach(button => {
    const targetId = button.dataset.target!;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter-options").forEach(el => {
          if (el !== targetElement) el.classList.add("hidden");
        });
        targetElement.classList.toggle("hidden");
      });
    }
  });

  // Récupère les données d'une carte (type, rareté, nom, etc.)
  function getCardData(card: HTMLElement) {
    const img = card.querySelector("img") as HTMLImageElement;
    const name = img?.alt.trim().toLowerCase() || "";
    const type = img?.dataset.type || "";
    const rarity = img?.dataset.rarity || "";
    const set = img?.dataset.set || "";
    const number = parseInt(img?.alt?.match(/\d+/)?.[0] || "0");
    return { name, type, rarity, set, number };
  }

  // Initialise les boutons de tri (par nom, par numéro, etc.)
  function setupSortButtons(buttons: NodeListOf<HTMLButtonElement>) {
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedSort = button.dataset.value!;
        filterAndSortCards();
      });
    });
  }

  // Initialise la sélection multiple pour un groupe de filtres
  function setupMultiSelect(groupKey: keyof typeof filterGroups) {
    const group = filterGroups[groupKey];
    const allBtn = Array.from(group.buttons).find(btn => (btn as HTMLElement).dataset.value === "all");

    group.buttons.forEach(button => {
      button.addEventListener("click", () => {
        const value = (button as HTMLElement).dataset.value!;
        const isAll = value === "all";

        if (isAll) {
          group.selected = [];
          group.buttons.forEach(b => b.classList.remove("active"));
          button.classList.add("active");
        } else {
          allBtn?.classList.remove("active");

          const isActive = button.classList.toggle("active");
          if (isActive) {
            group.selected.push(value);
          } else {
            group.selected = group.selected.filter(v => v !== value);
          }

          if (group.selected.length === 0) {
            allBtn?.classList.add("active");
          }
        }

        filterAndSortCards();
      });
    });
  }

  // Filtre et trie les cartes en fonction des filtres et de la recherche
  function filterAndSortCards() {
    const search = searchInput.value.toLowerCase();

    const filtered = allCards.filter(card => {
      const { name, type, rarity, set } = getCardData(card);

      const matchType = filterGroups.types.selected.length === 0 || filterGroups.types.selected.includes(type);
      const matchRarity = filterGroups.rarity.selected.length === 0 || filterGroups.rarity.selected.includes(rarity);
      const matchSet = filterGroups.set.selected.length === 0 || filterGroups.set.selected.includes(set);
      const matchSearch = name.includes(search);

      return matchType && matchRarity && matchSet && matchSearch;
    });

    // Tri
    filtered.sort((a, b) => {
      const aData = getCardData(a);
      const bData = getCardData(b);
      return selectedSort === "name"
        ? aData.name.localeCompare(bData.name)
        : aData.number - bData.number;
    });

    cardsContainer.innerHTML = "";
    filtered.forEach(card => cardsContainer.appendChild(card));
  }

  // Met à jour la liste de résultats auto-complétés
  function updateAutocomplete() {
    const query = searchInput.value.toLowerCase();
    autoCompleteList.innerHTML = "";

    if (!query) return;

    const names = new Set<string>();
    allCards.forEach(card => {
      const name = getCardData(card).name;
      if (name.includes(query)) names.add(name);
    });

    [...names].slice(0, 5).forEach(name => {
      const button = document.createElement("button");
      button.textContent = name;
      button.addEventListener("click", () => {
        searchInput.value = name;
        autoCompleteList.innerHTML = "";
        filterAndSortCards();
      });
      autoCompleteList.appendChild(button);
    });
  }

  // ====== INITIALISATION ======
  function initializeApp() {
    setupSortButtons(sortButtons);
    setupMultiSelect("types");
    setupMultiSelect("rarity");
    setupMultiSelect("sort");
    setupMultiSelect("set");

    searchInput.addEventListener("input", () => {
      updateAutocomplete();
      filterAndSortCards();
    });

    filterAndSortCards();
    highlightOwnedCards();
  }

  // Lance l’app
  initializeApp();
});
