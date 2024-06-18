const getAllUsers = require("../apis/getAllUsers");
const getProductByBarcode = require("../apis/getProductByBarcode");
const getAllBarcodes = require("../apis/getAllBarcodes");

const apiRoutes = {
    "/api/users": getAllUsers,
    "/api/products": (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const params = new URLSearchParams(url.search);
        const barcode = params.get('barcode');

        if (!barcode) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Barcode parameter is required" }));
            return;
        }

        getProductByBarcode(barcode)
            .then(product => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(product));
            })
            .catch(error => {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: error.message }));
            });
    },
    "/api/getBarcodes": getAllBarcodes,  
};

function handleApiRoutes(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    const routeHandler = apiRoutes[pathname];
    if (routeHandler) {
        routeHandler(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
}

module.exports = handleApiRoutes;
