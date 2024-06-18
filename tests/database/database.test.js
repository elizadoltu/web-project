const sqlite3 = require('sqlite3').verbose();

function runTests() {
    const db = new sqlite3.Database('server/data/database.db');

    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Error querying users:', err.message);
        } else {
            console.log('Users:');
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Username: ${row.username}, Email: ${row.email}`);
            });
        }

        db.close();
    });
}

module.exports = { runTests };

