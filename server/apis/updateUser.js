const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.db');
const db = new sqlite3.Database(dbPath);

async function updateUser(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
            return;
        }

        const { email, newUsername, newPassword } = parsedBody;

        // Hash the new password if provided
        let hashedPassword = null;
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        // Update user details in the database
        db.serialize(() => {
            if (newUsername && newPassword) {
                db.run(`UPDATE users SET username = ?, password = ? WHERE email = ?`, [newUsername, hashedPassword, email], function(err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User updated successfully' }));
                });
            } else if (newUsername) {
                db.run(`UPDATE users SET username = ? WHERE email = ?`, [newUsername, email], function(err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User updated successfully' }));
                });
            } else if (newPassword) {
                db.run(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email], function(err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User updated successfully' }));
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No updates provided' }));
            }
        });
    });
}

module.exports = updateUser;
