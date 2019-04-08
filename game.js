//const fs = require("fs");
//const uuidv1 = require("uuid/v1");
const Card = require("./cards")
const Heroes = require("./heroes")

const liveGames = "./live_games/";
const deadGames = "./dead_games/";

const cardDB;
//const keywords;

module.exports = class Game {
    constructor(player1, player2) {
        this.filePath = `${player1.uuid}_${player2.uuid}.json`;

        let today = new Date();
        this.timestamp = today.toISOString();

        this.player1 = {
            uuid: player1.uuid,
            life: 20,
            hero: Heroes[`${player1.deck.hero}`].name,
            power: Heroes[`${player1.deck.hero}`].power,
            deck: populateDeck(player1.deck.cards),
            hand: [],
            field: [],
            graveyard: [],
            mana: 1,
            damage: 0,
            ready: false
        };

        this.player2 = {
            uuid: player2.uuid,
            life: 20,
            hero: Heroes[`${player2.deck.hero}`].name,
            power: Heroes[`${player2.deck.hero}`].power,
            deck: populateDeck(player2.deck.cards),
            hand: [],
            field: [],
            graveyard: [],
            mana: 1,
            damage: 0,
            ready: false
        };
        
        this.turnCount = 0;
        this.turnLogs = [];
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
    };

    logTurn() {
        let turn = {
            "turn": this.turnCount,
            "p1_state": [
                this.player1.life,
                this.player1.deck,
                this.player1.hand,
                this.player1.field,
                this.player1.graveyard
            ],
            "p2_state": [
                this.player2.life,
                this.player2.deck,
                this.player2.hand,
                this.player2.field,
                this.player2.graveyard
            ]
        }
        this.turnLogs.push(turn);
    }

    
}

var populateDeck = playerDeck => {
    let deck = [];
    let index = 0;

    for (const cardID of playerDeck) {
        let card = new Card(cardDB[cardID], index);
        deck.push(card)
    }

    return deck
};