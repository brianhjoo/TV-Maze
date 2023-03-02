"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

$('input').attr('value', '');

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  const shows = response.data.map(function (tvShow) {
    const { id, name, summary, image} = tvShow.show;
    return { id, name, summary, image};
  });
  
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

async function populateShows(shows) {
  $showsList.empty();

  const awaitShows = await shows;
  for (let show of awaitShows) {
    const { id, image, name, summary } = show;
    const $show = $(
      `<div data-show-id="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${!image ? 'https://tinyurl.com/tv-missing' : image.medium}"
              alt=""
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${name}</h5>
             <div><small>${summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
