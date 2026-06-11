const STORAGE_KEY = "cookie-consent";

const banner = document.getElementById("cookie-banner");
const reopenBtn = document.getElementById("cookie-reopen-btn");
const panel = document.getElementById("cookie-preferences-panel");
const primaryActions = document.getElementById(
    "cookie-banner-primary-actions",
);

const btnAccept = document.getElementById("cookie-btn-accept");
const btnDecline = document.getElementById("cookie-btn-decline");
const btnCustomize = document.getElementById("cookie-btn-customize");
const btnSave = document.getElementById("cookie-btn-save");

const prefAnalytics = document.getElementById(
    "cookie-pref-analytics",
) as HTMLInputElement;

function showBanner() {
    if (!banner) return;
    banner.classList.remove(
        "translate-y-30",
        "opacity-0",
        "pointer-events-none",
    );
    if (reopenBtn)
        reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
}

function hideBanner() {
    if (!banner) return;
    banner.classList.add("translate-y-30", "opacity-0", "pointer-events-none");

    // Update floating button state
    updateFloatingButtonVisibility();
}

function saveConsent(analyticsVal: boolean) {
    const consent = {
        technical: true,
        analytics: analyticsVal,
        timestamp: new Date().getTime(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));

    // Dispatch a custom event for other scripts to listen to if they want to load analytics dynamically
    window.dispatchEvent(
        new CustomEvent("cookie-consent-changed", { detail: consent }),
    );

    hideBanner();
}

// Verify and update floating button visibility
function updateFloatingButtonVisibility() {
    if (!reopenBtn) return;

    // If banner is open, button must remain hidden
    if (banner && !banner.classList.contains("pointer-events-none")) {
        reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
        return;
    }

    const consent = localStorage.getItem(STORAGE_KEY);
    if (consent) {
        // Check if footer is visibile in viewport
        const footer = document.querySelector("footer");
        if (footer) {
            const rect = footer.getBoundingClientRect();
            // If footer is visible from the bottom (around 150px) hide button
            if (rect.top <= window.innerHeight + 150) {
                reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
                return;
            }
        }
        reopenBtn.classList.remove("scale-0", "opacity-0", "pointer-events-none");
    }
}

// Initial check
const existingConsent = localStorage.getItem(STORAGE_KEY);
if (!existingConsent) {
    // Show banner on first load (slightly delayed for nice entry animation)
    setTimeout(showBanner, 1000);
} else {
    if (reopenBtn) {
        // Check whether or not show the button
        updateFloatingButtonVisibility();
    }
    try {
        const parsed = JSON.parse(existingConsent);
        if (prefAnalytics) prefAnalytics.checked = !!parsed.analytics;
    } catch (e) {
        console.error("Error parsing cookie consent", e);
    }
}

// Event Listeners
btnAccept?.addEventListener("click", () => saveConsent(true));
btnDecline?.addEventListener("click", () => saveConsent(false));

btnCustomize?.addEventListener("click", () => {
    if (panel) {
        panel.classList.toggle("hidden");
        const isHidden = panel.classList.contains("hidden");
        if (btnCustomize) {
            const customizeText =
                btnCustomize.getAttribute("data-customize") || "Customize";
            const backText = btnCustomize.getAttribute("data-back") || "Back";
            btnCustomize.textContent = isHidden ? customizeText : backText;
        }
        if (btnSave) {
            btnSave.classList.toggle("hidden", isHidden);
        }
        if (primaryActions) {
            primaryActions.classList.toggle("hidden", !isHidden);
        }
    }
});

btnSave?.addEventListener("click", () => {
    const analyticsConsent = prefAnalytics ? prefAnalytics.checked : false;
    saveConsent(analyticsConsent);

    // Reset Customize view
    if (panel) panel.classList.add("hidden");
    if (btnCustomize) btnCustomize.textContent = "Customize";
    if (btnSave) btnSave.classList.add("hidden");
    if (primaryActions) primaryActions.classList.remove("hidden");
});

reopenBtn?.addEventListener("click", () => {
    const currentConsent = localStorage.getItem(STORAGE_KEY);
    if (currentConsent) {
        try {
            const parsed = JSON.parse(currentConsent);
            if (prefAnalytics) prefAnalytics.checked = !!parsed.analytics;
        } catch (e) { }
    }
    showBanner();
});

// Use IntersectionObserver to monitor footer in a safe and efficient way
const footer = document.querySelector("footer");
if (footer && reopenBtn) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(() => {
            updateFloatingButtonVisibility();
        });
    }, {
        root: null, // viewport
        rootMargin: "0px 0px 150px 0px", // Intersection is 150px before footer
        threshold: 0
    });

    observer.observe(footer);

    // Extra fallback to guarantee smooth transitions during fast movements
    window.addEventListener("scroll", updateFloatingButtonVisibility, { passive: true });
}

// Export globally for the footer button or links
(window as any).openCookieBanner = showBanner;