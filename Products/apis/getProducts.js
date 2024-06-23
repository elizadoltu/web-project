const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.db');

function getProducts() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        const sql = `SELECT id, barcode, productName FROM barcodes`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            db.close();
        });
    });
}

module.exports = getProducts;
