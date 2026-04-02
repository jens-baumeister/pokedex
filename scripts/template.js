
async function getPokeCard(i) {
  const response = await fetch(currentPokemons[i].url);
  const data = await response.json();
  const id = data.id;
  const mainType = data.types[0].type.name;

  let footerIcons = "";
  for (let t of data.types) {
    const res = await fetch(t.type.url);
    const typeData = await res.json();
    const icon = typeData.sprites["generation-viii"]["sword-shield"].symbol_icon;
    footerIcons += `<img src="${icon}" alt="${t.type.name}" class="type-icon-small">`;
  }

  return `
<section class="card" onclick="openPokeCard(${i})" tabindex="0">
  <div class="card-header">#${id} ${capitalize(data.name)}</div>
  <div class="card-body ${mainType}">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png"
         alt="picture of ${data.name}">
  </div>
  <div class="card-footer">${footerIcons}</div>
</section>`;
}

function getPokeDetails(data) {
  return `
<article class="pokemon-details">
  <section class="pokecard-header">
    <p id="poke-id">#${data.id} ${capitalize(data.name)}</p>
    <div onclick="closePokeCard()" class="close-btn">✕</div>
  </section>
  <section class="pokecard-img" id="pokecard-img">
  </section>
  <section class="pokecard-content">
    <div class="tabs">
      <button onclick="showTab('stats')">Stats</button>
      <button onclick="showTab('evo')">Evolution</button>
      <button onclick="showTab('types')">Types</button>
    </div>
    <div id="tab-stats" class="tab-content"></div>
    <div id="tab-evo" class="tab-content hidden"></div>
    <div id="tab-types" class="tab-content hidden"></div>
    
  </section>
  
  <section class="pokecard-footer">
    <div class="overlay-nav">
      <button id="prev-pokemon" onclick="navigateOverlay(-1)">←</button>
      <button id="next-pokemon" onclick="navigateOverlay(1)">→</button>
    </div>
  </section>
</article>`;
}

function getImageTemplate(data) {
  const id = data.id;
  const mainType = data.types[0].type.name;
  return `<div class="detail-img ${mainType}">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png">
  </div>`;
}

function getStatsTemplate(data) {
  return data.stats.map(stat => `
    <div class="stat-row">
      <span>${stat.stat.name.toUpperCase()}</span>
      <div class="bar"><div class="fill" style="width: ${Math.min(stat.base_stat, 100)}%"></div></div>
      <span>${stat.base_stat}</span>
    </div>`).join("");
}

function getPokeDetailsStructure(data) {
  return `
    <article class="pokemon-details">
      <section class="pokecard-header">
        <p id="poke-id">#${data.id} ${capitalize(data.name)}</p>
        <div onclick="closePokeCard()" class="close-btn">✕</div>
      </section>
      <section class="pokecard-img" id="pokecard-img"></section>
      <section class="pokecard-content">
        <div class="tabs">
          <button onclick="showTab('stats')">Stats</button>
          <button onclick="showTab('evo')">Evolution</button>
          <button onclick="showTab('types')">Types</button>
        </div>
        <div id="tab-stats" class="tab-content"></div>
        <div id="tab-evo" class="tab-content hidden"></div>
        <div id="tab-types" class="tab-content hidden"></div>
      </section>
      <section class="pokecard-footer"></section>
    </article>
  `;
}

function getTypesTemplate(data) {
  return data.types.map(t => {
    return `<span class="poke-type ${t.type.name}">${capitalize(t.type.name)}</span>`;
  }).join("");
}

function getEvoCardTemplate(id, name) {
  return `
    <div class="evo-card">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png" alt="${name}">
      <p>${capitalize(name)}</p>
    </div>`;
}