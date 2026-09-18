document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = [...document.querySelectorAll('.site-nav a[href*="#"]')];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    header?.classList.remove("menu-visible");
    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menu?.classList.toggle("is-open", !isOpen);
    header?.classList.toggle("menu-visible", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 960) closeMenu(); }, { passive: true });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window) {
    const sections = navLinks.map((link) => {
      const hash = new URL(link.href, window.location.href).hash;
      return hash ? document.querySelector(hash) : null;
    }).filter(Boolean);
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = new URL(link.href, window.location.href).hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-28% 0px -62%", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach((item) => {
      item.classList.add("reveal-pending");
      revealObserver.observe(item);
    });
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const original = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = original; }, 1600);
      } catch (_) { button.textContent = "Select command"; }
    });
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
});
