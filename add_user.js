const MongoClient = require('mongodb').MongoClient;

// URI of cloud DB
const uri = "mongodb+srv://admin_user:1Q84_mastur@nodeproject-j2rmx.mongodb.net/test?retryWrites=true";

// Set up connection to cloud DB
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

// bcrypt module has password decryption and encryption
const bcrypt = require('bcrypt');

// Add new user function that is exported
module.exports.addNewUser = async function (username, password) {

    // connect to cloud db
    client.open( (err, client) => {
        if (err) {
            return console.log('Unable to connect to DB');
        }


        
        //TODO: Finish username validation
        //query all entries for provided username
        let userExists = await checkUserIdInDb()


        const usersCollection = client.db("node_project").collection("users");

        // get users db
        let db = mongoclient.db("users");
        

        // perform actions on the collection object
        client.close();
    });

};

app.post('/newStudent', async function (request, response) {
    let id = request.body.id;
    let name = request.body.name;
    let email = request.body.email;

    let db = utils.getDb();
    let userExists = await checkUserIdInDb(id, db, "student");
    if (userExists === true) {
        response.send('Username already taken')
    } else {
        db.collection('students').insertOne({
            id: id,
            name: name,
            email: email
        }, (err, result) => {
            if (err) {
                response.send('Unable to insert student');
            } else {
                response.send(JSON.stringify(result.ops, undefined, 2));
            }
        });
        // let usernameQuery = await db.collection('students').find({
        //     "id": id
        // }).toArray(function (err, result) {
        //     if (err) {
        //         response.send('Error');
        //     }
        //     response.send
        // });
        // console.log(usernameQuery);
    }
});

function checkUserIdInDb(userId, database, databaseName) {
    return new Promise((resolve, reject) => {
        database.collection(databaseName).find({
            "id": userId
        }, {
            projection: {
                "id": 1
            }
        }).toArray(function (err, result) {
            if (err) {
                return reject(error);
            } else {
                if (result.length === 0) {
                    resolve(false)
                }
                resolve(true)
            }
        });
    });
};