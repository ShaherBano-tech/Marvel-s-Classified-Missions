const heroCards = document.querySelectorAll(".hero-card");
const heroPopup = document.getElementById("heroPopup");
const popupHeroImage = document.getElementById("popupHeroImage");
const popupHeroName = document.getElementById("popupHeroName");
const closePopup = document.getElementById("closePopup");

heroCards.forEach((card) => {
    card.addEventListener("click", () => {
        const heroName = card.dataset.name;
        const heroImage = card.dataset.img;

        popupHeroName.textContent = heroName;
        popupHeroImage.src = heroImage;
        popupHeroImage.alt = heroName;

        heroPopup.classList.add("active");
    });
});

closePopup.addEventListener("click", () => {
    heroPopup.classList.remove("active");
});

heroPopup.addEventListener("click", (event) => {
    if (event.target === heroPopup) {
        heroPopup.classList.remove("active");
    }
});