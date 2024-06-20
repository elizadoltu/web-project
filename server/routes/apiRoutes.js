const loginUser = require("../apis/loginUser");
const registerUser = require("../apis/registerUser");
const loginAdmin = require("../apis/loginAdmin");
const loginUser = require('../apis/loginUser');
const registerUser = require('../apis/registerUser');
const loginAdmin = require('../apis/loginAdmin');
const updateUser = require('../apis/updateUser'); // Add the updateUser module

const apiRoutes = {
  "/api/products": (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);
    const barcode = params.get("barcode");
  },
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
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
}


module.exports = handleApiRoutes;
