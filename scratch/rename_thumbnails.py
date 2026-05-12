import os
import json
import re

# Directory of thumbnails
thumb_dir = "/Users/fabio/Desktop/folio-fabien/public/images/projects/thumbnails"
projects_file = "/Users/fabio/Desktop/folio-fabien/src/data/projects.ts"

# Mapping of old names to new SEO names
mapping = {
    "atelier-martell-cover.webp": "atelier-martell-cognac-motion-design.webp",
    "belvedere-night-cover.webp": "belvedere-night-vodka-animation-3d.webp",
    "bourjois-paris-cover.webp": "bourjois-paris-makeup-motion-design.webp",
    "cartier-cover.webp": "cartier-horlogerie-motion-design-luxe.webp",
    "charlie-heidsieck-teaser-cover.webp": "charlie-heidsieck-champagne-motion-design.webp",
    "chaumet-wishes-cover.webp": "chaumet-wishes-joaillerie-animation.webp",
    "chopard-love-cover.webp": "chopard-love-joaillerie-motion-design.webp",
    "chopard-red-carpet-cover.jpg": "chopard-red-carpet-luxe-motion-design.jpg",
    "coca-cola-kanako-cover.webp": "coca-cola-kanako-animation-paris.webp",
    "coty-cover.png": "coty-parfums-motion-design-paris.png",
    "dior-joy-makers-cover.webp": "dior-joy-makers-luxe-animation.webp",
    "dior-snow-cover.webp": "dior-snow-cosmetiques-motion-design.webp",
    "gayelord-hauser-tv-cover.webp": "gayelord-hauser-motion-design-tv.webp",
    "givenchy-cover.webp": "givenchy-luxe-motion-design-paris.webp",
    "guerlain-cover.webp": "guerlain-cosmetiques-animation-3d.webp",
    "lancome-cover.webp": "lancome-beauty-motion-design-paris.webp",
    "loreal-gold-obsession-cover.webp": "loreal-gold-obsession-motion-design.webp",
    "loreal-luxe-cover.png": "loreal-luxe-motion-design-freelance.png",
    "martell-metavers-cover.png": "martell-metavers-luxe-3d-animation.png",
    "nescens-cover.png": "nescens-cosmetiques-animation-suisse.png",
    "nina-ricci-harrods-cover.webp": "nina-ricci-harrods-luxe-animation.webp",
    "nissan-leaf-cover.webp": "nissan-leaf-automobile-motion-design.webp",
    "nuxe-cover.jpg": "nuxe-cosmetiques-motion-design-paris.jpg",
    "parti-pris-cover.webp": "parti-pris-agence-motion-design.webp",
    "poliakov-cover.webp": "poliakov-vodka-animation-3d-paris.webp",
    "remy-martin-instagram-cover.webp": "remy-martin-cognac-social-media-motion.webp",
    "remy-martin-red-knight-cover.webp": "remy-martin-red-knight-motion-design.webp",
    "ruinart-cover.jpg": "ruinart-champagne-luxe-motion-design.jpg",
    "ysl-beauty-cover.webp": "ysl-beauty-motion-design-freelance.webp",
    "yves-saint-laurent-cover.webp": "yves-saint-laurent-motion-design-luxe.webp"
}

# 1. Rename files
for old_name, new_name in mapping.items():
    old_path = os.path.join(thumb_dir, old_name)
    new_path = os.path.join(thumb_dir, new_name)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"Renamed: {old_name} -> {new_name}")

# 2. Update projects.ts
with open(projects_file, 'r', encoding='utf-8') as f:
    content = f.read()

for old_name, new_name in mapping.items():
    content = content.replace(f"/images/projects/thumbnails/{old_name}", f"/images/projects/thumbnails/{new_name}")

with open(projects_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated projects.ts with new image paths.")
