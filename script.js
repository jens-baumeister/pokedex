let pokeJson = [];

const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pokeJson.length}`

// function init(){
//     document.getElementsByClassName("loader").style.display = "block"
//     document.getElementsByClassName("card").style.display = "none"
// }

// bilderpfad: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/brilliant-diamond-shining-pearl/[i].png

function init() {
    fetchPokemons('/forms');
    console.log(pokeJson);
    
}

async function fetchPokemons(path=""){
    try {
        load();
        let response = await fetch(BASE_URL + path + '.json');
        if (!response.ok) {
            throw new Error(`Fehler! Status: ${response.status}`);
        }
        let data = await response.json();
        pokeJson.push(data);
        console.log('Daten wurden erfolgreich gepusht:', pokeJson);
        
    } catch (error) {
        console.error('Fehler beim Laden:', error);
        
    }
    renderPokeCards()
}

function load() {
    document.getElementById('card').style.display = "none";
    document.getElementById('loader').style.display = "";
}

function endOfLoading() {
    document.getElementById('card').style.display = "";
    document.getElementById('loader').style.display = "none";
}

function renderPokeCards() {
    let pokeCardRef = document.getElementById('card')
    pokeCardRef.innerHTML = ""
    for (let i = 0; i < pokeJson.length; i++) {
        pokeCardRef.innerHTML += getPokeCard();        
    }

    endOfLoading();
}