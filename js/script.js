let elMoviesList = document.querySelector(".movies__list");
let elMoviesTemplate = document.querySelector("#movies__template").content;
let elItem = document.querySelector(".movies__item")

let elMoviesArr = movies.map(movie => {
  return {
    title: movie.fulltitle,
    reting: `Reting film:  ${movie.imdb_rating}`,
    img: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    imdb: `https://www.imdb.com/title/${movie.imdb_id}/?ref_=hm_tpks_tt_i_6_pd_tp1_pbr_ic`,
    category: `<strong>Categorys:</strong> ${movie.Categories}`,
    ytid: movie.ytid
  }
})

let createElementMovies = (movie) => {
  let newElItem = elMoviesTemplate.cloneNode(true);

  newElItem.querySelector(".movie__link").href = movie.imdb;

  newElItem.querySelector(".movie__img").src = movie.img;
  newElItem.querySelector(".movie__img").alt = movie.title;

  newElItem.querySelector(".movie__title").textContent = movie.title
  newElItem.querySelector(".movie__reting").textContent = movie.reting;

  newElItem.querySelector(".movie__category").innerHTML = movie.category.split("|").join(", ")

  return newElItem;
}

let renderMovies = (movies) => {
  elMoviesList.innerHTML = "";

  let elNewWrapper = document.createDocumentFragment();

  movies.forEach(movie => {
    if (movie.ytid != "") {
      elNewWrapper.append(createElementMovies(movie));
    }
  })

  elMoviesList.appendChild(elNewWrapper)
}

renderMovies(elMoviesArr)


