document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeName = urlParams.get("name");
  const email = getCookie('rememberedEmail');

  if (recipeName) {
    fetchRecipeDetails(recipeName, email);
  } else {
    document.getElementById("recipe-title").textContent =
      "No recipe name provided";
    document.getElementById("recipe-description").textContent = "";
    document.getElementById("recipe-preparation").textContent = "";
    fetchAvailableReceipts(email, []); 
  }

  const addToCartButton = document.getElementById("add-to-cart-button");
  addToCartButton.addEventListener("click", () => {
    const ingredientList = Array.from(
      document.querySelectorAll(".ingredients-list p")
    ).map((p) => {
      const text = p.textContent.trim();
      const quantity = text.match(/\d+(\s+\d+\/\d+)?/)[0]; 
      const ingredient = text.replace(quantity, "").trim(); 
      return { ingredient, quantity };
    });

    const selectedReceipt = document.querySelector(".receipt-item.selected");
    const cartName = selectedReceipt ? selectedReceipt.textContent.trim() : "";
    if (cartName) {
      addToCartAPIRequest(cartName, recipeName, ingredientList, email);
    } else {
      console.error("No receipt selected to add to cart.");
    }
  });
});

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function fetchRecipeDetails(recipeName, email) {
  fetch(`http://localhost:3002/api/recipe?name=${recipeName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Recipe details:", data);

      document.getElementById("recipe-title").textContent = data.name;
      document.getElementById("recipe-description").textContent =
        data.description;
      document.getElementById("calories-number").textContent = `${data.calories} kcal`;
      document.getElementById("carbo-number").textContent = `${data.carbs} g`;
      document.getElementById("protein-number").textContent = `${data.protein} g`;
      document.getElementById("fat-number").textContent = `${data.fat} g`;

      const ingredientsList = document.getElementById("ingredients-list");
      ingredientsList.innerHTML = "";

      data.ingredients.forEach((ingredient) => {
        const ingredientItem = document.createElement("p");
        ingredientItem.textContent = `${ingredient.quantity} ${ingredient.ingredient}`;
        ingredientsList.appendChild(ingredientItem);
      });

      document.getElementById("recipe-preparation").textContent = data.preparation;

      const ingredientList = data.ingredients.map(ingredient => ({
        ingredient: ingredient.ingredient,
        quantity: ingredient.quantity
      }));

      fetchAvailableReceipts(email, ingredientList);
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
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
