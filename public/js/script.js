document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      console.log("klickade på: " + this.textContent);
    });
  });

  // Väljer campus första gången man öpnnar sidan
  const campusButton = document.querySelector(".campusBTN");
  if (campusButton) {
    campusButton.classList.add("active");
    console.log("Default button set to active: " + campusButton.textContent);
  }
});
