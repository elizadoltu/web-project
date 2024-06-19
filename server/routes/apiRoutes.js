const getAllUsers = require("../apis/getAllUsers");
const getProductByBarcode = require("../apis/getProductByBarcode");
const getAllBarcodes = require("../apis/getAllBarcodes");
const getRecipeByName = require("../apis/getRecipe");
const addToCart = require("../apis/addToCart");

const apiRoutes = {
  "/api/users": (req, res) => {
    getAllUsers()
      .then((users) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      });
  },
  "/api/products": (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);
    const barcode = params.get("barcode");

    if (!barcode) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Barcode parameter is required" }));
      return;
    }

    getProductByBarcode(barcode)
      .then((product) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(product));
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      });
  },
  "/api/getBarcodes": (req, res) => {
    getAllBarcodes()
      .then((barcodes) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(barcodes));
      })
      .catch((error) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      });
  },
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
          const { ingredients } = JSON.parse(body);

          if (!ingredients || !Array.isArray(ingredients)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "ingredients array is required" }));
            return;
          }

          // Assuming ingredients is an array of strings
          const promises = ingredients.map((ingredient) =>
            addToCart(ingredient)
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
}
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