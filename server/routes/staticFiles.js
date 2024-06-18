const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

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
    let filePath = "." + req.url;
    if (filePath === "./") {
        filePath = path.join(__dirname, "../../index.html");
    } else {
        filePath = path.join(__dirname, "../..", req.url);
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                fs.readFile(path.join(__dirname, "../404.html"), (err, content) => {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(content, "utf-8");
                });
            } else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
            }
        } else {
            res.writeHead(200, {
                "Content-Type": contentType,
                "Content-Encoding": "gzip" // compression to reduce the size of files sent from the server
            });
            const gzip = zlib.createGzip();
            const stream = fs.createReadStream(filePath).pipe(gzip);
            stream.pipe(res);
        }
    });
}

module.exports = handleStaticFilesRequest;
