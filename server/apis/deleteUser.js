const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.db');
const db = new sqlite3.Database(dbPath);

function deleteUser(email) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE email = ?';

    db.run(sql, [email], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve('User deleted successfully');
      }
    });
  });
}

module.exports = deleteUser;
