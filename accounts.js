const fs = require('fs');
const glob = require('glob');

/** function that should be run when user submits username on login.
 * Parses all user json files in users directory for user with matching username
 * @param {username} username string
 */
var checkUserNameLogIn = async function (inputUserName) {

    // reads all json files in users directory
    glob("users/*.json", function (error, files) {
        if (error) {
            console.log("Glob failed", err);
        }

        let userFound = false;
        let userJSON = {};
        // reads each user file
        for (let file of files) {
            if (userFound === true) {
                return // TODO decide what to do here
            }

            // files.forEach(function (file) {
            // read current user file
            fs.readFile(file, 'utf8', function (error, data) {
                if (error) {
                    console.log("Cannot read the file", error);
                }
                var userObject = JSON.parse(data);
                // console.log(userObject);
                if (userObject.username === inputUserName) {
                    console.log('true');
                    userFound = true;
                    userJSON = userObject;
                    return true;
                } else {
                    console.log('false');
                    return false;
                }
            });
            // });
        }
    });
};

//TODO: Stop searching JSONs once a match is made

let gay = checkUserNameLogIn("darkflamemaster1983")
// let gays = checkUserNameLogIn("helloFriend")
// let gays2 = checkUserNameLogIn("hellofriend")



module.exports = {
    checkUserNameLogIn
}