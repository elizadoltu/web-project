const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');

module.exports = function unbanUser(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const { email } = JSON.parse(body);

        const sql = `UPDATE users SET banned = 0 WHERE email = ?`;

        db.run(sql, [email], function(err) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error unbanning user', details: err.message }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User unbanned successfully' }));
            }
        });
    });
};
