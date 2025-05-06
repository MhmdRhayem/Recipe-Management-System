from app import db

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    prep_time = db.Column(db.Integer)
    cook_time = db.Column(db.Integer)
    servings = db.Column(db.Integer)
    status = db.Column(db.String(100), default=False)

    def __repr__(self):
        return f'<Recipe {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'ingredients': self.ingredients,
            'instructions': self.instructions,
            'prep_time': self.prep_time,
            'cook_time': self.cook_time,
            'servings': self.servings,
            'status': self.status
        }
# # Create recipe objects
# r1 = Recipe(
#     name="Spaghetti Bolognese",
#     ingredients="Spaghetti, ground beef, tomato sauce, onion, garlic, olive oil, salt, pepper",
#     instructions="1. Cook spaghetti. 2. Cook beef with onions and garlic. 3. Add tomato sauce. 4. Mix with spaghetti.",
#     prep_time=10,
#     cook_time=30,
#     servings=4,
#     status="Published"
# )

# r2 = Recipe(
#     name="Pancakes",
#     ingredients="Flour, milk, eggs, baking powder, sugar, salt, butter",
#     instructions="1. Mix dry ingredients. 2. Add wet ingredients. 3. Cook on griddle until golden.",
#     prep_time=5,
#     cook_time=10,
#     servings=2,
#     status="Draft"
# )

# # Add to session
# db.session.add(r1)
# db.session.add(r2)

# # Commit to save to DB
# db.session.commit()
