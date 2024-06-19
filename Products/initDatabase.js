const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data/database.db');
const barcodesData = require('./json/barcodes.json');
const receipesData = require('./json/recepies.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

const db = new sqlite3.Database(dbPath);

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`;

const createCartTable = `
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ingredient TEXT,
        quantity INTEGER
    )
`;

const createBarcodesTable = `
    CREATE TABLE IF NOT EXISTS barcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode INTEGER UNIQUE,
        productName TEXT NOT NULL UNIQUE
    )
`;

const createReceipeTable = `
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories INTEGER,
        protein REAL, 
        fat REAL,
        carbs REAL,
        description TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        preparation TEXT,
        category TEXT
    )
`;

const insertUsers = [
    { username: 'user1', email: 'user1@example.com', password: 'password1' },
    { username: 'user2', email: 'user2@example.com', password: 'password2' },
    { username: 'user3', email: 'user3@example.com', password: 'password3' }
];

db.serialize(() => {
    db.run(createUsersTable, err => {
        if (err) console.error('Error creating users table:', err.message);
    });

    insertUsers.forEach(user => {
        const { username, email, password } = user;
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [username, email, password], err => {
            if (err) console.error('Error inserting user:', err.message);
        });
    });

    db.run('DROP TABLE IF EXISTS cart', err => {
        if (err) console.error('Error dropping cart table:', err.message);
    });

    db.run(createCartTable, err => {
        if (err) console.error('Error creating cart table:', err.message);
    });

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
            if (err) console.error('Error inserting product:', err.message);
        });
    });

    db.run('DROP TABLE IF EXISTS recipes', err => {
        if (err) console.error("Error dropping recipes table:", err.message);
    });

    db.run(createReceipeTable, err => {
        if (err) console.error('Error creating the recipes table:', err.message);
    });

    receipesData.forEach(recipe => {
        const { name, calories, protein, fat, carbs, description, ingredients, preparation, category } = recipe;
        const sql = `INSERT INTO recipes (name, calories, protein, fat, carbs, description, ingredients, preparation, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [name, calories, protein, fat, carbs, description, JSON.stringify(ingredients), preparation, category], err => {
            if (err) console.error('Error inserting recipe:', err.message);
        });
    });

    db.close(err => {
        if (err) console.error(err.message);
        console.log('Database connection closed');
    });
});
