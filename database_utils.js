// function that checks if user exists in player database
// returns True if they are
// returns False if they do not exist
function checkUserInDb(username, collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database
            .collection(collection)
            .find({
                username: username
            }, {
                username: 1
            })
            .toArray(function (error, result) {
                if (error) {
                    return reject(error);
                } else {
                    if (result.length === 0) {
                        resolve(false);
                    }
                    resolve(true);
                }
            });
    });
}

function returnUserDetails(username, collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database
            .collection(collection)
            .find({
                username: username
            })
            .toArray(function (error, result) {
                if (error) {
                    console.log("error in returnUserDetails");
                    reject(error);
                } else {
                    console.log("returnUserDetails worked");
                    resolve(result);
                    //JSON.stringify(result.ops, undefined, 2)
                }
            });
    });
}

function returnAllEntriesFromCollection(collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database
            .collection(collection)
            .find({})
            .toArray(function (error, result) {
                if (error) {
                    console.log("error in returnAllEntriesFromCollection");
                    reject(error);
                } else {
                    console.log("returnAllEntriesFromCollection worked");
                    resolve(result);
                    //JSON.stringify(result.ops, undefined, 2)
                }
            });
    });
}

function returnUserDetailsByUUID(uuid, collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database
            .collection(collection)
            .find({
                uuid: uuid
            })
            .toArray(function (error, result) {
                if (error) {
                    console.log("error in returnUserDetails");
                    reject(error);
                } else {
                    console.log("returnUserDetails worked");
                    resolve(result);
                    //JSON.stringify(result.ops, undefined, 2)
                }
            });
    });
};

var checkGame = (players, collection, database) => {
    return new Promise((resolve, reject) => {
        database
            .collection(collection)
            .find({
                players: { $all: players }
            })
            .toArray(function (error, result) {
                if (error) {
                    console.log('error!')
                    reject(error);
                } else {
                    if (result.length === 0) {
                        console.log('should be null')
                        resolve(null);
                    }
                    console.log('should be result')
                    resolve(result);
                }
            });
    });
};

module.exports = {
    checkUserInDb,
    returnUserDetails,
    returnUserDetailsByUUID,
    returnAllEntriesFromCollection,
    checkGame
};