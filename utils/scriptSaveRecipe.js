document.addEventListener("DOMContentLoaded", () => {
  const email = getCookie('rememberedEmail');
  const urlParams = new URLSearchParams(window.location.search);
  const recipeName = urlParams.get("name");
  const saveButton = document.querySelector(".save-button");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      console.log("Save button clicked");
      saveRecipe(recipeName, email);
    });
  } else {
    console.error("Save button not found");
  }

  const carouselItems = document.querySelectorAll(".carousel-item");
  carouselItems.forEach(item => {
    const recipeName = item.querySelector(".recipe-button").getAttribute("data-recipe");
    getTotalSavings(recipeName, item);
  });

  function getTotalSavings(recipeName, item) {
    fetch("http://localhost:3003/api/getTotalSavings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipeName })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Total savings received for", recipeName, ":", data);
      const savingElement = item.querySelector(".saves-count span");
      if (savingElement) {
        savingElement.textContent = data.totalSaving || 0;
      } else {
        console.error("Saving element not found for:", recipeName);
      }
    })
    .catch(error => {
      console.error("Error getting total savings:", error);
    });
  }

});

function saveRecipe(recipeName, email) {
  fetch("http://localhost:3003/api/saveRecipe", {
    method: "PUT",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ recipeName, email })
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
