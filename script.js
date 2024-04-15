async function searchMovie() {
    const movieNameInput = document.getElementById('movieNameInput');
    const movieName = movieNameInput.value.trim();
    const searchResultContainer = document.getElementById('searchResultContainer');

    try {
        const response = await fetch(`https://dummyapi.online/api/movies?name=${movieName}`);
        const data = await response.json();

        const matchingMovies = data.filter(movie => movie.movie.toLowerCase() === movieName.toLowerCase());

        if (matchingMovies.length > 0) {
            const movieHTML = matchingMovies.map(movie => {
                return `<div class="movieItem">
                            <h3>${movie.movie}</h3>
                            <img src="${movie.image}" alt="${movie.movie}">
                            <p>Rating: ${movie.rating}</p>
                            <button id="watchBtn"><a href="${movie.imdb_url}" target="_blank">Watch</a></button>
                        </div>`;
            }).join('');

            searchResultContainer.innerHTML = movieHTML;
        } else {
            searchResultContainer.innerHTML = '<p>No movies found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        searchResultContainer.innerHTML = '<p>Error fetching data.</p>';
    }
}
