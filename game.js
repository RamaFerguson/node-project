//const fs = require("fs");
//const uuidv1 = require("uuid/v1");
const Card = require("./cards");
const Heroes = require("./heroes");

const liveGames = "./live_games/";
const deadGames = "./dead_games/";

const cardDB = require("./assets/card_db.json");
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

        shuffleDeck(this.player1.deck);
        shuffleDeck(this.player2.deck);

        while (this.player1.hand.length < 5) {
            this.player1.hand.push(this.player1.deck.shift());
        }

        while (this.player2.hand.length < 5) {
            this.player2.hand.push(this.player2.deck.shift());
        }

        this.turnCount = 0;
        this.turnLogs = [];
        this.logTurn(["Game Start!"]);
    }

    acceptTurn(turn) {
        if (this.player1.uuid === turn.uuid) {
            this.player1.hand = turn.hand;
            this.player1.deck = turn.deck;
            this.player1.field = turn.field;
            this.player1.graveyard = turn.graveyard;
            this.player1.ready = turn.ready;
            return true;
        } else if (this.player2.uuid === turn.uuid) {
            this.player2.hand = turn.hand;
            this.player2.deck = turn.deck;
            this.player2.field = turn.field;
            this.player2.graveyard = turn.graveyard;
            this.player2.ready = turn.ready;
            return true;
        } else {
            return false;
        }
    }

    resolveTurn() {
        let log = [];

        sortField(this.player1.field);
        sortField(this.player2.field);

        this.player1.damage = calcDamage(this.player1.field)
        this.player2.damage = calcDamage(this.player2.field)

        for (let card of this.player1.field) {
            if (card.includes("sneak")) {
                continue;
            }
            else if (player2.damage >= card.health) {
                player2.damage -= card.health;
                log.push(`P1: ${card.name} destroyed!`)
                player1.field.shift()
            }
        }
    }

    logTurn(log) {
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
            ],
            "log": log
        };
        this.turnLogs.push(turn);
    }
};

var populateDeck = playerDeck => {
    let deck = [];
    let index = 0;

    
    for (let cardID of playerDeck) {
        let card = new Card(cardDB[cardID], index);
        deck.push(card);
        index++;
    }

    return deck;
};

var shuffleDeck = deck => {
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

var sortField = field => {
    field.sort(sortFieldHealth);
    field.sort(sortFieldAttack);
    field.sort(sortFieldWall);
};

var sortFieldHealth = (prev, next) => {
    return -(next.health - prev.health);
};

var sortFieldAttack = (prev, next) => {
    if (prev.health === next.health) {
        if (prev.attack < next.attack) {
            return -1;
        }
        if (prev.attack > next.attack) {
            return 1;
        }
    }
    return 0;
};

var sortFieldWall = (prev, next) => {
    if (prev.keywords.includes("wall") && !next.keywords.includes("wall")) {
        return -1;
    }
    if (!prev.keywords.includes("wall") && next.keywords.includes("wall")) {
        return 1;
    }
    return 0;
};

var calcDamage = (field) => {
    return field.map(card => {
        return card.attack;
    })
    .reduce((total, next) => {
        return total + next;
    });
}

var testDeck = [
    "militia",
    "militia",
    "militia",
    "militia",
    "militia",
    "militia",
    "militia",
    "militia",
    "wooden_palisade",
    "wooden_palisade",
    "wooden_palisade",
    "reckless_avandon",
    "reckless_avandon",
    "ywontudei",
    "ywontudei",
    "ywontudei",
    "ywontudei",
    "ywontudei",
    "champion_champignon",
    "champion_champignon",
    "champion_champignon",
    "champion_champignon",
    "champion_champignon",
    "champion_champignon",
    "champion_champignon"
];
var newDeck = populateDeck(testDeck);
shuffleDeck(newDeck);
var testHand = [];
while (testHand.length < 5) {
    testHand.push(newDeck.shift());
}

sortField(testHand);
console.log(newDeck);
console.log(testHand);
console.log(
    testHand
        .map(card => {
            return card.attack;
        })
        .reduce((total, next) => {
            return total + next;
        })
);
