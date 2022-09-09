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

// get local storage

let bookmarkInfo = JSON.parse(localStorage.getItem("bookList"));
let bookmarkArr = bookmarkInfo || [];

// change key name in movies.js
movies.forEach(movie => {
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
      imdId: movie.imdb_id
    }
  )
})

// create movies in Template
let createElementMovies = (movie) => {
  let newElItem = elMoviesTemplate.cloneNode(true);

  // newElItem.querySelector(".movie__link").href = movie.imdb;

  newElItem.querySelector(".movie__img").src = movie.img;
  newElItem.querySelector(".movie__img").alt = movie.title;

  newElItem.querySelector(".movie__title").textContent = movie.title;
  newElItem.querySelector(".movie__reting").textContent = movie.reting;

  newElItem.querySelector(".movie__category").innerHTML = movie.category.split("|").join(", ");

  newElItem.querySelector(".js-star").dataset.imdId = movie.imdId;

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

  })

  return newElItem;
}

function bookDelete() {
  elMoviesFavoritesList.addEventListener("click", (evt) => {
    if (evt.target.matches(".book-movie-delet")) {
      let deletId = evt.target.getAttribute("data-id");
      let deletBookIndex = bookmarkArr.findIndex(item => {
        return item.imdId == deletId;
      })
      bookmarkArr.splice(deletBookIndex, 1)
      console.log(deletBookIndex);
      rendringBook(bookmarkArr)
      localStorage.setItem("bookList", JSON.stringify(bookmarkArr))
    }
  })
}

bookDelete();

function rendringBook(bookMovies) {
  elMoviesFavoritesList.innerHTML = "";

  bookMovies.forEach(movie => {
    elMoviesFavoritesList.innerHTML += `
      <li class="card flex-row position-relative mb-2 p-2">
        <img class ="rounded me-3" src="${movie.img}" alt="${movie.titleLigt}" width="100" height="100">
        <div>
          <h5 class="mb-1">${movie.titleLigt}</h5>
          <p class="mb-1">${movie.reting}</p>
          <p class="mb-0">${movie.category.split("|").join(", ")}</p>
          </div>
          <button class = "book-movie-delet btn-close " data-id = "${movie.imdId}"></button>
      </li>
    `;
  })
}

rendringBook(bookmarkArr)

elMoviesList.addEventListener("click", function (evt) {
  if (evt.path[2].matches(".js-star")) {
    let btnId = evt.path[2].dataset.imdId;
    let bookFind = arr.find(movie => {
      return movie.imdId == btnId
    })
    bookmarkArr.push(bookFind)
    rendringBook(bookmarkArr)
    localStorage.setItem("bookList", JSON.stringify(bookmarkArr))
  }

})

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

// localStorage.clear()
