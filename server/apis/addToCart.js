const sqlite3 = require('sqlite3').verbose();

function addToCart(ingredient) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('server/data/database.db');

        // Check if the ingredient already exists in the cart
        db.get('SELECT * FROM cart WHERE ingredient = ?', [ingredient], (err, row) => {
            if (err) {
                reject(err);
                db.close(); // Close the database connection on error
                return;
            }

            if (row) {
                // If the ingredient exists, update its quantity
                const newQuantity = row.quantity + 1;
                db.run('UPDATE cart SET quantity = ? WHERE ingredient = ?', [newQuantity, ingredient], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Quantity updated for ${ingredient}`);
                    }
                    db.close(); // Close the database connection after update operation
                });
            } else {
                // If the ingredient does not exist, insert a new entry with quantity 1
                db.run('INSERT INTO cart (ingredient, quantity) VALUES (?, 1)', [ingredient], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Ingredient added to cart: ${ingredient}`);
                    }
                    db.close(); // Close the database connection after insert operation
                });
            }
        });
    });
}

module.exports = addToCart;
