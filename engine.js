//const uuidv1 = require("uuid/v1");
const game = require("./game");
//const databaseUtils = require("./database_utils");

const liveGames = "liveGames";
const deadGames = "deadGames";

var initGame = async (database, player1, player2) => {
    let timestamp = new Date();
    console.log('timestamp: ');
    console.log(timestamp);

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
    console.log('p1: ');
    console.log(p1);

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
    console.log('p2: ');
    console.log(p2);

    game.shuffleDeck(p1.deck);
    game.shuffleDeck(p2.deck);

    while (p1.hand.length < 5) {
        p1.hand.push(p1.deck.shift());
    }
    while (p2.hand.length < 5) {
        p2.hand.push(p2.deck.shift());
    }

    let players = [p1.username, p2.username].sort();
    let gameState = new game.Game(p1, p2, 0, []);
    gameState.logTurn(["Game Start!"]);

    await database
    .collection(liveGames)
    .insertOne({
        players: players,
        gameState: gameState,
        timestamp: timestamp
    }, (error, result) => {
        if (error) {
            console.log('failure occured when adding new game')
            return 'failure';
        } else {
            console.log('Successfully added game to live games db')
            return 'success';
        }
    });
};

var fillGameButtons = (games, username) => {
    let buttons = [];
    // potentially check for null
    // if (games === null && typeof(games) === "object"){

    // }
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

        // TODO - update this to current link
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

// changed player to playerUserName
var updateTurn = (currentGame, playerUserName, turnBuffer) => {
    let turn = {
        username: playerUserName,
        hand: turnBuffer.hand,
        deck: turnBuffer.deck,
        field: turnBuffer.field,
        ready: true
    };
    currentGame.acceptTurn(turn);
};

var renderGame = (currentGame, username) => {
    console.log('_____renderGame logs______')
    console.log('______Current game: ____')
    console.log(currentGame)
    console.log('currentGame[0].gameState: ')
    console.log(currentGame[0].gameState)
    console.log('Username: ')
    console.log(username)
    let turnLog = currentGame[0].gameState.turnLogs;
    console.log('Turn logs: ')
    console.log(turnLog)

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

    if (currentGame[0].gameState.player1.username === username) {
        opponent.field = currentGame[0].gameState.player2.field;
        opponent.life = currentGame[0].gameState.player2.life;
        opponent.mana = currentGame[0].gameState.player2.mana;
        opponent.hero = currentGame[0].gameState.player2.hero;
        opponent.username = currentGame[0].gameState.player2.username;

        player.field = currentGame[0].gameState.player1.field;
        player.life = currentGame[0].gameState.player1.life;
        player.mana = currentGame[0].gameState.player1.mana;
        player.hero = currentGame[0].gameState.player1.hero;
        player.hand = currentGame[0].gameState.player1.hand;
        player.deck = currentGame[0].gameState.player1.deck.length;
    } else {
        opponent.field = currentGame[0].gameState.player1.field;
        opponent.life = currentGame[0].gameState.player1.life;
        opponent.mana = currentGame[0].gameState.player1.mana;
        opponent.hero = currentGame[0].gameState.player1.hero;
        opponent.username = currentGame[0].gameState.player1.username;

        player.field = currentGame[0].gameState.player2.field;
        player.life = currentGame[0].gameState.player2.life;
        player.mana = currentGame[0].gameState.player2.mana;
        player.hero = currentGame[0].gameState.player2.hero;
        player.hand = currentGame[0].gameState.player2.hand;
        player.deck = currentGame[0].gameState.player2.deck.length;
    }

    return { opponent: opponent, player: player, log: turnLog };
};

module.exports = {
    initGame,
    updateTurn,
    fillGameButtons,
    renderGame
};
