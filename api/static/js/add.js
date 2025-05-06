document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('recipe-form').addEventListener('submit', handleAddRecipe);
});

async function handleAddRecipe(e) {
    e.preventDefault();

    const recipeData = {
        name: document.getElementById('name').value.trim(),
        ingredients: document.getElementById('ingredients').value.trim(),
        instructions: document.getElementById('instructions').value.trim(),
        prep_time: parseInt(document.getElementById('prep-time').value),
        cook_time: parseInt(document.getElementById('cook-time').value),
        servings: parseInt(document.getElementById('servings').value),
        status: document.getElementById('status').value
    };

    try {
        const response = await fetch('/api/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipeData)
        });

        if (response.ok) {
            window.location.href = '/'; // Redirect back to home
        } else {
            alert('Failed to add recipe');
        }
    } catch (error) {
        console.error('Error adding recipe:', error);
        alert('Error adding recipe');
    }
}

document.getElementById('ai-suggest-btn').addEventListener('click', async function () {
    const btn = this;
    
    // Show loading state
    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Generating Recipe...
    `;
    btn.disabled = true;
    
    const recipeName = prompt("Enter a dish name or type of recipe you'd like suggestions for:");
    
    if (!recipeName) {
        // Reset button if user cancels
        btn.innerHTML = '<i class="fas fa-magic"></i> AI Suggest';
        btn.disabled = false;
        return;
    }
    
    try {
        const response = await fetch('/api/ai/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipe_name: recipeName
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get AI suggestion');
        }

        const data = await response.json();

        // Fill the form with AI suggestion
        document.getElementById('name').value = data.name || '';
        document.getElementById('ingredients').value = data.ingredients || '';
        document.getElementById('instructions').value = data.instructions || '';
        document.getElementById('prep-time').value = data.prep_time || 15;
        document.getElementById('cook-time').value = data.cook_time || 30;
        document.getElementById('servings').value = data.servings || 4;
        document.getElementById('status').value = data.status || 'active';

    } catch (error) {
        console.error('Error fetching AI suggestion:', error);
        alert('Failed to get AI suggestion: ' + error.message);
    } finally {
        // Reset button state
        btn.innerHTML = '<i class="fas fa-magic"></i> AI Suggest';
        btn.disabled = false;
    }
});