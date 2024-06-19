function loginAdmin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log('Received admin login request with body:', body);

        let parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
            return;
        }

        const { email, password } = parsedBody;
        console.log('Parsed admin login details:', email, password);

        if (email === 'Admin Web' && password === '123456789') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Admin login successful' }));
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid admin ID or password' }));
        }
    });
}

module.exports = loginAdmin;
