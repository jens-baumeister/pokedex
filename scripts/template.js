function getPokeCard(i) {

    let urlParts = pokeJson[i].url.split('/');
    let id = urlParts[urlParts.length - 2];
  return `
<section class="card">
    <div class="card-header">#${id} ${pokeJson[i].name.charAt(0).toUpperCase(1) + pokeJson[i].name.slice(1).toLowerCase()}</div>
    <div class="card-body">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/${id}.png"
                alt="picture of ${pokeJson[i].name}">
    </div>
    <div class="card-footer ">Footer</div>
</section>`;
}
