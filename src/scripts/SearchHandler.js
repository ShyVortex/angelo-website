const searchPageInput = document.getElementById(
    "search-page-input",
);
const searchPageSubmit = document.getElementById("search-page-submit");
const header = document.querySelector("header");
const searchPath = header?.getAttribute("data-search-path") || "/cerca";

const doSearch = () => {
    if (searchPageInput) {
        const query = searchPageInput.value.trim();
        if (query) {
            window.location.href = `${searchPath}?q=${encodeURIComponent(query)}`;
        }
    }
};

searchPageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        doSearch();
    }
});

searchPageSubmit?.addEventListener("click", () => {
    doSearch();
});