// scrollPosition = 0;

// let pokeJson = [];

// let currentPokemons = [];

// const BASE_URL = `https://pokeapi.co/api/v2/pokemon`;

// function init() {
//   fetchPokemons();
  
// }

// async function fetchPokemons(append = false) {
//   try {
//     load();
//     let response = await fetch(`${BASE_URL}?limit=20&offset=${pokeJson.length}`,
//     );
//     if (!response.ok) {throw new Error(`Fehler! Status: ${response.status}`)};

//     let data = await response.json();
//     pokeJson = pokeJson.concat(data.results);
//   } catch (error) {
//     console.error("Fehler beim Laden:", error);
//   }
//   currentPokemons = pokeJson;
//   await renderPokeCards(append);

//   console.log(pokeJson);
//   endOfLoading();
// }

// function load() {
//   document.getElementById("loading-overlay").classList.remove("hidden");
// }

// function endOfLoading() {
//   document.getElementById("loading-overlay").classList.add("hidden");
// }

// async function renderPokeCards(append = false) {
//   let pokeCardRef = document.getElementById("card");

//   if (!append) {
//     pokeCardRef.innerHTML = "";
//   }
//   let startIndex = append ? pokeCardRef.children.length : 0;
//   for (let i = startIndex; i < currentPokemons.length; i++) {
//     pokeCardRef.insertAdjacentHTML("beforeend", await getPokeCard(i));
//   }
// }

// async function getTypeIcons(types) {
//   let icons = [];

//   for (let t of types) {
//     let response = await fetch(t.type.url);
//     let data = await response.json();

//     let icon = data.sprites["generation-viii"]["sword-shield"].symbol_icon;

//     icons.push(`<img src="${icon}" alt="${t.type.name}">`);
//   }
//   return icons.join("");
// }

//   async function renderTypeIcons(types) {
//   let html = "";

//   for (let t of types) {
//     let response = await fetch(t.type.url);
//     let data = await response.json();

//     let icon = data.sprites["generation-viii"]["sword-shield"].name_icon;
//     if (!icon || icon === "") {
//       icon = data.sprites["generation-viii"]["sword-shield"].symbol_icon;
//     }
//     if (!icon || icon === "") {
//       html += `<span>${t.type.name}</span>`;
//       continue;
//     }

//     html += `<img src="${icon}" alt="${t.type.name}" class="type-icon">`;
//   }

//   return html;
// }

// function loadMore() {
//   fetchPokemons(true);
// }

// function search() {
//   let filterWord = document.getElementById("poke-search").value.toLowerCase();

//   if (filterWord.length < 3) {
//     currentPokemons = pokeJson;
//   } else {
//     currentPokemons = pokeJson.filter((pokemon) =>
//       pokemon.name.toLowerCase().includes(filterWord),
//     );
//   }

//   renderPokeCards();
// }

// async function openPokeCard(index) {
//   let response = await fetch(currentPokemons[index].url);
//   let data = await response.json();

//   // Overlay HTML zuerst setzen
//   document.getElementById("pokecard").innerHTML = getPokeDetails(data);
//   document.getElementById("pokecard").classList.add("open");

//   // Type Icons rendern
//   let typesHtml = await renderTypeIcons(data.types);
//   document.getElementById('tab-types').innerHTML = typesHtml;

//   // Weitere Details rendern (ohne Tab Types!)
//   renderPokeDetails(data);
// }

// function closePokeCard(){ 
//   document.getElementById("pokecard").classList.remove("open")
// }

// async function renderPokeDetails(data) {
//   document.getElementById("pokecard-img").innerHTML = getImageTemplate(data);
//   document.getElementById("tab-stats").innerHTML = getStatsTemplate(data);
//   let chain = await getEvolutionChain(data);
//   document.getElementById("tab-evo").innerHTML = await renderEvolutionChain(chain);
// }

// function capitalize(name) {
//   return name.charAt(0).toUpperCase() + name.slice(1);
// }

// function showTab(tab) {
//   const pokecard = document.getElementById("pokecard");
//   if (!pokecard) return;
//   pokecard.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
//   const tabEl = pokecard.querySelector(`#tab-${tab}`);
//   if (tabEl) tabEl.classList.remove("hidden");
// }

// function renderStats(data) {
//   let statsRef = document.getElementById("tab-stats");
//   statsRef.innerHTML = getStatsTemplate(data);
// }

// async function renderTypes(data) {
//   let typesRef = document.getElementById("tab-types");
//   typesRef.innerHTML = await getTypesTemplate(data);
// }

