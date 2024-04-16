async function searchMovie() {
    const movieNameInput = document.getElementById('movieNameInput');
    const movieName = movieNameInput.value.trim();
    const searchResultContainer = document.getElementById('searchResultContainer');

    try {
        const response = await fetch(`https://dummyapi.online/api/movies?name=${movieName}`);
        const data = await response.json();

        let foundMovie = null;
        for (const movie of data) {
            if (movie.movie === movieName) {
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
                        <button id="watchBtn"><a href="${foundMovie.imdb_url}" target="_blank">About</a></button>
                        <button id="watchBtn"><a href="${foundMovie.imdb_url}" target="_blank"></a></button>
                    </div>
                    <button id="watchBtn"><a href="${foundMovie.imdb_url}" target="_blank">Watch</a></button>
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

const 