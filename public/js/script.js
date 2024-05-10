const filter = document.querySelector(".filter").childNodes;

filter.forEach((btn) => {

    // Tar aktiva knappen ifrån localstorage i browsern. Om den finns annars är den bara tom
    const activeButtonValue = localStorage.getItem("activeButton");

    btn.addEventListener("click", async (e) => {

        const button = e.currentTarget;
        if (button.classList.contains("active")) return;
        button.classList.add("active");

        filter.forEach((item) => {
            if (item !== button && item.classList) {
                item.classList.remove("active");
            }
        });

        // Sparar den valda knappen som den aktiva knappen.
        const value = btn.textContent;
        localStorage.setItem("activeButton", value);
        await fetchFeed(value);
    });
    
    // Om det finns en aktiv knapp och värdet matchar den i localstorage så läggs klassen "active" till.
    if (activeButtonValue && btn.textContent === activeButtonValue) {
        btn.classList.add("active");
    }
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
    document.getElementById("suggestions").classList.add("open")
}
//Funktion för att stänga menyn till höger
function closeSuggestionsMeny() {
    document.getElementById("suggestions").classList.remove("open")
}
