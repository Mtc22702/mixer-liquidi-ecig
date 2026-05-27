const NICOTINE_RATIOS = {
  "70vg": { pg: 30, vg: 70 },
  "50vg": { pg: 50, vg: 50 }
};

const NICOTINE_BOTTLE_VOLUME = 10;
const NICOTINE_STRENGTH = 20;

const DEFAULT_RECIPE = [
  { id: "aroma", volume: 3, pg: 100, vg: 0, nicotine: 0 },
  { id: "nicotine", volume: 10, pg: 30, vg: 70, nicotine: 20 },
  { id: "basePg", volume: 24, pg: 100, vg: 0, nicotine: 0 },
  { id: "baseVg", volume: 23, pg: 0, vg: 100, nicotine: 0 }
];

const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

function parseInput(value) {
  return Number(String(value).replace(",", "."));
}

function calculateRecipe({ finalVolume, targetVg, ingredients }) {
  if (!Number.isFinite(finalVolume) || finalVolume <= 0) {
    throw new Error("La quantita totale deve essere maggiore di zero.");
  }

  if (!Number.isFinite(targetVg) || targetVg < 0 || targetVg > 100) {
    throw new Error("La percentuale VG deve essere compresa tra 0 e 100.");
  }

  const totals = ingredients.reduce(
    (result, ingredient) => {
      const volume = parseInput(ingredient.volume);

      if (!Number.isFinite(volume) || volume < 0) {
        throw new Error("Le quantita dei componenti devono essere positive.");
      }

      result.volume += volume;
      result.pg += volume * (ingredient.pg / 100);
      result.vg += volume * (ingredient.vg / 100);
      result.nicotine += volume * ingredient.nicotine;

      return result;
    },
    { volume: 0, pg: 0, vg: 0, nicotine: 0 }
  );

  if (Math.abs(totals.volume - finalVolume) > 0.011) {
    throw new Error(
      `I componenti devono totalizzare ${formatMl(finalVolume)}.`
    );
  }

  const actualPg = (totals.pg / finalVolume) * 100;
  const actualVg = (totals.vg / finalVolume) * 100;

  return {
    total: round(totals.volume),
    actualPg: round(actualPg),
    actualVg: round(actualVg),
    nicotineStrength: round(totals.nicotine / finalVolume),
    deltaVg: round(actualVg - targetVg),
    isExact: Math.abs(actualVg - targetVg) < 0.01
  };
}

function recommendBases({
  finalVolume,
  targetVg,
  aromaVolume,
  nicotineVolume,
  nicotineRatio
}) {
  const fixedPg = aromaVolume + nicotineVolume * (nicotineRatio.pg / 100);
  const fixedVg = nicotineVolume * (nicotineRatio.vg / 100);
  const residual = Math.max(0, finalVolume - aromaVolume - nicotineVolume);
  const desiredPg = finalVolume * ((100 - targetVg) / 100) - fixedPg;
  const basePg = clamp(desiredPg, 0, residual);

  return {
    basePg: round(basePg),
    baseVg: round(residual - basePg),
    fixedVg: round(fixedVg)
  };
}

function updateFixedVolume(
  ingredients,
  changedId,
  requestedVolume,
  finalVolume
) {
  const result = ingredients.map((ingredient) => ({ ...ingredient }));
  const changed = result.find((ingredient) => ingredient.id === changedId);

  const otherFixed = result.find(
    (ingredient) =>
      ingredient.id !== changedId &&
      (ingredient.id === "aroma" || ingredient.id === "nicotine")
  );

  const maximum = Math.max(0, finalVolume - otherFixed.volume);

  changed.volume = round(clamp(parseInput(requestedVolume) || 0, 0, maximum));

  return result;
}

