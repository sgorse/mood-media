const express = require('express');
const cors = require('cors')
const app = express();
var PythonShell = require('python-shell');
var bodyParser = require('body-parser')
var deasync = require('deasync');

var Genius = require('genius-api');
var cheerio = require('cheerio');
var fetch = require("node-fetch");

//import Spotify from 'spotify-web-api-js'

const accessToken = '5MQ-WVXQ1eYFdr5DSVIfntYVk5o-6GlCRdtfMwvUEP0y7Hm4G2lfYy7AjFio3q83'
const genius = new Genius(accessToken)

// Needed to pass information from the web client to the backend
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Function used to parse the track objects received from the front end Spotify API call
function parseTracks(obj) {
  let resObj = []
  for(track in obj) {
    let parsedObj = {}
    songObj = obj[track]
    parsedObj['name'] = songObj.name
    parsedObj['artists'] = []
    // Get a list all of the artists for the song
    for(var artist in songObj.artists) {
      parsedObj['artists'].push(songObj.artists[artist].name)
    }
    resObj.push(parsedObj)
  }
  return resObj
}

// TODO :: Still not finished, need to integrate with Lina's code
// Currently just returns a list of strings that don't contain the lyrics
function getLyrics(tracks) {
  let resObj = []

  for (let i = 0; i < tracks.length; i += 1) {
    let temp_artist = tracks[i].artists[0]
    let temp_track = tracks[i].name
    
    const genius = new Genius(accessToken)
    genius.getArtistIdByName(temp_artist)
      .then(function(id) {
        genius.getSongsByArtist(id, temp_track)
      })
      .catch(function(error) {
        console.error(error);
      });  
  }

  /* let temp_url = "https://genius.com/Sia-chandelier-lyrics"
  let temp_artist = "Sia"
  let temp_track = "Chandelier" */

  /* const genius = new Genius(accessToken)
    genius.getArtistIdByName(temp_artist)
      .then(function(id) {
        genius.getSongsByArtist(id, temp_track)
      })
      .catch(function(error) {
        console.error(error);
      });  
  */

  // TODO: push lyrics of each songs to the resObj array
  for(var t in tracks) {
    resObj.push('')
  }
  // console.log(resObj)
  return resObj
}

// Genius API does not have an artist entrypoint.
// Instead, search for the artist => get a song by that artist => get API info on that song => get artist id
Genius.prototype.getArtistIdByName = function getArtistIdByName(artistName) {
  const normalizeName = name => name.replace(/\./g, '').toLowerCase()   // regex removes dots
  const artistNameNormalized = normalizeName(artistName)
  console.log(artistNameNormalized)

  return this.search(artistName)
    .then((response) => {
      for (let i = 0; i < response.hits.length; i += 1) {
        const hit = response.hits[i]
        if (hit.type === 'song' && normalizeName(hit.result.primary_artist.name) === artistNameNormalized) {
          return hit.result
        }
      }
      throw new Error(`Did not find any songs whose artist is "${artistNameNormalized}".`)
    })
    .then(songInfo => songInfo.primary_artist.id) 
}

Genius.prototype.getSongsByArtist = function getSongsByArtist(artistId, trackName) {
  const normalize = name => name.replace(/\./g, '').toLowerCase()   // regex removes dots
  const trackNameNormalized = normalize(trackName)
  // console.log(trackNameNormalized);

  var urls_array = []
  const genius = new Genius(accessToken)
  genius.songsByArtist(artistId, {
    per_page: 50,
    sort: 'popularity',
  }).then(function(data) {
    // console.log(data.songs);
    urls_array = data.songs.map(song => ({title: song.title, url: song.url}))
    // console.log(urls_array);

    urls_array.forEach(function(item){
      // console.log(item.url)
      if (normalize(item.title) === trackNameNormalized) {
        console.log(item.url)
        genius.getSongLyrics(item.url).then(function(response) {
          console.log(response)
          return response;
        }) 
      }
    })
  }).catch(function(error) {
    console.error(error);
  });
}

Genius.prototype.getSongLyrics = function getSongLyrics(geniusUrl) {
  return fetch(geniusUrl, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) return response.text()
    throw new Error('Could not get song url ...')
  })
  .then(parseSongHTML)
}

function parseSongHTML(htmlText) {
  const $ = cheerio.load(htmlText)
  const lyrics = $('.lyrics').text()
  const releaseDate = $('release-date .song_info-info').text()
  return lyrics
}

// --------------------------------------------------------------
// POST method route
// Used to receive the track list from the front end
app.post('/', function (req, res) {
  console.log("Received POST Request")
  let mood = req.body.mood
  let parsedTracks = parseTracks(req.body.tracks)
  let songLyrics = getLyrics(parsedTracks)

  var options = {
    mode: 'text',
    scriptPath: '/Users/linahsie/mood-media/mood-backend',
    args: []
  }
  for(song in songLyrics) {
    options.args.push(songLyrics[song])
  }
  options.args.push(mood)
  PythonShell.run('mood.py', options, function (err, results) {
  if (err) throw err;
  resUris = []
  for(index in req.body.tracks) {
    if(results[index] == "True") {
      resUris.push(req.body.tracks[index].uri)
    }
  }
  res.send({ status: 'SUCCESS', uris: resUris})
  })
})

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
