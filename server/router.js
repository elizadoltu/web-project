const handleApiRoutes = require("./routes/apiRoutes");
const handleStaticFilesRequest = require("./routes/staticFiles");

function route(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname.startsWith("/api")) {
        handleApiRoutes(req, res);
    } else {
        handleStaticFilesRequest(req, res);
    }
}

module.exports = route;
