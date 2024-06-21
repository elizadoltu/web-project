const sqlite3 = require('sqlite3').verbose();

function addNewCart(cartName, email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.get('SELECT * FROM cart WHERE name = ? AND email = ?', [cartName, email], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row) {
                reject(new Error('Receipt already exists'));
            } else {
                db.run('INSERT INTO cart (name, email) VALUES (?, ?)', [cartName, email], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, name: cartName, email: email });
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