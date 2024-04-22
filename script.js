// Array of image filenames in the 'images/' folder
const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg','fence.jpg'];

let currentSlide = 0;
const slideshowContainer = document.getElementById('imageshow');

function showNextSlide() {
    currentSlide = (currentSlide + 1) % images.length;
    displaySlide();
}

function showPrevSlide() {
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    displaySlide();
}
function displaySlide() {
    slideshowContainer.innerHTML = `<img class="slides" src="images/${images[currentSlide]}" alt="Slide">`;
}
displaySlide();
setInterval(showNextSlide, 3000);


// Function to fetch and display movies based on search criteria
async function searchMovie() {
    const movieName = movieNameInput.value.trim();

    try {
        const response = await fetch('movies.json');
        const data = await response.json();

        const filteredMovies = data.filter(movie =>
            movie.movie.toLowerCase().includes(movieName.toLowerCase())
        );

        if (filteredMovies.length > 0) {
            const movieHTML = filteredMovies.map(foundMovie => `
                <div class="movieItem">
                    <h3>${foundMovie.movie}</h3>
                    <img src="${foundMovie.image}" alt="${foundMovie.movie}">
                    <p>Rating: ${foundMovie.rating}</p>
                    <div class="buttons">
                        <button onclick="addToWishlist('${foundMovie.movie}', '${foundMovie.image}', '${foundMovie.rating}', '${foundMovie.imdb_url}')" id="_wishList">Add to wishlist</button>
                        <button id="_more"><a href="${foundMovie.imdb_url}" target="_blank">More</a></button>
                    </div>
                </div>
            `).join('');

            searchResultContainer.innerHTML = movieHTML;
        } else {
            searchResultContainer.innerHTML = '<p>No movies found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        searchResultContainer.innerHTML = '<p>Error fetching data.</p>';
    }
}

// Global variables

// Function to fetch and display recommendations
async function displayRecommendation(recommendations) {
    if (recommendations.length > 0) {
        const recommendationHTML = recommendations.map(movie => `
            <div class="recommendedItem">
                <h3>${movie.movie}</h3>
                <img src="${movie.image}" alt="${movie.movie}">
                <p>Rating: ${movie.rating}</p>
                <div class="buttons">
                    <button onclick="addToWishlist('${movie.movie}', '${movie.image}', '${movie.rating}', '${movie.imdb_url}')" id="_wishList">Add to wishlist</button>
                    <button id="_more"><a href="${movie.imdb_url}" target="_blank">More</a></button>
                </div>
            </div>
        `).join('');

        recommendationContainer.innerHTML = recommendationHTML;
    } else {
        recommendationContainer.innerHTML = '<p>No recommendations available.</p>';
    }
}

// Function to fetch and display the wishlist
function displayWishlist(wishlist) {
    if (wishlist.length > 0) {
        const wishlistHTML = wishlist.map(item => `
            <div class="wishlistItem">
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}">
                <p>Rating: ${item.rating}</p>
                <div class="buttons">
                    <button onclick="deleteFromWishlist('${item.name}')" id="_delete">Remove</button>
                    <button id="_more"><a href="${item.url}" target="_blank">More</a></button>
                </div>
            </div>
        `).join('');

        wishlistContainer.innerHTML = wishlistHTML;
    } else {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    }
}



// Function to add a movie to the wishlist
function addToWishlist(movieName, movieImage, movieRating, imdbUrl) {
    const movie = { name: movieName, image: movieImage, rating: movieRating, url: imdbUrl };
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const isDuplicate = wishlist.some(item => item.name === movieName);

    if (!isDuplicate) {
        wishlist.push(movie);
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Save wishlist to localStorage
        alert(`${movieName} added to wishlist!`);
    } else {
        alert(`${movieName} is already in your wishlist!`);
    }
}

// Function to delete a movie from the wishlist
function deleteFromWishlist(movieName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.name !== movieName);
    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Update wishlist in localStorage
    alert(`${movieName} removed from wishlist.`);
}

// Fetch and display initial recommendation when the page loads
async function fetchRecommendationData() {
    try {
        const response = await fetch('recommendation.json'); // Assume this is your recommendation data file
        const data = await response.json();
        displayRecommendation(data.recommendations); // Display recommendations
    } catch (error) {
        console.error('Error fetching recommendation data:', error);
        recommendationContainer.innerHTML = '<p>Error fetching recommendation data.</p>';
    }
}

// Fetch and display initial wishlist when the page loads
displayWishlist(JSON.parse(localStorage.getItem('wishlist')) || []); // Display wishlist from localStorage
document.addEventListener('DOMContentLoaded', () => {
   
   
    displayWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
});