const express = require('express');
const cors = require('cors')
const app = express();
var PythonShell = require('python-shell');
var bodyParser = require('body-parser')
var deasync = require('deasync');
//import Spotify from 'spotify-web-api-js'


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
  console.log("Tracks Object:")
  console.log(tracks)
  let resObj = []
  let testLyrics = "THESE ARE THE TEST LYRICS"
  for(var t in tracks) {
    resObj.push(testLyrics)
  }
  return resObj
}

function runPythonScript(songLyrics, mood) {
  let resBools = []
  var options = {
    mode: 'text',
    scriptPath: '/Users/shirdongorse/Documents/spring18/cs410/project/mood-media/mood-backend',
    args: []
  }
  for(song in songLyrics) {
    options.args.push(songLyrics[song])
  }
  options.args.push(mood)
  PythonShell.run('mood.py', options, function (err, results) {
  if (err) throw err;
  resBools = results;
  })
  return resBools
}

// POST method route
// Used to receive the track list from the front end
app.post('/', function (req, res) {
  console.log("Received POST Request")
  let mood = req.body.mood
  let parsedTracks = parseTracks(req.body.tracks)
  let songLyrics = getLyrics(parsedTracks)

  var options = {
    mode: 'text',
    scriptPath: '/Users/shirdongorse/Documents/spring18/cs410/project/mood-media/mood-backend',
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
