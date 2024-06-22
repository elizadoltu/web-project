const sqlite3 = require('sqlite3').verbose();

function getTotalNumberOfSavings(recipeName) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./data/database.db');
      db.get('SELECT SUM(numberOfSaving) AS totalSaving FROM userPreference WHERE recipeName = ?', [recipeName], (err, row) => {
        if (err) {
          db.close();
          return reject(err);
        }
        db.close();
        resolve(row.totalSaving || 0); 
      });
    });
  }

  module.exports = getTotalNumberOfSavings;
  