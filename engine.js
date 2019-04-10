//const uuidv1 = require("uuid/v1");
const game = require("./game");
//const databaseUtils = require("./database_utils");

//const liveGames = "./live_games/";
//const deadGames = "./dead_games/";

var initGame = (database, player1, player2) => {
    let p1 = {
        username: player1.username,
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
        username: player2.username,
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

    let players = [p1.username, p2.username];
    let gameState = game.Game(p1, p2, 0, []);
    gameState.logTurn(["Game Start!"]);

    database.collection(liveGames).insertOne({
        players: players,
        gameState: gameState
    });
};

var fillGameButtons = (games, username) => {
    let buttons = [];

    for (let instance of games) {
        console.log(instance)
        let opponent = instance.players.filter(player => {
            return player !== username;
        });
        console.log(opponent)


        let ready;
        if (instance.gameState.player1.username === username) {
            ready = instance.gameState.player1.ready;
        } else {
            ready = instance.gameState.player2.ready;
        }
        console.log(ready)

        let link = `/play/${instance.players.join(".")}`;
        console.log('pre')
        console.log(buttons)

        buttons.push({
            opponent: opponent[0],
            ready: ready,
            link: link
        });
        console.log('post')
        console.log(buttons)
    }

    return buttons;
};

var updateTurn = (currentGame, player, turnBuffer) => {
    let turn = {
        uuid: player.username,
        hand: turnBuffer.hand,
        deck: turnBuffer.deck,
        field: turnBuffer.field,
        ready: true
    };
    currentGame.acceptTurn(turn);
};

var renderGame = (currentGame, username) => {
    let opponent
}

module.exports = {
    initGame,
    updateTurn,
    fillGameButtons,
    renderGame
};
