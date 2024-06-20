const getRecipeByName = require("../apis/getRecipe");
const addToCart = require("../apis/addToCart");
const getReceipts = require("../apis/getReceipts");
const getIngredients = require("../apis/getIngredients");
const addNewCart = require("../apis/addNewCart");

const apiRoutes = {
  "/api/recipe": (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);
    const recipeName = params.get("name");

    if (!recipeName) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Recipe name parameter is required" }));
      return;
    }

    getRecipeByName(recipeName)
      .then((recipe) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(recipe));
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      });
  },
  "/api/addToCart": (req, res) => {
    if (req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { cartName, ingredients } = JSON.parse(body);

          if (!cartName || typeof cartName !== "string") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "cartName is required and must be a string",
              })
            );
            return;
          }

          if (!ingredients || !Array.isArray(ingredients)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "ingredients array is required" }));
            return;
          }

          const promises = ingredients.map(({ ingredient }) =>
            addToCart(ingredient, cartName)
          );

          Promise.all(promises)
            .then((messages) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ messages }));
            })
            .catch((error) => {
              console.error("Error adding ingredients to cart:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ error: "Failed to add ingredients to cart" })
              );
            });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  },

  "/api/receipts": (req, res) => {
    if (req.method === "GET") {
      getReceipts()
        .then((receipts) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ receipts }));
        })
        .catch((error) => {
          console.error("Error fetching receipts:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Not found" }));
        });
    } else {
      res.writeHead(404, { "Content-Type": "application" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  },
  "/api/getIngredients": (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cartName = url.searchParams.get("name");

    if (req.method === "GET" && cartName) {
      getIngredients(cartName)
        .then((ingredients) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ingredients }));
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Not found" }));
        });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  },
  "/api/addReceipt": (req, res) => {
    if (req.method === "POST" || req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { cartName, email } = JSON.parse(body);

          if (!cartName || typeof cartName !== "string" || !email || typeof email !== "string") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "cartName and email are required and must be strings",
              })
            );
            return;
          }

          addNewCart(cartName, email)
            .then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Receipt added successfully",
                  receipt: result,
                })
              );
            })
            .catch((error) => {
              console.error("Error adding receipt:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Failed to add receipt" }));
            });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
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
