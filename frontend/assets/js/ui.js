/* ==========================================================
   MindSense AI
   UI Utility Module
   ========================================================== */

/* ----------------------------------------------------------
   Toast Notifications
---------------------------------------------------------- */

export function showToast(message, type = "info") {

    const oldToast = document.querySelector(".toast");

    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    toast.setAttribute("role", "alert");

    toast.innerHTML = `
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

/* ----------------------------------------------------------
   Loading Overlay
---------------------------------------------------------- */

export function showLoader(text = "Loading...") {

    if (document.querySelector("#loadingOverlay")) return;

    const overlay = document.createElement("div");

    overlay.id = "loadingOverlay";

    overlay.innerHTML = `
        <div class="loader-card">
            <div class="spinner"></div>
            <p>${text}</p>
        </div>
    `;

    document.body.appendChild(overlay);

}

export function hideLoader() {

    const overlay = document.querySelector("#loadingOverlay");

    if (overlay) {

        overlay.remove();

    }

}

/* ----------------------------------------------------------
   Animated Counter
---------------------------------------------------------- */

export function animateCounter(element, target, duration = 1200) {

    let start = 0;

    const increment = target / (duration / 16);

    function update() {

        start += increment;

        if (start >= target) {

            element.textContent = target.toFixed(2);

            return;

        }

        element.textContent = start.toFixed(2);

        requestAnimationFrame(update);

    }

    update();

}

/* ----------------------------------------------------------
   Circular Progress Ring
---------------------------------------------------------- */

export function setProgress(circle, percentage) {

    const radius = circle.r.baseVal.value;

    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = circumference;

    const offset = circumference - percentage / 100 * circumference;

    circle.style.strokeDashoffset = offset;

}

/* ----------------------------------------------------------
   Risk Badge
---------------------------------------------------------- */

export function getRiskLevel(score) {

    if (score >= 8) {

        return {
            label: "Healthy",
            className: "risk-good"
        };

    }

    if (score >= 6) {

        return {
            label: "Moderate",
            className: "risk-moderate"
        };

    }

    if (score >= 4) {

        return {
            label: "Needs Attention",
            className: "risk-warning"
        };

    }

    return {

        label: "Critical",

        className: "risk-critical"

    };

}

/* ----------------------------------------------------------
   Update Risk Badge
---------------------------------------------------------- */

export function updateRiskBadge(element, score) {

    const risk = getRiskLevel(score);

    element.textContent = risk.label;

    element.className = `risk-badge ${risk.className}`;

}

/* ----------------------------------------------------------
   Smooth Scroll
---------------------------------------------------------- */

export function scrollToElement(selector) {

    const element = document.querySelector(selector);

    if (!element) return;

    element.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

/* ----------------------------------------------------------
   Theme Manager
---------------------------------------------------------- */

export function initializeTheme() {

    const toggle = document.getElementById("themeToggle");

    if (!toggle) return;

    const saved = localStorage.getItem("theme");

    if (saved === "dark") {

        document.body.classList.add("dark");

    }

    toggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const current = document.body.classList.contains("dark")
            ? "dark"
            : "light";

        localStorage.setItem("theme", current);

    });

}

/* ----------------------------------------------------------
   Skeleton Loader
---------------------------------------------------------- */

export function createSkeleton(parent, count = 3) {

    parent.innerHTML = "";

    for (let i = 0; i < count; i++) {

        const item = document.createElement("div");

        item.className = "skeleton-card";

        parent.appendChild(item);

    }

}

/* ----------------------------------------------------------
   Fade In Animation
---------------------------------------------------------- */

export function fadeIn(element) {

    element.style.opacity = 0;

    element.style.transform = "translateY(20px)";

    requestAnimationFrame(() => {

        element.style.transition = "all .4s ease";

        element.style.opacity = 1;

        element.style.transform = "translateY(0)";

    });

}

/* ----------------------------------------------------------
   Format Date
---------------------------------------------------------- */

export function formatDate(date = new Date()) {

    return new Intl.DateTimeFormat("en-IN", {

        dateStyle: "medium",

        timeStyle: "short"

    }).format(date);

}