// function that checks if user exists in player database
// returns True if they are
// returns False if they do not exist
function checkUserInDb(username, collection, database) {
    return new Promise((resolve, reject) => {
        // console.log(username);
        // console.log(collection);
        database.collection(collection).find({
            "username": username
        }, {
            projection: {
                "username": 1
            }
        }).toArray(function (error, result) {
            if (error) {
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

module.exports = {
    checkUserInDb
}