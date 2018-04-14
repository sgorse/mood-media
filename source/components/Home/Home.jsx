import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import styles from './Home.scss'
import Spotify from 'spotify-web-api-js'

const spotifyWebApi = new Spotify();
class Home extends Component {
  constructor(props) {
    super(props)
    const params = this.getHashParams()

    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: ''

      }
    }
    if(params.access_token) {
      var myStorage = window.localStorage
      localStorage.setItem('access_token', params.access_token)
      localStorage.setItem('logged_In', true)
      spotifyWebApi.setAccessToken(params.access_token)
      this.props.set_access_token(params.access_token)
      this.props.set_loggedIn(true)
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState().
      then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })
  }
  render() {
      return(
          <div className="Home">
            <h1 id="mainTitle">What do you want to consume?</h1>
            <div className="LinkButtons">
                <Button id="musicButton" as={Link} to='music' onClick={() => {window.location.reload();}}>Music</Button>
                <Button id="moviesButton" as={Link} to='movies' onClick={() => {window.location.reload();}}>Movies</Button>
            </div>
            <div>Now Playing : {this.state.nowPlaying.name}</div>
            <div>
              <img src={ this.state.nowPlaying.image} style={{width: 100}}/>
            </div>
            <button onClick={() => this.getNowPlaying()} >
              Check Now Playing
            </button>
          </div>
      )
  }
}

export default Home
