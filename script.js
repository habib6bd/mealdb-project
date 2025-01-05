document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results");
    const mealDetailsContainer = document.getElementById("meal-details");
    searchInput.value = "";
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (!query) {
        resultsContainer.innerHTML = "<div class='text-muted'>Please enter a search term.</div>";
        return;
      }

      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        displayResults(data.meals);
      } catch (error) {
        console.error("Error fetching meals:", error);
        resultsContainer.innerHTML = `<div class="text-danger">Error fetching data. Please try again.</div>`;
      }
    });

    function displayResults(meals) {
      resultsContainer.innerHTML = "";

      if (!meals) {
        resultsContainer.innerHTML = `<div class="text-center text-danger">No meals found. Try a different meal.</div>`;
        return;
      }

      meals.forEach((meal) => {
        const card = document.createElement("div");
        card.className = "col-md-3";

        card.innerHTML = `
          <div class="card shadow h-100" data-id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
            </div>
          </div>
        `;

        card.addEventListener("click", () => {
          fetchMealDetails(meal.idMeal);
        });

        resultsContainer.appendChild(card);
      });
    
    }

    async function fetchMealDetails(mealId) {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        displayMealDetails(data.meals[0]);
      } catch (error) {
        console.error("Error fetching meal details:", error);
        mealDetailsContainer.innerHTML = `<div class="text-danger">Error fetching meal details. Please try again.</div>`;
      }
    }

    function displayMealDetails(meal) {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
          ingredients.push(`${ingredient} - ${measure}`);
        }
      }

      mealDetailsContainer.innerHTML = `
        <div class="card shadow">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body">
            <h5 class="card-title text-center text-primary">${meal.strMeal}</h5>
            <h6>Ingredients:</h6>
            <ul>
              ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    }
  });