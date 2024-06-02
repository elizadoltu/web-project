const sqlite3 = require('sqlite3').verbose();

function getAllUsers(callback) {
    const db = new sqlite3.Database('server/data/database.db');

    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }

        db.close();
    });
}

module.exports = getAllUsers;
