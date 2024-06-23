const sqlite3 = require('sqlite3').verbose();

function getBarcode(productName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./data/database.db");

        db.get('SELECT barcode FROM barcodes WHERE productName = ?', [productName], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.barcode);
            } else {
                resolve(null);
            }
        });

        db.close((err) => {
            if (err) {
                console.error("Error closing the database connection");
            }
        });
    });
}

module.exports = getBarcode;