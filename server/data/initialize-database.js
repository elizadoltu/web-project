const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('server/data/database.db');

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`;

const createBarCodesTable = `
    CREATE TABLE IF NOT EXISTS barcodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode INTEGER UNIQUE,
        productName TEXT NOT NULL UNIQUE
    )
`

const insertUsers = [
    'INSERT INTO users (username, email, password) VALUES ("user1", "user1@example.com", "password1")',
    'INSERT INTO users (username, email, password) VALUES ("user2", "user2@example.com", "password2")',
    'INSERT INTO users (username, email, password) VALUES ("user3", "user3@example.com", "password3")'
];

const insertProducts = [
    'INSERT INTO barcodes (barcode, productName) VALUES (4056489186267, "Green Apples")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20588885, "Cheese")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20119690, "Sliced Pork Ham")',
    'INSERT INTO barcodes (barcode, productName) VALUES (4056489100553, "Pinneaple")',
    'INSERT INTO barcodes (barcode, productName) VALUES (5411188112709, "Almond Milk")',
    'INSERT INTO barcodes (barcode, productName) VALUES (4056489166221, "Chicken Breast")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20357146, "Butter")',
    'INSERT INTO barcodes (barcode, productName) VALUES (4056489018636, "Flatbread")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20012540, "Bacon")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20790530, "Salad")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20242145, "Cherry Tomatoes")',
    'INSERT INTO barcodes (barcode, productName) VALUES (5942218001118, "Orange Juice")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20130596, "Berries")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20436322, "Nuts Mix")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20306274, "Potatoes")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20053970, "Rice")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20724696, "Almonds")',
    'INSERT INTO barcodes (barcode, productName) VALUES (5941300001104, "Flour")',
    'INSERT INTO barcodes (barcode, productName) VALUES (80135463, "Nutella")',
    'INSERT INTO barcodes (barcode, productName) VALUES (8004690611500, "Whole wheat spaghetti")',
    'INSERT INTO barcodes (barcode, productName) VALUES (4056489195917, "Oat")',
    'INSERT INTO barcodes (barcode, productName) VALUES (20241681, "Oranges")'
]

db.serialize(() => {
    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created successfully');
        }
    });

    insertUsers.forEach(sql => {
        db.run(sql, (err) => {
            if (err) {
                console.error('Error inserting user:', err.message);
            } else {
                console.log('User inserted successfully');
            }
        });
    });

    db.run(createBarCodesTable, (err) => {
        if (err) {
            console.error('Error creating barcodes table: ', err.message);
        } else {
            console.log('Barcodes table created successfully');
        }
    });

    insertProducts.forEach(sql => {
        db.run(sql, (err) => {
            if (err) {
                console.error('Error inserting products: ', err.message);
            } else {
                console.log('Products inserted successfully');
            }
        });
    });
});

db.close();
