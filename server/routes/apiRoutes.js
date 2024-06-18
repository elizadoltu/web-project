const getAllUsers = require("../apis/getAllUsers");
const getAllProducts = require("../apis/getProductByBarcode");

const apiRoutes = {
    "/api/users": getAllUsers,
    "/api/products" : getAllProducts,
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
