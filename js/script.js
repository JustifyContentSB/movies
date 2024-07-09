const hidePreloader = () => {
    const preloader = document.querySelector('.preloader');

    if(preloader) {
        preloader.style.display = 'none';
    }
}

const showNoMovies = () => {
    hidePreloader();

    const moviesContent = document.querySelector('.movies__content');

    const noMoviesElement = document.createElement('p');
    noMoviesElement.classList.add('movies__none');
    noMoviesElement.textContent = 'Фильмов не найдено';

    moviesContent.appendChild(noMoviesElement);
}

const showMoviesList = function(movies) {
    hidePreloader();

    if(!movies) {
        showNoMovies();

        return;
    }

    const moviesContent = document.querySelector('.movies__content');

    const moviesList = document.createElement('ul');
    moviesList.className = 'movies__list';
    moviesContent.appendChild(moviesList);
    
    const noPoster = '../images/no-poster.jpg';
    const noName = 'Название фильма отсутствует';

    if(movies.docs) {
        movies.docs.forEach(movie => {
            let posterUrl;
            let movieName;

            if (movie.poster && movie.poster.previewUrl) {
                posterUrl = movie.poster.previewUrl;
            } else if (movie.alternativePosterUrl) {
                posterUrl = movie.alternativePosterUrl;
            } else {
                posterUrl = noPoster;
            }

            if (movie.name) {
                movieName = movie.name;
            } else if (movie.alternativeName) {
                movieName = movie.alternativeName;
            } else {
                movieName = noName;
            }

            const movieElement = `
                <li class="movies__item">
                    <a class="movies__link" href="#">
                        <div class="movies__img"><img src="${posterUrl}"></div>
                        <div class="movies__info">
                            <h3 class="movies__name">${movieName}</h3>
                        </div>
                    </a>
                </li>
            `;

            moviesList.insertAdjacentHTML('beforeend', movieElement);
        });
    }
}

const url = 'https://api.kinopoisk.dev/v1.4/movie?rating.imdb=8-10';
const apiKey = 'P3RTS9G-2YH4XAV-QWKVWAZ-E9XFFDQ';

fetch(url, {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey
    }
})
    .then(response => response.json())
    .then(data => {
        showMoviesList(data);
    })
    .catch(error => {
        showNoMovies();
    });
