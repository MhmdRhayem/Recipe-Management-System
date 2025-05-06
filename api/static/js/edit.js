document.addEventListener('DOMContentLoaded', () => {
    const recipeId = getRecipeIdFromUrl();
    loadRecipe(recipeId);

    document.getElementById('recipe-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateRecipe(recipeId);
    });
});

// Helper to get id from /edit/{id}
function getRecipeIdFromUrl() {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
}

// Load recipe details
async function loadRecipe(id) {
    try {
        const response = await fetch(`/api/recipes/${id}`);
        const recipe = await response.json();

        // Fill form fields
        document.getElementById('name').value = recipe.name;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('prep-time').value = recipe.prep_time;
        document.getElementById('cook-time').value = recipe.cook_time;
        document.getElementById('servings').value = recipe.servings;
        document.getElementById('status').value = recipe.status;

    } catch (error) {
        console.error('Failed to load recipe', error);
        alert('Error loading recipe!');
    }
}

// Update recipe
async function updateRecipe(id) {
    const data = {
        name: document.getElementById('name').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value,
        prep_time: parseInt(document.getElementById('prep-time').value),
        cook_time: parseInt(document.getElementById('cook-time').value),
        servings: parseInt(document.getElementById('servings').value),
        status: document.getElementById('status').value
    };

    try {
        const response = await fetch(`/api/recipes/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Recipe updated!');
            window.location.href = '/';
        } else {
            throw new Error('Failed to update');
        }
    } catch (error) {
        console.error('Error updating recipe', error);
        alert('Error updating recipe!');
    }
}
