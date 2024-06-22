const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');

module.exports = function getUsers(req, res) {
    const sql = `SELECT username, email FROM users`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error retrieving users', details: err.message }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ users: rows }));
    });
};
