const sqlite3 = require('sqlite3').verbose();

function getReceipts() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.all('SELECT DISTINCT name FROM cart', (err, rows) => {
            if (err) {
                reject(err);
                db.close();
                return;
            }

            const receipts = rows.map(row => row.name);
            resolve(receipts);
            db.close();
        });
    });
}

module.exports = getReceipts;
