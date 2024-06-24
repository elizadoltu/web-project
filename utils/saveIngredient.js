document.addEventListener("DOMContentLoaded", () => {
    const email = sessionStorage.getItem('rememberedEmail');
    console.log('Retrieved email:', email);  

    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get("name");
    console.log('Retrieved productName from URL:', productName);  

    const saveButton = document.querySelector(".save-button");
    fetchSavedIngredients(email);

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            console.log("Save button clicked");
            saveIngredient(productName, email);
        });
    } else {
        console.error("Save button not found");
    }
});

function saveIngredient(productName, email) {
    fetch("http://localhost:3003/api/saveIngredient", {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ productName, email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Recipe saved to preference: ", data);
    })
    .catch(error => {
        console.error("Error saving the recipe:", error);
    });
}

function fetchSavedIngredients(email) {
    if (!email) {
        console.error('No email provided, cannot fetch saved ingredients.');
        return;
    }

    fetch("http://localhost:3003/api/getSavedProducts", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({ email }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched saved products:", data);  
        const productsList = document.getElementById("preference-products-container");
        productsList.innerHTML = "";

        data.products.forEach((product, index) => {
            if (!product) {
                console.warn(`Product at index ${index} is null or undefined`);
                return;
            }

            const productName = product;  
            const carouselItem = document.createElement("div");
            carouselItem.classList.add("preference-product-item");

            carouselItem.innerHTML = `
                <img src="food-placeholder.jpg" alt="${productName}" />
                <h3><button product-name="${productName}" class="product-button" data-recipe="${productName}">${productName}</button></h3>
            `;

            productsList.appendChild(carouselItem);
            const productButton = carouselItem.querySelector(".product-button");
            productButton.addEventListener("click", () => {
                const clickedProductName = productButton.getAttribute("product-name");
                window.location.href = `/frontend/pages/productsPage.html?name=${encodeURIComponent(clickedProductName)}`;
            });
        });
    })
    .catch(error => {
        console.error("Error fetching saved products:", error);
    });
}
