const http = require('http');
const handleApiRoutes = require('./routes/apiRoutes');

const PORT = 3003;
const server = http.createServer((req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE. OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url.startsWith('/api')) {
        handleApiRoutes(req, res);
    } else {
        res.writeHead(404, { 'Content-Type' : 'application/json'});
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});