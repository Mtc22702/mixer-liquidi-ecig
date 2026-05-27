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
  const normalized = String(value).trim().replace(",", ".");

  if (normalized === "" || normalized === "." || normalized === "-") {
    return NaN;
  }

  return Number(normalized);
}

function roundToStep(value, step) {
  return round(Math.round(value / step) * step);
}

function formatInputValue(value, maximumFractionDigits = 1) {
  return value.toLocaleString("it-IT", {
    maximumFractionDigits,
    useGrouping: false
  });
}

function setInputValue(input, value, maximumFractionDigits = 1) {
  input.value = formatInputValue(value, maximumFractionDigits);
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
  const ratioVisualVg = document.querySelector("#ratio-visual-vg");
  const stickyVg = document.querySelector("#sticky-vg");
  const stickyPg = document.querySelector("#sticky-pg");
  const stickyDeltaEl = document.querySelector("#sticky-delta");
  const stickyRatioVg = document.querySelector("#sticky-ratio-vg");
  const stickyNicotine = document.querySelector("#sticky-nicotine");
  const stickyNoteEl = document.querySelector("#sticky-note");

  const BTL_LAYERS = ["baseVg", "basePg", "nicotine", "aroma"];
  const btlLiqEls = Object.fromEntries(
    BTL_LAYERS.map((id) => [id, document.querySelector(`#btl-liq-${id}`)])
  );

  let ingredients = DEFAULT_RECIPE.map((ingredient) => ({ ...ingredient }));

  function updateBottleFill() {
    const BODY_BOTTOM = 208;
    const BODY_HEIGHT = 160;
    const totalVol = ingredients.reduce((s, i) => s + (i.volume || 0), 0);
    const totalFillH =
      totalVol > 0 ? Math.min(totalVol / 100, 1) * BODY_HEIGHT : 0;
    let currentBottom = BODY_BOTTOM;
    for (const id of BTL_LAYERS) {
      const el = btlLiqEls[id];
      if (!el) continue;
      const ing = ingredients.find((i) => i.id === id);
      const vol = ing && Number.isFinite(ing.volume) ? ing.volume : 0;
      const segH = totalVol > 0 ? (vol / totalVol) * totalFillH : 0;
      const yVal = currentBottom - segH;
      el.setAttribute("y", yVal);
      el.setAttribute("height", segH);
      el.style.y = yVal + "px";
      el.style.height = segH + "px";
      currentBottom -= segH;
    }
  }

  function flashEl(id) {
    const el = document.querySelector(id);
    if (!el) return;
    el.classList.remove("value-flash");
    void el.offsetWidth;
    el.classList.add("value-flash");
  }

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
        if (document.activeElement !== nicotineBottlesInput) {
          setInputValue(
            nicotineBottlesInput,
            roundToStep(ingredient.volume / NICOTINE_BOTTLE_VOLUME, 0.5),
            1
          );
        }
        return;
      }

      const input = getAmountInput(ingredient.id);

      if (document.activeElement !== input) {
        setInputValue(input, roundToStep(ingredient.volume, 0.1), 1);
      }
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

    updateBottleFill();

    customTarget.hidden = targetPresetInput.value !== "custom";
    targetPgOutput.textContent = Number.isFinite(settings.targetVg)
      ? formatPercent(100 - settings.targetVg)
      : "-";

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

      flashEl("#result-vg-box");
      flashEl("#result-pg-box");

      if (ratioVisualVg) ratioVisualVg.style.width = calculation.actualVg + "%";

      if (stickyVg) stickyVg.textContent = formatPercent(calculation.actualVg);
      if (stickyPg) stickyPg.textContent = formatPercent(calculation.actualPg);
      if (stickyDeltaEl) {
        stickyDeltaEl.textContent = deltaText;
        stickyDeltaEl.className =
          "sticky-delta " + (calculation.isExact ? "sticky-ok" : "sticky-warn");
      }
      if (stickyRatioVg) stickyRatioVg.style.width = calculation.actualVg + "%";
      if (stickyNicotine)
        stickyNicotine.textContent = `${formatNumber(calculation.nicotineStrength)} mg/ml`;
      if (stickyNoteEl) {
        stickyNoteEl.textContent = calculation.isExact
          ? "Composizione precisa"
          : "Rapporto differisce dal target";
        stickyNoteEl.className =
          "sticky-note-text" + (calculation.isExact ? "" : " changed");
      }
    } catch (error) {
      result.classList.add("error");

      document.querySelector("#result-note").className = "result-note changed";
      document.querySelector("#result-note").textContent = error.message;

      if (stickyNoteEl) {
        stickyNoteEl.textContent = error.message;
        stickyNoteEl.className = "sticky-note-text error";
      }
    }
  }

  function resetBasesAndRender() {
    const { finalVolume } = readSettings();
    if (Number.isFinite(finalVolume) && finalVolume > 0) {
      const parsedBottles = parseInput(nicotineBottlesInput.value);
      if (Number.isFinite(parsedBottles) && parsedBottles >= 0) {
        const aromaVol = ingredients.find((i) => i.id === "aroma").volume;
        const maxBottles =
          Math.floor(
            (Math.max(0, finalVolume - aromaVol) / NICOTINE_BOTTLE_VOLUME) * 2
          ) / 2;
        const bottles = clamp(roundToStep(parsedBottles, 0.5), 0, maxBottles);
        ingredients = updateFixedVolume(
          ingredients,
          "nicotine",
          bottles * NICOTINE_BOTTLE_VOLUME,
          finalVolume
        );
      }
    }
    syncComposition();
    fitBasesToTarget();
    render();
  }

  function applyAmountChange(input) {
    const changedId = input.closest(".component-row").dataset.id;
    const finalVolume = readSettings().finalVolume;
    const parsedValue = parseInput(input.value);

    if (!Number.isFinite(parsedValue)) {
      render();
      return;
    }

    const value = roundToStep(parsedValue, 0.1);

    if (changedId === "aroma" || changedId === "nicotine") {
      ingredients = updateFixedVolume(
        ingredients,
        changedId,
        value,
        finalVolume
      );

      syncComposition();
      fitBasesToTarget();
    } else {
      ingredients = updateBaseVolume(
        ingredients,
        changedId,
        value,
        finalVolume
      );
    }

    syncInputs();
    render();
  }

  document.querySelectorAll(".amount").forEach((input) => {
    input.addEventListener("blur", () => {
      applyAmountChange(input);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        input.blur();
      }
    });
  });

  function applyNicotineBottlesChange() {
    const finalVolume = readSettings().finalVolume;

    const aromaVolume = ingredients.find(
      (ingredient) => ingredient.id === "aroma"
    ).volume;

    const maximumBottles =
      Math.floor(
        (Math.max(0, finalVolume - aromaVolume) / NICOTINE_BOTTLE_VOLUME) * 2
      ) / 2;

    const parsedBottles = parseInput(nicotineBottlesInput.value);
    const bottles = clamp(
      roundToStep(Number.isFinite(parsedBottles) ? parsedBottles : 0, 0.5),
      0,
      maximumBottles
    );

    setInputValue(nicotineBottlesInput, bottles, 1);

    ingredients = updateFixedVolume(
      ingredients,
      "nicotine",
      bottles * NICOTINE_BOTTLE_VOLUME,
      finalVolume
    );

    resetBasesAndRender();
  }

  nicotineBottlesInput.addEventListener("blur", applyNicotineBottlesChange);
  nicotineBottlesInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      nicotineBottlesInput.blur();
    }
  });

  function applyFinalVolumeChange() {
    const parsedFinalVolume = parseInput(finalVolumeInput.value);

    if (!Number.isFinite(parsedFinalVolume) || parsedFinalVolume <= 0) {
      render();
      return;
    }

    const finalVolume = Math.round(parsedFinalVolume);
    finalVolumeInput.value = String(finalVolume);

    resetBasesAndRender();
  }

  finalVolumeInput.addEventListener("blur", applyFinalVolumeChange);
  finalVolumeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      finalVolumeInput.blur();
    }
  });

  function applyTargetVgChange() {
    const parsedTarget = parseInput(targetVgInput.value);

    if (!Number.isFinite(parsedTarget)) {
      render();
      return;
    }

    setInputValue(
      targetVgInput,
      clamp(roundToStep(parsedTarget, 0.1), 0, 100),
      1
    );
    resetBasesAndRender();
  }

  targetVgInput.addEventListener("blur", applyTargetVgChange);
  targetVgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      targetVgInput.blur();
    }
  });

  targetPresetInput.addEventListener("change", resetBasesAndRender);
  nicotineRatioInput.addEventListener("change", resetBasesAndRender);

  function adjustInput(button) {
    const input = document.querySelector(`#${button.dataset.target}`);
    const delta = parseInput(button.dataset.delta);
    const minimum = input.min === "" ? -Infinity : parseInput(input.min);
    const maximum = input.max === "" ? Infinity : parseInput(input.max);
    const currentValue = parseInput(input.value) || 0;

    const step =
      input.id === "final-volume"
        ? 10
        : input.id === "nicotine-bottles"
          ? 0.5
          : 0.1;

    const nextValue = roundToStep(
      clamp(currentValue + delta, minimum, maximum),
      step
    );

    if (input.id === "final-volume") {
      input.value = String(Math.max(1, Math.round(nextValue)));
    } else {
      setInputValue(input, nextValue, 1);
    }

    if (input.classList.contains("amount")) {
      applyAmountChange(input);
    } else if (input === nicotineBottlesInput) {
      applyNicotineBottlesChange();
    } else if (input === finalVolumeInput) {
      applyFinalVolumeChange();
    } else if (input === targetVgInput) {
      applyTargetVgChange();
    }
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
