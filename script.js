let pokeJson = [];
let currentPokemons = [];
let typeCache = {};
let currentOverlayIndex = 0;
const BASE_URL = `https://pokeapi.co/api/v2/pokemon`;

function init() {
  document.getElementById("no-results").classList.add("hidden");
  fetchPokemons();
}

async function fetchPokemons(append = false) {
  try {
    toggleLoading(true);
    const offset = pokeJson.length;
    let newPokemons =  await loadRawData(offset)
    pokeJson = pokeJson.concat(newPokemons);
    await refreshDisplay(append, offset);
  } catch (err) {
    console.error("Fehler beim Laden:", err);
  } finally {
    toggleLoading(false);
  }
}

async function loadRawData(offset){
  let response = await fetch(`${BASE_URL}?limit=20&offset=${offset}`);
    if (!response.ok) throw new Error(`Fehler! Status: ${response.status}`);
    let data = await response.json();
  return data.results;
  }

  async function refreshDisplay(append, offset) {
    const filterWord = document.getElementById("poke-search").value.toLowerCase();
    if (filterWord.length < 3) {
      currentPokemons = pokeJson;
      await renderPokeCards(append, offset);
    } else {
      search();
    }
  }

async function getDetailedPokemonData(pokemon) {
  if (pokemon.id) return pokemon;
  const response = await fetch(pokemon.url);
  const details = await response.json();
  Object.assign(pokemon, details);
  return pokemon;
}

async function getTypeIconUrl(typeUrl, size = "symbol_icon") {
  if (typeCache[typeUrl]) return typeCache[typeUrl][size];
  const res = await fetch(typeUrl);
  const typeData = await res.json();
  typeCache[typeUrl] = {
    symbol_icon:
      typeData.sprites["generation-viii"]["sword-shield"].symbol_icon,
    name_icon: typeData.sprites["generation-viii"]["sword-shield"].name_icon,
  };
  return typeCache[typeUrl][size];
}

async function renderPokeCards(append = false, startAt = 0) {
  const container = document.getElementById("card");
  if (!append) {
    container.innerHTML = "";
    startAt = 0;
  }

  for (let i = startAt; i < currentPokemons.length; i++) {
    const pokemon = currentPokemons[i];
    const data = await getDetailedPokemonData(pokemon);
    const cardHtml = await getPokeCard(data, i);
    container.insertAdjacentHTML("beforeend", cardHtml);
  }
}

function search() {
  const inputField = document.getElementById("poke-search");
  const filterWord = inputField.value.toLowerCase().trim();
  const loadMoreBtn = document.getElementById("load-btn");
  const searchCheck = document.getElementById("no-results");
  
  if (searchCheck) searchCheck.classList.add("hidden")
  if (filterWord.length < 3) {
    currentPokemons = pokeJson;
    if (loadMoreBtn) loadMoreBtn.classList.remove("hidden");
  } else {
    searchResult(filterWord, loadMoreBtn, searchCheck);
  }
  renderPokeCards(false, 0);
}

function searchResult(filterWord, loadMoreBtn, searchCheck){ 

  currentPokemons = pokeJson.filter((p) => p.name.toLowerCase().includes(filterWord));
    if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
    if (currentPokemons.length === 0 && searchCheck) searchCheck.classList.remove("hidden");
}

async function openPokeCard(index) {
  currentOverlayIndex = index;
  const pokemon = currentPokemons[index];
  const data = await getDetailedPokemonData(pokemon);

  document.getElementById("pokecard").innerHTML = getPokeDetails(data);
  document.getElementById("pokecard").classList.add("open");

  const typesHtml = await renderTypeIcons(data.types, "large");
  document.getElementById("tab-types").innerHTML = typesHtml;

  renderPokeDetails(data);
}

async function renderPokeDetails(data) {
  document.getElementById("pokecard-img").innerHTML = getImageTemplate(data);
  document.getElementById("tab-stats").innerHTML = getStatsTemplate(data);
  const evoChain = await getEvolutionChain(data);
  document.getElementById("tab-evo").innerHTML =
    await renderEvolutionChain(evoChain);
}

async function renderTypeIcons(types, size = "large") {
  let html = "";
  const iconKey = size === "large" ? "name_icon" : "symbol_icon";
  for (let t of types) {
    const icon = await getTypeIconUrl(t.type.url, iconKey);
    html += `<img src="${icon}" alt="${t.type.name}" class="type-icon ${size}">`;
  }
  return html;
}

async function navigateOverlay(direction) {
  currentOverlayIndex += direction;
  if (currentOverlayIndex < 0) currentOverlayIndex = currentPokemons.length - 1;
  if (currentOverlayIndex >= currentPokemons.length) currentOverlayIndex = 0;
  openPokeCard(currentOverlayIndex);
}

function closePokeCard() {
  document.getElementById("pokecard").classList.remove("open");
}

function loadMore() {
  fetchPokemons(true);
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
    if (node.evolves_to.length > 0) {
      evoHTML += `<span class="evo-arrow">↓</span>`;
      for (let next of node.evolves_to) await traverse(next);
    }
  }
  await traverse(chain);
  return evoHTML + `</div>`;
}

function showTab(tab) {
  const pokecard = document.getElementById("pokecard");
  pokecard
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  pokecard.querySelector(`#tab-${tab}`).classList.remove("hidden");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleLoading(show) {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.classList.toggle("hidden", !show);
}
