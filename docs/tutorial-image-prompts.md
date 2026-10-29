# Tutorial image sources

Stage-specific replacements are documented with their exact prompts in
`tutorial-step-image-prompts.json`. They distinguish preparation, setup,
early growth, observation and finished results. A tutorial may reuse a shared
process photo from another recipe, but it must not repeat an image between
its own steps. Check the images for distinct stages when updating a tutorial.

The additional **cave-station** image used this prompt:

> One high-resolution landscape 3:2 educational process photograph for CRYST. Soft mint/lavender studio product photography, realistic glass and materials, gentle diffuse light, close framing, no labels, no frame, no people. Show preparation only: exactly two completely EMPTY transparent glass jars spaced apart on a pastel mint tabletop, empty white plate between them, loose length of thick cotton cord coiled on tabletop in front of jars, a spoon and small bowl of white baking soda nearby. Cord not attached yet. No water or crystals.

Generated with the built-in image_gen tool. Final optimized assets live in
`public/images/tutorials/` as full-resolution 1536 × 1024 JPEGs at quality 94. Existing photographs are reused
from the high-resolution `public/images/recipes/` versions; the per-step assignments, alt text and captions
are in `app/data/tutorialImages.js`.

## Prompt set

For the ten process photos below and the two additional salt/sugar photos,
each prompt uses this shared prefix followed by its subject:

> One landscape 3:2 educational tutorial photograph for CRYST. Soft pastel mint/lavender studio product photography, realistic glass and real materials, gentle diffused lighting, minimal clean seamless tabletop, closely framed entire setup visible. No text, logos, collage, people or hands. Subject:

- **prepare-station:** Neatly arranged empty clear glass jar, shallow glass dish, cotton string, pencil, spoon, safety goggles and white salt in a bowl, on mint tabletop. All containers empty.
- **cave-bridge:** Two clear glass jars of transparent liquid, one thick cotton cord bridges the jars with ends submerged and middle drooping over a white plate between jars. Fine white crystalline deposits on cord.
- **crystal-paint:** Black paper flat on lavender tabletop, brush and glass bowl of clear solution beside it, white crystalline snowflake and star brushstroke patterns drying on paper.
- **shell-bath:** Scallop seashell lying in shallow clear glass bowl with a little transparent water and fine white salt crystals forming on shell ridges; plain shell beside bowl.
- **compare-jars:** Three identical clear glass jars in a row with same clear liquid levels, identical cotton strings suspended from pencils. First open, second half-covered with paper, third mostly covered with paper leaving a small gap. No writing.
- **model-cave:** Small handmade open-front cardboard shoebox cave model with grey air dry clay rocks and small white crystal clusters glued inside, paintbrush and unlabelled child safe glue bottle beside it.
- **detective-kit:** Magnifying glass beside three small glass dishes containing white table salt grains, white sugar grains, and clear ice cube. Blank observation notebook and pencil nearby.
- **underwater-garden:** Single transparent laboratory beaker of clear water and delicate orange teal blue branching mineral precipitate tubes growing from base. Realistic chemical garden demonstration.
- **blue-solution:** Clear laboratory beaker with transparent blue solution and a tiny blue seed crystal on thin thread suspended from glass rod across rim.
- **colour-change:** Two shallow white ceramic laboratory dishes, one with fine blue crystalline granules, other with white dry powder, glass dropper with water droplet above white powder. No heat.
- **salt-growth:** A transparent glass jar with a yellow pencil across rim, white cotton string hanging down into transparent water with many fine white cubic salt crystals growing on string above and near water line, tiny crystalline deposits around jar rim. Still delicate growth, not a large rock or golden candy.
- **sugar-skewer:** A bare wooden skewer lying across a small white plate of white granulated sugar, thin even coating of sugar granules adhering to the damp skewer. Small glass of water beside plate. No finished rock candy.

The first two photographs used this shared prefix:

> Generate one landscape 3:2 educational tutorial photograph for CRYST crystal-growing app. Style: soft pastel studio product photography, realistic glass, gentle diffused light, clean uncluttered composition, tactile real materials, pale mint/lavender seamless background, close framing, entire setup visible, no typography, no logos, no collage. Subject:

- **mix-solution:** A clear heat-safe glass bowl of transparent water on a pale lavender tabletop, a stainless spoon stirring white granules dissolving in the water, small dish of white salt nearby. No hand, no stove, no steam. Close-up illustrating stirring a dissolved crystal solution.
- **string-jar:** A transparent glass jar filled two thirds with clear water, a yellow wooden pencil resting horizontally across the rim, a single white cotton string tied to pencil and hanging freely into water ending above bottom, a small metal paper clip attached to string bottom. No crystals yet. Pale lavender background.

These are illustrative process photographs; captions identify example outcomes
and shared equipment setups rather than promising an identical result.
