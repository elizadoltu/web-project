const sqlite3 = require('sqlite3').verbose();

function getIngredients(cartName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.all('SELECT ingredient, quantity FROM cart WHERE name = ?', [cartName], (err, rows) => {
            if (err) {
                db.close((dbErr) => {
                    if (dbErr) {
                        console.error('Error closing database connection');
                    }
                });
                reject(err);
                return;
            }
            if (!rows.length) {
                db.close((dbErr) => {
                    if (dbErr) {
                        console.error('Error closing database connection');
                    }
                });
                reject({ error: 'No ingredients found for the given cart name' });
                return;
            }

            db.close((dbErr) => {
                if (dbErr) {
                    console.error('Error closing database connection');
                }
            });

            resolve(rows);
        });
    });
}

module.exports = getIngredients;
