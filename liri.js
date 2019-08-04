require('dotenv').config();
var keys = require('./keys.js');
var spotifyApi = require('node-spotify-api');
var spotify = new spotifyApi(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var liri = {
    // Bands in town API
    'concert-this': function (artist) {
        axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
            // Promise to display Bands in town API data
            .then(function(response) {
                // Array map method to display
                // Bands in town array
                response.data.map(function(artist) {
                    var venue = artist.venue;
                    console.log('Name of venue: ' + venue.name);
                    console.log('Location: ' + venue.city + ', ' + venue.region);
                    console.log('Date of event: ' + moment(artist.datetime).format('MM/DD/YY'));
                });
            });
    },
    // Spotify API
    'spotify-this-song': function (song) {
        // If no song added in 2nd parameter (process.env)
        // then assign song variable to 'The Sign'
        if (!song) song = 'The Sign';
        spotify.search({ type: 'track', query: song }, 
        function (err, data) {
            if (err) return console.log('Error occurred: ' + err);

            // New Set() will eventually create a collection
            // of items that aren't repeated and 
            // is an ES6 reserved word
            var artistNames = new Set();
            var item = data.tracks.items[0];
            var artists = item.artists;
            var songName = item.name;
            var url = item.external_urls.spotify;
            var albumName = item.album.name;
  
            // Iterate through artists array and 
            // add artist.name to artistNames set
            artists.map(function(artist) {
                artistNames.add(artist.name);
            });
            // Get array from artistNames and then join
            // array into a string on a comma
            console.log('Artists: ' + Array.from(artistNames).join(', '));
            console.log('Name: ' + songName);
            console.log('Preview link: ' + url);
            console.log('Album name: ' + albumName);
        });
    },
    // OMDB API (pulls info from IMDB)
    'movie-this': function (movie) {
        if (!movie) movie = 'Mr. Nobody';
        axios.get('https://www.omdbapi.com/?t=' + movie + '&apikey=trilogy')
            .then(function(response) {
                var data = response.data;
                var items = ['Title', 'Year', 'Country', 'Language', 'Plot', 'Actors'];
                // Iterate through items array to show
                // Title, Year, Country, Language, Plot, Actors
                // of movie
                items.map(function(e) {
                    console.log(e + ': ' + data[e]);
                });
                // Iterate through data.Ratings to show
                // ratings from OMDB, like Rotten Tomatoes
                data.Ratings.map(function(e) {
                    console.log(e.Source + ' Rating: ' + e.Value);
                });
            });
    },
    'do-what-it-says': function () {
        fs.readFile('random.txt', 'utf8', function (err, content) { 
            this.runCommand(content)
        });
    },
    runCommand: function(command, param) {
        // Assign this to that to use this
        // value in a callback function
        var that = this;

        if(!command && !param) {
            console.log('Please enter a search action and search term.');
        }
        // If 'do-what-it-says' command
        else if(command === 'do-what-it-says' && !param) {
            fs.readFile('random.txt', 'utf8', function(err, data) {
                if(err) {
                    throw err;
                }

                // Convert file text into array, split on comma
                // in file
                var dataArr = data.split(',');

                // Get command from random.txt
                var doWhatItSaysCommand = dataArr[0];
                // Get parameter from random.txt
                var doWhatItSaysParam = dataArr[1];

                // Call this (assigned to that)
                // and pass in do what is says command
                // and param from from random.txt file
                that[doWhatItSaysCommand](doWhatItSaysParam);

            });
        }
        // If command and param are defined
        // then call this object with command method
        // and pass in param as method paramater
        else if(command && param) {
            this[command](param);
        }
    }
};
// Call runCommand method on liri object
// and pass in process.argv[2] and then
// grab array elements from process.argv and  
// start from 3rd array index and get rest of array elements,
// joining them on an empty space (' ')
liri.runCommand(process.argv[2], process.argv.slice(3).join(' '));