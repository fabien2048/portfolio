import os
import google.generativeai as genai

# Try to find API key in env
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    print("No API key")
    exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-pro')

sample_file = genai.upload_file(path="/Users/fabio/.gemini/antigravity/brain/f209d36a-54cb-4664-89ae-9e202f3ad816/media__1778083605110.png", display_name="Sample")

response = model.generate_content([sample_file, "Describe the structure of this mobile layout in extreme detail. How are the projects presented? Where is the text, where are the images, what shapes are used?"])
print(response.text)
