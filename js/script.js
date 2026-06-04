const heroCards = document.querySelectorAll(".hero-card");
const heroModal = document.getElementById("heroModal");
const modalHeroImage = document.getElementById("modalHeroImage");
const modalHeroName = document.getElementById("modalHeroName");
const closeModal = document.getElementById("closeModal");

heroCards.forEach((card) => {
    const button = card.querySelector("button");

    button.addEventListener("click", () => {
        modalHeroName.textContent = card.dataset.name;
        modalHeroImage.src = card.dataset.img;
        modalHeroImage.alt = card.dataset.name;

        heroModal.classList.add("active");
    });
});

closeModal.addEventListener("click", () => {
    heroModal.classList.remove("active");
});