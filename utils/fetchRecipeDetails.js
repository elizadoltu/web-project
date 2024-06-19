document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get("name");

    if (recipeName) {
        fetch(`http://localhost:3002/api/recipe?name=${recipeName}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("recipe-title").textContent = data.name;
                document.getElementById("recipe-description").textContent = data.description;
                document.getElementById("calories-number").textContent = data.calories + " kcal";
                document.getElementById("carbo-number").textContent = data.carbs + " g";
                document.getElementById("protein-number").textContent = data.protein + " g";
                document.getElementById("fat-number").textContent = data.fat + " g";

                const ingredientsList = document.getElementById("ingredients-list");
                ingredientsList.innerHTML = "";

                data.ingredients.forEach(ingredient => {
                    const ingredientItem = document.createElement("p");
                    ingredientItem.textContent = `${ingredient.quantity} ${ingredient.ingredient}`;
                    ingredientsList.appendChild(ingredientItem);
                });

                document.getElementById("recipe-preparation").textContent = data.preparation;

                // Add event listener for Add to Cart button
                const addToCartButton = document.getElementById("add-to-cart-button");
                addToCartButton.addEventListener("click", () => {
                    const ingredientList = data.ingredients.map(ingredient => `${ingredient.quantity} ${ingredient.ingredient}`);
                    addToCartAPIRequest(ingredientList);
                });
            })
            .catch(error => {
                console.error("Error fetching recipe:", error);
            });
    } else {
        document.getElementById("recipe-title").textContent = "No recipe name provided";
        document.getElementById("recipe-description").textContent = "";
        document.getElementById("recipe-preparation").textContent = "";
    }
});

function addToCartAPIRequest(ingredients) {
    fetch("http://localhost:3002/api/addToCart", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ingredients })
    })
    .then(response => response.json())
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


