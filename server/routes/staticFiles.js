const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const url = require("url");

const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
};

function handleStaticFilesRequest(req, res) {
    let parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    let query = parsedUrl.query;

    // Handle the case where the pathname includes a query string
    if (query) {
        pathname = pathname.split("?")[0]; // Strip off the query string
    }

    let filePath = path.join(__dirname, "../..", pathname);

    if (pathname === "/") {
        filePath = path.join(__dirname, "../../index.html");
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    console.log("Requested file path:", filePath);

    fs.exists(filePath, (exists) => {
        if (!exists) {
            console.error("File not found:", filePath);
            fs.readFile(path.join(__dirname, "../../404.html"), (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Sorry, check with the site admin for error: ${err.code} ..\n`);
                } else {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(content, "utf-8");
                }
            });
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Encoding": "gzip" // compression to reduce the size of files sent from the server
        });

        const gzip = zlib.createGzip();
        const stream = fs.createReadStream(filePath).pipe(gzip);
        stream.pipe(res);
    });
}

module.exports = handleStaticFilesRequest;
