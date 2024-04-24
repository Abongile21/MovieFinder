const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg', 'fences.jpg'];
let currentSlide = 0;

const slideshowContainer = document.getElementById('imageshow');
const movieNameInput = document.getElementById('movieNameInput');
const searchResultContainer = document.getElementById('searchResultContainer');
const wishlistContainer = document.getElementById('wishlistContainer');
const recommendationContainer = document.getElementById('recommendationContainer');

document.addEventListener('DOMContentLoaded', () => {
    displaySlide();
    setInterval(showNextSlide, 3000);
    searchMovie();
    display("main");
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
                        <button id="wishlistButton_${index}" onclick="addToWishlist(${index}, '${foundMovie.movie}', '${foundMovie.image}', '${foundMovie.rating}', '${foundMovie.imdb_url}')"><i class="fa-regular fa-bookmark"></i></button>
                        <button><a href="${foundMovie.imdb_url}" target="_blank"><i class="fa-solid fa-play"></i></a></button>
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

function fetchWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    displayWishlist(wishlist);
    display("wish");
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
                    <button><a href="${item.url}" target="_blank"><i class="fa-solid fa-play"></i></a></button>
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
    displayWishlist(updatedWishlist);
}

function calculateAverageRating(wishlist) {
    if (wishlist.length === 0) return 0;

    const totalRating = wishlist.reduce((sum, movie) => sum + parseFloat(movie.rating), 0);
    return totalRating / wishlist.length;
}

function recommendMovies() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const averageRating = calculateAverageRating(wishlist);

    const recommendedMovies = data.filter(movie => parseFloat(movie.rating) > averageRating);
    displayRecommendations(recommendedMovies);
}

function displayRecommendations(recommendedMovies) {
    if (recommendedMovies.length > 0) {
        const recommendationHTML = recommendedMovies.map(movie => `
            <div class="movieItem">
                <img src="${movie.image}" alt="${movie.movie}">
                <h3>${movie.movie}</h3>
                <p>⭐${movie.rating}</p>
                <div class="buttons">
                    <button><a href="${movie.imdb_url}" target="_blank"><i class="fa-solid fa-play"></i></a></button>
                </div>
            </div>
        `).join('');

        recommendationContainer.innerHTML = recommendationHTML;
    } else {
        recommendationContainer.innerHTML = '<p>No recommendations based on your wishlist.</p>';
    }
}

function display(cont) {
    switch (cont) {
        case "main":
            wishlistContainer.style.display = 'none';
            searchResultContainer.style.display = "grid";
            recommendationContainer.style.display = "none";
            slideshowContainer.style.display = "block";
            break;

        case "wish":
            wishlistContainer.style.display = 'grid';
            searchResultContainer.style.display = "none";
            recommendationContainer.style.display = "none";
            slideshowContainer.style.display = "none";
            break;

        case "recom":
            wishlistContainer.style.display = 'none';
            searchResultContainer.style.display = "none";
            recommendationContainer.style.display = "grid";
            slideshowContainer.style.display = "none";
            break;
    }
}
