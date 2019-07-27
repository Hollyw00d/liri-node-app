// Requre dotenv to 
require('dotenv').config();
var keys = require('./keys.js');
var spotify = require('node-spotify-api');
var spotifyApp = new spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var liri = {
    // Concert this API
    'concert-this': function (artist) {
        axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
            .then(function(response) {
                response.data.map(function(artist) {
                    var data = artist;
                    var venue = data.venue;
                    console.log(`Name of venue: ${venue.name}`);
                    console.log(`Location: ${venue.city}, ${venue.region}`);
                    console.log(`Date of event: ${moment(data.datetime).format('MM/DD/YY')}`);
                });
            });
    },
    'do-what-it-says': function () {
        fs.readFile('random.txt').then(resp => this.runCommand(resp));
    },
    runCommand: function (str) {
        var spaceIndex = str.indexOf(' ');
        var command = str.slice(0, spaceIndex);
        var param = str.slice(spaceIndex + 1);
        this[command](param);
    }
};

liri.runCommand(process.argv.slice(2).join(' '));


var arr = [1, 2, 3, 4];
arr.map(function(number) {
    console.log(number + 1);
});



