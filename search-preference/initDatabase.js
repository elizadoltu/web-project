const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data/database.db');
const barcodesData = require('./json/barcodes.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

const db = new sqlite3.Database(dbPath);

const createBarcodesTable = `
    CREATE TABLE IF NOT EXISTS barcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode INTEGER UNIQUE,
        productName TEXT NOT NULL UNIQUE
    )
`;

const createPreferenceTable = `
    CREATE TABLE IF NOT EXISTS userPreference (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode INTEGER UNIQUE,
        email TEXT,
        recipeName TEXT,
        numberOfSaving INTEGER
    )
`;

db.serialize(() => {

    db.run('DROP TABLE IF EXISTS userPreference', err => {
        if (err) console.error('Error dropping userPreference table:', err.message);
    });

    db.run(createPreferenceTable, err => {
        if (err) console.error('Error creating preference table:', err.message);
    })

    db.run('DROP TABLE IF EXISTS barcodes', err => {
        if (err) console.error('Error dropping barcodes table:', err.message);
    });

    db.run(createBarcodesTable, err => {
        if (err) console.error('Error creating barcodes table:', err.message);
    });

    barcodesData.forEach(product => {
        const { barcode, productName } = product;
        const sql = `INSERT INTO barcodes (barcode, productName) VALUES (?, ?)`;
        db.run(sql, [barcode, productName], err => {
            if (err) console.error('Error inserting a product:', err.message);
        });
    });

    db.close(err => {
        if (err) console.error(err.message);
        console.log('Database connection closed');
    });

})