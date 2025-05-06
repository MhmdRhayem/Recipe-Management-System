from flask import jsonify, request, render_template
from app import app, db
from models import Recipe
from werkzeug.exceptions import BadRequest
from ai import generate_recipe
import os

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([recipe.to_dict() for recipe in recipes])

@app.route('/api/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify(recipe.to_dict())


@app.route('/add')
def add_recipe_page():
    return render_template('add.html')

@app.route('/api/add', methods=['POST'])
def add_recipe():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'ingredients', 'instructions']
        if not all(field in data for field in required_fields):
            raise BadRequest('Missing required fields')
        
        # Create new recipe using the model
        new_recipe = Recipe(
            name=data['name'],
            ingredients=data['ingredients'],
            instructions=data['instructions'],
            prep_time=data.get('prep_time', 0),
            cook_time=data.get('cook_time', 0),
            servings=data.get('servings', 1),
            status=data.get('status', 'to try')
        )
        
        # Add to database
        db.session.add(new_recipe)
        db.session.commit()
        
        return jsonify({
            "message": "Recipe added successfully",
            "recipe": {
                "id": new_recipe.id,
                "name": new_recipe.name,
                "status": new_recipe.status
                # Include other fields as needed
            }
        }), 201
        
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error adding recipe: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.route('/api/recipes/edit/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    data = request.get_json()

    recipe.name = data['name']
    recipe.ingredients = data['ingredients']
    recipe.instructions = data['instructions']
    recipe.prep_time = data['prep_time']
    recipe.cook_time = data['cook_time']
    recipe.servings = data['servings']
    recipe.status = data['status']

    db.session.commit()
    return jsonify({'message': 'Recipe updated'})

@app.route("/edit/<int:recipe_id>", methods = ['GET'])
def edit_recipe(recipe_id):
    return render_template("edit.html")

@app.route('/api/ai/suggest', methods=['POST'])
def ai_suggest():
    try: 
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        recipe_name = data.get('recipe_name')

        if not recipe_name:
            return jsonify({"error": "Missing recipe_name"}), 400

        # 🧑‍🍳 Generate recipe - make sure generate_recipe() returns a dict with all required fields
        recipe = generate_recipe(recipe_name)
        
        # Ensure all required fields are present
        required_fields = ['name', 'ingredients', 'instructions', 'prep_time', 'cook_time', 'servings', 'status']
        for field in required_fields:
            if field not in recipe:
                recipe[field] = "" if field in ['name', 'ingredients', 'instructions', 'status'] else 0

        return jsonify(recipe)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to generate recipe", "details": str(e)}), 500

@app.route('/api/recipes/search', methods=['GET'])
def search_recipes():
    search_term = request.args.get('q', '').strip()
    
    if not search_term:
        return jsonify([])
    
    # Case-insensitive search across name, ingredients, and instructions
    results = Recipe.query.filter(
        db.or_(
            Recipe.name.ilike(f'%{search_term}%'),
            Recipe.ingredients.ilike(f'%{search_term}%'),
            Recipe.instructions.ilike(f'%{search_term}%'),
            Recipe.prep_time.ilike(f'%{search_term}%')
        )
    ).all()
    
    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
        'status': recipe.status
    } for recipe in results])