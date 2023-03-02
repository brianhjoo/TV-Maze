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
  // console.log('response.data', response.data)

  const shows = response.data.map(function (showAndScore) {
    let { id, name, summary, image } = showAndScore.show;
    image = !image ? 'https://tinyurl.com/tv-missing' : image.medium;
    return { id, name, summary, image };
  });

  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const { id, image, name, summary } = show;
    const $show = $(
      `<div data-show-id="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${image}"
              alt="${name}"
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
  // const $id = $('.Show').data('showId');
  // console.log('$id', $id)
  // const episodes = await getEpisodesOfShow($id);

  $episodesArea.hide();
  populateShows(shows);
  const $id = $('.Show').data('showId');
  const episodes = await getEpisodesOfShow($id);
  populateEpisodes(episodes);
  
}

$searchForm.on("submit", function (evt) {
  evt.preventDefault();
  searchForShowAndDisplay();
});

$('.Show-getEpisodes').on('click', function (evt){
  searchForShowAndDisplay
})
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */



async function getEpisodesOfShow(id) {
  console.log('getEpisodesOfShow', getEpisodesOfShow)
  console.log('id', id)
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log('id', id)
  const episodes = response.data.map(function (showData) {
    const { id, name, season, number } = showData;
    return { id, name, season, number };
  });

  console.log('episodes array: ', episodes);
  return episodes;
}

function populateEpisodes (episodes) {
  for (let episode of episodes) {
    const { id, name, season, number } = episode;
    const $episode = $(
      `<li>${name} (season${season}, Number(${number}))<li>`
    )
    $('#episodesList').append($episode);
  }
  $episodesArea.attr('display', 'block')
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
