const sqlite3 = require('sqlite3').verbose();

// Open a new SQLite3 database instance
const db = new sqlite3.Database('server/data/database.db');

// Define SQL statements to create tables
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`;

// Define SQL statements to insert sample users
const insertUsers = [
    'INSERT INTO users (username, email, password) VALUES ("user1", "user1@example.com", "password1")',
    'INSERT INTO users (username, email, password) VALUES ("user2", "user2@example.com", "password2")',
    'INSERT INTO users (username, email, password) VALUES ("user3", "user3@example.com", "password3")'
];

// Run SQL statements to create tables
db.serialize(() => {
    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created successfully');
        }
    });

    // Insert sample users
    insertUsers.forEach(sql => {
        db.run(sql, (err) => {
            if (err) {
                console.error('Error inserting user:', err.message);
            } else {
                console.log('User inserted successfully');
            }
        });
    });
});

// Close the database connection
db.close();
