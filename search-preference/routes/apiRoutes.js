const saveRecipe = require("../apis/saveRecipe");

const apiRoutes = {
  "/api/saveRecipe": (req, res) => {
    if (req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { recipeName, email } = JSON.parse(body);

          if (!recipeName || typeof recipeName !== "string") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "recipeName is required and must be a string",
              })
            );
            return;
          }

          saveRecipe(recipeName, email)
            .then((message) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message }));
            })
            .catch((error) => {
              console.error("Error saving recipe:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Failed to save recipe" }));
            });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  },
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
    res.end(JSON.stringify({ error: "Not found" }));
  }
}

module.exports = handleApiRoutes;
