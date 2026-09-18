// Apply a saved choice before CSS paints. New visitors always start in dark mode.
(() => {
  const storageKey = "portfolio-theme";
  const root = document.documentElement;
  let theme = "dark";
  try {
    if (localStorage.getItem(storageKey) === "light") theme = "light";
  } catch (_) {
    // Theme switching still works when browser storage is unavailable.
  }

  const applyTheme = (nextTheme) => {
    root.dataset.theme = nextTheme;
    document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", nextTheme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content", nextTheme === "light" ? "#f7f9fc" : "#060b12"
    );
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isLight = nextTheme === "light";
      button.setAttribute("aria-pressed", String(isLight));
      button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      button.querySelector("[data-theme-label]").textContent = isLight ? "Dark mode" : "Light mode";
    });
  };

  applyTheme(theme);
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(root.dataset.theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
        try { localStorage.setItem(storageKey, nextTheme); } catch (_) {}
      });
    });
  });
})();
