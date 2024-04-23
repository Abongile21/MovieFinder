const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg', 'fences.jpg'];
let currentSlide = 0;

const slideshowContainer = document.getElementById('imageshow');
const movieNameInput = document.getElementById('movieNameInput');
const searchResultContainer = document.getElementById('searchResultContainer');
const wishlistContainer = document.getElementById('wishlistContainer');
const recommendationContainer = document.getElementById('recommendationContainer');
let isDlayed = true 
let isDlayedW = false 
// Load wishlist on page load
document.addEventListener('DOMContentLoaded', () => {
    displaySlide();
    setInterval(showNextSlide, 3000);


    // fetchWishlist();
});

// Show next slide
function showNextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    displaySlide();
}

// Show previous slide
function showPrevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    displaySlide();
}

// Display slide
function displaySlide() {
    slideshowContainer.innerHTML = `<img class="slides" src="images/${images[currentSlide]}" alt="Slide">`;
}

// Display slide initially and set interval
// Search for movies
async function searchMovie() {

    if(isDlayedW){
        wishlistContainer.style.display = 'none'
        searchResultContainer.style.display = "grid";
        isDlayedW = false 
        isDlayed = true
    }

    const movieName = movieNameInput.value.trim();

    try {
        const response = await fetch('movies.json');
        const data = await response.json();

        const filteredMovies = data.filter(movie =>
            movie.movie.toLowerCase().includes(movieName.toLowerCase())
        );

        if (filteredMovies.length > 0) {
            const movieHTML = filteredMovies.map((foundMovie, index) => `
                <div class="movieItem">
                    <img src="${foundMovie.image}" alt="${foundMovie.movie}">
                    <h3>${foundMovie.movie}</h3>
                    <p>⭐${foundMovie.rating}</p>
                    <div class="buttons">
                        <button id="wishlistButton_${index}" onclick="addToWishlist(${index}, '${foundMovie.movie}', '${foundMovie.image}', '${foundMovie.rating}', '${foundMovie.imdb_url}')"><i class="fa-regular fa-bookmark"></i></button>
                        <button><a href="${foundMovie.imdb_url}" target="_blank"><i class="fa-solid fa-info"></i></a></button>
                    </div>
                </div>
            `).join('');

            searchResultContainer.innerHTML = movieHTML;
        } else {
            searchResultContainer.innerHTML = '<p>No movies found.</p>';
            displaySlide();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        searchResultContainer.innerHTML = '<p>Error fetching data.</p>';
    }
}

// Add movie to wishlist
function addToWishlist(index, movieName, movieImage, movieRating, imdbUrl) {
    const movie = { name: movieName, image: movieImage, rating: movieRating, url: imdbUrl };
    const wishlistButton = document.getElementById(`wishlistButton_${index}`);

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isDuplicate = wishlist.some(item => item.name === movieName);
    if (isDuplicate) {
        alert(`${movieName} is already in your wishlist!`);
    } else {
        wishlist.push(movie);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        wishlistButton.disabled = true;
        wishlistButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        alert(`${movieName} added to wishlist!`);
    }
}


// Fetch wishlist from localStorage and display
function fetchWishlist() {
    wishlistContainer.style.display = "grid"
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    displayWishlist(wishlist);

    if(isDlayed){
        slideshowContainer.style.display = "none";
        searchResultContainer.style.display = "none";
        isDlayed = false
        isDlayedW = true
        console.log(isDlayed, isDlayedW)
    }
    


    
}

// Display wishlist items
function displayWishlist(wishlist) {
    const wishlistContainer = document.getElementById('wishlistContainer');
    if (wishlist.length > 0) {
        const wishlistHTML = wishlist.map(item => `
            <div class="wishlistItem">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>⭐${item.rating}</p>
                <div class="buttons">
                    <button onclick="deleteFromWishlist('${item.name}')"><i class="fa-solid fa-xmark"></i></button>
                    <button><a href="${item.url}" target="_blank"><i class="fa-solid fa-info"></i></a></button>
                </div>

        
            </div>
        `).join('');

        wishlistContainer.innerHTML = wishlistHTML;
    } else {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    }
}

// Delete movie from wishlist
function deleteFromWishlist(movieName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const updatedWishlist = wishlist.filter(item => item.name !== movieName);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    alert(`${movieName} removed from wishlist.`);
    displayWishlist(updatedWishlist);
}

// wishlistContainer.addEventListener("click",()=>{
//     wishlistContainer.style.display = "none"
// })