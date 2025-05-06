import os
import json
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not found in .env file")

llm = ChatOpenAI(openai_api_key=openai_api_key, model="gpt-3.5-turbo", temperature=0.7)

response_schemas = [
    ResponseSchema(name="ingredients", description="List ingredients, separated by newlines"),
    ResponseSchema(name="instructions", description="Cooking instructions, with numbered steps separated by newlines"),
    ResponseSchema(name="prep_time", description="Preparation time in minutes (integer)"),
    ResponseSchema(name="cook_time", description="Cooking time in minutes (integer)"),
    ResponseSchema(name="servings", description="Number of servings (integer)"),
    ResponseSchema(name="status", description="Always set to 'to try'")
]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()

prompt = ChatPromptTemplate.from_template("""
You are an expert recipe generator.

Given the recipe name "{recipe_name}", generate the following structured output in JSON format:
- name : (string including the recipe name)
- ingredients: (string with ingredients separated by newlines)
- instructions: (string with numbered steps separated by newlines)
- prep_time: (integer, in minutes)
- cook_time: (integer, in minutes)
- servings: (integer)
- status: (always "to try")
                                          
Recipe Name: {recipe_name}
""")

def generate_recipe(recipe_name):
    chain = prompt | llm | output_parser
    result = chain.invoke({
        "recipe_name": recipe_name,
    })
    return result