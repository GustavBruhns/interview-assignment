const db = require('../DatabaseScripts/databaseConnect');
const prompt = require('prompt-sync')();
const fs = require('fs');


function main() {
    try {
        // Get (assumed) select query from user
        let q = prompt("Enter query please: ");
        // Run query in Database db, write contents to file, delete retrieved rows from db    
        getAndDeleteRowsWithBackup(q); 
    }
    catch(e) {
        console.log("Error occured: " + e);
    }
}

function getAndDeleteRowsWithBackup(query) {
    db.all(query, [], (e, rows) => {
        if (e) {
            console.log("Error occured while attempting to query database: \n");
            throw e;
        }
        
        if (fs.existsSync("BackUp.txt")) {
            fs.writeFileSync("BackUp.txt", JSON.stringify(rows, null, 4));
            if (checkDataIntegrity(rows) === true) {
                console.log("Data was correctly written to backup file.");
            } else {
                console.log("Data was integrity was not maintained.");
            }
            deleteRows(rows);
        }
        console.log("No file was found for the following path: " + __dirname + "/BackUp.txt");
    });
}

function checkDataIntegrity(rows) {
    const path = __dirname + "/BackUp.txt";
    const contents = fs.readFileSync(path);
    const originalContent = JSON.stringify(rows);
        
    // Replace all white spaces and then compare strings.
    if (originalContent.replace(/\s/g, "") === contents.toString().replace(/\s/g, "")) {
        return true;
    }
    return false;
}

function deleteRows(rows) {
    if (rows.length !== 0) {
        rowKeys = Object.keys();

        rows.forEach(row => {
            let condition = "";
            rowKeys.forEach(key => {
                condition += `${key} = "${row[key]}" AND `;
            });
            
            let i = condition.lastIndexOf("AND");
            condition = condition.slice(0, i);
            db.run(`DELETE FROM users WHERE ${condition};`, (err) => {if(err) {console.error(err.message)}}); 
        });
    }
}

main();