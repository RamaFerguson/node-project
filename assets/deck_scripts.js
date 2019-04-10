const cardDB = "./card_db.json"
//const Heroes = "./heroes.js"

let deck = {
    hero: "",
    cards: []
};
function lightlord() {
    deck.hero = "lightlord";
    document.getElementById("hero").innerHTML =
        `Your Hero is: ${heroes[deck.hero].name}`;
    document.getElementById("heroDesc").innerHTML = `${heroes[deck.hero].desc}`
}

function brodia() {
    deck.hero = "brodia";
    document.getElementById("hero").innerHTML =
        "Your Hero is: Brodia, the Vanguard";
}
function bats() {
    deck.hero = "hundred_bats";
    document.getElementById("hero").innerHTML = "Your Hero is: 100 bats";
}
function guuch() {
    deck.hero = "guuch";
    document.getElementById("hero").innerHTML = "Your Hero is: The Guuch";
}
function brainum() {
    deck.hero = "brainum";
    document.getElementById("hero").innerHTML = "Your Hero is: Brainum";
}

function test() {
    console.log(deck);
}

function generateDeckCards() {
    let deckButtons = [];

    for (let key in Object.keys(cardDB)) {
        let card = `<img src="/cards/${key}.jpg" alt=${cardDB[key].name}>`
        
    }
};