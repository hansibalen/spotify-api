const APIController = (function () {
  /* Values that you can get from Spotify for Developers.
  I'm well aware that environment variables should be hidden, but I
  can't really do that since I'm working purely on client-side.*/
  const clientId = "41490910527142b78c10c85bf2bd8b46";
  const clientSecret = "4181822e26de461b975a6243241e25af";

  //Private methods

  const _getToken = async () => {
    //JavaScript fetch API method to call the Spotify token endpoint
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  //API Endpoints

  //Get a list of genres
  const _getGenres = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.categories.items;
  };

  //Get a lists of playlists for selected genre
  const _getPlaylistsForGenre = async (token, genreId) => {
    //Get only 10 playlists
    const limit = 10;

    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.playlists.items;
  };

  //Get tracks for selected playlist
  const _getTracksForPlaylist = async (token, tracksEndPoint) => {
    //Get only 10 tracks
    const limit = 10;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.items;
  };

  //Get track info
  const _getTrack = async (token, trackEndPoint) => {
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data;
  };

  return {
    getToken() {
      return _getToken();
    },
    getGenres(token) {
      return _getGenres(token);
    },
    getPlaylistsForGenre(token, genreId) {
      return _getPlaylistsForGenre(token, genreId);
    },
    getTracksForPlaylist(token, tracksEndPoint) {
      return _getTracksForPlaylist(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint);
    },
  };
})();

//UI Module

const UIController = (function () {
  //This object holds the references to specific HTML selectors
  const DOMElements = {
    selectGenre: "#select_genre",
    selectPlaylist: "#select_playlist",
    buttonSubmit: "#btn_submit",
    divSongDetail: "#song-detail",
    hfToken: "#hidden_token",
    divSonglist: ".song-list",
  };

  //Public methods
  return {
    //This method gets the input fields
    inputField() {
      return {
        genre: document.querySelector(DOMElements.selectGenre),
        playlist: document.querySelector(DOMElements.selectPlaylist),
        tracks: document.querySelector(DOMElements.divSonglist),
        submit: document.querySelector(DOMElements.buttonSubmit),
        songDetail: document.querySelector(DOMElements.divSongDetail),
      };
    },

    //This method creates list options for the genres
    createGenre(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document.querySelector(DOMElements.selectGenre).insertAdjacentHTML("beforeend", html);
    },

    //This method creates list options for the playlists of specified genre
    createPlaylist(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML("beforeend", html);
    },

    //This method creates list of tracks of specified playlist
    createTrack(id, name) {
      const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
      document.querySelector(DOMElements.divSonglist).insertAdjacentHTML("beforeend", html);
    },

    //This method creates a div which stores info for selected track
    createTrackDetail(img, title, artist) {
      const detailDiv = document.querySelector(DOMElements.divSongDetail);
      //Div needs to be cleared everytime a new track is selected
      detailDiv.innerHTML = "";

      const html = `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By: ${artist} </label>
            </div> 
            `;

      detailDiv.insertAdjacentHTML("beforeend", html);
    },

    //Reset all details
    resetTrackDetail() {
      this.inputField().songDetail.innerHTML = "";
    },

    resetTracks() {
      this.inputField().tracks.innerHTML = "";
      this.resetTrackDetail();
    },

    resetPlaylist() {
      this.inputField().playlist.innerHTML = "";
      this.resetTracks();
    },

    storeToken(value) {
      document.querySelector(DOMElements.hfToken).value = value;
    },

    getStoredToken() {
      return {
        token: document.querySelector(DOMElements.hfToken).value,
      };
    },
  };
})();

//APP Module, utilizes both API and UI

const APPController = (function (UICtrl, APICtrl) {
  const DOMInputs = UICtrl.inputField();

  //On page load, load genres
  const loadGenres = async () => {
    //Get the token
    const token = await APICtrl.getToken();
    //Store token on page
    UICtrl.storeToken(token);
    //Get genres
    const genres = await APICtrl.getGenres(token);
    //Populate the element which stores the genres
    genres.forEach((element) => UICtrl.createGenre(element.name, element.id));
  };

  //On genre change event listener
  DOMInputs.genre.addEventListener("change", async () => {
    //Playlist and subsequent elements will clear on genre change
    UICtrl.resetPlaylist();
    //Get token that is stored on page load
    const token = UICtrl.getStoredToken().token;
    //Get the genre select field
    const genreSelect = UICtrl.inputField().genre;
    //Get genre ID
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    //Get playlist from selected genre
    const playlist = await APICtrl.getPlaylistsForGenre(token, genreId);
    //Create playlist
    playlist.forEach((p) => UICtrl.createPlaylist(p.name, p.tracks.href));
  });

  //Button click event listener
  DOMInputs.submit.addEventListener("click", async (e) => {
    //Prevent page refresh
    e.preventDefault();
    //Tracks will clear on playlist change
    UICtrl.resetTracks();
    //Get token
    const token = UICtrl.getStoredToken().token;
    //Get playlist
    const playlistSelect = UICtrl.inputField().playlist;
    //Get playlist track field
    const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
    //Get tracks of selected playlist
    const tracks = await APICtrl.getTracksForPlaylist(token, tracksEndPoint);
    //Create track list
    tracks.forEach((el) => UICtrl.createTrack(el.track.href, el.track.name));
  });

  //Track selection event listener
  DOMInputs.tracks.addEventListener("click", async (e) => {
    //Prevent page refresh
    e.preventDefault();

    UICtrl.resetTrackDetail();
    //Get token
    const token = UICtrl.getStoredToken().token;
    //Get track field
    const trackEndpoint = e.target.id;
    //Get selected track
    const track = await APICtrl.getTrack(token, trackEndpoint);
    //Render track details
    UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
  });

  return {
    init() {
      loadGenres();
    },
  };
})(UIController, APIController);

APPController.init();
