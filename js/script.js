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
const apiKey = '69BZKAD-JDNM3W1-MWHPNTA-D9K458R';

fetch(url, {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey
    }
})
.then((response) => {
    return response.json();
})
.then((data) => {
    showMoviesList(data);
})
.catch((error) => {
    console.error(error);
    showNoMovies();
});


const formatPhoneNumber = function(phoneNumber) {
    if (phoneNumber.startsWith('+7')) {
        phoneNumber = phoneNumber.slice(2);
    } else if (phoneNumber.startsWith('7') || phoneNumber.startsWith('8')) {
        phoneNumber = phoneNumber.slice(1);
    }

    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 3) {
        return '+7 (' + phoneNumber;
    }

    if (phoneNumberLength < 6) {
        return '+7 (' + phoneNumber.substring(0, 3) + ') ' + phoneNumber.substring(3);
    }

    if (phoneNumberLength < 9) {
        return '+7 (' + phoneNumber.substring(0, 3) + ') ' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6);
    }

    return '+7 (' + phoneNumber.substring(0, 3) + ') ' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6, 8) + '-' + phoneNumber.substring(8);
}

const phoneInput = document.querySelector('.tel');
let isDeleting = false;

if(phoneInput) {
    phoneInput.addEventListener('input', e => {
        const inputValue = e.target.value.replace(/\D/g, '');
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
            isDeleting = true;
        } else {
            isDeleting = false;
            const formattedValue = formatPhoneNumber(inputValue);
            e.target.value = formattedValue;
        
            if (inputValue.length >= 12) {
                e.target.value = e.target.value.slice(0, -1);
            }
        }
    });
}

const feedbackForm = document.querySelector('.form');

feedbackForm.addEventListener('submit', function(e) {
    const phoneErrorText = document.createElement('span');
    phoneErrorText.classList.add('form__error');
    phoneErrorText.textContent = 'Введите корректный номер телефона';

    if (phoneInput.value.length !== 18) {
        e.preventDefault();
        
        const formError = this.querySelector('.form__error');

        if(!formError) {
            phoneInput.parentNode.insertBefore(phoneErrorText, phoneInput.nextSibling);
        }

    } else {
        phoneErrorText.style.display = 'none';
        this.submit();
    }
});