// async function renderTypeIcons(types) {
//   let html = "";
//   for (let t of types) {
//     let response = await fetch(t.type.url);
//     let data = await response.json();
//     let icon = data.sprites["generation-viii"]["sword-shield"].name_icon || data.sprites["generation-viii"]["sword-shield"].symbol_icon;
//     html += `<img src="${icon}" alt="${t.type.name}" class="type-icon">`;
//   }
//   return html;
// }

// async function getEvolutionChain(pokemonData) {  
//   let speciesResponse = await fetch(pokemonData.species.url);
//   let speciesData = await speciesResponse.json();
//   let evoResponse = await fetch(speciesData.evolution_chain.url);
//   let evoData = await evoResponse.json();
//   return evoData.chain; 
// }

// async function renderEvolutionChain(chain) {
//   let evoHTML = `<div class="evo-timeline">`;
//   async function traverse(chainNode) {
//     let name = chainNode.species.name;
//     let response = await fetch(chainNode.species.url);
//     let speciesData = await response.json();
//     let id = speciesData.id;
//     evoHTML += `
//       <div class="evo-card">
//         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png" alt="${name}">
//         <p>${capitalize(name)}</p>
//       </div>
//     `;
//     if (chainNode.evolves_to.length > 0) {
//       evoHTML += `<span class="evo-arrow">↓</span>`;
//     }
//     for (let next of chainNode.evolves_to) {
//       await traverse(next);
//     }
//   }

//   await traverse(chain);
//   evoHTML += `</div>`;
//   return evoHTML;
// }

// ============================
// Globals & Constants
// ============================
let scrollPosition = 0;
let pokeJson = [];
let currentPokemons = [];
const BASE_URL = `https://pokeapi.co/api/v2/pokemon`;

// ============================
// Initialization
// ============================
function init() {
  fetchPokemons();
}

// ============================
// Pokemon Fetch & Search
// ============================
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

// ============================
// Card Rendering
// ============================
async function renderPokeCards(append = false) {
  const container = document.getElementById("card");
  if (!append) container.innerHTML = "";
  const startIndex = append ? container.children.length : 0;
  for (let i = startIndex; i < currentPokemons.length; i++) {
    container.insertAdjacentHTML("beforeend", await getPokeCard(i));
  }
}

async function getPokeCard(i) {
  const response = await fetch(currentPokemons[i].url);
  const data = await response.json();
  const id = data.id;
  const mainType = data.types[0].type.name;
  const typesHTML = await renderTypeIcons(data.types);

  return `
<section class="card" onclick="openPokeCard(${i})" tabindex="0">
  <div class="card-header">#${id} ${capitalize(data.name)}</div>
  <div class="card-body ${mainType}">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png"
         alt="picture of ${data.name}">
  </div>
  <div class="card-footer">${typesHTML}</div>
</section>`;
}

// ============================
// Overlay Management
// ============================
async function openPokeCard(index) {
  const response = await fetch(currentPokemons[index].url);
  const data = await response.json();
  document.getElementById("pokecard").innerHTML = getPokeDetails(data);
  document.getElementById("pokecard").classList.add("open");
  document.getElementById("tab-types").innerHTML = await renderTypeIcons(data.types);
  await renderPokeDetails(data);
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

// ============================
// Detail Rendering
// ============================
async function renderPokeDetails(data) {
  document.getElementById("pokecard-img").innerHTML = getImageTemplate(data);
  document.getElementById("tab-stats").innerHTML = getStatsTemplate(data);
  document.getElementById("tab-evo").innerHTML = await renderEvolutionChain(await getEvolutionChain(data));
}

async function renderTypeIcons(types) {
  let html = "";
  for (let t of types) {
    const res = await fetch(t.type.url);
    const data = await res.json();
    const icon = data.sprites["generation-viii"]["sword-shield"].name_icon 
                 || data.sprites["generation-viii"]["sword-shield"].symbol_icon;
    html += icon ? `<img src="${icon}" alt="${t.type.name}" class="type-icon">` 
                 : `<span>${t.type.name}</span>`;
  }
  return html;
}

// ============================
// Evolution
// ============================
async function getEvolutionChain(pokemonData) {
  const speciesData = await (await fetch(pokemonData.species.url)).json();
  const evoData = await (await fetch(speciesData.evolution_chain.url)).json();
  return evoData.chain;
}

async function renderEvolutionChain(chain) {
  let evoHTML = `<div class="evo-timeline">`;
  async function traverse(node) {
    const speciesData = await (await fetch(node.species.url)).json();
    const id = speciesData.id;
    const name = node.species.name;
    evoHTML += `
      <div class="evo-card">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png" alt="${name}">
        <p>${capitalize(name)}</p>
      </div>`;
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

function loadMore() {
  fetchPokemons(true);
}