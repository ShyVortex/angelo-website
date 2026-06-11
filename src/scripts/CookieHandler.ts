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

// In-memory flag to track if reopenBtn should be visible
let isReopenBtnActive = false;

function showBanner() {
    isReopenBtnActive = false;
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
    isReopenBtnActive = true;
    if (!banner) return;
    banner.classList.add("translate-y-30", "opacity-0", "pointer-events-none");

    // Show button only if we aren't at the end of the page
    handleScroll();
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

// Initial check
const existingConsent = localStorage.getItem(STORAGE_KEY);
if (!existingConsent) {
    // Show banner on first load (slightly delayed for nice entry animation)
    setTimeout(showBanner, 1000);
} else {
    isReopenBtnActive = true;
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

// Hide floating button near the bottomside of any page
function handleScroll() {
    if (!reopenBtn || !isReopenBtnActive) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;

    // Hide if near footer (150px)
    if (scrollPosition >= scrollHeight - 150) {
        reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
    } else {
        reopenBtn.classList.remove("scale-0", "opacity-0", "pointer-events-none");
    }
}

window.addEventListener("scroll", handleScroll);

// Run on start
handleScroll();

// Export globally for the footer button or links
(window as any).openCookieBanner = showBanner;