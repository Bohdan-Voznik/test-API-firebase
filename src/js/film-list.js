import  filmInfo from '../partials/film-item.hbs';

export function createMarkup (films) {
    const FilmsList = filmInfo(films);
    return FilmsList;
} 