async function getPokeCard(i) {
  let response = await fetch(pokeJson[i].url);
  let data = await response.json();

  let id = data.id;
  let name = data.name;
  let typesHTML = await getTypeIcons(data.types);
  let mainType = data.types[0].type.name;

  endOfLoading();
  
  return `
<section class="card">
    <div class="card-header">#${id} ${name.charAt(0).toUpperCase(1) + name.slice(1).toLowerCase()}</div>
    <div class="card-body ${mainType}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png"
                alt="picture of ${name}">
    </div>
    <div class="card-footer">${typesHTML}</div>
</section>`;
}
