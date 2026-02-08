document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "images/contact-page-00.png",
        "images/contact-page-01.png",
        "images/contact-page-02.png",
        "images/contact-page-03.png",
        "images/contact-page-04.png",
        "images/contact-page-05.png",
        "images/contact-page-06.png",
        "images/contact-page-07.png",
    ];

    const rotatingImage = document.getElementById("rotating-image");
    const recentImages = new Set();
    let currentIndex = 0;

    function changeImage() {
        do {
            currentIndex = Math.floor(Math.random() * images.length);
        } while (recentImages.has(currentIndex));

        recentImages.add(currentIndex);
        if (recentImages.size > 5) {
            recentImages.delete([...recentImages][0]);
        }

        rotatingImage.src = images[currentIndex];
        rotatingImage.classList.remove("fade");
        rotatingImage.classList.add("initial");

        void rotatingImage.offsetWidth;

        setTimeout(() => {
            rotatingImage.classList.remove("initial");
            rotatingImage.classList.add("fade");
        }, 30);
    }

    setInterval(changeImage, 3000);
});
