document.addEventListener("DOMContentLoaded", () => {
  const email = sessionStorage.getItem('rememberedEmail');
  const groupId = getCookie('groupID');

  fetchAvailableReceipts(email);
  fetchGroupReceipts(email);

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

  document.getElementById("delete-individual-cart-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const cartName = document.getElementById("delete-individual-cart-name").value.trim();
    const email = document.getElementById("delete-individual-cart-email").value.trim();

    if (cartName && email) {
      try {
        await deleteIndividualCart(cartName, email);
        console.log('Individual cart deleted successfully');
        // Optionally fetch updated data or perform other actions
        document.getElementById("delete-individual-cart-name").value = "";
        document.getElementById("delete-individual-cart-email").value = "";
        fetchAvailableReceipts(email);
      } catch (error) {
        console.error('Failed to delete individual cart:', error.message);
      }
    } else {
      console.error('Cart name and email are required');
    }
  });

  document.getElementById("delete-group-cart-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const cartName = document.getElementById("delete-group-cart-name").value.trim();
    const groupId = document.getElementById("delete-group-cart-id").value.trim(); // Corrected ID field
    const email = document.getElementById("delete-group-cart-email").value.trim();

    if (cartName && groupId && email) {
      try {
        await deleteGroupCart(cartName, email, groupId); 
        console.log('Group cart deleted successfully');
        fetchGroupReceipts(email);
        document.getElementById("delete-group-cart-name").value = "";
        document.getElementById("delete-group-cart-id").value = "";
        document.getElementById("delete-group-cart-email").value = "";
      } catch (error) {
        console.error('Failed to delete group cart:', error.message);
      }
    } else {
      console.error('Cart name, group ID, and email are required');
    }
  });
});

async function deleteIndividualCart(cartName, email) {
  try {
    const response = await fetch('http://localhost:3002/api/deleteIndividualsCart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartName, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete individual cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting individual cart:', error.message);
    throw error; 
  }
}


async function deleteGroupCart(cartName, email, groupId) {
  try {
    const response = await fetch('http://localhost:3002/api/deleteCart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartName, email, groupId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete group cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting group cart:', error.message);
    throw error;
  }
}

function fetchGroupReceipts(email) {
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
      receiptButton.addEventListener("click", () => displayReceiptDetails(receipt));
      groupReceiptList.appendChild(receiptButton);
    });
  })
  .catch((error) => {
    console.error("Error fetching group receipts:", error);
  });
}

function fetchAvailableReceipts(email) {
  fetch("http://localhost:3002/api/receipts", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
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
      const individualReceiptList = document.getElementById("individual-receipt-list");
      individualReceiptList.innerHTML = "";

      data.receipts.forEach((receipt) => {
        const receiptButton = document.createElement("button");
        receiptButton.classList.add("receipt-item");
        receiptButton.textContent = receipt;
        receiptButton.addEventListener("click", () => displayReceiptDetails(receipt, email));
        individualReceiptList.appendChild(receiptButton);
        
      });
    })
    .catch((error) => {
      console.error("Error fetching receipts:", error);
    });
}

function displayReceiptDetails(receiptId) {
  fetch(`http://localhost:3002/api/getIngredients?name=${encodeURIComponent(receiptId)}`)
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

function addNewGroupCart(cartName, groupId, email) {
  fetch("http://localhost:3002/api/addGroupCart", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
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
    fetchGroupReceipts(email);
  })
  .catch((error) => {
    console.error("Error adding new cart:", error);
  });
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
  const joinedReceiptList = document.getElementById("joined-group-receipt-list");
  joinedReceiptList.innerHTML = "";

  receipts.forEach(receipt => {
    const receiptButton = document.createElement("button");
    receiptButton.classList.add("receipt-item");
    receiptButton.textContent = receipt;
    receiptButton.addEventListener("click", () => {
      displayReceiptDetails(receipt);
    });
    joinedReceiptList.appendChild(receiptButton);
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
