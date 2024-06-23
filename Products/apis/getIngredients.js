const sqlite3 = require('sqlite3').verbose();

function getIngredients(cartName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db', (err) => {
            if (err) {
                reject(err);
                return;
            }
        });

        db.all('SELECT ingredient, quantity FROM cart WHERE name = ? AND ingredient IS NOT NULL', [cartName], (err, rows) => {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing database:", closeErr);
                    }
                    reject(err);
                });
                return;
            }

            const ingredients = rows.map(row => ({
                ingredient: row.ingredient,
                quantity: row.quantity
            }));
            db.close((closeErr) => {
                if (closeErr) {
                    console.error("Error closing database:", closeErr);
                }
                resolve(ingredients);
            });
        });
    });
}

module.exports = getIngredients;
