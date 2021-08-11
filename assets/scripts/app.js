const APIController = (function () {
  //Values that you can get from Spotify for Developers
  const clientId = " ";
  const clientSecret = " ";

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
  const _getPlaylistsForGenre = async (token, genreID) => {
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

    const data = result.json();
    return data.items;
  };

  //Get track info
  const _getTrack = async (token, trackEndPoint) => {
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer" + token },
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
        songDetail: document.querySelector(DOMElements.songDetail),
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
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
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
