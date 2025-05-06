# Recipe Creation and Management System
A Flask-based web application for creating, managing, and searching recipes with AI-powered recipe generation.

## Features
- **Create/Add Recipes:** Manually add new recipes or generate them using AI.
- **Read Recipes:** View all recipes or search by name/ingredients.
- **Update Recipes:** Edit existing recipes.
- **Delete Recipes:** Delete existing recipes.
- **Search Functionality:** Search across recipe names, ingredients, and instructions.
- **AI Integration:** Get AI-generated recipes using OpenAI's GPT-3.5-turbo.
- **SQLite Database:** Persistent storage for all recipes.

## Technologies Used
- **Backend:** Flask
- **Database:** SQLite (via SQLAlchemy)
- **AI:** OpenAI API + LangChain
- **Frontend:** HTML + BootStrap

## Installation
1. Clone Repository
``` bash 
git clone https://github.com/MhmdRhayem/Recipe-Management-System
cd Recipe-Management-System
```

2. Install Requirements 
```bash 
pip install requirements.txt
```

3. Environment Setup
Create .env 
```bash 
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage
Start Application 
```bash
python api/app.py
```
Access the web interface at http://localhost:5000.

## API
- **/api/recipes**: Gets all recipe 
- **/api/recipes/<id>**: Gets specific recipe 
- **/api/add**: adds a new recipe 
- **/api/recipes/edit/<id>**: update recipe 
- **/api/ai/suggest**: generate recipe using AI

## AI Integration 
Uses OpenAI's GPT-3.5-turbo through LangChain to generate recipes. The AI:
- Takes a recipe name as input
- Returns structured data with ingredients and instructions
- Automatically populates timing and serving information


