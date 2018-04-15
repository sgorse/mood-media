const express = require('express');
const cors = require('cors')
const app = express();
var PythonShell = require('python-shell');

// Needed to pass information from the web client to the backend
app.use(cors())

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
  let testLyrics = "THESE ARE THE TEST LYRICS"
  for(var t in tracks) {
    resObj.push(testLyrics)
  }
  return resObj
}

// POST method route
// Used to receive the track list from the front end
app.post('/', function (req, res) {
  console.log("Received POST Request")
  var resBools = []
  var data = ''
  req.on('data', function (chunk) {
    data += chunk;
  });

  req.on('end', function () {
    console.log('POST data received');
    let obj = JSON.parse(data).tracks
    let mood = JSON.parse(data).mood
    console.log(mood)
    let parsedTracks = parseTracks(obj)
    let songLyrics = getLyrics(parsedTracks)

    for(var s in songLyrics) {
      lyric = songLyrics[s]
      var options = {
        mode: 'text',
        scriptPath: '/Users/shirdongorse/Documents/spring18/cs410/project/mood-media/mood-backend',
        args: [lyric, mood]
      }
      PythonShell.run('mood.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      //console.log('results: %j', results[0]);
      resBools.push(results[0])
      });
    }
    res.end();
  });
  console.log(resBools)
  res.send({ status: 'SUCCESS', resBools: {resBools}})
})

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
