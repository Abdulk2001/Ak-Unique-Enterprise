window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");

    if (!nav) return; 

    if (window.scrollY > 50) {
        nav.classList.add("fixed");
    } else {
        nav.classList.remove("fixed");
    }
});