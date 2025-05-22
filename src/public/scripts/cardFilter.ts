document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search") as HTMLInputElement;
  const autoCompleteList = document.getElementById("autocomplete-results") as HTMLDivElement;
  const cardsContainer = document.getElementById("cards-container") as HTMLElement;
  const sortButtons = document.querySelectorAll("#filter-buttons button") as NodeListOf<HTMLButtonElement>;
  const filterToggles = document.querySelectorAll(".filter-toggle") as NodeListOf<HTMLButtonElement>;
  const allCards: HTMLElement[] = Array.from(cardsContainer.querySelectorAll(".card-item"));

  let selectedSort = "number";

  const filterGroups = {
    types: {
      buttons: document.querySelectorAll("#type-buttons button") as NodeListOf<HTMLButtonElement>,
      selected: [] as string[]
    },
    rarity: {
      buttons: document.querySelectorAll("#rarity-buttons button") as NodeListOf<HTMLButtonElement>,
      selected: [] as string[]
    },
    sort: {
      buttons: document.querySelectorAll("#sort-buttons button") as NodeListOf<HTMLButtonElement>,
      selected: [] as string[]
    },
    set: {
      buttons: document.querySelectorAll("#set-buttons button") as NodeListOf<HTMLButtonElement>,
      selected: [] as string[]
    }
  };

  filterToggles.forEach(button => {
  const targetId = button.dataset.target!;
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    button.addEventListener("click", () => {
      // Fermer tous les autres
      document.querySelectorAll(".filter-options").forEach(el => {
        if (el !== targetElement) el.classList.add("hidden");
      });
      targetElement.classList.toggle("hidden");
    });
  }
});

  function getCardData(card: HTMLElement) {
    const img = card.querySelector("img") as HTMLImageElement;
    const name = img?.alt.trim().toLowerCase() || "";
    const type = img?.dataset.type || "";
    const rarity = img?.dataset.rarity || "";
    const set = img?.dataset.set || "";
    const number = parseInt(img?.alt?.match(/\d+/)?.[0] || "0");
    return { name, type, rarity, set, number };
  }

  function setupSortButtons(buttons: NodeListOf<HTMLButtonElement>) {
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        // Retire la classe active de tous les boutons
        buttons.forEach(btn => btn.classList.remove("active"));

        // Active le bouton cliqué
        button.classList.add("active");

        // Met à jour la sélection
        selectedSort = button.dataset.value!;
        filterAndSortCards();
      });
    });
  }
  setupSortButtons(sortButtons);

  function setupMultiSelect(groupKey: keyof typeof filterGroups) {
    const group = filterGroups[groupKey];
    const allBtn = Array.from(group.buttons).find(btn => btn.dataset.value === "all");

    group.buttons.forEach(button => {
      button.addEventListener("click", () => {
        const value = button.dataset.value!;
        const isAll = value === "all";

        if (isAll) {
          // Réinitialiser tout
          group.selected = [];
          group.buttons.forEach(b => b.classList.remove("active"));
          button.classList.add("active");
        } else {
          // Retirer "Tous"
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

    const sort = filterGroups.sort.selected[0] || "number";
    filtered.sort((a, b) => {
      const aData = getCardData(a);
      const bData = getCardData(b);

      if (selectedSort === "name") {
        return aData.name.localeCompare(bData.name);
      }
      return aData.number - bData.number;
    });

    cardsContainer.innerHTML = "";
    filtered.forEach(card => cardsContainer.appendChild(card));
  }

  function updateAutocomplete() {
    const query = searchInput.value.toLowerCase();
    autoCompleteList.innerHTML = "";

    if (!query) return;

    const names = new Set<string>();
    allCards.forEach(card => {
      const name = getCardData(card).name;
      if (name.includes(query)) {
        names.add(name);
      }
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

  // Applique à tous les groupes
  setupMultiSelect("types");
  setupMultiSelect("rarity");
  setupMultiSelect("sort");
  setupMultiSelect("set");

  searchInput.addEventListener("input", () => {
    updateAutocomplete();
    filterAndSortCards();
  });

  filterAndSortCards();
});
