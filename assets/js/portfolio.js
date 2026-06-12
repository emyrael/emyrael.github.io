document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const revealElements = document.querySelectorAll(".reveal");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

            window.scrollTo({
                top,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    });

    function updateNavbar() {
        if (!navbar) return;
        navbar.classList.toggle("scrolled", window.scrollY > 24);
    }

    function updateActiveNav() {
        const offset = (navbar ? navbar.offsetHeight : 0) + 80;
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    }

    if (prefersReducedMotion) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get("name") || "";
            const email = formData.get("email") || "";
            const subject = formData.get("subject") || "Contact from Portfolio";
            const message = formData.get("message") || "";
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:manuel@ginja.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
            showNotification("Email client opened. Please send your message.");
            contactForm.reset();
        });
    }

    function showNotification(message) {
        const existingNotification = document.querySelector(".notification");
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement("div");
        notification.className = "notification";
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" type="button" aria-label="Close notification">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add("show"));

        const close = () => {
            notification.classList.remove("show");
            window.setTimeout(() => notification.remove(), 250);
        };

        notification.querySelector(".notification-close").addEventListener("click", close);
        window.setTimeout(close, 5000);
    }

    updateNavbar();
    updateActiveNav();
    window.addEventListener("scroll", () => {
        updateNavbar();
        updateActiveNav();
    }, { passive: true });
});
