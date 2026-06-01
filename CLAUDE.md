# Mixer VG / PG — App personale (PWA)

## Contesto
**App personale** che sto sviluppando: un calcolatore per **miscelare liquidi da sigaretta elettronica** (rapporto VG/PG, nicotina, aromi, costi).
Sono uno studente del corso Frontend Developer (LinkAcademy): spiegami brevemente le cose nuove mentre lavoriamo.
- È una **PWA installabile** (offline-capable), pensata soprattutto per mobile.
- Stack: **Vanilla HTML + CSS + JavaScript**, nessun framework, nessun build step.
- Font: **Inter** (Google Fonts). Palette **verde** (`#126849`).

## File principali
| File | Ruolo |
|------|-------|
| `index.html` | Unica pagina: PIN overlay + calcolatore |
| `mixer.js` | Logica principale (~1400 righe): calcolo ricetta, i18n, prezzi, render |
| `mixer.css` | Tutti gli stili. `:root` con le variabili colore |
| `pin.js` / `pin.css` | Schermata PIN di accesso (hash SHA-256, `sessionStorage "unlocked"`) |
| `service-worker.js` | Cache offline della PWA |
| `manifest.json` | Manifest PWA (nome, icone, theme color `#126849`) |
| `icon-192.png` / `icon-512.png` | Icone app |
| `mixer-assets/` | Immagini (hero, flacone graduato) |

## Architettura JS (mixer.js, tutto vanilla)
- Helper: `round`, `clamp`, `parseInput` (gestisce virgola e punto), `roundToStep`, formatter (`formatMl`, `formatPercent`, `formatMoney`).
- Calcolo: `calculateRecipe({finalVolume, targetVg, ingredients})`, `recommendBases(...)`, `updateBaseVolume(...)`.
- UI: `initCalculator()` registra tutti gli event listener; `render()` ricalcola e aggiorna il DOM in tempo reale.
- Persistenza `localStorage`:
  - `"mixer-price-settings"` → prezzi/volumi componenti salvati
  - `"mixer-language"` → lingua scelta
- Ingredienti gestiti: **aroma, nicotina (shot), base full PG, base full VG**. Risultato live: VG%, PG%, nicotina mg/ml, costo, scostamento dal target.

## ⚠️ Regole critiche (non dimenticare)

### 1. Service Worker — bump della versione cache
`service-worker.js` ha `const CACHE_NAME = "vg-mixer-vXX"` con strategia **cache-first**.
- **Ogni volta che modifichi un file cachato** (HTML/CSS/JS/asset) DEVI incrementare il numero in `CACHE_NAME` (es. `v26.5` → `v26.6`), altrimenti gli utenti installati vedono la versione vecchia.
- Se aggiungi/rimuovi file, aggiorna anche l'array `FILES_TO_CACHE`.
- In `localhost`/`127.0.0.1` il fetch non usa la cache (già gestito), ma in produzione sì.

### 2. Internazionalizzazione (i18n) — RO / IT / EN
- I testi UI vivono nell'oggetto `TRANSLATIONS` in `mixer.js`, con chiavi per `ro`, `it`, `en`. Default: **`ro`**.
- Si applicano tramite la funzione `t(key, params)`.
- **Qualsiasi nuovo testo dell'interfaccia va aggiunto in TUTTE E TRE le lingue** e collegato via `t()` / attributi i18n, mai hardcodato nell'HTML.

### 3. Stili
- Solo variabili CSS da `:root` in `mixer.css`, niente colori hardcoded nuovi.
- L'app è mobile-first: testa sempre il layout su schermo stretto e la barra `sticky-result` in basso.

### 4. PIN di accesso
- `pin.js` confronta l'hash **SHA-256** del codice inserito con `HASH`. Lo sblocco è in `sessionStorage`.
- Non rimuovere l'overlay PIN dal flusso senza che lo chieda esplicitamente.

## Regole generali
- Lingua di commenti/testi: romeno o italiano (non inglese, salvo termini tecnici).
- Nessuna dipendenza npm/build — vanilla + CDN (Google Fonts).
- Mantieni l'accessibilità già presente (`aria-label`, `role`, `aria-live`).
