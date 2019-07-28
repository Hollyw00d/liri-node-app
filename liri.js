require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var liri = {
    'concert-this': function (artist) {
        axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
            .then(response => {
                for (var i = 0; i < response.data.length; ++i) {
                    var data = response.data[i];
                    var venue = data.venue;
                    console.log('Name of venue: ' + venue.name);
                    console.log('Location: ' + venue.city + ', ' + venue.region);
                    console.log('Date of event: ' + moment(data.datetime).format('MM/DD/YY'));
                }
            });
    },
    'spotify-this-song': function (song) {
        if (!song) song = 'The Sign';
        spotify.search({ type: 'track', query: song }, (err, data) => {
            if (err) return console.log('Error occurred: ' + err);
            var artistNames = new Set();
            var item = data.tracks.items[0];
            var artists = item.artists;
            var songName = item.name;
            var url = item.external_urls.spotify;
            var albumName = item.album.name;
            for (var j = 0; j < artists.length; ++j) {
                artistNames.add(artists[j].name);
            }
            console.log('Artists: ' + Array.from(artistNames).join(', '));
            console.log('Name: ' + songName);
            console.log('Preview link: ' + url);
            console.log('Album name: ' + albumName);
        });
    },
    'movie-this': function (movie) {
        if (!movie) movie = 'Mr. Nobody';
        axios.get('https://www.omdbapi.com/?t=' + movie + '&apikey=trilogy')
            .then(response => {
                var data = response.data;
                var items = ['Title', 'Year', 'Country', 'Language', 'Plot', 'Actors'];
                items.map(e => {
                    console.log(e + ': ' + data[e]);
                });
                data.Ratings.map(e => console.log(e.Source + ' Rating: ' + e.Value));
            });
    },
    'do-what-it-says': function () {
        fs.readFile('random.txt', 'utf8', (err, content) => this.runCommand(content));
    },
    runCommand: function (str) {
        var commaIndex = str.indexOf(',');
        var command, param;
        if (commaIndex > -1) {
            command = str.slice(0, commaIndex);
            param = str.slice(commaIndex + 1);
        } else command = str;
        console.log(command);
        this[command](param);
    }
};
liri.runCommand(process.argv.slice(2).join(','));