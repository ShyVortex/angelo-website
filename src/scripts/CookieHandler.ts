const STORAGE_KEY = "cookie-consent";

// Globally exported function to reopen floating cookie button
(window as any).openCookieBanner = () => {
    console.log("openCookieBanner called");
    const banner = document.getElementById("cookie-banner");
    const reopenBtn = document.getElementById("cookie-reopen-btn");
    console.log("openCookieBanner elements:", { banner, reopenBtn });
    if (!banner) return;
    banner.classList.remove(
        "translate-y-30",
        "opacity-0",
        "pointer-events-none",
    );
    if (reopenBtn)
        reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
};

function initCookieBanner() {
    console.log("initCookieBanner executed");
    const banner = document.getElementById("cookie-banner");
    const reopenBtn = document.getElementById("cookie-reopen-btn");
    const panel = document.getElementById("cookie-preferences-panel");
    const primaryActions = document.getElementById("cookie-banner-primary-actions");

    const btnAccept = document.getElementById("cookie-btn-accept");
    const btnDecline = document.getElementById("cookie-btn-decline");
    const btnCustomize = document.getElementById("cookie-btn-customize");
    const btnSave = document.getElementById("cookie-btn-save");

    const prefAnalytics = document.getElementById("cookie-pref-analytics") as HTMLInputElement;

    console.log("initCookieBanner elements found:", { banner, reopenBtn });

    if (!banner || !reopenBtn) {
        // Elements not yet available in DOM
        console.warn("Cookie banner or reopen button not found in DOM!");
        return;
    }

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
        handleScroll();
    }

    function saveConsent(analyticsVal: boolean) {
        const consent = {
            technical: true,
            analytics: analyticsVal,
            timestamp: new Date().getTime(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));

        window.dispatchEvent(
            new CustomEvent("cookie-consent-changed", { detail: consent }),
        );

        hideBanner();
    }

    // Initial check
    const existingConsent = localStorage.getItem(STORAGE_KEY);
    if (!existingConsent) {
        setTimeout(showBanner, 1000);
    } else {
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
                const customizeText = btnCustomize.getAttribute("data-customize") || "Customize";
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

    function handleScroll() {
        if (!reopenBtn) return;

        if (banner && !banner.classList.contains("pointer-events-none")) {
            reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
            return;
        }

        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
            return;
        }

        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (scrollHeight - scrollY - clientHeight <= 150) {
            reopenBtn.classList.add("scale-0", "opacity-0", "pointer-events-none");
        } else {
            reopenBtn.classList.remove("scale-0", "opacity-0", "pointer-events-none");
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Run on start
    handleScroll();
}

// Run initialization when DOM is loading
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookieBanner);
} else {
    initCookieBanner();
}