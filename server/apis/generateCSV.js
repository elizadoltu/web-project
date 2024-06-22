const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');
const { parse } = require('json2csv');

module.exports = function generateCSV(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get('email');

    if (!email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email is required' }));
        return;
    }

    const sql = `
        SELECT 
            users.username, 
            users.email, 
            users.password, 
            user_allergies.allergies, 
            users.vegan, 
            users.vegetarian 
        FROM 
            users 
        LEFT JOIN 
            user_allergies 
        ON 
            users.email = user_allergies.email
        WHERE 
            users.email = ?
    `;

    db.all(sql, [email], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error retrieving user', details: err.message }));
            return;
        }

        const fields = ['username', 'email', 'password', 'allergies', 'vegan', 'vegetarian'];
        const opts = { fields };
        try {
            const csv = parse(rows, opts);
            res.setHeader('Content-Disposition', 'attachment;filename=user.csv');
            res.writeHead(200, { 'Content-Type': 'text/csv' });
            res.end(csv);
        } catch (err) {
            console.error('CSV generation error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error generating CSV', details: err.message }));
        }
    });
};
