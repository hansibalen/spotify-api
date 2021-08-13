# Spotify API

A Spotify API, which fetches genres, playlists and songs.\
[Live site](spotify-api-js.netlify.app)

## Description

I made a Spotify API, where you can choose from a list of different genres and from that genre, you get different playlists.\
Subsequently, you get a song list from the selected playlist and choosing a song will give you some song information.\
To achieve this, I followed the module pattern (Pre-ES6) coding strategy, which is great for separating the concerns in the code structure.\
I created three modules, one for the API, one for the UI and one for the app itself.

The first module is the API module, where I fetch the API method to call the Spotify token endpoint.\
I know that environment variables should be hidden, but, for the sake of hosting a functioning demo\
and since I'm working purely on client-side, I decided to let my environment variables on the source code.\
On this module, I also added API endpoints for each type of data that will be pulled from Spotify.\
Since the methods for the API endpoints are private, I return the methods that I want exposed to the outside scope, so they can be used later on.

The second module is the UI module, which will help to populate select lists and create change events, in order for them to interact with the API data.\
I created an object which holds the references of all HTML selectors. After that, I added public methods which will help to populate the lists with the API data.\
Here is where genres, playlists, song lists and song details are generated with the help of those public methods.\
The objects here will be used outside this module, by attaching event listeners to them.

The last module is the APP module, which will make possible for the API and the UI module to interact with each other.\
Since my approach was separation of concerns, the API module is only focused on the API functionality and the UI module is only focused on the UI aspect, the APP module will make the API and UI module handle the retreiving of Spotify data and populate the UI fields with that data.

## Installation

- Download / fork the project.

- Open the master folder.

- Change the values that you can get on Spotify For Developers.\
  ![Spotify variables](https://i.ibb.co/Bng57H3/spotify-variables.png)

- Initialize project on index file.
