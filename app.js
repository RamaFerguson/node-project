// express setup
var express = require("express");
var hbs = require("hbs");
var port = process.env.PORT || 8080;

var app = express();

hbs.registerPartials(__dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.use(express.static("assets"));

// cookies
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
app.use(cookieParser("this_is_my_salt"));

// add new user function
const databaseUtils = require("./database_utils");

// uuid module to allow unique
const uuidv1 = require("uuid/v1");

// bcrypt setup
const bcrypt = require("bcrypt");
const saltRounds = 10;

// collection that stores player data
const playerCollection = "players";
const liveGames = "liveGames";
const deadGames = "deadGames";

// contains functions that setup, run and finish games
const gameEngine = require("./engine");
const heroes = require("./heroes");
const cardDB = require("./assets/card_db.json");

// enables parsing of body json
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const axios = require("axios");

// mongo connection
let mongodb = require("mongodb");
let MongoClient = require("mongodb").MongoClient;
const uri =
    "mongodb+srv://admin_user:1Q84_mastur@nodeproject-j2rmx.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

// Initialize connection once
var nodeProjectDB;
client.connect(function(err, clientObject) {
    if (err) throw err;
    // console.log(clientObject);
    // console.log(clientObject.db);
    nodeProjectDB = clientObject.db("node_project");

    // Start the application after the database connection is ready
    app.listen(port);
    console.log("Listening to the port 8080");
});

app.post("/newPlayerAccount", async function(request, response) {
    let username = request.body.username;
    let password = request.body.password;

    // hashing password
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    // verifying username is new
    let userExists = await databaseUtils.checkUserInDb(
        username,
        playerCollection,
        nodeProjectDB
    );
    if (userExists === true) {
        response.render("user_exists.hbs", {
            title: "Uh oh!"
        });
    } else {
        // adds new user to player collection
        nodeProjectDB.collection(playerCollection).insertOne(
            {
                uuid: uuidv1(),
                username: username,
                password: hashedPassword,
                wins: 0,
                losses: 0,
                draws: 0,
                deck: {
                    hero: "lightlord",
                    cards: []
                }
            },
            (error, result) => {
                if (error) {
                    response.render("server_error.hbs", {
                        title: "Uh oh!"
                    });
                } else {
                    response.render("new_user_success.hbs", {
                        title: "Success!"
                    });
                }
            }
        );
    }
});

app.post("/logInPlayer", async function(request, response) {
    let username = request.body.username;
    let password = request.body.password;

    // verifying username exists
    let userExists = await databaseUtils.checkUserInDb(
        username,
        playerCollection,
        nodeProjectDB
    );
    if (userExists === false) {
        response.render("user_does_not_exist.hbs", {
            title: "Uh oh!"
        });
    } else {
        // fetch hashed password on db
        let userDetails = await databaseUtils
            .returnUserDetails(username, playerCollection, nodeProjectDB)
            .catch(error => {
                console.log("the catch is happening");
                response.render("server_error.hbs", {
                    title: "Uh oh!"
                });
            });
        console.log(userDetails[0].uuid);
        console.log(userDetails[0].password);

        // compare hashed password with provided password
        // console.log(fetchedDetails);
        bcrypt.compare(password, userDetails[0].password, function(
            error,
            result
        ) {
            if (error) {
                console.log(error);
            } else if (result === false) {
                // TODO - replace this with some text on the website when i have time
                console.log("Password incorrect!");
                response.render("login.hbs", {
                    title: "Try again!"
                });
            } else if (result === true) {
                console.log("made it to the cookie step!");
                // console.log(UserDetails[0].uuid)
                response.cookie("id", userDetails[0].uuid, {
                    signed: true
                });
                response.redirect("/home");
            }
        });
    }
});

// populates live games list
hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});

