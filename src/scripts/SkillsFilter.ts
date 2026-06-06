// Client-side interactive filters, search & pagination functionality
function initSkillsFilter() {
    const searchInput = document.getElementById("skill-search") as HTMLInputElement;
    const clearButton = document.getElementById("clear-search") as HTMLButtonElement;
    const tabs = document.querySelectorAll(".category-tab") as NodeListOf<HTMLElement>;
    const cards = Array.from(document.querySelectorAll(".skill-card")) as HTMLElement[];
    const noResults = document.getElementById("no-skills-msg") as HTMLElement | null;
    const grid = document.getElementById("skills-grid") as HTMLElement | null;

    // Pagination DOM Elements
    const paginationContainer = document.getElementById("skills-pagination") as HTMLElement | null;
    const pagPrev = document.getElementById("pag-prev") as HTMLButtonElement | null;
    const pagNext = document.getElementById("pag-next") as HTMLButtonElement | null;
    const pagNumbers = document.getElementById("pag-numbers") as HTMLButtonElement | null;

    if (!searchInput) return;

    let currentPage: number = 1;
    const itemsPerPage: number = 9;
    let filteredCards: any[] = [];

    function displayPage(page: number) {
        currentPage = page;
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Show/Hide cards according to page range
        cards.forEach((card) => {
            const isFiltered = filteredCards.includes(card);
            const cardIdx = filteredCards.indexOf(card);

            if (isFiltered && cardIdx >= startIndex && cardIdx < endIndex) {
                card.classList.remove("hidden");
                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "scale(1) translateY(0)";
                }, 50);
            } else {
                card.style.opacity = "0";
                card.style.transform = "scale(0.95) translateY(5px)";
                setTimeout(() => {
                    if (card.style.opacity === "0") {
                        card.classList.add("hidden");
                    }
                }, 150);
            }
        });

        // Update Prev/Next buttons
        if (pagPrev) pagPrev.disabled = (currentPage === 1);
        if (pagNext) pagNext.disabled = (currentPage === totalPages || totalPages === 0);

        // Re-render Page Numbers
        if (pagNumbers) {
            pagNumbers.innerHTML = "";
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("button");
                btn.textContent = i.toString();
                btn.className = `page-btn px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all border border-underline/10 bg-bg-card text-route hover:border-highlight/30 hover:bg-highlight/5 active:scale-95 ${i === currentPage ? "active" : ""}`;
                btn.addEventListener("click", () => {
                    displayPage(i);
                    document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
                });
                pagNumbers.appendChild(btn);
            }
        }
    }

    function filter() {
        const query = searchInput.value.toLowerCase().trim();
        const activeTab =
            (document.querySelector(".category-tab.active") as HTMLElement)?.dataset
                .category || "all";

        // Find all matching cards
        filteredCards = cards.filter((card) => {
            const category = card.dataset.category;
            const searchText = card.dataset.search || "";
            const matchesCategory = activeTab === "all" || category === activeTab;
            const matchesSearch = query === "" || searchText.includes(query);
            return matchesCategory && matchesSearch;
        });

        const visibleCount = filteredCards.length;

        // Show/hide clear search button
        if (query.length > 0) {
            clearButton?.classList.remove("hidden");
        } else {
            clearButton?.classList.add("hidden");
        }

        // Handle empty state & pagination display
        if (visibleCount === 0) {
            noResults?.classList.remove("hidden");
            grid?.classList.add("hidden");
            paginationContainer?.classList.add("hidden");
        } else {
            noResults?.classList.add("hidden");
            grid?.classList.remove("hidden");

            const totalPages = Math.ceil(visibleCount / itemsPerPage);
            if (totalPages > 1) {
                paginationContainer?.classList.remove("hidden");
                if (paginationContainer) {
                    setTimeout(() => {
                        paginationContainer.style.opacity = "1";
                        paginationContainer.style.transform = "translateY(0)";
                    }, 50);
                }
            } else {
                paginationContainer?.classList.add("hidden");
            }

            // Reset back to page 1 on filter adjustment
            displayPage(1);
        }
    }

    // Prev/Next button click listeners
    pagPrev?.addEventListener("click", () => {
        if (currentPage > 1) {
            displayPage(currentPage - 1);
            document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }
    });

    pagNext?.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            displayPage(currentPage + 1);
            document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }
    });

    // Search Input listener
    searchInput.addEventListener("input", filter);

    // Clear Search button
    clearButton?.addEventListener("click", () => {
        searchInput.value = "";
        filter();
        searchInput.focus();
    });

    // Tab click listeners
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            filter();
        });
    });

    // Execute initial filter
    filter();
}

// Run on initial load
initSkillsFilter();

// Support Astro View Transitions page swaps
document.addEventListener("astro:after-swap", initSkillsFilter);