// Search input and Select category
let elMoviesInput = document.querySelector(".movies__input");
let elMoviesSelect = document.querySelector(".movies__select");

// Movies list
let elMoviesList = document.querySelector(".movies__list");

// Tempalte
let elMoviesTemplate = document.querySelector("#movies__template").content;
let elItem = document.querySelector(".movies__item");

// Modal
let elModal = document.querySelector(".movie__btn-modal");
let elMoadalTitle = document.querySelector(".movie__title-modal");

// Select sort
let elMoviesSelectSort = document.querySelector(".movies__select-sort");

// Movies Favorites List 
let elMoviesFavoritesList = document.querySelector(".movie__favorites-list");

movies = movies.slice(0, 100);

let arr = [];

let arrFovorite = [];

// change key name in movies.js
let elMoviesArr = movies.forEach(movie => {
  arr.push(
    {
      titleLigt: movie.Title,
      title: movie.fulltitle,
      reting: `Reting film:  ${movie.imdb_rating}`,
      img: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
      imdb: `https://www.imdb.com/title/${movie.imdb_id}/?ref_=hm_tpks_tt_i_6_pd_tp1_pbr_ic`,
      category: `<strong>Categorys:</strong> ${movie.Categories}`,
      ytid: movie.ytid,
      retImdb: movie.imdb_rating,
      summary: movie.summary,
    }
  )
})

// create movies in Template
let createElementMovies = (movie) => {
  let newElItem = elMoviesTemplate.cloneNode(true);

  newElItem.querySelector(".movie__link").href = movie.imdb;

  newElItem.querySelector(".movie__img").src = movie.img;
  newElItem.querySelector(".movie__img").alt = movie.title;

  newElItem.querySelector(".movie__title").textContent = movie.title;
  newElItem.querySelector(".movie__reting").textContent = movie.reting;

  newElItem.querySelector(".movie__category").innerHTML = movie.category.split("|").join(", ");

  // SelectorAll Button in Template
  let elBtns = newElItem.querySelectorAll(".movie__btn");

  elBtns.forEach(elBtn => {
    elBtn.addEventListener("click", () => {
      elMoadalTitle.textContent = movie.titleLigt;
      elModal.innerHTML = `
      <img class ="rounded" src="${movie.img}" alt="${movie.titleLigt}" width="100%" height="320">
      <h4 class="h5 mt-3 mb-1">Fulltitle: ${movie.title}</h4>
      <p class="text-warning mb-1">${movie.reting}</p>
      <p class="mb-1">${movie.category.split("|").join(", ")}</p>
      <p class="mb-0">${movie.summary}</p>    

      `;
    })

    let elInputCheckFavorites = newElItem.querySelector(".modal__fovorite-chekbox");

    let elMoviesFavoritesItem = document.createElement("li");
    elMoviesFavoritesItem.className = "card p-2 flex-row mb-1 movies__fav-item ";

    elInputCheckFavorites.addEventListener("change", function () {
      let arrFovoriteIndex = arrFovorite.indexOf(movie.titleLigt);

      if (elInputCheckFavorites.checked) {
        elMoviesFavoritesItem.innerHTML = `
        <img class ="rounded me-3" src="${movie.img}" alt="${movie.titleLigt}" width="100" height="100">
       <div>
         <h5 class="mb-1">${movie.titleLigt}</h5>
         <p class="mb-1">${movie.reting}</p>
         <p class="mb-0">${movie.category.split("|").join(", ")}</p>
        </div>
        `;
        arrFovorite.push(movie);
        // add local storage
        localStorage.setItem("Movies", JSON.stringify(arrFovorite));

        elMoviesFavoritesList.appendChild(elMoviesFavoritesItem);

      } else {
        arrFovorite.splice(arrFovoriteIndex, 1)
        elMoviesFavoritesList.removeChild(elMoviesFavoritesItem);
      }

    })
  })

  return newElItem;
}

// get local storage
let localInfo = localStorage.getItem("Movies");
console.log(JSON.parse(localInfo));

// Render Movies in append for list
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

// Copy arr for default status sort
let arrDefault = arr.slice(0, 100);

elMoviesSelect.addEventListener("change", () => {
  let filt = arr.filter(movie => movie.category.includes(elMoviesSelect.value));

  if (elMoviesSelect.value == "choose-category") {
    elMoviesSelectSort.value = "choose-sort-default";
    renderMovies(arrDefault);
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

elMoviesSelectSort.addEventListener("change", function () {

  if (this.value == "choose-sort-default") {
    elMoviesSelect.value = "choose-category";
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
