const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.db');
const db = new sqlite3.Database(dbPath);

function loginUser(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        console.log('Received login request with body:', body);

        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
            return;
        }

        const { email, password } = parsedBody;
        console.log('Parsed login details:', email, password);

        const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
        db.get(query, [email, email], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error logging in' }));
            } else if (row) {
                if (row.banned) {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Your account is banned' }));
                } else if (await bcrypt.compare(password, row.password)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful', user: row }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid email/username or password' }));
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid email/username or password' }));
            }
        });
    });
}

module.exports = loginUser;
