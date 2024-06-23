const sqlite3 = require('sqlite3').verbose();

function getGroupReceipts(email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db', (err) => {
            if (err) {
                reject(err);
                return;
            }
        });

        db.all('SELECT DISTINCT name FROM cart WHERE email = ? AND groupId IS NOT NULL', [email], (err, rows) => {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing database:", closeErr);
                    }
                    reject(err);
                });
                return;
            }

            const receipts = rows.map(row => row.name);
            db.close((closeErr) => {
                if (closeErr) {
                    console.error("Error closing database:", closeErr);
                }
                resolve(receipts);
            });
        });
    });
}

module.exports = getGroupReceipts;