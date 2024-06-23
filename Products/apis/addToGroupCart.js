const sqlite3 = require('sqlite3').verbose();

function addToCart(ingredient, cartName, email) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.get('SELECT groupId FROM cart WHERE name = ? AND email = ? AND groupId IS NOT NULL LIMIT 1', [cartName, email], (err, row) => {
            if (err) {
                reject(err);
                db.close();
                return;
            }

            let groupId = null;
            if (row) {
                groupId = row.groupId;
            }

            db.get('SELECT * FROM cart WHERE name = ? AND ingredient = ? AND email = ? AND groupId = ?', [cartName, ingredient, email, groupId], (err, row) => {
                if (err) {
                    reject(err);
                    db.close();
                    return;
                }

                if (row) {
                    const newQuantity = row.quantity + 1;
                    db.run('UPDATE cart SET quantity = ? WHERE name = ? AND ingredient = ? AND email = ? AND groupId = ?', [newQuantity, cartName, ingredient, email, groupId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(`Quantity updated for ${ingredient}`);
                        }
                        db.close();
                    });
                } else {
                    db.run('INSERT INTO cart (ingredient, quantity, name, email, groupId) VALUES (?, 1, ?, ?, ?)', [ingredient, cartName, email, groupId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(`Ingredient added to cart: ${ingredient}`);
                        }
                        db.close();
                    });
                }
            });
        });
    });
}

module.exports = addToCart;
