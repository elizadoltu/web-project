const sqlite3 = require('sqlite3').verbose();

function fetchSavedRecipes(email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db', (err) => {
            if (err) {
                reject(err);
                retrurn;
            }
        });

        db.all('SELECT recipeName, numberOfSaving FROM userPreference WHERE email = ?', [email], (err, rows) => {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing database:", closeErr);
                    }
                    reject(err);
                });
                return;
            }

            const recipesName = rows.map(row => ({
                recipeName: row.recipeName,
                numberOfSaving: row.numberOfSaving
            }));
            db.close((closeErr) => {
                if (closeErr) {
                    console.error("Error closing database:", closeErr);
                }
                resolve(recipesName);
            });
        });
    });
}

module.exports = fetchSavedRecipes;