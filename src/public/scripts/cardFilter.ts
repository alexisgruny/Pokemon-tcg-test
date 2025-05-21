document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort") as HTMLSelectElement;
  const typeSelect = document.getElementById("type") as HTMLSelectElement;
  const raritySelect = document.getElementById("rarity") as HTMLSelectElement;
  const setSelect = document.getElementById("set") as HTMLSelectElement;
  const searchInput = document.getElementById("search") as HTMLInputElement;
  const autoCompleteList = document.getElementById("autocomplete-results") as HTMLUListElement;
  const cardsContainer = document.getElementById("cards-container") as HTMLElement;

  const allCards: HTMLElement[] = Array.from(cardsContainer.querySelectorAll(".card-item"));

  function getCardData(card: HTMLElement) {
    const name = card.querySelector("strong")?.textContent?.trim().toLowerCase() || "";
    const img = card.querySelector("img") as HTMLImageElement;
    const type = img?.dataset.type || ""; 
    const rarity = img?.dataset.rarity || "";
    const set = img?.dataset.set || "";
    const number = parseInt(img?.alt?.match(/\d+/)?.[0] || "0");
    return { name, type, rarity, number, set };
  }

  function filterAndSortCards() {
    const type = typeSelect.value;
    const rarity = raritySelect.value;
    const set = setSelect.value;
    const search = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;
    const filtered = allCards.filter(card => {
      const { name, type: cardType, rarity: cardRarity, set: cardSet } = getCardData(card);

      const matchType = type === "all" || cardType === type;
      const matchRarity = rarity === "all" || cardRarity === rarity;
      const matchSet = set ==="all" || cardSet === set;
      const matchSearch = name.includes(search);

      return matchType && matchRarity && matchSearch && matchSet;
    });

    filtered.sort((a, b) => {
      const aData = getCardData(a);
      const bData = getCardData(b);

      if (sortBy === "name") {
        return aData.name.localeCompare(bData.name);
      }
      return aData.number - bData.number;
    });

    // Réafficher
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
      const li = document.createElement("li");
      li.textContent = name;
      li.addEventListener("click", () => {
        searchInput.value = name;
        autoCompleteList.innerHTML = "";
        filterAndSortCards();
      });
      autoCompleteList.appendChild(li);
    });
  }

  // Events
  sortSelect.addEventListener("change", filterAndSortCards);
  typeSelect.addEventListener("change", filterAndSortCards);
  raritySelect.addEventListener("change", filterAndSortCards);
  setSelect.addEventListener("change", filterAndSortCards);
  searchInput.addEventListener("input", () => {
    updateAutocomplete();
    filterAndSortCards();
  });

  filterAndSortCards();
});