const filter = document.querySelector(".filter").childNodes;

filter.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
        const button = e.currentTarget;
        if (button.classList.contains("active")) return;
        button.classList.add("active");

        filter.forEach((item) => {
            if (item !== button && item.classList) {
                item.classList.remove("active");
            }
        });

        const value = btn.textContent;

        await fetchFeed(value);
    });
});

const fetchFeed = (BTN) => {
    fetch(`/feed/${BTN}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => {
        window.location.href = `/feed?val=${BTN}`;
    });
};

//Funktion för att öppna menyn till höger
function openSuggestionsMeny() {
    document.getElementById("suggestions").style.width = "12%";
}
//Funktion för att stänga menyn till höger
function closeSuggestionsMeny() {
    document.getElementById("suggestions").style.width = "0";
}
