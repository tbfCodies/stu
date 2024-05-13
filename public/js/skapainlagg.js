//Hämta referenser
const chooseFile = document.getElementById("bild");
const imgPreview = document.getElementById("bild-forhandsvisning");

//Om en bild laddats upp anropas funktionen getImgData
chooseFile.addEventListener("change", function () {
    getImgData();
});

//Hämta bilddata
function getImgData() {
    const files = chooseFile.files[0];
    //Kontrollera om en bild laddats upp
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            //Visa bilden som laddats upp
            imgPreview.style.display = "block";
            imgPreview.innerHTML = '<img src="' + this.result + '" />';
        });
    }
}
