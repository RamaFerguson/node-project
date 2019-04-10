//const uuidv1 = require("uuid/v1");
const game = require("./game");
//const databaseUtils = require("./database_utils");

//const liveGames = "./live_games/";
//const deadGames = "./dead_games/";

var initGame = (database, player1, player2) => {
    let timestamp = new Date();

    let p1 = {
        username: player1.username,
        life: 20,
        hero: player1.deck.hero,
        deck: player1.deck.cards,
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
        deck: player2.deck.cards,
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
        gameState: gameState,
        timestamp: timestamp
    });
};

var fillGameButtons = (games, username) => {
    let buttons = [];

    for (let instance of games) {
        // console.log(instance)
        let opponent = instance.players.filter(player => {
            return player !== username;
        });
        // console.log(opponent)


        let ready;
        if (instance.gameState.player1.username === username) {
            ready = instance.gameState.player1.ready;
        } else {
            ready = instance.gameState.player2.ready;
        }
        // console.log(ready)

        let link = `/play/${instance.players.join(".")}`;
        // console.log('pre')
        // console.log(buttons)

        buttons.push({
            opponent: opponent[0],
            ready: ready,
            link: link
        });
        // console.log('post')
        // console.log(buttons)
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
    let turnLog = currentGame.turnLog;

    let opponent = {
        field: [],
        life: "",
        mana: "",
        hero: "",
        username: ""
    };

    let player = {
        field: [],
        life: "",
        mana: "",
        hero: "",
        hand: "",
        deck: ""
    };

    if (currentGame.player1.username === username) {
        opponent.field = currentGame.player2.field;
        opponent.life = currentGame.player2.life;
        opponent.mana = currentGame.player2.mana;
        opponent.hero = currentGame.player2.hero;
        opponent.username = currentGame.player2.username;

        player.field = currentGame.player1.field;
        player.life = currentGame.player1.life;
        player.mana = currentGame.player1.mana;
        player.hero = currentGame.player1.hero;
        player.hand = currentGame.player1.hand;
        player.deck = currentGame.player1.deck.length;
    } else {
        opponent.field = currentGame.player1.field;
        opponent.life = currentGame.player1.life;
        opponent.mana = currentGame.player1.mana;
        opponent.hero = currentGame.player1.hero;
        opponent.username = currentGame.player1.username;

        player.field = currentGame.player2.field;
        player.life = currentGame.player2.life;
        player.mana = currentGame.player2.mana;
        player.hero = currentGame.player2.hero;
        player.hand = currentGame.player2.hand;
        player.deck = currentGame.player2.deck.length;
    }

    return { opponent: opponent, player: player, log: turnLog };
};

module.exports = {
    initGame,
    updateTurn,
    fillGameButtons,
    renderGame
};
