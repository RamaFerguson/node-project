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
app.use(cookieParser());

// add new user function
const databaseUtils = require("./database_utils");

// uuid module to allow unique
const uuidv1 = require("uuid/v1");

// bcrypt setup
const bcrypt = require("bcrypt");
const saltRounds = 10;

// collection that stores player data
const PLAYER_COLLECTION = "players";

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
client.connect(function(err, clientObject) {
    if (err) throw err;
    // console.log(clientObject);
    // console.log(clientObject.db);
    nodeProjectDB = clientObject.db("node_project");

    // Start the application after the database connection is ready
    app.listen(port);
    console.log("Listening on port 8080");
});

app.post("/newPlayerAccount", async function(request, response) {
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
        nodeProjectDB.collection(PLAYER_COLLECTION).insertOne(
            {
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

app.post("/logInPlayer", async function(request, response) {
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
        nodeProjectDB.collection(PLAYER_COLLECTION).find({
            "username": username,
        }, {
            "password": 1
        }, (error, result) => {
            if (error) {
                response.render('server_error.hbs', {
                    title: 'Uh oh!'
                });
            } else {
                fetchedDetails = JSON.stringify(result.ops, undefined, 2);
                // compare hashed password with provided password
                bcrypt.compare(password, fetchedDetails.password, function(error, result) {
                    if (result === false) {
                        alert("Password incorrect!");
                    } else if (result === true) {
                        
                    }
                });
                response.render('new_user_success.hbs', {
                    title: 'Success!'
                });
            }
        );

        let hashedPassword = await bcrypt.compare(password, saltRounds);

        // adds new user to player collection
    }
});

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

app.get("/user", (request, response) => {
    response.render("main_user_page.hbs", {
        title: "Profile"
    });
});

app.get("/deckbuild", (request, response) => {
    response.render("deckbuild.hbs", {
        title: "deckbuild"
    });
});

// Don't need this here, I moved it to line 41
// app.listen(port, () => {
//     console.log('Vanguard Assault is online')
// });
