const MongoClient = require('mongodb').MongoClient;

// URI of cloud DB
const uri = "mongodb+srv://admin_user:1Q84_mastur@nodeproject-j2rmx.mongodb.net/test?retryWrites=true";

// Set up connection to cloud DB
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

// bcrypt module has password decryption and encryption
const bcrypt = require('bcrypt');

// Log in function that is exported
module.exports.logIn = async function (username) {

    // connect to cloud db
    client.open( (err, mongoclient) => {
        if (err) {
            return console.log('Unable to connect to DB');
        }

        // get users db
        let db = mongoclient.db("users");

        //query all entries for provided username
        db.collection('students').find({
            // queries for username
            "username": username
        }, {
            // shows both username and password if user is found
            "username": 1,
            "password": 1
        }).toArray(function (err, result) {
            if (err) {
                response.send('Unable to find students');
            }
            response.send(result);
        // rename "test" with whatever we end up calling the db
        // rename  "devices" with the name of the collection we want to access (probably)
        const usersCollection = client.db("node_project").collection("users");
        // perform actions on the collection object
        client.close();
    });

};