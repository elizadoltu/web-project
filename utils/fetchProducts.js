document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get("name");
    const email = sessionStorage.getItem('rememberedEmail');
    fetchGroupReceipts(email, productName);
    fetchAvailableReceipts(email, productName); 

    if (productName) {
        try {
            const barcode = await getBarcode(productName);
            console.log("Fetched barcode:", barcode);
            fetchProducts(barcode, productName, email);
        } catch (error) {
            console.error("Error fetching barcode:", error);
        }
    } else {
        console.error("Product name parameter is missing in the URL");
    }
});

function getBarcode(productName) {
    return fetch(`http://localhost:3002/api/getBarcode?name=${productName}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        });
}

function fetchProducts(barcode, productName, email) {
    fetch(`http://localhost:3002/api/getProductDetails?barcode=${barcode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.product) {
                throw new Error("Product details not found");
            }

            const product = data.product;
            document.getElementById("product-name").textContent = productName || "N/A";
            document.getElementById("product-quantity").textContent = `${product.product_quantity || "N/A"} ${product.product_quantity_unit || ""}`;
            document.getElementById("product-code").textContent = `Code: ${product.code || "N/A"}`;
            document.getElementById("product-countries").textContent = `Countries: ${product.countries || "N/A"}`;

            const nutrientLevels = document.getElementById("product-nutrient-levels");
            nutrientLevels.innerHTML = "<h3>Nutrient Levels</h3>";
            for (const [key, value] of Object.entries(product.nutrient_levels || {})) {
                const nutrientItem = document.createElement("p");
                nutrientItem.textContent = `${key}: ${value}`;
                nutrientLevels.appendChild(nutrientItem);
            }
            fetchAvailableReceipts(email, productName);
            fetchGroupReceipts(email, productName);
            
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
        });
}

function fetchAvailableReceipts(email, ingredientList) {
    fetch("http://localhost:3002/api/receipts", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({ email: email, ingredients: ingredientList }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const receiptList = document.getElementById("receipt-list");
        receiptList.innerHTML = "";
  
        data.receipts.forEach((receipt) => {
          const receiptButton = document.createElement("button");
          receiptButton.classList.add("receipt-item");
          receiptButton.textContent = receipt;
          receiptButton.addEventListener("click", () => {
            const selectedReceipt = document.querySelector(".receipt-item.selected");
            if (selectedReceipt) {
              selectedReceipt.classList.remove("selected");
            }
            receiptButton.classList.add("selected");
  
            addToCartAPIRequest(receipt, ingredientList, email);
          });
          receiptList.appendChild(receiptButton);
        });
      })
      .catch((error) => {
        console.error("Error fetching receipts:", error);
      });
  }
  
  function addToCartAPIRequest(cartName, ingredients, email) {
    fetch("http://localhost:3002/api/addToCart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cartName, ingredients, email })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Ingredients added to cart:");
      data.messages.forEach((message, index) => {
        console.log(`${index + 1}. ${message}`);
      });
    })
    .catch(error => {
      console.error("Error adding ingredients to cart:", error);
    });
  }
  
  function fetchGroupReceipts(email, ingredientList) {
    fetch("http://localhost:3002/api/groupReceipts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const groupReceiptList = document.getElementById("group-receipt-list");
      groupReceiptList.innerHTML = "";
  
      data.receipts.forEach((receipt) => {
        const receiptButton = document.createElement("button");
        receiptButton.classList.add("receipt-item");
        receiptButton.textContent = receipt;
        receiptButton.addEventListener("click", () => {
          const selectedReceipt = document.querySelector(".receipt-item.selected");
          if (selectedReceipt) {
            selectedReceipt.classList.remove("selected");
          }
          receiptButton.classList.add("selected");
  
          addToGroupCart(receipt, ingredientList, email);
        })
        groupReceiptList.appendChild(receiptButton);
      });
    })
    .catch((error) => {
      console.error("Error fetching group receipts:", error);
    });
  }
  
  function addToGroupCart(cartName, ingredients, email) {
    fetch("http://localhost:3002/api/addToGroupCart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cartName, ingredients, email })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Ingredients added to cart:");
      data.messages.forEach((message, index) => {
        console.log(`${index + 1}. ${message}`);
      });
    })
    .catch(error => {
      console.error("Error adding ingredients to cart:", error);
    });
  }