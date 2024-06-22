document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value.trim();
    if (!query) return;
  
    try {
      const response = await fetch(`http://localhost:3002/api/searchForRecipe?name=${encodeURIComponent(query)}`);
      const recipes = await response.json();
  
      if (recipes.length > 0) {
        // Assuming there's only one recipe that matches the search
        window.location.href = `/frontend/pages/recipePage.html?name=${encodeURIComponent(recipes[0].name)}`;
      } else {
        alert('No recipes found');
      }
    } catch (error) {
      console.error('Error searching for recipes:', error);
    }
  });
  