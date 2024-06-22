const sqlite3 = require('sqlite3').verbose();

function addNewGroupCart(cartName, groupId, email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.get('SELECT * FROM cart WHERE name = ? AND groupId = ? AND email = ?', [cartName, groupId, email], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row) {
                reject(new Error('Receipt already exists'));
            } else {
                db.run('INSERT INTO cart (name, groupId, email) VALUES (?, ?, ?)', [cartName, groupId, email], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, name: cartName, email: email, groupId: groupId });
                    }
                });
            }
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    });
}

module.exports = addNewGroupCart;