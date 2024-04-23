const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg', 'fences.jpg'];
let currentSlide = 0;
const slideshowContainer = document.getElementById('imageshow');
const movieNameInput = document.getElementById('movieNameInput');
const searchResultContainer = document.getElementById('searchResultContainer');
const wishlistContainer = document.getElementById('wishlistContainer');
const recommendationContainer = document.getElementById('recommendationContainer');

document.addEventListener('DOMContentLoaded', () => {
    fetchWishlist();
});

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
            const movieHTML = filteredMovies.map((foundMovie, index) => `
                <div class="movieItem">
                    <img src="${foundMovie.image}" alt="${foundMovie.movie}">
                    <h3>${foundMovie.movie}</h3>
                    <p>⭐${foundMovie.rating}</p>
                    <div class="buttons">
                        <button onclick="addToPlaylist('${foundMovie.movie}', '${foundMovie.image}', '${foundMovie.rating}', '${foundMovie.imdb_url}')"><i class="fa-regular fa-bookmark"></i> Add to Playlist</button>
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

function addToPlaylist(movieName, movieImage, movieRating, imdbUrl) {
    const movie = { name: movieName, image: movieImage, rating: movieRating, url: imdbUrl };

    let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    playlist.push(movie);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    alert(`${movieName} added to playlist!`);
}

function fetchWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    displayWishlist(wishlist);
}

function displayWishlist(wishlist) {
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

function deleteFromWishlist(movieName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const updatedWishlist = wishlist.filter(item => item.name !== movieName);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    alert(`${movieName} removed from wishlist.`);
    fetchWishlist();
}

function toggleContainerVisibility(containerId) {
    const container = document.getElementById(containerId);
    if (container.style.display === 'none') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}
