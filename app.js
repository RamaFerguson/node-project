// express setup
var express = require('express');
var hbs = require('hbs');
var port = process.env.PORT || 8080;

var app = express();

// uuid module to allow unique
const uuidv1 = require("uuid/v1");

// bcrypt setup
const bcrypt = require('bcrypt');
const saltRounds = 10;

// collection that stores player data
const PLAYER_COLLECTION = "players";

// enables parsing of body json
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// mongo connection
let mongodb = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin_user:1Q84_mastur@nodeproject-j2rmx.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

// Initialize connection once
var nodeProjectDB;
client.connect(function (err, clientObject) {
    if (err) throw err;
    // console.log(clientObject);
    // console.log(clientObject.db);
    nodeProjectDB = clientObject.db('node_project');

    // Start the application after the database connection is ready
    app.listen(port);
    console.log("Listening on port 8080");
});

app.post("/newPlayerAccount", async function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    // function that checks if user already exists in players database
    // returns True if they are
    // returns False if they do not exist
    function checkUserInDb(username, collection) {
        return new Promise((resolve, reject) => {
            // console.log(username);
            // console.log(collection);
            nodeProjectDB.collection(collection).find({
                "username": username
            }, {
                projection: {
                    "username": 1
                }
            }).toArray(function (error, response) {
                if (error) {
                    return reject(error);
                } else {
                    if (response.length === 0) {
                        resolve(false)
                    }
                    resolve(true)
                }
            });
        });
    };

    // hashing password
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    // verifying username is new
    let userExists = await checkUserInDb(username, PLAYER_COLLECTION);
    if (userExists === true) {
        response.render('/views/user_exists.hbs', {
            title: 'Uh oh!'
        });
    } else {
        // adds new user to player collection
        nodeProjectDB.collection(PLAYER_COLLECTION).insertOne({
            "uuid": uuidv1(),
            "username": username,
            "password": hashedPassword,
            "wins": 0,
            "losses": 0,
            "draws": 0,
            "deck": {}
        }, (error, result) => {
            if (error) {
                response.render('/views/server_error.hbs', {
                    title: 'Uh oh!'
                });
            } else {
                // placeholder for test purposes
                // response.send(JSON.stringify(result.ops, undefined, 2));

                response.render('/views/new_user_success.hbs', {
                    title: 'Success!'
                });
            }
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
app.get('/login', (request, response) => {
    response.render('login.hbs', {
        title: 'Login',
    });
});

app.get('/signup', (request, response) => {
    response.render('signup.hbs', {
        title: 'signup',
    });
});

app.get('/user', (request, response) => {
    response.render('main_user_page.hbs', {
        title: 'user',
    });
});

app.get('/deckbuild', (request, response) => {
    response.render('deckbuild.hbs', {
        title: 'deckbuild',
    });
});

// Don't need this here, I moved it to line 41
// app.listen(port, () => {
//     console.log('Vanguard Assault is online')
// });

