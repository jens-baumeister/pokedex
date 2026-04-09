function getPokeCard(data, i, footerIcons) {

  return `
    <button class="card" onclick="openPokeCard(${i})">
      <div class="card-header">#${data.id} ${capitalize(data.name)}</div>
      <div class="card-body ${data.types[0].type.name}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${data.id}.png"
             alt="${data.name}">
      </div>
      <div class="card-footer">${footerIcons}</div>
    </button>`;
}

function getPokeDetails(data) {
  return `
    <article class="pokemon-details" onclick="event.stopPropagation()">
      <section class="pokecard-header">
        <p id="poke-id">#${data.id} ${capitalize(data.name)}</p>
        <button onclick="closePokeCard()" class="close-btn" id="close-btn">✕</button>
      </section>
      <section class="pokecard-img" id="pokecard-img"></section>
      <section class="pokecard-content">
        <div class="tabs">
          <button class="tab" onclick="showTab('stats')">Stats</button>
          <button class="tab" onclick="showTab('evo')">Evolution</button>
          <button class="tab" onclick="showTab('types')">Types</button>
        </div>
        <div id="tab-stats" class="tab-content"></div>
        <div id="tab-evo" class="tab-content hidden"></div>
        <div id="tab-types" class="tab-content hidden"></div>
      </section>
      <section class="pokecard-footer">
        <div class="overlay-nav">
            <button class="nav-btn" onclick="navigateOverlay(-1)"><</button>
            <button class="nav-btn" onclick="navigateOverlay(1)">></button>
        </div>
      </section>
    </article>`;
}

function getImageTemplate(data) {
  return `<div class="detail-img ${data.types[0].type.name}">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${data.id}.png">
    </div>`;
}

function getStatsTemplate(data) {
  return data.stats
    .map(
      (stat) => `
      <div class="stat-row">
        <span>${stat.stat.name.toUpperCase()}</span>
        <div class="bar"><div class="fill" style="width: ${Math.min(stat.base_stat, 100)}%"></div></div>
        <span>${stat.base_stat}</span>
      </div>`,
    )
    .join("");
}

function getEvoCardTemplate(id, name) {
  return `
    <div class="evo-card">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png" alt="${name}">
      <p>${capitalize(name)}</p>
    </div>`;
}
