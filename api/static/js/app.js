document.addEventListener('DOMContentLoaded', function() {
    // Load home page on startup
    loadHomePage();

    // Navigation: Home and Add Recipe
    document.getElementById('home-link').addEventListener('click', loadHomePage);
    
    // Search form submission
    document.getElementById('search-form').addEventListener('submit', handleSearch);
});

// Handle search form submission
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value.trim();
    
    try {
        const response = await fetch(`/api/recipes/search?q=${encodeURIComponent(searchTerm)}`);
        const recipes = await response.json();
        
        renderRecipes(recipes);
    } catch (error) {
        console.error('Error searching recipes:', error);
        showError('Failed to search recipes');
    }
}

// Render recipes in the main content area
function renderRecipes(recipes) {
    let html = `<h1 class="mb-4">My Recipes</h1><div class="row" id="recipes-container">`;

    if (recipes.length === 0) {
        html += `
            <div class="col-12">
                <div class="alert alert-info">No recipes found. Try a different search term!</div>
            </div>
        `;
    } else {
        recipes.forEach(recipe => {
            html += createRecipeCard(recipe);
        });
    }

    html += `</div>`;
    document.getElementById('main-content').innerHTML = html;

    // Add click listeners for Edit & Delete
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-id');
            window.location.href = `/edit/${recipeId}`;
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteRecipe);
    });
}

// Load all recipes and render cards
async function loadHomePage(e) {
    if (e) e.preventDefault();

    try {
        const response = await fetch('/api/recipes');
        const recipes = await response.json();

        let html = `<h1 class="mb-4">My Recipes</h1><div class="row" id="recipes-container">`;

        if (recipes.length === 0) {
            html += `
                <div class="col-12">
                    <div class="alert alert-info">No recipes found. Add your first recipe!</div>
                </div>
            `;
        } else {
            recipes.forEach(recipe => {
                html += createRecipeCard(recipe);
            });
        }

        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;

        // Add click listeners for Edit & Delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const recipeId = this.getAttribute('data-id');
                window.location.href = `/edit/${recipeId}`;  // Navigate to /edit/{recipe_id}
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteRecipe);
        });

    } catch (error) {
        console.error('Error loading recipes:', error);
        showError('Failed to load recipes');
    }
}

// Render single recipe card
function createRecipeCard(recipe) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${recipe.name}</h5>
                    <p class="card-text"><strong>Status:</strong> ${recipe.status}</p>
                    <p class="card-text"><strong>Prep Time:</strong> ${recipe.prep_time} mins</p>
                    <p class="card-text"><strong>Cook Time:</strong> ${recipe.cook_time} mins</p>
                    <p class="card-text"><strong>Servings:</strong> ${recipe.servings}</p>
                    <p class="card-text"><strong>Ingredients:</strong><br> ${recipe.ingredients.replace(/\n/g, '<br>')}</p>
                    <p class="card-text"><strong>Instructions:</strong><br> ${recipe.instructions.replace(/\n/g, '<br>')}</p>

                    <div class="recipe-actions">
                        <a href="/edit/${recipe.id}" class="btn btn-primary">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <button class="btn btn-danger delete-btn" data-id="${recipe.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}