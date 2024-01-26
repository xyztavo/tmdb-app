const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer YOUR BEARER HERE'
    }
};

const url = `https://api.themoviedb.org/3/movie/`;


// create movie component with necessary params:
function createDiv(count, elementTitle, elementImage, elementVoteAverage, insertBeforeID) {
    const div = document.createElement('div');
    div.className = 'movie';
    div.innerHTML = `
        <div id="search-div-inner">
         <h3 class="movie-title">${elementTitle}</h3>
         <img class="movie-img" src="${elementImage}">
          <h3 class="ratings">${count}rd, Rating:   ${(elementVoteAverage).toFixed(1)} <ion-icon name="star-outline"></ion-icon></h3>
        </div>
    `;
    document.getElementById(insertBeforeID).appendChild(div);
}
// todo: get user language
const languageButton = document.getElementById("language-button")
let language = ''
// language = 'language=pt-br'


// variables that will be used in getTopRated 

let countMovies = 0;
let pagenumber = 1;

// fetch top rated 
    function getTopRated() {
        fetch(`${url}top_rated?${language}page=${pagenumber}`, options)
            .then(response => response.json())
            .then(topdata => {
                const loadMoreButton = document.getElementById("load-more-button")
                let pagesLeft = topdata.total_pages - topdata.page

                // if pages left greater than 0,
                if (pagesLeft > 0) {
                    // make loadmorebutton appear:
                    loadMoreButton.style.display = 'flex'

                    // change pagesleftvisor with the pagesleft number
                    let pagesLeftVisor = document.getElementById('pages-left-top-rated')
                    pagesLeftVisor.innerHTML = 'theres ' + pagesLeft.toLocaleString() + ' pages left!'
                    // loadmorebutton onlclick:
                    loadMoreButton.onclick = () => {
                        //adds a page number
                        pagenumber++
                        // runs the whole function again.
                        getTopRated()
                    }
                } else {
                    loadMoreButton.style.display = 'none'
                }
                // use the component we created for each array result with the params:
                topdata.results.forEach(element => {
                    function imageExists() {
                        if (element.poster_path) {
                            return `https://image.tmdb.org/t/p/w500/${element.poster_path}`
                        } else {
                            return './assets/default-banner-img.png'
                        }
                    }

                    countMovies++
                    createDiv(countMovies, element.title, imageExists(), element.vote_average, "top-rated-div")
                })
            })
            .catch(err => console.error(err));
    }
    getTopRated()

    //variables that will be used in search function
    let countSearchedMovies = 0;
    let searchPage = 1;

    const searchButton = document.getElementById('search')

    searchButton.onclick = () => {
        document.getElementById("search-div").innerHTML = ''
        searchFunction()
        countSearchedMovies = 0;
    }

    function searchFunction() {
        const searchInput = document.getElementById('search-input');
        const searchMoreButton = document.getElementById('search-more')

        let searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&${language}page=${searchPage}`

        fetch(searchUrl, options)
            .then(response => response.json())
            .then(topdata => {
                let pagesLeft = topdata.total_pages - topdata.page;
                let pagesLeftVisor = document.getElementById('pages-left-search');



                // check the pages left greater than 0.
                if (pagesLeft > 0) {
                    // if so, show load more button.
                    searchMoreButton.style.display = "flex";

                    //change the pagesleftvisor (which id is pages-left-search).
                    pagesLeftVisor.innerHTML = 'theres ' + pagesLeft.toLocaleString() + ' pages left!'

                    //load more button onclick:
                    searchMoreButton.onclick = () => {
                        // add to searchPage ( number of the actual page ).
                        searchPage++
                        // run this whole function again.
                        searchFunction()
                    }
                    // if its not greater than 0,
                } else {
                    // change pagesleftvisor.
                    pagesLeftVisor.innerHTML = 'theres no pages left!'
                    // make loadmorebutton invisible.
                    searchMoreButton.style.display = "none";
                }

                // use the component we created for each array result with the params:
                topdata.results.forEach(element => {
                    function imageExists() {
                        if (element.poster_path) {
                            return `https://image.tmdb.org/t/p/w500/${element.poster_path}`
                        } else {
                            return './assets/default-banner-img.png'
                        }
                    }

                    countSearchedMovies++;
                    createDiv(countSearchedMovies, element.title, imageExists(), element.vote_average, "search-div")

                })





            })
            .catch(err => console.error(err));
    }

    // this makes the default loadmorebutton for searched movies invisible, TODO: change that to somewhere else


    //simple script to make pressing enter on a input to click a button
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchButton.click();
        }
    });

