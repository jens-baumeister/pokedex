# Pokédex

Eine interaktive Webanwendung zur Erkundung und Verwaltung von Pokémon-Daten.

## 🎯 Features

- **Pokémon-Katalog**: Umfangreiche Datenbank mit Pokémon-Informationen
- **Suchfunktion**: Schnelle Suche nach Pokémon-Namen oder ID
- **Detailansicht**: Umfassende Informationen zu jedem Pokémon (Typ, Fähigkeiten, Stats)
- **Responsives Design**: Optimiert für alle Gerätetypen
- **Moderne UI**: Benutzerfreundliche Oberfläche mit intuitivem Layout

## 📋 Anforderungen

- Node.js 16 oder höher
- npm oder yarn
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/pokedex.git
   cd pokedex
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Im Browser öffnen**
   ```
   http://localhost:3000
   ```

## 📦 Verfügbare Skripte

- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Produktionsversion erstellen
- `npm test` - Unit-Tests ausführen
- `npm run lint` - Code-Qualität prüfen

## 🏗️ Projektstruktur

```
pokedex/
├── src/
│   ├── components/     # React-Komponenten
│   ├── pages/          # Seiten
│   ├── styles/         # CSS-Dateien
│   └── utils/          # Hilfsfunktionen
├── public/             # Statische Assets
├── package.json
└── README.md
```

## 🔌 API

Das Projekt nutzt die [PokéAPI](https://pokeapi.co/) für Pokémon-Daten.

**Beispiel-Anfrage:**
```javascript
fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 💡 Beispiel-Nutzung

```javascript
// Pokémon suchen
const searchPokemon = (name) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(res => res.json());
};

searchPokemon('charizard').then(pokemon => {
  console.log(`${pokemon.name}: ${pokemon.stats}`);
});
```

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 👤 Autor

Entwickelt von Developer Akademie

## 🤝 Beiträge

Beiträge sind willkommen! Bitte erstellen Sie einen Pull Request mit Ihren Änderungen.