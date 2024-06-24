const sqlite3 = require('sqlite3').verbose();

function fetchSavedIngredients(email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./data/database.db", (err) => {
            if (err) {
                reject(err);
                return;
            }
        });

        db.all('SELECT productName FROM userPreference WHERE email = ?', [email], (err, rows) => {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing database:", closeErr);
                    }
                    reject(err);
                });
                return;
            }

            const productsName = rows.map(row => row.productName);
            db.close((closeErr) => {
                if (closeErr) {
                    console.error("Error closing database:", closeErr);
                }
                resolve(productsName);
            });
        });
    });
}

module.exports = fetchSavedIngredients;