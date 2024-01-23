const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer CHANGE BEARER HERE'
    }
};

const url = `https://api.themoviedb.org/3/movie/`;

let countMovies = 0;
let pagenumber = 1;

function createDiv(count, elementTitle, elementImage, elementVoteAverage, insertBeforeID) {

    const div = document.createElement('div');
    div.className = 'movie';
    div.innerHTML = `
        <div id="search-div-inner">
         <h3>${elementTitle}</h3>
         <img src="https://image.tmdb.org/t/p/w500/${elementImage}">
          <h3>${count}rd, Rating: ${(elementVoteAverage).toFixed(1)}</h3>
        </div>
    `;
    document.getElementById(insertBeforeID).appendChild(div);
}


function getTopRated() {
    fetch(`${url}top_rated?page=${pagenumber}`, options)
        .then(response => response.json())
        .then(topdata => {
            const loadMoreButton = document.getElementById("load-more-button")


            let pagesLeft = topdata.total_pages - topdata.page

            if (pagesLeft > 0) {

                let pagesLeftVisor = document.getElementById('pages-left-top-rated')
                pagesLeftVisor.innerHTML = 'theres ' + pagesLeft.toLocaleString() + ' pages left!'
                console.log('theres ' + pagesLeft + ' more pages on top rated!')


                loadMoreButton.onclick = () => {
                    pagenumber++
                    getTopRated()
                }

            } else {

                loadMoreButton.onclick = () => {
                    alert('Nothing to load more!')
                }

            }
            console.log(topdata.results)
            topdata.results.forEach(element => {
                countMovies++

                createDiv(countMovies, element.title, element.poster_path, element.vote_average, "top-rated-div")
            })
        })
        .catch(err => console.error(err));
}
getTopRated()



let test = 1;
let pagenumberload = 1;


let countSearchedMovies = 0;
let searchPage = 1;
function searchFunction() {
    const searchInput = document.getElementById('search-input');

    let searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&top_rated&page=${searchPage}`

    fetch(searchUrl, options)
        .then(response => response.json())
        .then(topdata => {
            const topRatedHeading = document.getElementById("search-div");
            searchMoreButton = document.getElementById('search-more')



            let pagesLeft = topdata.total_pages - topdata.page

            let pagesLeftVisor = document.getElementById('pages-left-search')



            if (pagesLeft > 0) {

                console.log('theres ' + pagesLeft + ' more pages on top rated!')
                pagesLeftVisor.innerHTML = 'theres ' + pagesLeft.toLocaleString() + ' pages left!'

                searchMoreButton.onclick = () => {
                    searchPage++
                    searchFunction()
                }



            } else {
                searchMoreButton.onclick = () => {
                    alert('Nothing to load more!')
                }
            }

            if (topdata.results.length > 0) {
                topdata.results.forEach(element => {
                    countSearchedMovies++;
                    createDiv(countSearchedMovies, element.title, element.poster_path, element.vote_average, "search-div")
                })

            } else {
                alert('No corresponding results were found!')
            }
        })
        .catch(err => console.error(err));
}
