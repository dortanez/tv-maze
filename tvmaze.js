// search the input value and find it in the api
async function searchShows(query) {
  const res = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: query}});
  return res.data
}

// add show info to the dom and populate on html page
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    const noImage = 'https://tinyurl.com/tv-missing';
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
         <div class="card" data-show-id="${show.show.id}">
          <img class='card-img-top img-thumbnail' src="${show.show.image ? show.show.image.medium : noImage}">
           <div class="card-body">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
           </div>
           <div class='text-center mb-4'><button class="btn btn-primary" data-show-id='${show.show.id}' id='episodeBtn' >Episodes</button></div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

// handle search form and populate the results when the button is clicked
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

// search the api for all the episodes for the show and return the array of episodes
async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return res.data
  
}

// use the episodes array and create html to list all the episodes for that show
async function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for(let episode of episodes) {
    let $newLi = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    )
    $episodesList.append($newLi);
  }
}

// when the episodes button is clicked, generate episodes on html page
$('#shows-list').on('click', async function(e) {
  $('#episodes-area').css('display', '');
  let showId;
  if(e.target.tagName === 'BUTTON') {
    showId = e.target.getAttribute('data-show-id');
  }
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})
