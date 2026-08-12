/* ==========================================================
   MindSense AI
   Main Application Script
   ========================================================== */

import { healthCheck } from "./api.js";

import {
    initializeTheme,
    showToast
} from "./ui.js";

/* ----------------------------------------------------------
   DOM Ready
---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    initializeNavbar();

    initializeSmoothScroll();

    initializeRevealAnimation();

    checkBackendStatus();

});

/* ----------------------------------------------------------
   Navbar Shadow on Scroll
---------------------------------------------------------- */

function initializeNavbar() {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 20) {

                navbar.classList.add("navbar-scrolled");

            } else {

                navbar.classList.remove("navbar-scrolled");

            }

        },
        { passive: true }
    );

}

/* ----------------------------------------------------------
   Smooth Anchor Navigation
---------------------------------------------------------- */

function initializeSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const targetId = link.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

}

/* ----------------------------------------------------------
   Reveal Animation
---------------------------------------------------------- */

function initializeRevealAnimation() {

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("reveal-visible");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );

    document
        .querySelectorAll(
            ".feature-card, .stat-card, .step, .section-title"
        )
        .forEach(element => {

            element.classList.add("reveal");

            observer.observe(element);

        });

}

/* ----------------------------------------------------------
   Backend Health Check
---------------------------------------------------------- */

async function checkBackendStatus() {

    try {

        const response = await healthCheck();

        console.info(response.message);

    }

    catch (error) {

        console.error(error);

        showToast(
            "Backend server is currently unavailable.",
            "error"
        );

    }

}

/* ----------------------------------------------------------
   Active Navigation Highlight
---------------------------------------------------------- */

(function highlightCurrentPage() {

    const current = location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(link => {

        if (link.getAttribute("href") === current) {

            link.classList.add("active");

        }

    });

})();

/* ----------------------------------------------------------
   Hero Button Ripple Effect
---------------------------------------------------------- */

document.addEventListener("click", event => {

    const button = event.target.closest(
        ".btn-primary, .btn-secondary"
    );

    if (!button) return;

    const ripple = document.createElement("span");

    ripple.className = "ripple";

    const rect = button.getBoundingClientRect();

    ripple.style.left =
        `${event.clientX - rect.left}px`;

    ripple.style.top =
        `${event.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => {

        ripple.remove();

    }, 600);

});


