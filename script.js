let pokeJson = [];

const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pokeJson.length}`;

function init() {
  fetchPokemons();
}

async function fetchPokemons() {
  try {
  load();
    let response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Fehler! Status: ${response.status}`);
    }
    let data = await response.json();
    pokeJson = data.results;
    console.log("Daten wurden erfolgreich gepusht:", pokeJson);
  } catch (error) {
    console.error("Fehler beim Laden:", error);
  }
  renderPokeCards();
}

function load() {
  document.getElementById("card").style.display = "none";
  document.getElementById("loader").style.display = "";
}

function endOfLoading() {
  document.getElementById("card").style.display = "";
  document.getElementById("loader").style.display = "none";
}

async function renderPokeCards() {
  let pokeCardRef = document.getElementById("card");
  pokeCardRef.innerHTML = "";
  for (let i = 0; i < pokeJson.length; i++) {
    pokeCardRef.innerHTML += await getPokeCard(i);
  }
}

async function getTypeIcons(types) {
  let icons =[];

  for (let t of types) {
    let response = await fetch(t.type.url);
    let data = await response.json();

    let icon = data.sprites['generation-viii']['sword-shield'].symbol_icon;
   
    icons.push(`<img src="${icon}" alt="${t.type.name}">`);
  }
  return icons.join("");
}