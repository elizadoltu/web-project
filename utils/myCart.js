document.addEventListener("DOMContentLoaded", () => {
  fetchAvailableReceipts();
});

function fetchAvailableReceipts() {
  fetch("http://localhost:3002/api/receipts")
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
        receiptButton.addEventListener("click", () => displayReceiptDetails(receipt));
        receiptList.appendChild(receiptButton);
      });
    })
    .catch((error) => {
      console.error("Error fetching receipts:", error);
    });
}

function displayReceiptDetails(receiptId) {
  fetch(`http://localhost:3002/api/getIngredients?name=${receiptId}`)
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
