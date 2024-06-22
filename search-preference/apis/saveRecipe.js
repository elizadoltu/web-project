const sqlite3 = require('sqlite3').verbose();

function saveRecipe(recipeName, email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');
        const checkSql = `SELECT COUNT(*) as count FROM userPreference WHERE recipeName = ? AND email = ?`;
        const insertSql = `INSERT INTO userPreference (recipeName, email, numberOfSaving) VALUES (?, ?, 1)`;

        db.get(checkSql, [recipeName, email], (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }

            if (row.count > 0) {
                db.close();
                return resolve({ message: 'Recipe already exists for this user.', recipeName, email });
            }

            db.run(insertSql, [recipeName, email], function (err) {
                if (err) {
                    db.close();
                    return reject(err);
                }

                resolve({ message: 'Recipe successfully added.', recipeName, email, id: this.lastID });
                db.close();
            });
        });
    });
}

module.exports = saveRecipe;
