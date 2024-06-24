const sqlite3 = require('sqlite3').verbose();

function saveIngredient(productName, email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');
        const checkSql = `SELECT COUNT(*) as count FROM userPreference WHERE productName = ? AND email = ?`;
        const insertSql = `INSERT INTO userPreference (productName, email, numberOfSaving) VALUES (?, ?, 1)`;

        db.get(checkSql, [productName, email], (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }

            if (row.count > 0) {
                db.close();
                return resolve({ message: 'Product already exists for this user.', productName, email });
            }

            db.run(insertSql, [productName, email], function (err) {
                if (err) {
                    db.close();
                    return reject(err);
                }

                resolve({ message: 'Recipe successfully added.', productName, email, id: this.lastID });
                db.close();
            });
        });
    });
}

module.exports = saveIngredient;