const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');

module.exports = function joinGroup(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const { email, groupId } = JSON.parse(body);

        const sql = `UPDATE users SET group_id = ? WHERE email = ?`;
        db.run(sql, [groupId, email], function(err) {
            if (err) {
                console.error('Database error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error updating group', details: err.message }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Group joined successfully' }));
        });
    });
};
