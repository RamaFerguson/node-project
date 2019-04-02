const fs = require("fs");
const uuidv1 = require("uuid/v1");

const liveGames = "./live_games/";
const deadGames = "./dead_games/";

class Game {
    constructor(player1, player2) {
        this.filePath = `${player1.uuid}_${player2.uuid}.json`

        let today = new Date();
        this.timestamp = today.toISOString();

        this.player1 = {
            uuid = player1.uuid,
            life = 20,
            deck = player1.deck,
            hand = [],
            field = [],
            graveyard = [],
            mana = 1,
            ready = false
        }
        
        this.player2 = {
            uuid = player2.uuid,
            life = 20,
            deck = player2.deck,
            hand = [],
            field = [],
            graveyard = [],
            mana = 1,
            ready = false
        }

        this.turnCount = 0;
    }
}

var parseDatabase = () => {
    
}

var processGameLogic = (game) => {
    
}