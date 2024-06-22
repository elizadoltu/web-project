const sqlite3 = require('sqlite3').verbose();

function joinGroupCart(groupId, email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./data/database.db");

        db.get('SELECT COUNT(*) as count FROM cart WHERE groupId = ? AND email = ?', [groupId, email], (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }

            if (row.count > 0) {
                db.close();
                return resolve({ message: "GroupId already exists for this email" });
            }

            db.all('SELECT name FROM cart WHERE groupId = ?', [groupId], (err, rows) => {
                if (err) {
                    db.close();
                    return reject(err);
                }

                if (rows.length === 0) {
                    db.close();
                    return resolve({ message: "No carts found for this groupId." });
                }

                const placeholders = rows.map(() => '(?, ?, ?)').join(',');
                const values = [];

                rows.forEach(row => {
                    values.push(row.name, groupId, email);
                });

                const sql = `INSERT INTO cart (name, groupId, email) VALUES ${placeholders}`;

                db.run(sql, values, function (err) {
                    db.close();

                    if (err) {
                        return reject(err);
                    }

                    resolve({ message: "Carts successfully joined to group.", rowsAffected: this.changes });
                });
            });
        });
    });
}

module.exports = joinGroupCart;
