// Each image array follows the recipe step order; keep it aligned when adding or moving steps.
import { tutorialStageImages as stage } from "./tutorialStageImages.js";

// Each recipe progresses through distinct images; shared actions can reuse photos across recipes.
// Captions distinguish example setups and outcomes from the current action.
const photo = (name, alt, caption) => ({
  image: `${import.meta.env.BASE_URL}images/tutorials/${name}.jpg`,
  imageAlt: alt,
  imageCaption: caption,
});

const existing = (name, alt, caption) => ({
  image: `${import.meta.env.BASE_URL}images/recipes/${encodeURIComponent(name)}-landscape.png`,
  imageAlt: alt,
  imageCaption: caption,
});

const station = photo("prepare-station", "Empty glass containers, string, pencil, spoon and safety goggles on a mint work surface", "Set up a clear workspace and gather the materials listed for your project.");
const mix = photo("mix-solution", "A spoon stirring white granules into water in a heat-safe glass bowl", "Stir to dissolve the ingredients. Follow your recipe's quantities and ask an adult to handle hot water.");
const string = photo("string-jar", "Cotton string and a paper clip suspended in clear water from a pencil across a jar", "Keep the string hanging freely, away from the sides and bottom.");
const saltGrowth = photo("salt-growth", "Fine white salt crystals developing on a cotton string suspended inside a glass jar", "Look for tiny crystals on the string and compare their growth each day.");
const sugarSkewer = photo("sugar-skewer", "A damp wooden skewer coated in sugar granules on a plate beside a glass of water", "Coat the wet skewer with sugar, then let it dry completely before putting it in syrup.");
const bridge = photo("cave-bridge", "Two jars joined by a drooping cotton cord above a plate, with white deposits on the cord", "Look for white deposits along the cord and new formations where the drops fall.");
const caveStation = photo("cave-station", "Two empty jars with a plate between them and loose cord ready to assemble", "Place the two jars apart with a plate between them, then cut a cord long enough to reach into both.");
const paint = photo("crystal-paint", "White crystalline stars and snowflakes on black paper beside a brush and a bowl", "Once dry, look for sparkling crystals and compare thick and thin brushstrokes.");
const shells = photo("shell-bath", "A seashell in a shallow glass bowl with tiny white crystals on its ridges", "Look for crystals on the shell, then ask an adult to help lift it out with tweezers and let it dry.");
const comparison = photo("compare-jars", "Three matching jars with strings, one open and two partly covered with paper", "Comparison setup: change the paper cover while keeping the other conditions the same.");
const model = photo("model-cave", "A handmade cardboard and clay cave decorated with small white crystals", "Photograph your finished cave and compare it with your original sketch.");
const detective = photo("detective-kit", "A magnifying glass beside dishes of salt, sugar and ice, with a notebook", "Compare familiar samples and record the shapes you can see.");
const underwater = photo("underwater-garden", "Branching orange, teal and blue mineral formations inside a glass beaker", "Example chemical garden. Observe your teacher's demonstration without handling the materials.");
const blueSolution = photo("blue-solution", "A small blue seed crystal suspended by a thread in blue solution inside a beaker", "Example growing setup. Your teacher prepares and handles the solution.");
const candy = existing("Crystal photograph (4)", "Golden sugar crystals growing on a stick above a jar", "Ask an adult to help lift out the grown candy, let the syrup drip off, and leave it to dry.");
const seeds = existing("Crystal photograph (3)", "Small clear crystals in a shallow glass dish", "Look for small crystals with a clear, regular shape.");
const alum = existing("Crystal photograph (7)", "A grown clear crystal suspended above a glass jar", "Ask an adult to remove the grown crystal, then measure it and compare it with your starting seed.");
const garden = existing("crystal_06", "Pale green crystals in a shallow glass dish", "Example crystals in a dish. Examine your own garden's shapes and clusters.");
const blueCrystals = existing("Crystal photograph (5)", "A deep blue crystal cluster on a pale blue background", "Example blue crystal shapes. Observe the prepared sample without touching it.");

export const tutorialImages = {
  "salt-string-magic": [station, mix, string, saltGrowth],
  "rock-candy-sticks": [
    sugarSkewer,
    mix, stage["candy-setup"], stage["candy-early"], candy,
  ],
  "mini-crystal-cave": [caveStation, mix, stage["bridge-setup"], bridge],
  "crystal-painting": [stage["paint-station"], mix, stage["paint-action"], paint],
  "giant-crystal-quest": [station, seeds, stage["choose-seed"], stage["alum-growing"], alum],
  "sparkling-seashells": [stage["plain-shells"], mix, stage["shell-soaking"], shells],
  "crystal-garden": [station, mix, stage["garden-cooling"], garden],
  "crystal-lab-challenge": [stage["lab-empty"], stage["lab-filled"], comparison, stage["lab-record"], stage["lab-results"]],
  "crystal-cave-creator": [stage["cave-sketch"], stage["cave-build"], mix, stage["cave-decorate"], model],
  "crystal-detective": [detective, stage["detective-search"], stage["detective-examine"], stage["detective-report"]],
  "colour-change-chemistry": [blueCrystals, stage["colour-white"], stage["colour-return"], stage["colour-report"]],
  "underwater-garden": [stage["underwater-ready"], stage["underwater-early"], underwater, stage["underwater-report"]],
  "blue-crystal-lab": [blueCrystals, stage["blue-liquid"], blueSolution, stage["blue-growth"], {
    image: `${import.meta.env.BASE_URL}images/friend-mika-crystals.png`,
    imageAlt: "Large blue crystals with smaller crystals in the foreground",
    imageCaption: "Examine the final sample's shapes and compare it with your starting observations.",
  }],
};
