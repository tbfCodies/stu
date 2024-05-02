document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      console.log("Clicked on: " + this.textContent);
    });
  });

  const campusButton = document.querySelector(".campusBTN");
  const vannerButton = document.querySelector(".vannerBTN");

  if (campusButton && vannerButton) {
    campusButton.addEventListener("click", handleCampusButtonClick);
    vannerButton.addEventListener("click", handleVannerButtonClick);

    // Välj CAMPUS första gången.
    campusButton.classList.add("active");
    console.log("Default button set to active: " + campusButton.textContent);
  }
});

function handleCampusButtonClick() {
  const vannerButton = document.querySelector(".vannerBTN");
  if (vannerButton.classList.contains("active")) {
    vannerButton.classList.remove("active");
    console.log("Deselecting Vänner button");
  }
  console.log("Campus button clicked");
  loadCampusPosts();
}

function handleVannerButtonClick() {
  const campusButton = document.querySelector(".campusBTN");
  if (campusButton.classList.contains("active")) {
    campusButton.classList.remove("active");
    console.log("Deselecting Campus button");
  }
  console.log("Vänner button clicked");
  loadFriendPosts();
}

function loadCampusPosts() {
  // Hämta campus inlägg
  console.log("Hämta campus inlägg....");
  updatePosts("{id: 151581}");
}

function loadFriendPosts() {
  // Hämta vänner inlägg
  console.log("Hämta vänner inlägg....");
  updatePosts("{id: 131231}");
}

function updatePosts(posts) {
  // Updatera inläggen
  console.log("Uppdaterar inläggen");
  console.log(posts);
}

//Funktion för att öppna menyn till höger
function openSuggestionsMeny() {
  document.getElementById("suggestions").style.width = "12%";
}
//Funktion för att stänga menyn till höger
function closeSuggestionsMeny() {
  document.getElementById("suggestions").style.width = "0";
}
