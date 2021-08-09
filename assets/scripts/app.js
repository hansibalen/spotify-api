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
})();
