const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');
const barcodesData = require('./json/barcodes.json');

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`;

const createBarcodesTable = `
    CREATE TABLE IF NOT EXISTS barcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode INTEGER UNIQUE,
        productName TEXT NOT NULL UNIQUE
    )
`;


const insertUsers = [
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1'
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2'
    },
    {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password3'
    }
];


db.serialize(() => {
    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created successfully');
        }
    });

    insertUsers.forEach(user => {
        const { username, email, password } = user;
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [username, email, password], (err) => {
            if (err) {
                console.error('Error inserting user:', err.message);
            } else {
                console.log('User inserted successfully');
            }
        });
    });

    db.run('DROP TABLE IF EXISTS cart', (err) => {
        if (err) {
            console.error('Error dropping cart table: ', err.message);
        } else {
            console.log('Cart table dropped successfully');
        }
    });

    db.run('DROP TABLE IF EXISTS barcodes', (err) => {
        if (err) {
            console.error('Error dropping barcodes table:', err.message);
        } else {
            console.log('Barcodes table dropped successfully');
        }
    });

    db.run(createBarcodesTable, (err) => {
        if (err) {
            console.error('Error creating barcodes table:', err.message);
        } else {
            console.log('Barcodes table created successfully');
        }
    });

    barcodesData.forEach(product => {
        const { barcode, productName } = product;
        const sql = `INSERT INTO barcodes (barcode, productName) VALUES (?, ?)`;
        db.run(sql, [barcode, productName], (err) => {
            if (err) {
                console.error('Error inserting product:', err.message);
            } else {
                console.log(`Product ${productName} with barcode ${barcode} inserted successfully`);
            }
        });
    });

    db.run('DROP TABLE IF EXISTS recipes', (err) => {
        if (err) {
            console.error("Error dropping recipes table:", err.message);
        } else {
            console.log('Recipes table was dropped');
        }
    })


    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database connection closed');
    });
});
