// Array of image filenames in the 'images/' folder
const images = ['lion_king.jpg', 'avengers_endgame.jpg', 'her.jpg','fences.jpg'];

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
    const movieNameInput = document.getElementById('movieNameInput');
    const movieName = movieNameInput.value.trim();
    const searchResultContainer = document.getElementById('searchResultContainer')

    try {
        const response = await fetch('movies.json'); // Fetch local JSON file
        const data = await response.json();

        const filteredMovies = data.filter(movie =>
            movie.movie.toLowerCase().includes(movieName.toLowerCase())
        );

        if (filteredMovies.length > 0) {
            const movieHTML = filteredMovies.map(foundMovie => `
                <div class="movieItem">
                    <img src="${foundMovie.image}" alt="${foundMovie.movie}">
                    <h4>${foundMovie.movie}</h4>
                    <p>⭐${foundMovie.rating}</p>
                    <div class="buttons">
                        <button onclick="addToWishList('${foundMovie.movie}', '${foundMovie.image}')">Add to wishlist</button>
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

function addToFavourites(movie, image){
    const movieDetails = {
        movie:movie,
        "image":image
    }
    wishlist.push(movieDetails)
    alert("Added " + movieDetails.movie + " to wishlist")
}