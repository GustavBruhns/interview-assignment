const db = require('../DatabaseScripts/databaseConnect');
const fs = require('fs');

function main() {
    try {
        let q = "SELECT * FROM users;";
        // Run query in Database db, write contents to file, delete retrieved rows from db    
        getAndDeleteUsersWithBackup(q); 
    }
    catch(e) {
        console.log("Error occured: " + e);
    }
}

function getAndDeleteUsersWithBackup(query) {
    db.all(query, [], (e, users) => {
        if (e) {
            console.log("Error occured while attempting to query database: \n");
            throw e;
        }
        
        if (fs.existsSync("BackUp.txt")) {
            fs.writeFileSync("BackUp.txt", JSON.stringify(users, null, 4));
            if (checkDataIntegrity(users) === true) {
                console.log("Data was correctly written to backup file.");
                deleteUsers(users);
            } else {
                console.log("Data was integrity was not maintained.");
            }
        } else {
            console.log("No file was found for the following path: " + __dirname + "/BackUp.txt");
        }
    });
}

function checkDataIntegrity(users) {
    const path = __dirname + "/BackUp.txt";
    const writtenUsers = fs.readFileSync(path);
    const dbUsers = JSON.stringify(users);

    // Replace all white spaces and then compare strings.
    if (dbUsers.replace(/\s/g, "") === writtenUsers.toString().replace(/\s/g, "")) {
        return true;
    }
    return false;
}

function deleteUsers(users) {
    db.run("DELETE FROM users;");   
}

main();