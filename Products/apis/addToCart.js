const sqlite3 = require('sqlite3').verbose();

function addToCart(ingredient, cartName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./data/database.db');

        db.get('SELECT * FROM cart WHERE name = ? AND ingredient = ?', [cartName, ingredient], (err, row) => {
            if (err) {
                reject(err);
                db.close();
                return;
            }

            if (row) {
                const newQuantity = row.quantity + 1; 
                db.run('UPDATE cart SET quantity = ? WHERE name = ? AND ingredient = ?', [newQuantity, cartName, ingredient], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Quantity updated for ${ingredient}`);
                    }
                    db.close();
                });
            } else {
                db.run('INSERT INTO cart (ingredient, quantity, name) VALUES (?, 1, ?)', [ingredient, cartName], (err) => {
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

module.exports =  addToCart ;