function updateBaseVolume(
  ingredients,
  changedId,
  requestedVolume,
  finalVolume
) {
  const result = ingredients.map((ingredient) => ({ ...ingredient }));

  const fixedVolume = result
    .filter(
      (ingredient) => ingredient.id === "aroma" || ingredient.id === "nicotine"
    )
    .reduce((total, ingredient) => total + ingredient.volume, 0);

  const available = Math.max(0, finalVolume - fixedVolume);
  const selected = result.find((ingredient) => ingredient.id === changedId);
  const complementId = changedId === "basePg" ? "baseVg" : "basePg";

  const complement = result.find(
    (ingredient) => ingredient.id === complementId
  );

  selected.volume = round(
    clamp(parseInput(requestedVolume) || 0, 0, available)
  );

  complement.volume = round(available - selected.volume);

  return result;
}

function formatNumber(value, maximumFractionDigits = 2) {
  return value.toLocaleString("it-IT", { maximumFractionDigits });
}

function formatMl(value) {
  return `${formatNumber(value)} ml`;
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function initCalculator() {
  const form = document.querySelector("#mixer-form");
  if (!form) return;

  const finalVolumeInput = document.querySelector("#final-volume");
  const targetPresetInput = document.querySelector("#target-preset");
  const targetVgInput = document.querySelector("#target-vg");
  const targetPgOutput = document.querySelector("#target-pg");
  const customTarget = document.querySelector("#custom-target");
  const nicotineRatioInput = document.querySelector("#nicotine-ratio");
  const nicotineBottlesInput = document.querySelector("#nicotine-bottles");
  const nicotineComposition = document.querySelector("#nicotine-composition");
  const result = document.querySelector("#result");

  let ingredients = DEFAULT_RECIPE.map((ingredient) => ({ ...ingredient }));

  function getAmountInput(id) {
    return document.querySelector(`[data-id="${id}"] .amount`);
  }

  function readSettings() {
    const targetVg =
      targetPresetInput.value === "custom"
        ? parseInput(targetVgInput.value)
        : parseInput(targetPresetInput.value);

    return {
      finalVolume: parseInput(finalVolumeInput.value),
      targetVg,
      nicotineRatio: NICOTINE_RATIOS[nicotineRatioInput.value]
    };
  }

  function syncComposition() {
    const { nicotineRatio } = readSettings();

    const nicotine = ingredients.find(
      (ingredient) => ingredient.id === "nicotine"
    );

    nicotine.pg = nicotineRatio.pg;
    nicotine.vg = nicotineRatio.vg;
    nicotine.nicotine = NICOTINE_STRENGTH;

    nicotineComposition.textContent = `${nicotineRatio.vg}% VG / ${nicotineRatio.pg}% PG`;
  }

  function syncInputs() {
    ingredients.forEach((ingredient) => {
      if (ingredient.id === "nicotine") {
        nicotineBottlesInput.value = round(
          ingredient.volume / NICOTINE_BOTTLE_VOLUME
        );
        return;
      }

      getAmountInput(ingredient.id).value = round(ingredient.volume);
    });
  }

  function fitBasesToTarget() {
    const settings = readSettings();

    const aroma = ingredients.find((ingredient) => ingredient.id === "aroma");

    const nicotine = ingredients.find(
      (ingredient) => ingredient.id === "nicotine"
    );

    const bases = recommendBases({
      finalVolume: settings.finalVolume,
      targetVg: settings.targetVg,
      aromaVolume: aroma.volume,
      nicotineVolume: nicotine.volume,
      nicotineRatio: settings.nicotineRatio
    });

    ingredients.find((ingredient) => ingredient.id === "basePg").volume =
      bases.basePg;

    ingredients.find((ingredient) => ingredient.id === "baseVg").volume =
      bases.baseVg;

    syncInputs();
  }

  function render() {
    const settings = readSettings();

    customTarget.hidden = targetPresetInput.value !== "custom";
    targetPgOutput.textContent = formatPercent(100 - settings.targetVg);

    syncComposition();

    try {
      const calculation = calculateRecipe({
        finalVolume: settings.finalVolume,
        targetVg: settings.targetVg,
        ingredients
      });

      const deltaText = calculation.isExact
        ? "Preciso"
        : `${calculation.deltaVg > 0 ? "+" : ""}${formatPercent(
            calculation.deltaVg
          )} VG`;

      result.classList.remove("error");

      document.querySelector("#result-pg").textContent = formatPercent(
        calculation.actualPg
      );

      document.querySelector("#result-vg").textContent = formatPercent(
        calculation.actualVg
      );

      document.querySelector("#result-nicotine").textContent =
        `${formatNumber(calculation.nicotineStrength)} mg/ml`;

      document.querySelector("#result-delta").textContent = deltaText;

      document.querySelector("#result-note").className =
        `result-note${calculation.isExact ? "" : " changed"}`;

      document.querySelector("#result-note").textContent = calculation.isExact
        ? "La composizione corrisponde al rapporto impostato."
        : "Hai modificato la ricetta: il totale e rispettato, mentre il rapporto finale differisce dal riferimento.";
    } catch (error) {
      result.classList.add("error");

      document.querySelector("#result-note").className = "result-note changed";
      document.querySelector("#result-note").textContent = error.message;
    }
  }

  function resetBasesAndRender() {
    syncComposition();
    fitBasesToTarget();
    render();
  }

  document.querySelectorAll(".amount").forEach((input) => {
    input.addEventListener("input", (event) => {
      const changedId = event.target.closest(".component-row").dataset.id;
      const finalVolume = readSettings().finalVolume;

      if (changedId === "aroma" || changedId === "nicotine") {
        ingredients = updateFixedVolume(
          ingredients,
          changedId,
          parseInput(event.target.value),
          finalVolume
        );

        syncComposition();
        fitBasesToTarget();
      } else {
        ingredients = updateBaseVolume(
          ingredients,
          changedId,
          parseInput(event.target.value),
          finalVolume
        );
      }

      syncInputs();
      render();
    });
  });

  nicotineBottlesInput.addEventListener("input", () => {
    const finalVolume = readSettings().finalVolume;

    const aromaVolume = ingredients.find(
      (ingredient) => ingredient.id === "aroma"
    ).volume;

    const maximumBottles =
      Math.floor(
        (Math.max(0, finalVolume - aromaVolume) / NICOTINE_BOTTLE_VOLUME) * 2
      ) / 2;

    const bottles = clamp(
      Math.round((parseInput(nicotineBottlesInput.value) || 0) * 2) / 2,
      0,
      maximumBottles
    );

    nicotineBottlesInput.value = bottles;

    ingredients = updateFixedVolume(
      ingredients,
      "nicotine",
      bottles * NICOTINE_BOTTLE_VOLUME,
      finalVolume
    );

    resetBasesAndRender();
  });

  finalVolumeInput.addEventListener("input", () => {
    const finalVolume = parseInput(finalVolumeInput.value);

    if (!Number.isFinite(finalVolume) || finalVolume <= 0) {
      render();
      return;
    }

    resetBasesAndRender();
  });

  targetVgInput.addEventListener("input", resetBasesAndRender);
  targetPresetInput.addEventListener("change", resetBasesAndRender);
  nicotineRatioInput.addEventListener("change", resetBasesAndRender);

  function adjustInput(button) {
    const input = document.querySelector(`#${button.dataset.target}`);
    const delta = parseInput(button.dataset.delta);
    const minimum = input.min === "" ? -Infinity : parseInput(input.min);
    const maximum = input.max === "" ? Infinity : parseInput(input.max);
    const currentValue = parseInput(input.value) || 0;

    input.value = round(clamp(currentValue + delta, minimum, maximum));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  document.querySelectorAll(".adjust").forEach((button) => {
    button.addEventListener("click", () => {
      adjustInput(button);
    });

    button.addEventListener("touchend", (event) => {
      event.preventDefault();
      adjustInput(button);
    });
  });

  document.querySelectorAll(".component-details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;

      document.querySelectorAll(".component-details").forEach((otherDetail) => {
        if (otherDetail !== detail) otherDetail.open = false;
      });
    });
  });

  form.addEventListener("submit", (event) => event.preventDefault());

  syncInputs();
  resetBasesAndRender();
}

if (typeof document !== "undefined") {
  initCalculator();
}

if (typeof module !== "undefined") {
  module.exports = {
    calculateRecipe,
    recommendBases,
    updateBaseVolume,
    updateFixedVolume
  };
}
