const {
  calculateRecipe,
  recommendBases,
  updateBaseVolume,
  updateFixedVolume
} = require("./mixer.js");
const ingredients = [
  { id: "aroma", volume: 3.5, pg: 100, vg: 0, nicotine: 0 },
  { id: "nicotine", volume: 25, pg: 30, vg: 70, nicotine: 20 },
  { id: "basePg", volume: 16.5, pg: 100, vg: 0, nicotine: 0 },
  { id: "baseVg", volume: 15, pg: 0, vg: 100, nicotine: 0 }
];
console.log(calculateRecipe({ finalVolume: 60, targetVg: 50, ingredients }));
console.log(
  recommendBases({
    finalVolume: 60,
    targetVg: 50,
    aromaVolume: 3.5,
    nicotineVolume: 25,
    nicotineRatio: { pg: 30, vg: 70 }
  })
);
