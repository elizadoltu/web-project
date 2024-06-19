const sqlite3 = require('sqlite3').verbose();

function addToCart(ingredient) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.get('SELECT * FROM cart WHERE ingredient = ?', [ingredient], (err, row) => {
            if (err) {
                reject(err);
                db.close();
                return;
            }

            if (row) {
                const newQuantity = row.quantity + 1;
                db.run('UPDATE cart SET quantity = ? WHERE ingredient = ?', [newQuantity, ingredient], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Quantity update for ${ingredient}`);
                    }
                    db.close();
                });
            } else {
                db.run('INSERT INTO cart (ingredient, quantity) VALUES (?, 1)', [ingredient], (err) => {
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
}

module.exports = addToCart;