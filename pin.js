(function () {
  var HASH = "9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0";

  var overlay = document.getElementById("pin-overlay");
  if (!overlay) return;

  if (sessionStorage.getItem("unlocked") === "1") {
    overlay.remove();
    return;
  }

  var entered = "";
  var isChecking = false;
  var errEl = document.getElementById("pin-error");
  var card = document.getElementById("pin-card");
  var dots = document.getElementById("pin-dots");

  function updateDots() {
    for (var i = 0; i < 4; i++) {
      document
        .getElementById("d" + i)
        .classList.toggle("filled", i < entered.length);
    }
    dots.setAttribute(
      "aria-label",
      "Cod introdus: " + entered.length + " din 4 cifre"
    );
  }

  function clearError() {
    errEl.textContent = "";
    errEl.classList.remove("visible");
  }

  function showError(msg) {
    errEl.textContent = msg;
    errEl.classList.add("visible");
    card.classList.remove("pin-shake");
    void card.offsetWidth;
    card.classList.add("pin-shake");
  }

  function unlock() {
    sessionStorage.setItem("unlocked", "1");
    overlay.style.transition = "opacity 0.35s ease";
    overlay.style.opacity = "0";
    setTimeout(function () {
      overlay.remove();
    }, 350);
  }

  function sha256hex(str) {
    try {
      var buf = new TextEncoder().encode(str);
      return crypto.subtle.digest("SHA-256", buf).then(function (hash) {
        return Array.from(new Uint8Array(hash))
          .map(function (b) {
            return b.toString(16).padStart(2, "0");
          })
          .join("");
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  function submit() {
    if (isChecking || entered.length !== 4) return;
    isChecking = true;
    sha256hex(entered)
      .then(function (hex) {
        if (hex === HASH) {
          unlock();
        } else {
          showError("Cod incorect. Încearcă din nou.");
          entered = "";
          isChecking = false;
          updateDots();
        }
      })
      .catch(function () {
        showError("Verificarea nu a reușit. Încearcă din nou.");
        entered = "";
        isChecking = false;
        updateDots();
      });
  }

  function handleValue(v) {
    if (isChecking) return;

    if (v === "del") {
      entered = entered.slice(0, -1);
      clearError();
    } else if (entered.length < 4) {
      entered += v;
      clearError();
      if (entered.length === 4) submit();
    }
    updateDots();
  }

  document.getElementById("pin-pad").addEventListener("click", function (e) {
    var btn = e.target.closest(".pin-key");
    if (!btn) return;
    handleValue(btn.dataset.v);
  });

  document.addEventListener("keydown", function (e) {
    if (!document.getElementById("pin-overlay")) return;
    if (e.key >= "0" && e.key <= "9") {
      handleValue(e.key);
    } else if (e.key === "Backspace") {
      handleValue("del");
    } else if (e.key === "Enter") {
      submit();
    }
  });
})();
