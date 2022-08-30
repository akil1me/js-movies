let elMoviesInput = document.querySelector(".movies__input");
let elMoviesSelect = document.querySelector(".movies__select");
let elMoviesList = document.querySelector(".movies__list");
let elMoviesTemplate = document.querySelector("#movies__template").content;
let elItem = document.querySelector(".movies__item");

let elMoviesSelectSort = document.querySelector(".movies__select-sort");

movies = movies.slice(0, 100);

let arr = [];

let elMoviesArr = movies.forEach(movie => {
  arr.push(
    {
      title: movie.fulltitle,
      reting: `Reting film:  ${movie.imdb_rating}`,
      img: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
      imdb: `https://www.imdb.com/title/${movie.imdb_id}/?ref_=hm_tpks_tt_i_6_pd_tp1_pbr_ic`,
      category: `<strong>Categorys:</strong> ${movie.Categories}`,
      ytid: movie.ytid,
      retImdb: movie.imdb_rating
    }
  )
})


let createElementMovies = (movie) => {
  let newElItem = elMoviesTemplate.cloneNode(true);

  newElItem.querySelector(".movie__link").href = movie.imdb;

  newElItem.querySelector(".movie__img").src = movie.img;
  newElItem.querySelector(".movie__img").alt = movie.title;

  newElItem.querySelector(".movie__title").textContent = movie.title;
  newElItem.querySelector(".movie__reting").textContent = movie.reting;

  newElItem.querySelector(".movie__category").innerHTML = movie.category.split("|").join(", ");

  return newElItem;
}

let renderMovies = (movies) => {
  elMoviesList.innerHTML = null;

  let elNewWrapper = document.createDocumentFragment();

  movies.forEach(movie => {
    if (movie.ytid != "") {
      elNewWrapper.append(createElementMovies(movie));
    }
  })

  elMoviesList.appendChild(elNewWrapper);

}

renderMovies(arr);

let categorys = [...new Set(movies.map(movie => movie.Categories.split("|")).flat())].sort();

categorys.forEach(movie => {
  let categoryOption = document.createElement("option");

  categoryOption.textContent = movie;
  categoryOption.value = movie;

  elMoviesSelect.appendChild(categoryOption);
})

elMoviesSelect.addEventListener("change", () => {
  let filt = arr.filter(movie => movie.category.includes(elMoviesSelect.value));

  if (elMoviesSelect.value == "choose-category") {
    renderMovies(arr);
  } else {
    renderMovies(filt);
  }
})

elMoviesInput.oninput = () => {
  let inputValue = elMoviesInput.value;

  let regExp = new RegExp(inputValue.trim(), "gi")

  let filmName = arr.filter(movie => regExp.test(movie.title));

  renderMovies(filmName);
}

let arrDefault = arr.slice(0, 100);

elMoviesSelectSort.addEventListener("change", function () {

  if (this.value == "choose-sort-default") {
    renderMovies(arrDefault);
  }

  else if (this.value == "choose-sort-A-Z") {
    arr = arr.sort((a, b) => {
      let movName1 = a.title.toLowerCase();
      let movName2 = b.title.toLowerCase();
      if (movName1 < movName2) return -1
      return 1
    });
    renderMovies(arr);
  }

  else if (this.value == "choose-sort-Z-A") {
    arr = arr.sort((a, b) => {
      let movName1 = a.title.toLowerCase();
      let movName2 = b.title.toLowerCase();
      if (movName1 > movName2) return -1
      return 1
    });
    renderMovies(arr);
  }

  else if (this.value == "choose-sort-0-10") {
    arr = arr.sort((a, b) => a.retImdb - b.retImdb);
    renderMovies(arr);
  }

  else if (this.value == "choose-sort-10-0") {
    arr = arr.sort((a, b) => b.retImdb - a.retImdb);
    renderMovies(arr);
  }

})


