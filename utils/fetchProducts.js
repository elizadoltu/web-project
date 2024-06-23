document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get("name");

    if (productName) {
        try {
            const barcode = await getBarcode(productName);
            console.log("Fetched barcode:", barcode);
            fetchProducts(barcode, productName);
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

function fetchProducts(barcode, productName) {
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
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
        });
}
