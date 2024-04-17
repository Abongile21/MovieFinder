const wishlist = []

async function searchMovie() {
    const movieNameInput = document.getElementById('movieNameInput');
    const movieName = movieNameInput.value.trim();
    const searchResultContainer = document.getElementById('searchResultContainer')

    try {
        const response = await fetch('movies.json'); // Fetch local JSON file
        const data = await response.json();

        let foundMovie = null;
        for (const movie of data) {
            if (movie.movie.toLowerCase().includes(movieName.toLowerCase())) { // Case-insensitive comparison
                foundMovie = movie;
                break;
            }
        }

        if (foundMovie) {
            const movieHTML = `
                <div class="movieItem">
                    <h3>${foundMovie.movie}</h3>
                    <img src="${foundMovie.image}" alt="${foundMovie.movie}">
                    <p>Rating: ${foundMovie.rating}</p>
                    <div class="buttons">
                        <button onclick="addToFavourites('${foundMovie.movie}', '${foundMovie.image}')" id="_wishList">Add to wishlist</button>
                        <button id="watchBtn"><a href="${foundMovie.imdb_url}" target="_blank"></a></button>
                    </div>
                    <button id="_more"><a href="${foundMovie.imdb_url}" target="_blank">More</a></button>
                </div>
            `;

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
