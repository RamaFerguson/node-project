const uuidv1 = require("uuid/v1");
const game = require("./game");
const databaseUtils = require("./database_utils");

//const liveGames = "./live_games/";
//const deadGames = "./dead_games/";
const liveGames = "liveGames";
const deadGames = "deadGames";

var initGame = (database, player1, player2) => {
    let p1 = {
        uuid: player1.uuid,
        life: 20,
        hero: player1.deck.hero,
        deck: game.populateDeck(player1.deck.cards),
        hand: [],
        field: [],
        graveyard: [],
        mana: 1,
        damage: 0,
        ready: false
    };

    let p2 = {
        uuid: player2.uuid,
        life: 20,
        hero: player2.deck.hero,
        deck: game.populateDeck(player2.deck.cards),
        hand: [],
        field: [],
        graveyard: [],
        mana: 1,
        damage: 0,
        ready: false
    };

    game.shuffleDeck(p1.deck);
    game.shuffleDeck(p2.deck);

    while (this.p1.hand.length < 5) {
        this.p1.hand.push(this.p1.deck.shift());
    }
    while (this.p2.hand.length < 5) {
        this.p2.hand.push(this.p2.deck.shift());
    }

    let players = [p1.uuid, p2.uuid].sort();
    let gameState = game.Game(p1, p2, 0, []);
    gameState.logTurn(["Game Start!"]);

    database.collection(liveGames).insertOne({
        players: players,
        gameState: gameState
    });
};

module.exports = {
    initGame: initGame
};
