const NICOTINE_RATIOS = {
  "70vg": { pg: 30, vg: 70 },
  "50vg": { pg: 50, vg: 50 }
};

const DEFAULT_NICOTINE_BOTTLE_VOLUME = 10;
const DEFAULT_NICOTINE_STRENGTH = 20;
const PRICE_SETTINGS_STORAGE_KEY = "mixer-price-settings";
const LANGUAGE_STORAGE_KEY = "mixer-language";

let currentLanguage = "ro";

const LANGUAGE_LOCALES = {
  ro: "ro-RO",
  it: "it-IT",
  en: "en-US"
};

const TRANSLATIONS = {
  ro: {
    documentTitle: "Mixer VG / PG",
    heroTitle: 'Calculator <span class="h1-accent">VG / PG</span>',
    intro:
      "Instrument pentru amestecarea lichidelor pentru țigări electronice simplu și precis.",
    liveAria: "Starea calculului rețetei",
    liveTitle: "Rețetă în timp real",
    liveText:
      "VG, PG, nicotina și costul se actualizează când modifici valorile",
    language: "Limbă",
    costsButton: "Costuri componente",
    closeCosts: "Închide costurile componentelor",
    pricePanel: "Prețuri componente",
    currency: "Valută",
    bottle: "Flacon",
    price: "Preț",
    save: "Salvează",
    flavor: "Aromă",
    flavorSub: "Concentrat în PG",
    nicotine: "Nicotină",
    nicotineSub: "Shot pentru amestec",
    concentration: "Concentrație",
    basePg: "Bază neutră full PG",
    basePgSub: "Propilen glicol",
    basePgSubLong: "Propilen glicol · fluid",
    baseVg: "Bază neutră full VG",
    baseVgSub: "Glicerină vegetală",
    baseVgSubLong: "Glicerină vegetală · densă",
    recipeSettings: "Setări rețetă",
    setGoal: "Setează obiectivul",
    totalBottle: "Total flacon",
    finalVolume: "Volum final",
    targetRatio: "Raport obiectiv",
    custom: "Personalizat",
    customVg: "VG personalizat (%)",
    calculatedPg: "PG calculat",
    finalResult: "Rezultat final",
    finalVg: "VG final",
    finalPg: "PG final",
    finalNicotine: "Nicotină finală",
    totalCost: "Cost total",
    completePrices: "Completează prețurile",
    targetDelta: "Abatere target",
    precise: "Precis",
    regulateComponents: "Reglează componentele",
    quantityMl: "Cantitate (ml)",
    details: "Detalii",
    base: "Bază",
    purePg: "PG pur",
    pureVg: "VG pur",
    ratio: "Raport",
    nicotineType: "Tip nicotină",
    bottles: "Flacoane",
    pieces: "buc",
    shot: "Shot",
    baseType: "Tip bază",
    stickyNicotine: "Nicotină",
    stickyCost: "Cost",
    noteExact: "Compoziția corespunde raportului setat.",
    noteChanged:
      "Ai modificat rețeta: totalul este respectat, dar raportul final diferă de referință.",
    stickyExact: "Precis: compoziție aliniată cu targetul",
    stickyChanged: "{delta}: raportul diferă de target",
    errorFinalVolume: "Cantitatea totală trebuie să fie mai mare decât zero.",
    errorTargetVg: "Procentul VG trebuie să fie între 0 și 100.",
    errorIngredientsPositive:
      "Cantitățile componentelor trebuie să fie pozitive.",
    errorTotal: "Componentele trebuie să totalizeze {value}.",
    decreaseFinalVolume: "Scade volumul final",
    increaseFinalVolume: "Crește volumul final",
    decreaseVg: "Scade VG",
    increaseVg: "Crește VG",
    decreaseFlavor: "Scade aroma",
    increaseFlavor: "Crește aroma",
    decreaseNicotine: "Scade jumătate de flacon de nicotină",
    increaseNicotine: "Crește jumătate de flacon de nicotină",
    decreasePgBase: "Scade baza PG",
    increasePgBase: "Crește baza PG",
    decreaseVgBase: "Scade baza VG",
    increaseVgBase: "Crește baza VG"
  },
  it: {
    documentTitle: "Mixer VG / PG",
    heroTitle: 'Calcolatore <span class="h1-accent">VG / PG</span>',
    intro:
      "Strumento per miscelare liquidi per sigarette elettroniche in modo semplice e preciso.",
    liveAria: "Stato calcolo ricetta",
    liveTitle: "Ricetta in tempo reale",
    liveText:
      "VG, PG, nicotina e costo si aggiornano mentre modifichi i valori",
    language: "Lingua",
    costsButton: "Costi componenti",
    closeCosts: "Chiudi costi componenti",
    pricePanel: "Prezzi componenti",
    currency: "Valuta",
    bottle: "Flacone",
    price: "Prezzo",
    save: "Salva",
    flavor: "Aroma",
    flavorSub: "Concentrato in PG",
    nicotine: "Nicotina",
    nicotineSub: "Shot da miscelare",
    concentration: "Concentrazione",
    basePg: "Base neutra full PG",
    basePgSub: "Propilene glicole",
    basePgSubLong: "Propilene glicole · fluido",
    baseVg: "Base neutra full VG",
    baseVgSub: "Glicerina vegetale",
    baseVgSubLong: "Glicerina vegetale · densa",
    recipeSettings: "Impostazioni ricetta",
    setGoal: "Imposta l'obiettivo",
    totalBottle: "Totale flacone",
    finalVolume: "Volume finale",
    targetRatio: "Rapporto obiettivo",
    custom: "Personalizzato",
    customVg: "VG personalizzato (%)",
    calculatedPg: "PG calcolato",
    finalResult: "Risultato finale",
    finalVg: "VG finale",
    finalPg: "PG finale",
    finalNicotine: "Nicotina finale",
    totalCost: "Costo totale",
    completePrices: "Completa prezzi",
    targetDelta: "Scostamento target",
    precise: "Preciso",
    regulateComponents: "Regola i componenti",
    quantityMl: "Quantità (ml)",
    details: "Dettagli",
    base: "Base",
    purePg: "PG puro",
    pureVg: "VG puro",
    ratio: "Rapporto",
    nicotineType: "Tipo nicotina",
    bottles: "Boccette",
    pieces: "pz",
    shot: "Shot",
    baseType: "Tipo base",
    stickyNicotine: "Nicotina",
    stickyCost: "Costo",
    noteExact: "La composizione corrisponde al rapporto impostato.",
    noteChanged:
      "Hai modificato la ricetta: il totale è rispettato, mentre il rapporto finale differisce dal riferimento.",
    stickyExact: "Preciso: composizione in linea con il target",
    stickyChanged: "{delta}: rapporto differisce dal target",
    errorFinalVolume: "La quantità totale deve essere maggiore di zero.",
    errorTargetVg: "La percentuale VG deve essere compresa tra 0 e 100.",
    errorIngredientsPositive:
      "Le quantità dei componenti devono essere positive.",
    errorTotal: "I componenti devono totalizzare {value}.",
    decreaseFinalVolume: "Diminuisci volume finale",
    increaseFinalVolume: "Aumenta volume finale",
    decreaseVg: "Diminuisci VG",
    increaseVg: "Aumenta VG",
    decreaseFlavor: "Diminuisci aroma",
    increaseFlavor: "Aumenta aroma",
    decreaseNicotine: "Diminuisci mezza boccetta di nicotina",
    increaseNicotine: "Aumenta mezza boccetta di nicotina",
    decreasePgBase: "Diminuisci base PG",
    increasePgBase: "Aumenta base PG",
    decreaseVgBase: "Diminuisci base VG",
    increaseVgBase: "Aumenta base VG"
  },
  en: {
    documentTitle: "VG / PG Mixer",
    heroTitle: '<span class="h1-accent">VG / PG</span> Calculator',
    intro: "A simple, precise tool for mixing e-cigarette liquids.",
    liveAria: "Recipe calculation status",
    liveTitle: "Live recipe",
    liveText: "VG, PG, nicotine and cost update as you change values",
    language: "Language",
    costsButton: "Component costs",
    closeCosts: "Close component costs",
    pricePanel: "Component prices",
    currency: "Currency",
    bottle: "Bottle",
    price: "Price",
    save: "Save",
    flavor: "Flavor",
    flavorSub: "PG concentrate",
    nicotine: "Nicotine",
    nicotineSub: "Mixing shot",
    concentration: "Strength",
    basePg: "Neutral full PG base",
    basePgSub: "Propylene glycol",
    basePgSubLong: "Propylene glycol · fluid",
    baseVg: "Neutral full VG base",
    baseVgSub: "Vegetable glycerin",
    baseVgSubLong: "Vegetable glycerin · dense",
    recipeSettings: "Recipe settings",
    setGoal: "Set target",
    totalBottle: "Bottle total",
    finalVolume: "Final volume",
    targetRatio: "Target ratio",
    custom: "Custom",
    customVg: "Custom VG (%)",
    calculatedPg: "Calculated PG",
    finalResult: "Final result",
    finalVg: "Final VG",
    finalPg: "Final PG",
    finalNicotine: "Final nicotine",
    totalCost: "Total cost",
    completePrices: "Complete prices",
    targetDelta: "Target delta",
    precise: "Precise",
    regulateComponents: "Adjust components",
    quantityMl: "Quantity (ml)",
    details: "Details",
    base: "Base",
    purePg: "Pure PG",
    pureVg: "Pure VG",
    ratio: "Ratio",
    nicotineType: "Nicotine type",
    bottles: "Bottles",
    pieces: "pcs",
    shot: "Shot",
    baseType: "Base type",
    stickyNicotine: "Nicotine",
    stickyCost: "Cost",
    noteExact: "The composition matches the selected ratio.",
    noteChanged:
      "You changed the recipe: the total is correct, but the final ratio differs from the reference.",
    stickyExact: "Precise: composition aligned with target",
    stickyChanged: "{delta}: ratio differs from target",
    errorFinalVolume: "Total quantity must be greater than zero.",
    errorTargetVg: "VG percentage must be between 0 and 100.",
    errorIngredientsPositive: "Component quantities must be positive.",
    errorTotal: "Components must add up to {value}.",
    decreaseFinalVolume: "Decrease final volume",
    increaseFinalVolume: "Increase final volume",
    decreaseVg: "Decrease VG",
    increaseVg: "Increase VG",
    decreaseFlavor: "Decrease flavor",
    increaseFlavor: "Increase flavor",
    decreaseNicotine: "Decrease half a nicotine bottle",
    increaseNicotine: "Increase half a nicotine bottle",
    decreasePgBase: "Decrease PG base",
    increasePgBase: "Increase PG base",
    decreaseVgBase: "Decrease VG base",
    increaseVgBase: "Increase VG base"
  }
};

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
  return value.toLocaleString(LANGUAGE_LOCALES[currentLanguage], {
    maximumFractionDigits,
    useGrouping: false
  });
}

