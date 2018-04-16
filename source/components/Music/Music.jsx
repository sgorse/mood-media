import React, { Component } from 'react'
import { Dropdown, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import styles from './Music.scss'
import Spotify from 'spotify-web-api-js'
import SpotifyPlayer from 'react-spotify-player';
var axios = require('axios');

const spotifyWebApi = new Spotify();
// size may also be a plain string using the presets 'large' or 'compact'
const size = {
  width: '620px',
  height: 100,
};
const view = 'list'; // or 'coverart'
const theme = 'black'; // or 'white'

class Music extends Component {
    constructor(props) {
      super(props)
      var myStorage = window.localStorage;
      this.state = {
        access_token: localStorage.getItem("access_token") || '',
        loggedIn: localStorage.getItem("access_token") || false,
        chosenGenre: 'rap',
        chosenMood: 'happy',
        tracks: null
      }
      spotifyWebApi.setAccessToken(localStorage.getItem("access_token"))

    }

    getTracks(genre) {
      let currentComponent = this // Not sure why this is needed
      let url = 'http://localhost:5000/'
      spotifyWebApi.searchTracks('genre:'+this.state.chosenGenre)
      .then(data => axios.post(url, {tracks: data.tracks.items, mood: currentComponent.state.chosenMood}))
      .then(function(res) {
        currentComponent.setState({
            tracks: res.data.uris,
        })
      }, function(err) {
        console.error(err)
      })
    }

    render() {
        // If not logged in, show the login button
        if (!this.state.loggedIn) {
          return (
            <a href="http://localhost:8888/" >
              <Button id="spotifyLoginButton">Login to Spotify to use the app</Button>
            </a>
          )
        }
        // Create a SpotifyPlayer object for each track
        let tracks = _.map(this.state.tracks, (track) => {
          if(track != null) {
              return (
                <div>
                  <div class="breaker"></div>
                  <SpotifyPlayer
                    className="spotifyPlayer"
                    uri={track}
                    size={size}
                    view={view}
                    theme={theme}
                  />
                </div>
              );

          }
        });

        return(
          <div className="Music">
            <h1 id="musicTitle">Search for Songs</h1>
            <div className="searchElement">
              <Dropdown  placeholder='Select a genre' fluid selection options={genres} onChange={(e, { value }) => this.setGenre(value)}></Dropdown>
            </div>
            <div className="searchElement">
                <Dropdown className="searchElement" placeholder='Select your mood' fluid selection options={moods} onChange={(e, { value }) => this.setMood(value)}></Dropdown>
            </div>
            <Button className="searchElement" id="searchButton" onClick={() => this.getTracks('rock')}>
              Search
            </Button>
            <div>{tracks}</div>
          </div>
        )
    }

    setGenre(val) {
        this.setState({
            chosenGenre: val,
        });
        console.log(val)
    }

    setMood(val) {
        this.setState({
            chosenMood: val,
        });
        console.log(this.state.chosenMood)
    }
}

let genres = [
  {
    text: 'country',
    value: 'country',
  },
  {
    text: 'electronic',
    value: 'electronic',
  },
  {
    text: 'pop',
    value: 'pop',
  },
  {
    text: 'rap',
    value: 'rap',
  }
]

let moods = [
  {
    text: 'angry',
    value: 'angry',
  },
  {
    text: 'cheerful',
    value: 'cheerful',
  },
  {
    text: 'energized',
    value: 'energized',
  },
  {
    text: 'peaceful',
    value: 'peaceful',
  }
]

export default Music
