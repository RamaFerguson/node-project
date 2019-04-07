const fs = require("fs");
const uuidv1 = require("uuid/v1");

const liveGames = "./live_games/";
const deadGames = "./dead_games/";
const cardDB;
const keywords;
const powers;

class Game {
    constructor(player1, player2) {
        this.filePath = `${player1.uuid}_${player2.uuid}.json`;

        let today = new Date();
        this.timestamp = today.toISOString();

        this.player1 = {
            uuid: player1.uuid,
            life: 20,
            hero: player1.deck.hero,
            deck: populateDeck(player1.deck.cards),
            hand: [],
            field: [],
            graveyard: [],
            mana: 1,
            ready: false
        };

        this.player2 = {
            uuid: player2.uuid,
            life: 20,
            hero: player2.deck.hero,
            deck: populateDeck(player2.deck.cards),
            hand: [],
            field: [],
            graveyard: [],
            mana: 1,
            ready: false
        };

        this.turnCount = 0;
    }

    processGameLogic() {
        
    }

    shuffleDeck(deck) {
        let currentCard = deck.length;
        let tempCard, randomCard;

        while (0 !== currentCard) {
            
            randomCard = Math.floor(Math.random() * currentCard);
            currentCard--;
            
            tempCard = deck[currentCard];
            deck[currentCard] = deck[randomCard];
            deck[randomCard] = tempCard;
        }

        return deck;
    };
}

class Card {
    constructor(cardInfo, index) {
        this.name = cardInfo.name;
        this.attack = cardInfo.attack;
        this.health = cardInfo.health;
        this.cost = cardInfo.cost;
        this.keywords = cardInfo.keywords;

        this.GID = index;
    }
}

var populateDeck = playerDeck => {
    let deck = [];
    let index = 0;

    for (const cardID of playerDeck) {
        let card = Card(cardDB[cardID], index);
        deck.push(card)
    }

    return deck
};
