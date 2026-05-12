import json
import re

projects_file = "/Users/fabio/Desktop/folio-fabien/src/data/projects.ts"

alt_texts = {
    "dior-snow": "Dior Snow - Animation 3D cosmétique de luxe - Motion Designer Paris",
    "yves-saint-laurent": "Yves Saint Laurent - Motion design luxe et direction artistique - Freelance Paris",
    "gayelord-hauser-tv": "Gayelord Hauser - Publicité TV animation 3D et packshot - Motion Design Paris",
    "chopard-red-carpet": "Chopard Red Carpet - Motion design joaillerie de luxe et animation 3D - Paris",
    "coca-cola-kanako": "Coca-Cola x Kanako - Animation d'illustration et motion design - Freelance Paris",
    "nina-ricci-harrods": "Nina Ricci x Harrods - Vitrine digitale et animation 3D luxe - Motion Designer Paris",
    "belvedere-night": "Belvedere Night - Animation 3D spiritueux de luxe - Motion Design Freelance",
    "chopard-love": "Chopard Love - Motion design joaillerie et réseaux sociaux luxe - Paris",
    "chaumet-wishes": "Chaumet Wishes - Animation 3D haute joaillerie et luxe - Motion Designer Paris",
    "loreal-gold-obsession": "L'Oréal Gold Obsession - Motion design cosmétique et animation particules - Paris",
    "nissan-leaf": "Nissan Leaf - Animation 3D automobile et motion design industriel - Paris",
    "remy-martin-red-knight": "Remy Martin Red Knight - Motion design spiritueux et teaser de luxe - Paris",
    "parti-pris": "Parti Pris - Animation de logo et identité visuelle motion design - Paris",
    "lancome": "Lancôme - Animation 3D beauté et motion design cosmétiques - Freelance Paris",
    "givenchy": "Givenchy - Moodtape luxe et direction artistique vidéo - Motion Designer Paris",
    "remy-martin-instagram": "Remy Martin - Motion design Instagram et réseaux sociaux luxe - Paris",
    "bourjois-paris": "Bourjois Paris - Motion design cosmétiques et animation maquillage - Paris",
    "dior-joy-makers": "Dior Joy Makers - Animation 3D fête et luxe - Motion Designer Paris",
    "guerlain": "Guerlain Orchidée Impériale - Animation 3D cosmétique et botanique - Paris",
    "cartier": "Cartier - Motion design horlogerie et animation 3D de luxe - Paris",
    "ysl-beauty": "YSL Beauty - Motion design cosmétiques et réseaux sociaux - Freelance Paris",
    "poliakov": "Poliakov - Animation 3D vodka et motion design spiritueux - Paris",
    "ruinart": "Ruinart - Motion design champagne et direction artistique luxe - Paris",
    "atelier-martell": "Atelier Martell - Moodtape cognac et animation 3D luxe - Freelance Paris",
    "charlie-heidsieck-teaser": "Charlie Heidsieck - Teaser champagne et motion design de luxe - Paris",
    "nuxe": "Nuxe - Moodtape cosmétique et animation 3D beauté - Motion Designer Paris",
    "loreal-luxe": "L'Oréal Luxe - Motion design corporate et animation cosmétiques - Paris",
    "nescens": "Nescens - Animation 3D cosméceutique et direction artistique - Suisse",
    "martell-metavers": "Martell Metavers - Animation 3D immersive et luxe numérique - Paris",
    "coty": "Coty - Animation 3D parfums et expérimentation visuelle - Motion Designer Paris"
}

with open(projects_file, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the project block and replace the altText
# This is tricky with plain text, so we'll use a regex for each ID
for pid, alt in alt_texts.items():
    # Find the block starting with "id": "pid" up to the next "altText": "..."
    # We'll use a more robust search
    pattern = rf'("id": "{pid}",[\s\S]*?"altText": ")(.*?)(")'
    content = re.sub(pattern, rf'\1{alt}\3', content)

with open(projects_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated all altText in projects.ts.")
