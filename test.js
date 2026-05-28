const {
  calculateRecipe,
  recommendBases,
  updateBaseVolume,
  updateFixedVolume
} = require("./mixer.js");

const assert = require("node:assert/strict");

const ingredients = [
  { id: "aroma", volume: 3.5, pg: 100, vg: 0, nicotine: 0 },
  { id: "nicotine", volume: 25, pg: 30, vg: 70, nicotine: 20 },
  { id: "basePg", volume: 16.5, pg: 100, vg: 0, nicotine: 0 },
  { id: "baseVg", volume: 15, pg: 0, vg: 100, nicotine: 0 }
];

assert.deepEqual(
  calculateRecipe({ finalVolume: 60, targetVg: 50, ingredients }),
  {
    total: 60,
    actualPg: 45.83,
    actualVg: 54.17,
    nicotineStrength: 8.33,
    deltaVg: 4.17,
    isExact: false
  }
);

assert.deepEqual(
  recommendBases({
    finalVolume: 60,
    targetVg: 50,
    aromaVolume: 3.5,
    nicotineVolume: 25,
    nicotineRatio: { pg: 30, vg: 70 }
  }),
  { basePg: 19, baseVg: 12.5, fixedVg: 17.5 }
);

assert.deepEqual(
  updateBaseVolume(
    [
      { id: "aroma", volume: 3, pg: 100, vg: 0, nicotine: 0 },
      { id: "nicotine", volume: 10, pg: 30, vg: 70, nicotine: 20 },
      { id: "basePg", volume: 24, pg: 100, vg: 0, nicotine: 0 },
      { id: "baseVg", volume: 23, pg: 0, vg: 100, nicotine: 0 }
    ],
    "basePg",
    30,
    60
  ).map(({ id, volume }) => ({ id, volume })),
  [
    { id: "aroma", volume: 3 },
    { id: "nicotine", volume: 10 },
    { id: "basePg", volume: 30 },
    { id: "baseVg", volume: 17 }
  ]
);

assert.deepEqual(
  updateFixedVolume(
    [
      { id: "aroma", volume: 3, pg: 100, vg: 0, nicotine: 0 },
      { id: "nicotine", volume: 10, pg: 30, vg: 70, nicotine: 20 },
      { id: "basePg", volume: 24, pg: 100, vg: 0, nicotine: 0 },
      { id: "baseVg", volume: 23, pg: 0, vg: 100, nicotine: 0 }
    ],
    "aroma",
    999,
    60
  ).find((ingredient) => ingredient.id === "aroma").volume,
  50
);

assert.throws(
  () => calculateRecipe({ finalVolume: 0, targetVg: 50, ingredients }),
  /maggiore di zero/
);

console.log("All mixer tests passed");
