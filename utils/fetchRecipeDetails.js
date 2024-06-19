document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = urlParams.get("name");

    if (recipeName) {
      fetch(`/api/recipe?name=${recipeName}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById("recipe-title").textContent = data.name;
          document.getElementById("recipe-description").textContent = data.description;
          document.getElementById("calories-number").textContent = data.calories + " kcal";
          document.getElementById("carbo-number").textContent = data.carbs + " g";
          document.getElementById("protein-number").textContent = data.protein + " g";
          document.getElementById("fat-number").textContent = data.fat + " g";

          const ingredientsList = document.getElementById("ingredients-list");
          ingredientsList.innerHTML = ""; // Clear previous content

          data.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement("p");
            ingredientItem.textContent = `${ingredient.quantity} ${ingredient.ingredient}`;
            ingredientsList.appendChild(ingredientItem);
          });

          document.getElementById("recipe-preparation").textContent = data.preparation;
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