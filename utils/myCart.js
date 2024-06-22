document.addEventListener("DOMContentLoaded", () => {
  const email = getCookie('rememberedEmail');
  const groupId = getCookie('groupID');

  fetchAvailableReceipts(email);

  document.getElementById("new-cart-form-receipts").addEventListener("submit", (event) => {
    event.preventDefault();
    const newCartName = document.getElementById("new-cart-name-receipts").value.trim();
    if (newCartName) {
      addNewCart(newCartName, email); 
      document.getElementById("new-cart-name-receipts").value = "";
    }
  });

  document.getElementById("new-group-cart-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const cartName = document.getElementById("new-cart-name").value;
    const cartId = document.getElementById("new-group-id").value;

    if (cartName && cartId) {
      addNewGroupCart(cartName, cartId, email);
      document.getElementById("new-cart-name").value = "";
      document.getElementById("new-group-id").value = "";
    } else {
      console.error("Cart name and ID are required");
    }
  });
  
  document.getElementById("join-group-receipts-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const joinGroupId = document.getElementById("join-group-id").value.trim();
    if (joinGroupId) {
      joinGroupReceipts(joinGroupId, email);
      document.getElementById("join-group-id").value = "";
    }
  });
});

function joinGroupReceipts(groupId, email) {
  fetch("http://localhost:3002/api/joinGroupReceipts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId, email }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Joined group receipts successfully:", data);
      // Log the entire data object to understand its structure
      console.log("Response data:", data);

      // Check if data.receipts is defined and is an array
      if (Array.isArray(data.receipts)) {
        updateJoinedReceiptList(data.receipts, email);
      } else {
        console.error("No receipts found in the response:", data);
      }
      
      fetchAvailableReceipts(email);
    })
    .catch(error => {
      console.error("Error joining group receipts:", error);
    });
}

function updateJoinedReceiptList(receipts, email) {
  const joinedReceiptList = document.getElementById("joined-receipt-list");
  joinedReceiptList.innerHTML = "";

  receipts.forEach(receipt => {
    const receiptButton = document.createElement("button");
    receiptButton.classList.add("receipt-item");
    receiptButton.textContent = receipt;
    receiptButton.addEventListener("click", () => {
      displayReceiptDetails(receipt, email);
    });
    joinedReceiptList.appendChild(receiptButton);
  });
}

function addNewGroupCart(cartName, groupId, email) {
  fetch("http://localhost:3002/api/addGroupCart", {
    method: "PUT",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ cartName: cartName, groupId: groupId, email: email })
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Cart added successfully:", data);
    fetchAvailableReceipts(email);
  })
  .catch((error) => {
    console.error("Error adding new cart:", error);
  });
}

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

function addNewCart(cartName, email) {
  fetch("http://localhost:3002/api/addReceipt", {
    method: "PUT",  
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cartName: cartName, email: email })  
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Cart added successfully:", data);
    fetchAvailableReceipts(email);
  })
  .catch((error) => {
    console.error("Error adding new cart:", error);
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
        receiptButton.addEventListener("click", () => displayReceiptDetails(receipt, email));
        receiptList.appendChild(receiptButton);
      });
    })
    .catch((error) => {
      console.error("Error fetching receipts:", error);
    });
}

function displayReceiptDetails(receiptId, email) {
  fetch(`http://localhost:3002/api/getIngredients?name=${encodeURIComponent(receiptId)}&email=${encodeURIComponent(email)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const itemsListContainer = document.getElementById("items-list-container");
      itemsListContainer.innerHTML = ""; 
      data.ingredients.forEach((ingredient) => {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("item-container");

        const itemDetailsContainer = document.createElement("div");
        itemDetailsContainer.classList.add("item-details-container");

        const infoItem = document.createElement("div");
        infoItem.classList.add("info-item");
        const itemName = document.createElement("h3");
        itemName.textContent = ingredient.ingredient;

        const priceAndQuantityContainer = document.createElement("div");
        priceAndQuantityContainer.classList.add("price-and-quantity-container");
        const quantity = document.createElement("p");
        quantity.textContent = `x${ingredient.quantity}`;
        priceAndQuantityContainer.appendChild(quantity);

        infoItem.appendChild(itemName);
        infoItem.appendChild(priceAndQuantityContainer);

        itemDetailsContainer.appendChild(infoItem);
        itemContainer.appendChild(itemDetailsContainer);

        itemsListContainer.appendChild(itemContainer);
      });
    })
    .catch((error) => {
      console.error("Error fetching receipt details:", error);
    });
}
