const http = require("http");
const route = require("./router");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
    route(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
