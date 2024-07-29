const backgroundImage = document.getElementById("scroll-background-image");
let lastKnownScrollPosition = 0;
let ticking = false;

function updateHeight(scrollPos) {
    let newHeight = 100 - (scrollPos / 10);

    if (newHeight < 60) {
        newHeight = 60;
    }

    backgroundImage.style.height = `${newHeight}vh`;
}

document.addEventListener('scroll', function() {
    lastKnownScrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (!ticking) {
        window.requestAnimationFrame(function() {
            updateHeight(lastKnownScrollPosition);
            ticking = false;
        });
        ticking = true;
    }
});
