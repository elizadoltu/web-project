const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');

module.exports = function addUserAllergy(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const { email, allergy } = JSON.parse(body);
        const getAllergiesSql = `SELECT allergies FROM user_allergies WHERE email = ?`;

        db.get(getAllergiesSql, [email], (err, row) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error fetching allergies', details: err.message }));
                return;
            }

            let allergies = [];
            if (row) {
                allergies = JSON.parse(row.allergies);
                if (!allergies.includes(allergy)) {
                    allergies.push(allergy);
                }
            } else {
                allergies.push(allergy);
            }

            const updateAllergiesSql = row
                ? `UPDATE user_allergies SET allergies = ? WHERE email = ?`
                : `INSERT INTO user_allergies (email, allergies) VALUES (?, ?)`;

            const params = row
                ? [JSON.stringify(allergies), email]
                : [email, JSON.stringify(allergies)];

            db.run(updateAllergiesSql, params, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error saving allergies', details: err.message }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Allergy saved successfully' }));
                }
            });
        });
    });
};
