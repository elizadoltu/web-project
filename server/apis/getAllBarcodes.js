const sqlite3 = require('sqlite3').verbose();

function getAllBarcodes(req, res) {
    const db = new sqlite3.Database('server/data/database.db');

    db.all('SELECT barcode FROM barcodes', (err, rows) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
        } else {
            res.writeHead(200, { "Content-Type" : "application/json" });
            res.end(JSON.stringify(rows));
        }

        db.close();
    });
}

module.exports = getAllBarcodes;
