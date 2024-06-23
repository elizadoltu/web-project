const sqlite3 = require('sqlite3').verbose();

function deleteIndividualsCart(cartName, email) {
    const db = new sqlite3.Database('./data/database.db');

    return new Promise((resolve, reject) => {
        db.run('DELETE FROM cart WHERE name = ? AND email = ? AND groupId IS NULL', [cartName, email], function(err) {
            if (err) {
                console.error('Error deleting individual cart:', err.message);
                reject(err);
            } else {
                console.log(`Deleted cart: ${cartName} for email: ${email}`);
                resolve({ message: 'Individual cart deleted successfully' });
            }
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing database connection:', err.message);
            }
        });
    });
}

module.exports = deleteIndividualsCart;
