const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.db');
const db = new sqlite3.Database(dbPath);

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  return password.length >= 8;
};

function registerUser(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log('Received registration request with body:', body);

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON' }));
      return;
    }

    const { username, email, password } = parsedBody;
    console.log('Parsed registration details:', email, password);

    if (!validateEmail(email)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: 'Invalid email format' }));
    }

    if (!validatePassword(password)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: 'Password must be at least 8 characters long' }));
    }

    // Check if the username or email combination already exists
    db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email], async (err, row) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
      }

      if (row) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: 'Username or email already exists' }));
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user
      db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword], function(err) {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
        }
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: 'User registered successfully' }));
      });
    });
  });
}

module.exports = registerUser;
