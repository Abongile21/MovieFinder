// Array of image filenames in the 'images/' folder
const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg','fence.jpg'];

let currentSlide = 0;
const slideshowContainer = document.getElementById('imageshow');

// Function to display the next image in the slideshow
function showNextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    displaySlide();
}

// Function to display the previous image in the slideshow
function showPrevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    displaySlide();
}

// Function to display the current slide
function displaySlide() {
    slideshowContainer.innerHTML = `<img class="slides" src="images/${images[currentSlide]}" alt="Slide">`;
}

// Initial display of the first slide
displaySlide();

// Automatically move to the next slide every 3 seconds
setInterval(showNextSlide, 3000);
