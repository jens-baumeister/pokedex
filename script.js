scrollPosition = 0;

let pokeJson = [];

let currentPokemons = [];

const BASE_URL = `https://pokeapi.co/api/v2/pokemon`;

function init() {
  fetchPokemons();
}

async function fetchPokemons(append = false) {
  try {
    load();
    let response = await fetch(
      `${BASE_URL}?limit=20&offset=${pokeJson.length}`,
    );
    if (!response.ok) {
      throw new Error(`Fehler! Status: ${response.status}`);
    }
    let data = await response.json();
    pokeJson = pokeJson.concat(data.results);
    console.log("Daten wurden erfolgreich gepusht:", pokeJson);
  } catch (error) {
    console.error("Fehler beim Laden:", error);
  }
  currentPokemons = pokeJson;
  await renderPokeCards(append);
  endOfLoading();
}

function load() {
  document.getElementById("loading-overlay").classList.remove("hidden");
}

function endOfLoading() {
  document.getElementById("loading-overlay").classList.add("hidden");
}

async function renderPokeCards(append = false) {
  let pokeCardRef = document.getElementById("card");

  if (!append) {
    pokeCardRef.innerHTML = "";
  }
  let startIndex = append ? pokeCardRef.children.length : 0;
  for (let i = startIndex; i < currentPokemons.length; i++) {
    pokeCardRef.insertAdjacentHTML("beforeend", await getPokeCard(i));
  }
}

async function getTypeIcons(types) {
  let icons = [];

  for (let t of types) {
    let response = await fetch(t.type.url);
    let data = await response.json();

    let icon = data.sprites["generation-viii"]["sword-shield"].symbol_icon;

    icons.push(`<img src="${icon}" alt="${t.type.name}">`);
  }
  return icons.join("");
}

function loadMore() {
  fetchPokemons(true);
}

function search() {
  let filterWord = document.getElementById("poke-search").value.toLowerCase();

  if (filterWord.length < 3) {
    currentPokemons = pokeJson;
    document.getElementById("error-msg").style = "";
  } else {
    currentPokemons = pokeJson.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filterWord),
    );
    document.getElementById("error-msg").style = "display: none";
  }

  renderPokeCards();
}
