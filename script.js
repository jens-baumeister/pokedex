
let scrollPosition = 0;
let pokeJson = [];
let currentPokemons = [];
const BASE_URL = `https://pokeapi.co/api/v2/pokemon`;


function init() {
  fetchPokemons();
}


async function fetchPokemons(append = false) {
  try {
    toggleLoading(true);
    let response = await fetch(`${BASE_URL}?limit=20&offset=${pokeJson.length}`);
    if (!response.ok) throw new Error(`Fehler! Status: ${response.status}`);
    let data = await response.json();
    pokeJson = pokeJson.concat(data.results);
    currentPokemons = pokeJson;
    await renderPokeCards(append);
  } catch (err) {
    console.error("Fehler beim Laden:", err);
  } finally {
    toggleLoading(false);
  }
}


function search() {
  const filterWord = document.getElementById("poke-search").value.toLowerCase();
  currentPokemons = filterWord.length < 3
    ? pokeJson
    : pokeJson.filter(p => p.name.toLowerCase().includes(filterWord));
  renderPokeCards();
}


async function renderPokeCards(append = false) {
  const container = document.getElementById("card");
  if (!append) container.innerHTML = "";
  const startIndex = append ? container.children.length : 0;
  for (let i = startIndex; i < currentPokemons.length; i++) {
    container.insertAdjacentHTML("beforeend", await getPokeCard(i));
  }
}


async function openPokeCard(index) {
  const response = await fetch(currentPokemons[index].url);
  const data = await response.json();
  document.getElementById("pokecard").innerHTML = getPokeDetails(data);
  document.getElementById("pokecard").classList.add("open");
  const typesHtml = await renderTypeIcons(data.types, "large");
  document.getElementById('tab-types').innerHTML = typesHtml;

  renderPokeDetails(data);
}


function closePokeCard() {
  document.getElementById("pokecard").classList.remove("open");
}


function showTab(tab) {
  const pokecard = document.getElementById("pokecard");
  if (!pokecard) return;
  pokecard.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  const tabEl = pokecard.querySelector(`#tab-${tab}`);
  if (tabEl) tabEl.classList.remove("hidden");
}


async function renderPokeDetails(data) {
  document.getElementById("pokecard-img").innerHTML = getImageTemplate(data);
  document.getElementById("tab-stats").innerHTML = getStatsTemplate(data);
  document.getElementById("tab-evo").innerHTML = await renderEvolutionChain(await getEvolutionChain(data));
}



async function renderTypeIcons(types, size = "large") {
  let html = "";
  for (let t of types) {
    const response = await fetch(t.type.url);
    const data = await response.json();
    let icon = size === "large" 
      ? data.sprites["generation-viii"]["sword-shield"].name_icon
      : data.sprites["generation-viii"]["sword-shield"].symbol_icon;

    if (!icon) {
      icon = data.sprites["generation-viii"]["sword-shield"].symbol_icon || `<span>${t.type.name}</span>`;
    }
    html += `<img src="${icon}" alt="${t.type.name}" class="type-icon ${size}">`;
  }
  return html;
}


async function getEvolutionChain(pokemonData) {
  const speciesData = await (await fetch(pokemonData.species.url)).json();
  const evoData = await (await fetch(speciesData.evolution_chain.url)).json();
  return evoData.chain;
}

async function renderEvolutionChain(chain) {
  let evoHTML = `<div class="evo-timeline">`;
  async function traverse(node) {
    const speciesData = await (await fetch(node.species.url)).json();
    evoHTML += getEvoCardTemplate(speciesData.id, node.species.name);

    if (node.evolves_to.length > 0) evoHTML += `<span class="evo-arrow">↓</span>`;
    for (let next of node.evolves_to) await traverse(next);
  }
  await traverse(chain);
  evoHTML += `</div>`;
  return evoHTML;
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function toggleLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  if (!overlay) return;
  overlay.classList.toggle("hidden", !show);
}

let currentOverlayIndex = 0;

async function openPokeCard(index) {
  currentOverlayIndex = index; // merken, welches Pokémon gerade angezeigt wird
  const data = await fetchPokemonData(index);
  document.getElementById("pokecard").innerHTML = getPokeDetails(data);
  document.getElementById("pokecard").classList.add("open");

  const typesHtml = await renderTypeIcons(data.types, "large");
  document.getElementById('tab-types').innerHTML = typesHtml;

  renderPokeDetails(data);
}

// Hilfsfunktion, um Pokémon-Daten zu holen
async function fetchPokemonData(index) {
  const response = await fetch(currentPokemons[index].url);
  return await response.json();
}

// Navigation: vorheriges/nächstes Pokémon
async function navigateOverlay(direction) {
  currentOverlayIndex += direction;

  // wrap-around
  if (currentOverlayIndex < 0) currentOverlayIndex = currentPokemons.length - 1;
  if (currentOverlayIndex >= currentPokemons.length) currentOverlayIndex = 0;

  const data = await fetchPokemonData(currentOverlayIndex);
  document.getElementById("pokecard").innerHTML = getPokeDetails(data);

  const typesHtml = await renderTypeIcons(data.types, "large");
  document.getElementById('tab-types').innerHTML = typesHtml;

  renderPokeDetails(data);
}


function loadMore() {
  fetchPokemons(true);
}