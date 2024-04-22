const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg', 'fences.jpg'];
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
                    <p>⭐${foundMovie.rating}</p>
                    <div class="buttons">
                        <button onclick="addToWishlist('${foundMovie.movie}', '${foundMovie.image}', '${foundMovie.rating}', '${foundMovie.imdb_url}')"><i class="fa-regular fa-bookmark"></i></button>
                        <button><a href="${foundMovie.imdb_url}" target="_blank"><i class="fa-solid fa-info"></i></a></button>
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

const movieNameInput = document.getElementById('movieNameInput');
const searchResultContainer = document.getElementById('searchResultContainer');
const wishlistContainer = document.getElementById('wishlistContainer');
const recommendationContainer = document.getElementById('recommendationContainer');

async function displayRecommendation(recommendations) {
    if (recommendations.length > 0) {
        const recommendationHTML = recommendations.map(movie => `
            <div class="recommendedItem">
                <h3>${movie.movie}</h3>
                <img src="${movie.image}" alt="${movie.movie}">
                <p>Rating: ${movie.rating}</p>
                <div class="buttons">
                    <button onclick="addToWishlist('${movie.movie}', '${movie.image}', '${movie.rating}', '${movie.imdb_url}')"><i class="fa-regular fa-bookmark"></i></button>
                    <button><a href="${movie.imdb_url}" target="_blank"><i class="fa-solid fa-info"></i></a></button>
                </div>
            </div>
        `).join('');

        recommendationContainer.innerHTML = recommendationHTML;
    } else {
        recommendationContainer.innerHTML = '<p>No recommendations available.</p>';
    }
}

function displayWishlist(wishlist) {
    if (wishlist.length > 0) {
        const wishlistHTML = wishlist.map(item => `
            <div class="wishlistItem">
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}">
                <p>Rating: ${item.rating}</p>
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

function addToWishlist(movieName, movieImage, movieRating, imdbUrl) {
    const movie = { name: movieName, image: movieImage, rating: movieRating, url: imdbUrl };
    fetch('wishlist.json')
        .then(response => response.json())
        .then(wishlist => {
            wishlist.push(movie);
            fetch('wishlist.json', {
                method: 'PUT',
                body: JSON.stringify(wishlist),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => alert(`${movieName} added to wishlist!`))
                .catch(error => console.error('Error updating wishlist:', error));
        })
        .catch(error => console.error('Error fetching wishlist:', error));
}

function deleteFromWishlist(movieName) {
    fetch('wishlist.json')
        .then(response => response.json())
        .then(wishlist => {
            const updatedWishlist = wishlist.filter(item => item.name !== movieName);
            fetch('wishlist.json', {
                method: 'PUT',
                body: JSON.stringify(updatedWishlist),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => alert(`${movieName} removed from wishlist.`))
                .catch(error => console.error('Error updating wishlist:', error));
        })
        .catch(error => console.error('Error fetching wishlist:', error));
}

async function fetchRecommendationData() {
    try {
        const response = await fetch('recommendation.json');
        const data = await response.json();
        displayRecommendation(data.recommendations);
    } catch (error) {
        console.error('Error fetching recommendation data:', error);
        recommendationContainer.innerHTML = '<p>Error fetching recommendation data.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRecommendationData();
    fetch('wishlist.json')
        .then(response => response.json())
        .then(wishlist => displayWishlist(wishlist))
        .catch(error => console.error('Error fetching wishlist:', error));
});
