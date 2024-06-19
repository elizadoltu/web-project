const sqlite3 = require('sqlite3').verbose();

function getRecipeByName(recipeName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('server/data/database.db');

        db.get('SELECT * FROM recipes WHERE name = ?', [recipeName], (err, row) => {
            if (err) {
                db.close((dbErr) => {
                    if (dbErr) {
                        console.error('Error closing database connection:', dbErr.message);
                    }
                });
                reject(err);
                return;
            }
            if (!row) {
                db.close((dbErr) => {
                    if (dbErr) {
                        console.error('Error closing database connection:', dbErr.message);
                    }
                });
                reject({ error: 'Recipe not found' });
                return;
            }

            const ingredients = JSON.parse(row.ingredients);

            const recipe = {
                id: row.id,
                name: row.name,
                calories: row.calories,
                protein: row.protein,
                fat: row.fat,
                carbs: row.carbs,
                description: row.description,
                ingredients: ingredients,
                preparation: row.preparation,
                category: row.category
            };

            db.close((dbErr) => {
                if (dbErr) {
                    console.error('Error closing database connection:', dbErr.message);
                }
            });

            resolve(recipe);
        });
    });
}

module.exports = getRecipeByName;
