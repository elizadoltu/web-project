const getAllUsers = require('../apis/getAllUsers');
const getProductByBarcode = require('../apis/getProductByBarcode');
const getAllBarcodes = require('../apis/getAllBarcodes');
const loginUser = require('../apis/loginUser');
const registerUser = require('../apis/registerUser');
const loginAdmin = require('../apis/loginAdmin');
const updateUser = require('../apis/updateUser'); // Add the updateUser module

const apiRoutes = {
    '/api/users': getAllUsers,
    '/api/products': (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const params = new URLSearchParams(url.search);
        const barcode = params.get('barcode');

        if (!barcode) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Barcode parameter is required' }));
            return;
        }

        getProductByBarcode(barcode)
            .then(product => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(product));
            })
            .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            });
    },
    '/api/getBarcodes': getAllBarcodes,
    '/api/loginUser': (req, res) => {
        if (req.method === 'POST') {
            loginUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/registerUser': (req, res) => {
        if (req.method === 'PUT') {
            registerUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/loginAdmin': (req, res) => {
        if (req.method === 'POST') {
            loginAdmin(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/updateUser': (req, res) => { // Add the route for updating user information
        if (req.method === 'POST') {
            updateUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    }
};

function handleApiRoutes(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    const routeHandler = apiRoutes[pathname];
    if (routeHandler) {
        console.log(`Handling API request: ${pathname}`);
        routeHandler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
}

module.exports = handleApiRoutes;
