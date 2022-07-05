var sqlite3 = require('sqlite3');
const fs = require('fs');
const path = __dirname + '/db.sqlite'

function displayErrorAndTerminate(err) {
    if (err) {
        console.error(err);
        process.exit(1);  
    }
}

var database = new sqlite3.Database(path, (err) => displayErrorAndTerminate(err));
module.exports = database;