function t(key, params = {}) {
  const dictionary = TRANSLATIONS[currentLanguage] || TRANSLATIONS.ro;
  const fallback = TRANSLATIONS.ro[key] || key;
  let text = dictionary[key] || fallback;

  Object.entries(params).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });

  return text;
}

function setInputValue(input, value, maximumFractionDigits = 1) {
  input.value = formatInputValue(value, maximumFractionDigits);
}

function hasValidRecipeSettings({ finalVolume, targetVg, nicotineRatio }) {
  return (
    Number.isFinite(finalVolume) &&
    finalVolume > 0 &&
    Number.isFinite(targetVg) &&
    targetVg >= 0 &&
    targetVg <= 100 &&
    Boolean(nicotineRatio)
  );
}

function calculateRecipe({ finalVolume, targetVg, ingredients }) {
  if (!Number.isFinite(finalVolume) || finalVolume <= 0) {
    throw new Error(t("errorFinalVolume"));
  }

  if (!Number.isFinite(targetVg) || targetVg < 0 || targetVg > 100) {
    throw new Error(t("errorTargetVg"));
  }

  const totals = ingredients.reduce(
    (result, ingredient) => {
      const volume = parseInput(ingredient.volume);

      if (!Number.isFinite(volume) || volume < 0) {
        throw new Error(t("errorIngredientsPositive"));
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
    throw new Error(t("errorTotal", { value: formatMl(finalVolume) }));
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
  return value.toLocaleString(LANGUAGE_LOCALES[currentLanguage], {
    maximumFractionDigits
  });
}

function formatMl(value) {
  return `${formatNumber(value)} ml`;
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function formatMoney(value, currency) {
  return `${formatNumber(round(value), 2)} ${currency}`;
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
  const nicotineShotDetails = document.querySelector("#nicotine-shot-details");
  const priceToggle = document.querySelector("#component-prices-toggle");
  const priceBackdrop = document.querySelector("#component-prices-backdrop");
  const pricePanel = document.querySelector("#component-prices-panel");
  const priceSaveButton = document.querySelector("#component-prices-save");
  const priceCurrencyInput = document.querySelector("#price-currency");
  const priceCurrencyUnits = document.querySelectorAll(".price-currency-unit");
  const languageInput = document.querySelector("#language-select");
  const resultCost = document.querySelector("#result-cost");
  const result = document.querySelector("#result");
  const ratioVisualVg = document.querySelector("#ratio-visual-vg");
  const stickyVg = document.querySelector("#sticky-vg");
  const stickyPg = document.querySelector("#sticky-pg");
  const stickyDeltaEl = document.querySelector("#sticky-delta");
  const stickyRatioVg = document.querySelector("#sticky-ratio-vg");
  const stickyNicotine = document.querySelector("#sticky-nicotine");
  const stickyCost = document.querySelector("#sticky-cost");
  const stickyNoteEl = document.querySelector("#sticky-note");

  const BTL_LAYERS = ["baseVg", "basePg", "nicotine", "aroma"];
  const btlLiqEls = Object.fromEntries(
    BTL_LAYERS.map((id) => [id, document.querySelector(`#btl-liq-${id}`)])
  );

  let ingredients = DEFAULT_RECIPE.map((ingredient) => ({ ...ingredient }));

  function setText(selector, key) {
    const el = document.querySelector(selector);
    if (el) el.textContent = t(key);
  }

  function setTextAll(selector, key) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = t(key);
    });
  }

  function setHtml(selector, key) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = t(key);
  }

  function setHeadingText(selector, key) {
    const el = document.querySelector(selector);
    if (!el) return;

    const icon = el.querySelector("svg");
    if (!icon) {
      el.textContent = t(key);
      return;
    }

    Array.from(el.childNodes).forEach((node) => {
      if (node !== icon) node.remove();
    });

    el.append(` ${t(key)}`);
  }

  function setAttr(selector, attribute, key) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attribute, t(key));
  }

  function setLabelText(selector, key) {
    const el = document.querySelector(selector);
    if (!el) return;

    const node = Array.from(el.childNodes).find(
      (child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim()
    );

    if (node) node.textContent = `\n                  ${t(key)}\n                  `;
  }

  function setLabelTextAll(selector, key) {
    document.querySelectorAll(selector).forEach((el) => {
      const node = Array.from(el.childNodes).find(
        (child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim()
      );

      if (node) node.textContent = `\n                  ${t(key)}\n                  `;
    });
  }

  function getSavedLanguage() {
    if (typeof localStorage === "undefined") return "ro";

    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return TRANSLATIONS[saved] ? saved : "ro";
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t("documentTitle");

    setHtml(".hero h1", "heroTitle");
    setText(".hero .intro", "intro");
    setAttr(".live-status", "aria-label", "liveAria");
    setText(".live-status strong", "liveTitle");
    setText(".live-status small", "liveText");
    setText(".language-control span", "language");
    setText("#component-prices-toggle", "costsButton");
    setAttr("#component-prices-backdrop", "aria-label", "closeCosts");
    setAttr("#component-prices-panel", "aria-label", "pricePanel");
    setLabelText(".price-currency", "currency");
    setText("#component-prices-save", "save");

    setText('#target-preset option[value="custom"]', "custom");
    setAttr(".combined-left", "aria-label", "recipeSettings");
    setHeadingText(".combined-left .panel-title h2", "setGoal");
    setText(".bottle-label", "totalBottle");
    setText(".bottle-helper", "finalVolume");
    setLabelText(".target-grid > label", "targetRatio");
    setLabelText("#custom-target label", "customVg");
    setText(".read-only-value span", "calculatedPg");

    setHeadingText("#result h2", "finalResult");
    setText("#result-vg-box > span:not(.component-icon)", "finalVg");
    setText("#result-pg-box > span:not(.component-icon)", "finalPg");
    setText(".result-details > div:nth-child(1) span", "finalNicotine");
    setText(".result-details > div:nth-child(2) span", "totalCost");
    setText(".result-details > div:nth-child(3) span", "targetDelta");

    setAttr(".ingredients", "aria-label", "regulateComponents");
    setHeadingText(".ingredients .panel-title h2", "regulateComponents");
    setTextAll(".field.compact > span:first-child", "quantityMl");
    setTextAll(".component-details summary", "details");

    setComponentCopy("aroma", "flavor", "flavorSub");
    setComponentCopy("nicotine", "nicotine", "nicotineSub");
    setComponentCopy("basePg", "basePg", "basePgSubLong");
    setComponentCopy("baseVg", "baseVg", "baseVgSubLong");
    setPriceCopy("aroma", "flavor", "flavorSub");
    setPriceCopy("nicotine", "concentration", "nicotineSub");
    setPriceCopy("basePg", "basePg", "basePgSub");
    setPriceCopy("baseVg", "baseVg", "baseVgSub");

    setLabelTextAll(".price-field-volume", "bottle");
    setLabelTextAll(".price-field-total", "price");
    setLabelText(".price-field-strength", "concentration");
    setLabelText(".nicotine-type", "nicotineType");
    setText('[data-id="nicotine"] .field.compact > span:first-child', "bottles");
    setText('[data-id="nicotine"] .input-with-unit b', "pieces");

    setDetailCopy("aroma", "base", "purePg", "ratio");
    setDetailCopy("basePg", "base", "purePg", "ratio");
    setDetailCopy("baseVg", "base", "pureVg", "ratio");
    setDetailCopy("nicotine", "shot", null, "baseType");

    setText(".sticky-stat--nic .sticky-stat-label", "stickyNicotine");
    setText(".sticky-stat--cost .sticky-stat-label", "stickyCost");

    setAdjustLabels();
  }

  function setComponentCopy(id, titleKey, subtitleKey) {
    setText(`[data-id="${id}"] .component-name strong`, titleKey);
    setText(`[data-id="${id}"] .component-name small`, subtitleKey);
  }

  function setPriceCopy(id, titleKey, subtitleKey) {
    setText(`[data-price-id="${id}"] .price-select strong`, titleKey);
    setText(`[data-price-id="${id}"] .price-select small`, subtitleKey);
  }

  function setDetailCopy(id, firstLabelKey, firstValueKey, secondLabelKey) {
    setText(
      `[data-id="${id}"] .display-field:nth-child(1) span`,
      firstLabelKey
    );

    if (firstValueKey) {
      setText(
        `[data-id="${id}"] .display-field:nth-child(1) strong`,
        firstValueKey
      );
    }

    setText(
      `[data-id="${id}"] .display-field:nth-child(2) span`,
      secondLabelKey
    );
  }

  function setAdjustLabels() {
    const labels = [
      ['[data-target="final-volume"][data-delta="-10"]', "decreaseFinalVolume"],
      ['[data-target="final-volume"][data-delta="10"]', "increaseFinalVolume"],
      ['[data-target="target-vg"][data-delta="-1"]', "decreaseVg"],
      ['[data-target="target-vg"][data-delta="1"]', "increaseVg"],
      ['[data-target="aroma-amount"][data-delta="-0.1"]', "decreaseFlavor"],
      ['[data-target="aroma-amount"][data-delta="0.1"]', "increaseFlavor"],
      [
        '[data-target="nicotine-bottles"][data-delta="-0.5"]',
        "decreaseNicotine"
      ],
      [
        '[data-target="nicotine-bottles"][data-delta="0.5"]',
        "increaseNicotine"
      ],
      ['[data-target="base-pg-amount"][data-delta="-0.1"]', "decreasePgBase"],
      ['[data-target="base-pg-amount"][data-delta="0.1"]', "increasePgBase"],
      ['[data-target="base-vg-amount"][data-delta="-0.1"]', "decreaseVgBase"],
      ['[data-target="base-vg-amount"][data-delta="0.1"]', "increaseVgBase"]
    ];

    labels.forEach(([selector, key]) => setAttr(selector, "aria-label", key));
  }

  function getPriceSettings() {
    const currency = priceCurrencyInput ? priceCurrencyInput.value : "RON";
    const components = {};

    document.querySelectorAll("[data-price-id]").forEach((row) => {
      const id = row.dataset.priceId;
      const bottleVolume = row.querySelector(".price-bottle-volume");
      const bottleTotal = row.querySelector(".price-bottle-total");
      const nicotineStrength = row.querySelector(".price-nicotine-strength");

      components[id] = {
        bottleVolume: parseInput(bottleVolume ? bottleVolume.value : ""),
        bottleTotal: parseInput(bottleTotal ? bottleTotal.value : ""),
        nicotineStrength: parseInput(
          nicotineStrength ? nicotineStrength.value : ""
        )
      };
    });

    return { currency, components };
  }

  function applySavedPriceSettings() {
    if (typeof localStorage === "undefined") return;

    try {
      const saved = JSON.parse(
        localStorage.getItem(PRICE_SETTINGS_STORAGE_KEY) || "null"
      );

      if (!saved || typeof saved !== "object") return;

      if (priceCurrencyInput && saved.currency) {
        priceCurrencyInput.value = saved.currency;
      }

      Object.entries(saved.components || {}).forEach(([id, values]) => {
        const row = document.querySelector(`[data-price-id="${id}"]`);
        if (!row || !values || typeof values !== "object") return;

        const bottleVolume = row.querySelector(".price-bottle-volume");
        const bottleTotal = row.querySelector(".price-bottle-total");
        const nicotineStrength = row.querySelector(".price-nicotine-strength");

        if (bottleVolume && values.bottleVolume !== undefined) {
          bottleVolume.value = values.bottleVolume;
        }

        if (bottleTotal && values.bottleTotal !== undefined) {
          bottleTotal.value = values.bottleTotal;
        }

        if (nicotineStrength && values.nicotineStrength !== undefined) {
          nicotineStrength.value = values.nicotineStrength;
        }
      });
    } catch (error) {
      localStorage.removeItem(PRICE_SETTINGS_STORAGE_KEY);
    }
  }

  function savePriceSettings() {
    if (typeof localStorage === "undefined") return;

    const settings = getPriceSettings();
    const payload = {
      currency: settings.currency,
      components: {}
    };

    Object.entries(settings.components).forEach(([id, values]) => {
      payload.components[id] = {
        bottleVolume: Number.isFinite(values.bottleVolume)
          ? formatInputValue(values.bottleVolume, 1)
          : "",
        bottleTotal: Number.isFinite(values.bottleTotal)
          ? formatInputValue(values.bottleTotal, 2)
          : "",
        nicotineStrength: Number.isFinite(values.nicotineStrength)
          ? formatInputValue(values.nicotineStrength, 1)
          : ""
      };
    });

    localStorage.setItem(PRICE_SETTINGS_STORAGE_KEY, JSON.stringify(payload));
  }

  function closePricePanel({ restoreFocus = false } = {}) {
    if (!priceToggle || !pricePanel) return;

    pricePanel.hidden = true;
    if (priceBackdrop) priceBackdrop.hidden = true;
    priceToggle.setAttribute("aria-expanded", "false");

    if (restoreFocus) {
      priceToggle.focus();
    }
  }

  function getNicotineBottleVolume() {
    const nicotinePrice = getPriceSettings().components.nicotine;

    if (
      nicotinePrice &&
      Number.isFinite(nicotinePrice.bottleVolume) &&
      nicotinePrice.bottleVolume > 0
    ) {
      return nicotinePrice.bottleVolume;
    }

    return DEFAULT_NICOTINE_BOTTLE_VOLUME;
  }

  function getNicotineStrength() {
    const nicotinePrice = getPriceSettings().components.nicotine;

    if (
      nicotinePrice &&
      Number.isFinite(nicotinePrice.nicotineStrength) &&
      nicotinePrice.nicotineStrength >= 0
    ) {
      return nicotinePrice.nicotineStrength;
    }

    return DEFAULT_NICOTINE_STRENGTH;
  }

  function calculateCost() {
    const priceSettings = getPriceSettings();
    let total = 0;
    let isComplete = true;

    ingredients.forEach((ingredient) => {
      const price = priceSettings.components[ingredient.id];

      if (
        !price ||
        !Number.isFinite(price.bottleVolume) ||
        price.bottleVolume <= 0 ||
        !Number.isFinite(price.bottleTotal) ||
        price.bottleTotal < 0
      ) {
        isComplete = false;
        return;
      }

      total += (ingredient.volume / price.bottleVolume) * price.bottleTotal;
    });

    return {
      total: round(total),
      currency: priceSettings.currency,
      isComplete
    };
  }

  function renderCost() {
    const cost = calculateCost();
    const text = cost.isComplete
      ? formatMoney(cost.total, cost.currency)
      : t("completePrices");

    if (resultCost) resultCost.textContent = text;
    if (stickyCost) stickyCost.textContent = text;

    priceCurrencyUnits.forEach((unit) => {
      unit.textContent = cost.currency;
    });
  }

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
    const nicotineBottleVolume = getNicotineBottleVolume();
    const nicotineStrength = getNicotineStrength();

    const nicotine = ingredients.find(
      (ingredient) => ingredient.id === "nicotine"
    );

    nicotine.pg = nicotineRatio.pg;
    nicotine.vg = nicotineRatio.vg;
    nicotine.nicotine = nicotineStrength;

    nicotineComposition.textContent = `${nicotineRatio.vg}% VG / ${nicotineRatio.pg}% PG`;
    if (nicotineShotDetails) {
      nicotineShotDetails.textContent =
        `${formatMl(nicotineBottleVolume)} · ${formatNumber(nicotineStrength, 1)} mg/ml`;
    }
  }

  function syncInputs() {
    ingredients.forEach((ingredient) => {
      if (ingredient.id === "nicotine") {
        if (document.activeElement !== nicotineBottlesInput) {
          setInputValue(
            nicotineBottlesInput,
            roundToStep(ingredient.volume / getNicotineBottleVolume(), 0.5),
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

    if (!hasValidRecipeSettings(settings)) {
      return;
    }

    const aroma = ingredients.find((ingredient) => ingredient.id === "aroma");

    const nicotine = ingredients.find(
      (ingredient) => ingredient.id === "nicotine"
    );

    if (
      !Number.isFinite(aroma.volume) ||
      !Number.isFinite(nicotine.volume)
    ) {
      return;
    }

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
    renderCost();

    try {
      const calculation = calculateRecipe({
        finalVolume: settings.finalVolume,
        targetVg: settings.targetVg,
        ingredients
      });

      const deltaText = calculation.isExact
        ? t("precise")
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
        ? t("noteExact")
        : t("noteChanged");

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
          ? t("stickyExact")
          : t("stickyChanged", { delta: deltaText });
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
    const nicotineBottleVolume = getNicotineBottleVolume();

    if (Number.isFinite(finalVolume) && finalVolume > 0) {
      const parsedBottles = parseInput(nicotineBottlesInput.value);
      if (Number.isFinite(parsedBottles) && parsedBottles >= 0) {
        const aromaVol = ingredients.find((i) => i.id === "aroma").volume;
        const maxBottles =
          Math.floor(
            (Math.max(0, finalVolume - aromaVol) / nicotineBottleVolume) * 2
          ) / 2;
        const bottles = clamp(roundToStep(parsedBottles, 0.5), 0, maxBottles);
        ingredients = updateFixedVolume(
          ingredients,
          "nicotine",
          bottles * nicotineBottleVolume,
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

    if (
      !Number.isFinite(parsedValue) ||
      !Number.isFinite(finalVolume) ||
      finalVolume <= 0
    ) {
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
    const nicotineBottleVolume = getNicotineBottleVolume();

    if (!Number.isFinite(finalVolume) || finalVolume <= 0) {
      render();
      return;
    }

    const aromaVolume = ingredients.find(
      (ingredient) => ingredient.id === "aroma"
    ).volume;

    const maximumBottles =
      Math.floor(
        (Math.max(0, finalVolume - aromaVolume) / nicotineBottleVolume) * 2
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
      bottles * nicotineBottleVolume,
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

  function applyPriceChange(input) {
    const row = input.closest("[data-price-id]");

    if (
      row &&
      row.dataset.priceId === "nicotine" &&
      input.classList.contains("price-bottle-volume")
    ) {
      resetBasesAndRender();
      return;
    }

    render();
  }

  document
    .querySelectorAll(
      ".price-bottle-volume, .price-bottle-total, .price-nicotine-strength"
    )
    .forEach((input) => {
      input.addEventListener("input", () => applyPriceChange(input));

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          input.blur();
        }
      });
    });

  if (priceCurrencyInput) {
    priceCurrencyInput.addEventListener("change", render);
  }

  if (languageInput) {
    languageInput.addEventListener("change", () => {
      currentLanguage = TRANSLATIONS[languageInput.value]
        ? languageInput.value
        : "ro";

      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
      }

      applyTranslations();
      syncInputs();
      render();
    });
  }

  if (priceToggle && pricePanel) {
    priceToggle.addEventListener("click", () => {
      const nextOpen = pricePanel.hidden;

      pricePanel.hidden = !nextOpen;
      if (priceBackdrop) priceBackdrop.hidden = !nextOpen;
      priceToggle.setAttribute("aria-expanded", String(nextOpen));
    });

    if (priceBackdrop) {
      priceBackdrop.addEventListener("click", () => {
        closePricePanel({ restoreFocus: true });
      });
    }

    document.addEventListener("click", (event) => {
      if (
        pricePanel.hidden ||
        (priceBackdrop && priceBackdrop.contains(event.target)) ||
        pricePanel.contains(event.target) ||
        priceToggle.contains(event.target)
      ) {
        return;
      }

      closePricePanel();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || pricePanel.hidden) return;

      closePricePanel({ restoreFocus: true });
    });
  }

  if (priceSaveButton) {
    priceSaveButton.addEventListener("click", () => {
      savePriceSettings();
      closePricePanel({ restoreFocus: true });
      render();
    });
  }

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

  currentLanguage = getSavedLanguage();
  if (languageInput) languageInput.value = currentLanguage;

  applyTranslations();
  applySavedPriceSettings();
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
