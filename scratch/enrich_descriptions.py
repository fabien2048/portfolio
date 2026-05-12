import json
import re

file_path = "/Users/fabio/Desktop/folio-fabien/src/data/projects.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract the array content
match = re.search(r"export const projects = (\[.*\]);", content, re.DOTALL)
if not match:
    print("Could not find projects array")
    exit(1)

projects_json = match.group(1)
# Clean up some TS specific things if needed, but it looks like standard JSON
# Wait, it might not be perfect JSON if it has trailing commas or unquoted keys.
# Let's use a regex replacement instead of JSON parsing if possible, or just evaluate it.

# Actually, I can just use a simple regex replacement for the "description" fields.
# I will enrich the descriptions for the first few major projects (dior-backstage, dior-snow, yves-saint-laurent, chopard-red-carpet)

replacements = {
    '"dior-backstage"': {
        "old_desc": '"Pour Dior Backstage, la maison célèbre l\'énergie brute et suspendue du défilé. Nous avons conçu une immersion cinétique capturant la précision du geste et le souffle de la matière, mêlant animation 3d haute couture et approche documentaire, là où le chaos maîtrisé des coulisses rencontre l\'exigence d\'une restitution visuelle chirurgicale. Une véritable référence en motion design luxe paris."',
        "new_desc": '"Pour Dior Backstage, la maison célèbre l\'énergie brute et suspendue du défilé. En tant que directeur artistique et <a href=\\"/motion-designer-freelance-paris\\" class=\\"underline hover:text-black\\">motion designer freelance à Paris</a>, j\'ai conçu une immersion cinétique capturant la précision du geste et le souffle de la matière.\\n\\nCe projet mêle <a href=\\"/blog/motion-design-marques-luxe\\" class=\\"underline hover:text-black\\">animation 3D pour marques de luxe</a> et approche documentaire, là où le chaos maîtrisé des coulisses rencontre l\'exigence d\'une restitution visuelle chirurgicale. Chaque frame a été pensée pour refléter l\'intensité et le rythme effréné des backstages, mettant en valeur les textures uniques des produits Dior.\\n\\nLa collaboration étroite avec les équipes créatives a permis de définir une <a href=\\"/blog/direction-artistique-video-paris\\" class=\\"underline hover:text-black\\">direction artistique vidéo</a> percutante, renforçant le positionnement avant-gardiste de la ligne Dior Backstage. Une véritable référence en motion design luxe parisien, démontrant comment l\'image animée peut transcender la perception d\'une gamme de maquillage professionnel."'
    },
    '"dior-snow"': {
         "old_desc": '"Avec Dior Snow, la quête de clarté devient une exploration de la lumière glacée. Pour incarner cette technologie de pointe, nous avons sculpté des visuels explorant la transparence et la réfraction. Cette animation 3d cosmétiques transforme le froid en une expérience tactile et rayonnante, affirmant notre expertise en motion design produits beauté."',
         "new_desc": '"Avec Dior Snow, la quête de clarté devient une exploration de la lumière glacée. Pour incarner cette technologie de pointe, j\'ai sculpté des visuels explorant la transparence, la réfraction et la pureté cristalline. En tant qu\'expert en <a href=\\"/guide/animation-3d-cosmetiques\\" class=\\"underline hover:text-black\\">animation 3D cosmétiques</a>, le défi était de matérialiser la sensation de fraîcheur absolue.\\n\\nCette campagne transforme le froid en une expérience tactile et rayonnante, affirmant mon expertise en <a href=\\"/luxe-beaute-cosmetiques\\" class=\\"underline hover:text-black\\">motion design pour produits de beauté</a>. La modélisation minutieuse des textures et la gestion complexe de la lumière permettent de sublimer la formulation innovante du produit.\\n\\nTravailler sur ce projet a nécessité une <a href=\\"/direction-artistique\\" class=\\"underline hover:text-black\\">direction artistique</a> rigoureuse, où chaque micro-détail contribue à l\'élévation du produit. Ce type de réalisation illustre parfaitement la valeur ajoutée d\'un <a href=\\"/motion-designer-freelance-paris\\" class=\\"underline hover:text-black\\">motion designer freelance</a> spécialisé dans le secteur du luxe et de la cosmétique haut de gamme."'
    },
    '"yves-saint-laurent"': {
        "old_desc": '"Pour The Street and I, Yves Saint Laurent revendique une attitude urbaine et subversive. Nous avons orchestré un montage aux éclats néons et glitchs sensuels, un parfait exemple de direction artistique video paris, où la typographie tranche l\'obscurité pour incarner une féminité rock qui refuse d\'être sage via un motion design process dynamique."',
        "new_desc": '"Pour The Street and I, Yves Saint Laurent revendique une attitude urbaine et subversive. J\'ai orchestré un montage rythmé aux éclats néons et glitchs sensuels, un parfait exemple de <a href=\\"/blog/direction-artistique-video-paris\\" class=\\"underline hover:text-black\\">direction artistique vidéo à Paris</a>.\\n\\nDans cette création, la typographie tranche l\'obscurité pour incarner une féminité rock qui refuse d\'être sage. L\'utilisation d\'un <a href=\\"/article/qu-est-ce-qu-une-moodtape\\" class=\\"underline hover:text-black\\">processus créatif basé sur la moodtape</a> a permis de définir rapidement cette ambiance électrique et rebelle, propre à l\'ADN d\'YSL Beauté.\\n\\nCe projet démontre l\'importance d\'un <a href=\\"/blog/motion-design-vs-animation\\" class=\\"underline hover:text-black\\">motion design impactant</a> pour capter l\'attention sur les réseaux sociaux. En collaborant avec une approche de <a href=\\"/motion-designer-freelance-paris\\" class=\\"underline hover:text-black\\">motion designer freelance expert</a>, la marque s\'assure une communication visuelle audacieuse, en parfaite adéquation avec sa cible jeune et branchée."'
    }
}

for project_id, data in replacements.items():
    if data["old_desc"] in content:
        content = content.replace(data["old_desc"], data["new_desc"])
        print(f"Updated description for {project_id}")
    else:
        print(f"Could not find old description for {project_id}")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Finished updating projects.ts")
