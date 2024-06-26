const loginUser = require("../apis/loginUser");
const registerUser = require("../apis/registerUser");
const loginAdmin = require("../apis/loginAdmin");
const updateUser = require('../apis/updateUser'); 
const addUserAllergy = require('../apis/userAllergies'); 
const getUserInfo = require('../apis/getUserInfo'); 
const getUserAllergies = require('../apis/getUserAllergies'); 
const updateDietaryPreference = require('../apis/updateDietaryPreference'); 
const getUsers = require('../apis/getUsers');
const banUser = require('../apis/banUser'); 
const unbanUser = require('../apis/unbanUser'); 
const generateCSV = require('../apis/generateCSV');
const generatePDF = require('../apis/generatePDF');
const joinGroup = require('../apis/joinGroup');
const deleteUser = require("../apis/deleteUser");

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
    '/api/updateUser': (req, res) => {
        if (req.method === 'POST') {
            updateUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/addUserAllergy': (req, res) => { 
        if (req.method === 'POST') {
            addUserAllergy(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/getUserInfo': (req, res) => { 
        if (req.method === 'GET') {
            getUserInfo(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/getUserAllergies': (req, res) => { 
        if (req.method === 'GET') {
            getUserAllergies(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/updateDietaryPreference': (req, res) => { 
        if (req.method === 'POST') {
            updateDietaryPreference(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/getUsers': (req, res) => { 
        if (req.method === 'GET') {
            getUsers(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/banUser': (req, res) => { // Add this route
        if (req.method === 'POST') {
            banUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/unbanUser': (req, res) => { // Add this route
        if (req.method === 'POST') {
            unbanUser(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/generateCSV': (req, res) => {
        if (req.method === 'GET') {
            generateCSV(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/generatePDF': (req, res) => {
        if (req.method === 'GET') {
            generatePDF(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    '/api/joinGroup': (req, res) => { 
        if (req.method === 'POST') {
            joinGroup(req, res);
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    },
    "/api/deleteUser": (req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const { email } = JSON.parse(body);

          deleteUser(email)
            .then(message => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message }));
            })
            .catch(error => {
              console.error("Error deleting user:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Error deleting user" }));
            });
        } catch (error) {
          console.error("Error parsing request body:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid request body" }));
        }
      });
    } else {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
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
