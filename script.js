let scrollPosition = 0;
let pokeJson = [];
let currentPokemons = [];
let typeCache = {};
const BASE_URL = `https://pokeapi.co/api/v2/pokemon`;

function init() {
  fetchPokemons();
}

async function fetchPokemons(append = false) {
  try {
    toggleLoading(true);
    let response = await fetch(
      `${BASE_URL}?limit=20&offset=${pokeJson.length}`,
    );
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

async function getTypeIconUrl(typeUrl, size = "symbol_icon") {
  if (typeCache[typeUrl]) {
    return typeCache[typeUrl][size];
  }
  const res = await fetch(typeUrl);
  const typeData = await res.json();
  typeCache[typeUrl] = {
    symbol_icon: typeData.sprites["generation-viii"]["sword-shield"].symbol_icon,
    name_icon: typeData.sprites["generation-viii"]["sword-shield"].name_icon
  };

  return typeCache[typeUrl][size];
}

function search() {
  const filterWord = document.getElementById("poke-search").value.toLowerCase();
  currentPokemons =
    filterWord.length < 3
      ? pokeJson
      : pokeJson.filter((p) => p.name.toLowerCase().includes(filterWord));
  renderPokeCards();
}

async function renderPokeCards(append = false) {
  const container = document.getElementById("card");
  if (!append) container.innerHTML = "";

  const startIndex = append ? container.children.length : 0;

  for (let i = startIndex; i < currentPokemons.length; i++) {
    const data = await getDetailedPokemonData(i);
    const cardHtml = await getPokeCard(data, i); 
    
    container.insertAdjacentHTML("beforeend", cardHtml);
  }
}

let currentOverlayIndex = 0;

async function openPokeCard(index) {
  document.activeElement.blur();
  currentOverlayIndex = index;
  const data = await fetchPokemonData(index);
  document.getElementById("pokecard").innerHTML = getPokeDetails(data);
  document.getElementById("pokecard").classList.add("open");
  setTimeout(() => {
    document.getElementById("close-btn")?.focus();
  }, 50);
  const typesHtml = await renderTypeIcons(data.types, "large");
  document.getElementById("tab-types").innerHTML = typesHtml;

  renderPokeDetails(data);
}

function closePokeCard() {
  const overlay = document.getElementById("pokecard");
  overlay.classList.remove("open");
  document.activeElement.blur();
  document.body.focus();
}

function showTab(tab) {
  const pokecard = document.getElementById("pokecard");
  if (!pokecard) return;
  pokecard
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  const tabEl = pokecard.querySelector(`#tab-${tab}`);
  if (tabEl) tabEl.classList.remove("hidden");
}

async function renderPokeDetails(data) {
  document.getElementById("pokecard-img").innerHTML = getImageTemplate(data);
  document.getElementById("tab-stats").innerHTML = getStatsTemplate(data);
  document.getElementById("tab-evo").innerHTML = await renderEvolutionChain(
    await getEvolutionChain(data),
  );
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

    if (node.evolves_to.length > 0)
      evoHTML += `<span class="evo-arrow">↓</span>`;
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

async function getDetailedPokemonData(index) {
  if (pokeJson[index].id) {
    return pokeJson[index];
  }
  const response = await fetch(pokeJson[index].url);
  const details = await response.json();
  pokeJson[index] = { ...pokeJson[index], ...details };
  return pokeJson[index];
}

async function navigateOverlay(direction) {
  currentOverlayIndex += direction;

  if (currentOverlayIndex < 0) currentOverlayIndex = currentPokemons.length - 1;
  if (currentOverlayIndex >= currentPokemons.length) currentOverlayIndex = 0;

  const data = await fetchPokemonData(currentOverlayIndex);
  document.getElementById("pokecard").innerHTML = getPokeDetails(data);

  const typesHtml = await renderTypeIcons(data.types, "large");
  document.getElementById("tab-types").innerHTML = typesHtml;

  renderPokeDetails(data);
}

function loadMore() {
  fetchPokemons(true);
}
