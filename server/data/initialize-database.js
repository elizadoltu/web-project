const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/database.db');
const barcodesData = require('./json/barcodes.json');

/*db.run('DROP TABLE IF EXISTS cart', (err) => {
   if (err) {
      console.error('Error dropping cart table: ', err.message);
    } else {
        console.log('Cart table dropped successfully');
    }
});*/

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        vegan BOOLEAN NOT NULL DEFAULT FALSE,
        vegetarian BOOLEAN NOT NULL DEFAULT FALSE
    )
`;

const createBarcodesTable = `
    CREATE TABLE IF NOT EXISTS barcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode INTEGER UNIQUE,
        productName TEXT NOT NULL UNIQUE
    )
`;

const createAllergiesTable = `
    CREATE TABLE IF NOT EXISTS user_allergies (
        email TEXT PRIMARY KEY,
        allergies TEXT NOT NULL, -- JSON array of allergies
        FOREIGN KEY (email) REFERENCES users(email)
    )
`;

const insertUsers = [
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1',
        vegan: false,
        vegetarian: true
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2',
        vegan: true,
        vegetarian: false
    },
    {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password3',
        vegan: false,
        vegetarian: false
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

    db.run(createAllergiesTable, (err) => {
        if (err) {
            console.error('Error creating allergies table:', err.message);
        } else {
            console.log('Allergies table created successfully');
        }
    });

    insertUsers.forEach(user => {
        const { username, email, password, vegan, vegetarian } = user;
        const sql = `INSERT INTO users (username, email, password, vegan, vegetarian) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [username, email, password, vegan, vegetarian], (err) => {
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
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database connection closed');
    });
});
