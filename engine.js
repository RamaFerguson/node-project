const uuidv1 = require("uuid/v1");
const Game = require("./game");
const databaseUtils = require("./database_utils")

//const liveGames = "./live_games/";
//const deadGames = "./dead_games/";
const liveGames = "liveGames";
const deadGames = "deadGames";

var initGame = (database, player1, player2) => {
    database
        .collection(liveGames)
        .insertOne({
            players: [player1.uuid, player2.uuid].sort(),
            gameState: Game(player1, player2)
        });
};
