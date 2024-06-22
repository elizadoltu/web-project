const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.db');
const db = new sqlite3.Database(dbPath);

function searchForRecipe(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const name = url.searchParams.get('name');

    if (!name) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Recipe name is required" }));
        return;
    }

    const sql = 'SELECT * FROM recipes WHERE name = ?';
    const params = [name];

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to retrieve recipes" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows));
    });
}

module.exports = searchForRecipe;