hbs.registerPartials(__dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.use(express.static("assets"));

app.get("/", (request, response) => {
    response.render("landing.hbs", {
        title: "Vanguard Assault"
    });
});
app.get("/login", (request, response) => {
    response.render("login.hbs", {
        title: "Login"
    });
});

app.get("/signup", (request, response) => {
    response.render("signup.hbs", {
        title: "Sign Up"
    });
});

app.get("/home", async (request, response) => {
    // checks if a user is logged in
    if (request.signedCookies) {
        console.log(request.signedCookies.id);
        try {
            let playerID = request.signedCookies.id;
            let playerDetails = await databaseUtils.returnUserDetailsByUUID(
                playerID,
                playerCollection,
                nodeProjectDB
            );
            let playerUserName = playerDetails[0].username;

            // logic for populating live games list
            let arrayAllPlayers = await databaseUtils.returnAllEntriesFromCollection(
                playerCollection,
                nodeProjectDB
            );
            let arrayAllUsernames = [];
            for (let players of arrayAllPlayers) {
                arrayAllUsernames.push(players.username);
            }
            // console.log(arrayAllUsernames);

            // now that we have the list of all users, we want to compare with the list of active games that user has
            // get array of which players the user has started a game with
            let gamesArray = await databaseUtils.checkGame(
                [playerUserName],
                liveGames,
                nodeProjectDB
            );
            console.log(gamesArray);

            let newGameOpponentsNames;
            let liveOpponentsNames;
            // null means there are no live games, so can make a new game with anyone
            if (gamesArray === null && typeof gamesArray === "object") {
                newGameOpponentsNames = arrayAllUsernames.filter(
                    user => user !== playerUserName
                );
                // otherwise have to split the two lists
            } else {
                let liveGamesOpponentsArray = gameEngine.fillGameButtons(
                    gamesArray,
                    playerUserName
                );
                console.log("live games opponents array: ");
                console.log(liveGamesOpponentsArray);

                liveOpponentsNames = liveGamesOpponentsArray.map(button => {
                    return button.opponent;
                });
                console.log("live opponents names: ");
                console.log(liveOpponentsNames);

                // list of users to exclude from being able to make new games with
                let excludeList = [];
                // console.log(excludeList)
                for (let opponent of liveOpponentsNames) {
                    excludeList.push(opponent);
                }
                // console.log(excludeList)
                excludeList.push(playerUserName);
                // console.log(excludeList);

                newGameOpponentsNames = arrayAllUsernames.filter(user => {
                    if (!excludeList.includes(user)) {
                        return user;
                    }
                });
            }
            console.log("newGameOpponentsNames: ");
            console.log(newGameOpponentsNames);

            // When either of the arrays below are empty, it causes a server error
            // console.log(newGameOpponentsNames)
            // console.log(liveOpponentsNames)
            if (Array.isArray(newGameOpponentsNames) === false) {
                newGameOpponentsNames = [];
            }
            if (Array.isArray(liveOpponentsNames) === false) {
                liveOpponentsNames = [];
            }

            response.render("main_user_page.hbs", {
                title: "Home",
                username: playerUserName,
                newOpponents: newGameOpponentsNames,
                liveOpponents: liveOpponentsNames
            });
        } catch (error) {
            response.render("server_error.hbs", {
                title: "Error in Server"
            });
        }
    }
});

hbs.registerHelper("populateStartNewGames", (playerName, opponentNames) => {
    let links = [];
    opponentNames.forEach(opponentName => {
        console.log("try!!");
        if (playerName < opponentName) {
            // links.push(`<a href="localhost:8080/play/${playerName}.${value}"> Continue fighting ${value}!</a>`);
            links.push(
                `<form action ="/newGame/playerOne/${opponentName}/playerTwo/${playerName}/current/${playerName}">\n<input type = "submit" value = "Fight ${opponentName}!"/>\n</form>`
            );
        } else {
            links.push(
                `<form action ="/newGame/playerOne/${playerName}/playerTwo/${opponentName}/current/${playerName}">\n<input type = "submit" value = "Fight ${opponentName}!"/>\n</form>`
            );
        }
    });
    return links.join(`\n`);
});

// creates new game
app.get(
    "/newGame/playerOne/:playerOne/playerTwo/:playerTwo/current/:currentPlayer",
    async function(request, response) {
        try {
            console.log("_____________New game creation start_____________");
            console.log(request.params.playerOne);
            console.log(request.params.playerTwo);
            console.log(request.params.currentPlayer);

            let opponentName;
            if (request.params.playerOne === request.params.currentPlayer) {
                opponentName = request.params.playerTwo;
            } else {
                opponentName = request.params.playerOne;
            }
            let opponentDetails = await databaseUtils.returnUserDetails(
                opponentName,
                playerCollection,
                nodeProjectDB
            );

            let playerName = request.params.currentPlayer;
            let playerDetails = await databaseUtils.returnUserDetails(
                playerName,
                playerCollection,
                nodeProjectDB
            );
            console.log(
                "_____________opponent and player details initialised!______________"
            );

            let playersArray = [playerName, opponentName].sort();

            // checkGame returns null if game does not exist, and the game object if it does exist
            let game = await databaseUtils.checkGame(
                playersArray,
                liveGames,
                nodeProjectDB
            );
            console.log("Game :");
            console.log(game);
            console.log("Type of game:");
            console.log(typeof game);
            if (game !== null) {
                console.log("Game already exists!");
            } else if (game === null && typeof game === "object") {
                // initialises game and saves it to liveGames collection
                console.log("made it to game === null!");
                gameEngine.initGame(
                    nodeProjectDB,
                    playerDetails[0],
                    opponentDetails[0]
                );
                console.log("_____________NEW Game initialised!_____________");
                response.redirect(
                    `/play/player/${playersArray[0]}/opponent/${
                        playersArray[1]
                    }`
                );
            }
        } catch (error) {
            response.render("server_error.hbs", {
                title: "Error in Server"
            });
        }
    }
);

hbs.registerHelper("populateLiveGames", (playerName, opponentNames) => {
    let links = [];
    opponentNames.forEach(opponentName => {
        console.log("try!! nee");
        links.push(
            `<form action ="/play/player/${playerName}/opponent/${opponentName}">\n<input type = "submit" value = "Continue fighting ${opponentName}!"/>\n</form>`
        );
    });
    return links.join(`\n`);
});

hbs.registerHelper("generateDeckCards", cardKeys => {
    let cards = [];
    for (let key of cardKeys) {
        let cardButton = `<button type="button" onclick="addCard(\'${key}\')">
        <img src="/cards/${key}.jpg" alt="${cardDB[key].name}">
        </button>`;
        key.push(cardButton);
    }
    return cards.join(`\n`);
});

hbs.registerHelper("generateHeroes", heroes => {
    let heroKeys = Object.keys(heroes);
    let heroButtons = [];

    for (let key of heroKeys) {
        let heroButton = `<button type="button" onclick="changeHero(\'${key}\', \'${
            heroes[key].name
        }\', \'${heroes[key].desc}\');">
        <img src="/cards/${key}.jpg" alt="${heroes[key].name}">
        </button>`;
        heroButtons.push(heroButton);
    }
    return heroButtons;
});

hbs.registerHelper("oldHeroName", oldHero => {
    return heroes[oldHero].name;
});

hbs.registerHelper("oldHeroDesc", oldHero => {
    return heroes[oldHero].desc;
});

hbs.registerHelper("oldDeck", oldCards => {
    return oldCards.join(`\n`);
});

app.get("/deckbuild", async (request, response) => {
    let playerID = request.signedCookies.id;
    let playerDetails = await databaseUtils.returnUserDetailsByUUID(
        playerID,
        playerCollection,
        nodeProjectDB
    );
    console.log(playerDetails);
    console.log(playerDetails[0]);
    

    response.render("deckbuild.hbs", {
        title: "deckbuild",
        heroes: heroes,
        cardKeys: Object.keys(cardDB),
        oldHero: playerDetails[0].deck.hero,
        oldCards: playerDetails[0].deck.cards
    });
});

app.post("/deckbuild/confirm", async (request, response) => {
    let playerID = request.signedCookies.id;
    let playerDetails = await databaseUtils.returnUserDetailsByUUID(
        playerID,
        playerCollection,
        nodeProjectDB
    );
    //console.log(request.body)
    return new Promise((resolve, reject) => {
        nodeProjectDB.playerCollection.update(
            {
                uuid: playerID
            },
            {
                deck: request.body.deck
            }
        );
    });
});

app.get(
    "/play/player/:player/opponent/:opponent",
    async (request, response) => {
        console.log(request.params);
        let playerArray = [
            request.params.player,
            request.params.opponent
        ].sort();
        console.log("player array: ");

        console.log(playerArray);
        let currentGame = await databaseUtils.checkGame(
            playerArray,
            liveGames,
            nodeProjectDB
        );
        let gameState = await gameEngine.renderGame(
            currentGame,
            request.params.player
        );

        console.log("____GAME STATE in RENDER____");
        console.log(gameState);
        response.render("game.hbs", {
            title: "Fight!",
            opponentField: gameState.opponent.field,
            opponentLife: gameState.opponent.life,
            opponentMana: gameState.opponent.mana,
            opponentHero: gameState.opponent.hero,
            opponentUserName: gameState.opponent.username,

            playerField: gameState.player.field,
            playerLife: gameState.player.life,
            playerMana: gameState.player.mana,
            playerHero: gameState.player.hero,
            playerHand: gameState.player.hand,
            playerDeckSize: gameState.player.deck
        });
    }
);

app.get("/play/player/:player/opponent/:opponent", (request, response) => {
    // let players = playerString.split("-")
    console.log(request.params);
    response.render("game.hbs", {
        title: "Fight!",
        opponentField: gameState.opponent.field,
        opponentLife: gameState.opponent.life,
        opponentMana: gameState.opponent.mana,
        opponentHero: gameState.opponent.hero,
        opponentUserName: gameState.opponent.username,

        playerField: gameState.player.field,
        playerLife: gameState.player.life,
        playerMana: gameState.player.mana,
        playerHero: gameState.player.hero,
        playerHand: gameState.player.hand,
        playerDeckSize: gameState.player.deck
    });
});

// Don't need this here, I moved it to line 41
// app.listen(port, () => {
//     console.log('Vanguard Assault is online')
