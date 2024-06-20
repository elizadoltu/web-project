const sqlite3 = require('sqlite3').verbose();

function addNewCart(cartName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.get('SELECT * FROM cart WHERE name = ?', [cartName], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row) {
                reject(new Error('Receipt already exists'));
            } else {
                db.run('INSERT INTO cart (name) VALUES (?)', [cartName], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, name: cartName });
                    }
                });
            }
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    });
}

module.exports = addNewCart;