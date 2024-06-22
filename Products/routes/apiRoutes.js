const getRecipeByName = require("../apis/getRecipe");
const addToCart = require("../apis/addToCart");
const getReceipts = require("../apis/getReceipts");
const getIngredients = require("../apis/getIngredients");
const addNewCart = require("../apis/addNewCart");
<<<<<<< HEAD
const addNewGroupCart = require("../apis/addNewGroupCart");
const joinGroupCart = require("../apis/joinGroupCart");
=======
const searchForRecipe = require('../apis/searchForRecipe');
>>>>>>> 1878f218ebd5a9bd466f24891b4b9e8be5ef8922

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
  "/api/joinGroupReceipts": (req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { groupId, email } = JSON.parse(body);

          if (!groupId || typeof groupId !== "string" || !email || typeof email !== "string") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "groupId and email are required and must be strings",
              })
            );
            return;
          }

          joinGroupCart(groupId, email)
            .then((result) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(result));
            })
            .catch((error) => {
              console.error("Error joining group receipts:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Failed to join group receipts" }));
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
  "/api/addGroupCart": (req, res) => {
    if (req.method === "POST" || req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { cartName, groupId ,email } = JSON.parse(body);

          if (!cartName || typeof cartName !== "string" || !email || typeof email !== "string") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "cartName and email are required and must be strings",
              })
            );
            return;
          }

          addNewGroupCart(cartName,groupId ,email)
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
  },
  "/api/addToCart": (req, res) => {
    if (req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { cartName, ingredients, email } = JSON.parse(body);

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
            addToCart(ingredient, cartName, email)
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
    if (req.method === "POST") {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { email, ingredients } = JSON.parse(body);
          
          getReceipts(email) 
            .then((receipts) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ receipts }));
            })
            .catch((error) => {
              console.error("Error fetching receipts:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Error fetching receipts" }));
            });
        } catch (error) {
          console.error("Error parsing request body:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid request body" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  },
  "/api/getIngredients": (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cartName = url.searchParams.get("name");
    const email = url.searchParams.get("email");

    if (req.method === "GET" && cartName && email) {
      getIngredients(cartName, email)
        .then((ingredients) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ingredients }));
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to fetch ingredients" }));
        });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
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
  },
  "/api/searchForRecipe": (req, res) => {
        if (req.method === 'GET') {
            searchForRecipe(req, res);
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
