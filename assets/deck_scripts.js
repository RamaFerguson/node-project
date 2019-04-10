var deck = {
    hero: "",
    cards: []
};

function addCard(key) {
    if (deck.cards.length < 25) {
        deck.cards.push(`${key}`);
    }
    document.getElementById("cards").innerHTML = deck.cards.join(`\n`);
}

function clearDeck() {
    document.getElementById("cards").innerHTML = "";
}

/*
    function removeCard(key) {
        if (deck.cards.includes(`${key}`)) {
            deck.cards.splice(deck.cards.lastIndexOf(`${key}`), 1)
        }
        document.getElementById("cards").innerHTML = deck.cards.join(`\n`)
    }
    */

function changeHero(key, name, desc) {
    deck.hero = `${key}`;
    document.getElementById("hero").innerHTML = `Your Hero is: ${name}`;
    document.getElementById("heroDesc").innerHTML = `${desc}`;
}

function confirmDeck() {
    console.log(deck);
    if (deck.hero !== "" && deck.cards.length !== 0) {
        axios({
            method: "post",
            url: "/deckbuild/confirm",
            data: {
                deck: deck
            }
        });
    }
}
