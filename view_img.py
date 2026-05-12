from PIL import Image
import os

img = Image.open('/Users/fabio/.gemini/antigravity/brain/f209d36a-54cb-4664-89ae-9e202f3ad816/media__1778083605110.png')
img = img.convert('RGB')
img.thumbnail((80, 80)) # resize to fit terminal

chars = " .:-=+*#%@"
out = ""
for y in range(img.height):
    for x in range(img.width):
        r, g, b = img.getpixel((x, y))
        brightness = (r + g + b) / 3
        char_idx = int((brightness / 255) * (len(chars) - 1))
        out += chars[char_idx] * 2
    out += "\n"

print(out)
