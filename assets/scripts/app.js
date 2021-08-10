const APIController = (function () {
  //Values that you can get from Spotify for Developers
  const clientId = " ";
  const clientSecret = " ";

  //Private methods

  const getToken = async () => {
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
  const getGenres = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.categories.items;
  };

  //Get a lists of playlists for selected genre
  const getPlaylistsForGenre = async (token, genreID) => {
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
  const getTracksForPlaylist = async (token, tracksEndPoint) => {
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
  const getTrack = async (token, trackEndPoint) => {
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer" + token },
    });

    const data = await result.json();
    return data;
  };

  return {
    getToken() {
      return getToken();
    },
    getGenres(token) {
      return getGenres(token);
    },
    getPlaylistsForGenre(token, genreId) {
      return getPlaylistsForGenre(token, genreId);
    },
    getTracksForPlaylist(token, tracksEndPoint) {
      return getTracksForPlaylist(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return getTrack(token, trackEndPoint);
    },
  };
})();

//UI Module

//This object holds the references to specific HTML selectors
const UIController = (function () {
  const DOMElements = {
    selectGenre: "#select_genre",
    selectPlaylist: "#select_playlist",
    buttonSubmit: "#btn_submit",
    divSongDetail: "#song-detail",
    hfToken: "#hidden_token",
    divSonglist: ".song-list",
  };
})();
