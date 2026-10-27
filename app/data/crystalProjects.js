import { additionalCrystalProjects } from "./additionalCrystalProjects.js";

// Recipe content is kept separate from the cards and detail page presentation.
export const saltStringMagic = {
  id: "salt-string-magic",
  name: "Salt string magic",
  difficulty: "Easy",
  time: "5–7 days",
  price: "0–25 kr",
  introduction: "Turn ordinary salt into sparkling crystals! Hang a string in salty water and watch tiny crystals appear as the water slowly evaporates.",
  materials: ["Table salt", "Water (250 ml)", "Heat-resistant glass jar", "Cotton string", "Pencil", "Paper clip", "Spoon", "Saucepan"],
  scienceTitle: "Tiny cubes, big magic!",
  science: "Salt crystals grow in cube-shaped patterns because their tiny particles fit together in a repeating arrangement.",
  observation: "Look closely: Can you spot any square faces?",
  completionMessage: "You did it! Your string is covered in tiny crystals. Look at your photos to see how they grew.",
  steps: [
    {
      title: "Get your crystal station ready",
      needsAdult: true,
      safetyMessage: "Ask an adult to help with hot water.",
      instructions: [
        "Find a flat surface where your experiment can stay undisturbed.",
        "Gather all your materials.",
        "Tie a paper clip to one end of the string and the other end to a pencil.",
      ],
    },
    {
      title: "Make super salty water",
      needsAdult: true,
      safetyMessage: "Ask an adult to help with hot water.",
      instructions: [
        "Ask an adult to heat 250 ml of water.",
        "Add salt one spoonful at a time, stirring until dissolved.",
        "Keep adding until no more salt dissolves.",
        "Let the solution cool enough for safe handling.",
      ],
    },
    {
      title: "Hang your string",
      needsAdult: true,
      safetyMessage: "Ask an adult to help with hot water.",
      instructions: [
        "Ask an adult to pour the salty solution into the jar.",
        "Place your pencil across the jar with the string hanging into the water.",
        "Make sure the string hangs freely.",
        "Leave the jar in a safe place with a loose paper cover.",
      ],
    },
    {
      title: "Watch your crystals grow",
      instructions: [
        "Check your string once a day without moving the jar.",
        "Look for tiny white crystals appearing.",
        "Take a photo each day to track their growth.",
        "When you're finished, ask an adult to remove the string and let it dry.",
      ],
    },
  ],
  safety: "An adult must prepare and pour the hot water. Never taste the solution or crystals. Keep your experiment away from food and wash your hands afterwards.",
};

export const projectSections = [
  { name: "Easy", description: "Small starts. Amazing discoveries." },
  { name: "Medium", description: "Try a new shape or a splash of colour." },
  { name: "Hard", description: "More patience. More to investigate." },
].map(section => ({
  ...section,
  recipes: [saltStringMagic, ...additionalCrystalProjects].filter(recipe => recipe.difficulty === section.name),
}));

export function findCrystalProject(id) {
  return projectSections.flatMap(section => section.recipes).find(recipe => recipe.id === id);
}
