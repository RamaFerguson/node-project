// function that checks if user exists in player database
// returns True if they are
// returns False if they do not exist
function checkUserInDb(username, collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database
            .collection(collection)
            .find(
                {
                    username: username
                },
                {
                    projection: {
                        username: 1
                    }
                }
            )
            .toArray(function(error, result) {
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

// function that checks if user exists in player database
// returns True if they are
// returns False if they do not exist
function checkUserInDb(username, collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database
            .collection(collection)
            .find(
                {
                    username: username
                },
                {
                    username: 1
                }
            )
            .toArray(function(error, result) {
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
            .toArray(function(error, result) {
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

var checkGame = (players, collection, database) => {
    return new Promise((resolve, reject) => {
        database
            .collection(collection)
            .find({
                players: { $all: players }
            })
            .toArray(function(error, result) {
                if (error) {
                    reject(error);
                } else {
                    if (result.length === 0) {
                        resolve(null);
                    }
                    resolve(result);
                }
            });
    });
};

module.exports = {
    checkUserInDb,
    returnUserDetails,
    checkGame
};
