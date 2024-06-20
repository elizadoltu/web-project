const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');

module.exports = function updateDietaryPreference(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const { email, preference } = JSON.parse(body);

        let updateSql = '';
        if (preference === 'vegan') {
            updateSql = `UPDATE users SET vegan = 1, vegetarian = 0 WHERE email = ?`;
        } else if (preference === 'vegetarian') {
            updateSql = `UPDATE users SET vegetarian = 1, vegan = 0 WHERE email = ?`;
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid preference' }));
            return;
        }

        db.run(updateSql, [email], function(err) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error updating dietary preference', details: err.message }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dietary preference updated successfully' }));
            }
        });
    });
};
