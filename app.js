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
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
app.use(cookieParser('this_be_our_salt'));

// add new user function
const databaseUtils = require("./database_utils");

// uuid module to allow unique
const uuidv1 = require("uuid/v1");

// bcrypt setup
const bcrypt = require("bcrypt");
const saltRounds = 10;

// collection that stores player data
const PLAYER_COLLECTION = "players";
const liveGames = "liveGames";
const deadGames = "deadGames";

// enables parsing of body json
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

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
client.connect(function (err, clientObject) {
    if (err) throw err;
    // console.log(clientObject);
    // console.log(clientObject.db);
    nodeProjectDB = clientObject.db("node_project");

    // Start the application after the database connection is ready
    app.listen(port);
    console.log("Listening to the port 8080");
});

// creates new users
app.post("/newPlayerAccount", async function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    // hashing password
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    // verifying username is new
    let userExists = await databaseUtils.checkUserInDb(
        username,
        PLAYER_COLLECTION,
        nodeProjectDB
    );
    if (userExists === true) {
        response.render("user_exists.hbs", {
            title: "Uh oh!"
        });
    } else {
        // adds new user to player collection
        nodeProjectDB.collection(PLAYER_COLLECTION).insertOne({
                uuid: uuidv1(),
                username: username,
                password: hashedPassword,
                wins: 0,
                losses: 0,
                draws: 0,
                deck: {}
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

// logs in player
app.post("/logInPlayer", async function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    let fetchedDetails;

    // verifying username exists
    let userExists = await databaseUtils.checkUserInDb(
        username,
        PLAYER_COLLECTION,
        nodeProjectDB
    );
    if (userExists === false) {
        response.render("user_does_not_exist.hbs", {
            title: "Uh oh!"
        });
    } else {
        // fetch hashed password on db
        let userDetails = await databaseUtils.returnUserDetails(username, PLAYER_COLLECTION, nodeProjectDB).catch((error) => {
            console.log('the catch is happening');
            response.render('server_error.hbs', {
                title: 'Uh oh!'
            });
        });
        console.log(userDetails[0].uuid);
        console.log(userDetails[0].password)

        // compare hashed password with provided password
        // console.log(fetchedDetails);
        bcrypt.compare(password, userDetails[0].password, function (error, result) {
            if (error) {
                console.log(error);
            } else if (result === false) {
                // TODO - replace this with some text on the website when i have time
                console.log("Password incorrect!");
                response.render('login.hbs', {
                    title: 'Try agauin!'
                });
            } else if (result === true) {
                console.log('made it to the cookie step!');

                response.cookie("id", userDetails[0].uuid, {
                    signed: true
                });
                response.redirect('/home');
            };
        });
    };
});


hbs.registerPartials(__dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static('assets'));


app.get('/', (request, response) => {
    response.render('landing.hbs', {
        title: 'Vanguard Assault',
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

app.get('/home', async (request, response) => {
    if (request.signedCookies) {
        // console.log(request.signedCookies.id);
        try {
            let userDetails = await databaseUtils.returnUserDetailsByUUID(request.signedCookies.id, PLAYER_COLLECTION, nodeProjectDB);
            let username = await userDetails[0].username
            response.render('main_user_page.hbs', {
                title: 'Home',
                username: username
            });
        } catch (error) {
            response.render('server_error.hbs', {
                title: 'Error in Server'
            });
        };
    };
});

app.get("/deckbuild", (request, response) => {
    response.render("deckbuild.hbs", {
        title: "deckbuild"
    });
});

app.get("/play/<str:playerString>", (request, response) => {
    let players = playerString.split(".")
})

// Don't need this here, I moved it to line 41
// app.listen(port, () => {
//     console.log('Vanguard Assault is online')