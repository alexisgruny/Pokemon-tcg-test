document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search") as HTMLInputElement;
  const autoCompleteList = document.getElementById("autocomplete-results") as HTMLUListElement;
  const cardsContainer = document.getElementById("cards-container") as HTMLElement;

  const typeButtons = document.querySelectorAll("#type-buttons button") as NodeListOf<HTMLButtonElement>;
  const rarityButtons = document.querySelectorAll("#rarity-buttons button") as NodeListOf<HTMLButtonElement>;
  const sortButtons = document.querySelectorAll("#sort-buttons button") as NodeListOf<HTMLButtonElement>;
  const setButtons = document.querySelectorAll("#set-buttons button") as NodeListOf<HTMLButtonElement>;

  let selectedType = "all";
  let selectedRarity = "all";
  let selectedSort = "number";
  let selectedSet = "all";

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
    const search = searchInput.value.toLowerCase();

    const filtered = allCards.filter(card => {
      const { name, type, rarity, set } = getCardData(card);

      const matchType = selectedType === "all" || type === selectedType;
      const matchRarity = selectedRarity === "all" || rarity === selectedRarity;
      const matchSearch = name.includes(search);
      const matchSet = selectedSet === "all" || set === selectedSet;

      return matchType && matchRarity && matchSearch && matchSet;
    });

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
      const button = document.createElement("li");
      li.textContent = name;
      li.addEventListener("click", () => {
        searchInput.value = name;
        autoCompleteList.innerHTML = "";
        filterAndSortCards();
      });
      autoCompleteList.appendChild(li);
    });
  }

  function setupButtonGroup(buttons: NodeListOf<HTMLButtonElement>, onChange: (value: string) => void) {
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        onChange(button.dataset.value!);
        filterAndSortCards();
      });
    });
  }

  setupButtonGroup(typeButtons, value => selectedType = value);
  setupButtonGroup(rarityButtons, value => selectedRarity = value);
  setupButtonGroup(sortButtons, value => selectedSort = value);
  setupButtonGroup(setButtons, value => selectedSet = value);

  searchInput.addEventListener("input", () => {
    updateAutocomplete();
    filterAndSortCards();
  });

  filterAndSortCards();
});