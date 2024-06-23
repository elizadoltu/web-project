const sqlite3 = require('sqlite3').verbose();

function deleteCart(cartName, email, groupId) {
    const db = new sqlite3.Database('./data/database.db');

    return new Promise((resolve, reject) => {
        db.run('DELETE FROM cart WHERE name = ? AND email = ? AND groupId = ?', [cartName, email, groupId], function(err) {
            if (err) {
                console.error('Error deleting group cart:', err.message);
                reject(err);
            } else {
                console.log(`Deleted cart: ${cartName} with groupId of ${groupId} for email: ${email}`);
                resolve({ message: 'Group cart deleted successfully' });
            }
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing database connection:', err.message);
            }
        });
    });
}

module.exports = deleteCart;
