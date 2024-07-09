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
    
    const noPoster = 'images/no-poster.jpg';
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
const apiKey = 'DB406NV-G26MB2F-N12KM5M-V3NSBKH';

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
        console.error(error);
        showNoMovies();
    });


const formatPhoneNumber = function(phoneNumber) {
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) {
        return '+7 (' + phoneNumber;
    }

    if (phoneNumberLength < 7) {
        return '+7 (' + phoneNumber.substring(1, 4) + ') ' + phoneNumber.substring(4);
    }

    if (phoneNumberLength < 10) {
        return '+7 (' + phoneNumber.substring(1, 4) + ') ' + phoneNumber.substring(4, 7) + '-' + phoneNumber.substring(7);
    }

    return '+7 (' + phoneNumber.substring(1, 4) + ') ' + phoneNumber.substring(4, 7) + '-' + phoneNumber.substring(7, 9) + '-' + phoneNumber.substring(9, 12);
}

const phoneInput = document.querySelector('.tel');

if(phoneInput) {
    phoneInput.addEventListener('input', e => {
        const inputValue = e.target.value.replace(/\D/g, '');
        const formattedValue = formatPhoneNumber(inputValue);
    
        e.target.value = formattedValue;
    
        if (inputValue.length >= 12) {
            e.target.value = e.target.value.slice(0, -1);
        }
    });
}