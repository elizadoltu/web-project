const saveRecipe = require("../apis/saveRecipe");
const getTotalNumberOfSavings = require("../apis/getTotalNumberOfSavings");
const fetchSavedRecipes = require("../apis/fetchSavedRecipes");
const saveIngredient = require("../apis/saveIngredient");
const fetchSavedIngredients = require("../apis/fetchSavedProducts");

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
  "/api/saveIngredient" : (req, res) => {
    if (req.method === "PUT") {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { productName, email } = JSON.parse(body);

          if (!productName || typeof productName !== "string") {
            res.writeHead(400, { "Content-Type" : "application/json" });
            res.end(
              JSON.stringify({
                error: "productName is required and must be a string",
              })
            );
            return;
          }

          saveIngredient(productName, email)
          .then((message) => {
            res.writeHead(200, { "Content-Type" : "application" });
            res.end(JSON.stringify({ message }));
          })
          .catch((error) => {
            console.error("Error saving product:", error);
            res.writeHead(500, { "Content-Type" : "application/json" });
            res.end(JSON.stringify({ error: "Failed to save recipe" }));
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(500, { "Content-Type" : "application/json" });
          res.end(JSON.stringify({ error: "Failed to save recipe" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type" : "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  },
  "/api/getTotalSavings": (req, res) => {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { recipeName } = JSON.parse(body);
        getTotalNumberOfSavings(recipeName)
          .then((totalSaving) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ recipeName, totalSaving }));
          })
          .catch((error) => {
            console.error("Error getting total savings:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to get total savings" }));
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
"/api/getSavedRecipes": (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);

        fetchSavedRecipes(email)
          .then((recipes) => {
            res.writeHead(200, { "Content-Type" : "application/json"});
            res.end(JSON.stringify({ recipes }));
          })
          .catch((error) => {
            console.error("Error fetching receipts:", error);
            res.writeHead(500, { "Content-Type" : "application/json" });
            res.end(JSON.stringify({ error: "Error fetching recipes" }));
          });
      } catch (error) {
        console.error("Error  parsing request body:", error);
        res.end(JSON.stringify({ error: "Invalid request body" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
},
"/api/getSavedProducts" : (req, res) => {
    if (req.method === 'POST') {
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const { email } = JSON.parse(body);

          fetchSavedIngredients(email)
          .then((products) => {
            res.writeHead(200, { "Content-Type" : "application/json" });
            res.end(JSON.stringify({ products }));
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
            res.writeHead(500, { "Content-Type" : "application" });
            res.end(JSON.stringify({ error: "Error fetching products" }));
          });
        } catch (error) {
          console.error("Error parsing request body:", error);
          res.end(JSON.stringify({ error: "Invalid request body" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type" : "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
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
    res.end(JSON.stringify({ error: "Not found" }));
  }
}

module.exports = handleApiRoutes;
