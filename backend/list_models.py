import google.generativeai as genai
import os
import dotenv
import sys

dotenv.load_dotenv()

api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    print("Error: GOOGLE_API_KEY not found in environment.")
    exit(1)

genai.configure(api_key=api_key)

with open('models_output.txt', 'w') as f:
    f.write(f"Library Version: {genai.__version__}\n")
    f.write("Available Models:\n")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"{m.name}\n")
    except Exception as e:
        f.write(f"Error listing models: {e}\n")
