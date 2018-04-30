import React, { Component } from 'react'
import { Dropdown, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Request from 'superagent'
let axios = require('axios');
import styles from './Movies.scss'

class Movies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chosenGenre: 'Action',
      chosenMood: 'happy',
      movies: null,
      tracks: null,
      movie_overviews: [],
      movies: []
    }
  }

  // Sets the background color to white once the page is loaded
  componentDidMount() {
    document.body.style.backgroundColor = '#FFFFFF'
  }

  setGenre(val) {
    this.setState({
      chosenGenre: val,
    })
  }

  setMood(val) {
    this.setState({
      chosenMood: val,
    })
  }

  getMovies() { 
    let currentGenreID = genreID[this.state.chosenGenre]
    let currentComponent = this // Not sure why this is needed
    let post_url = 'http://localhost:5000/movies'
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=68a5226494252d022b94bd1db36218ed&with_genres='+currentGenreID
    this.state.movie_bools = []
    Request.get(url).then((response) => {
      let overviews = []
      this.setState({
        movies: response.body.results,
      })
      response.body.results.forEach((element) => {
        overviews.push(element.overview)
        this.state.movie_bools.push('False')
      })
      return overviews })
    .then(overviews => axios.post(post_url, {overviews: overviews, mood: currentComponent.state.chosenMood}))
    .then((res) => {
      console.log(res.data.movie_bools)
      this.setState({
        movie_bools: res.data.movie_bools
      })
    })
    
  }

  render() {
    let movies = undefined
    if(this.state.movie_bools) {
      movies = _.map(this.state.movies, (movie, index) => {
        if(movie != null && this.state.movie_bools[index] === 'True') {
          // If no picture is found, just use the No-image-found.jpg as the default
          if(movie.poster_path == null ) {
              movie.poster_path = 'https://vignette.wikia.nocookie.net/mixels/images/f/f4/No-image-found.jpg'
          }
          else if (movie.poster_path.substring(0,4) != 'http'){
              movie.poster_path = 'http://image.tmdb.org/t/p/w185/'+movie.poster_path
          }
          return (
            <div id={movie.id} key={movie.id} className="resContainer" onClick={this.goToDetails}>
              <img
                  className="moviePoster"
                  src={movie.poster_path}
              />
              <div className="movieTitle">
                {movie.title} <br/>
                <div className="movieRating">
                  Voting Average: {movie.vote_average}
                </div>
              </div>
              <hr className="resSeparator"/>
            </div>
          )
        }
      })
    }
    

    return (
      <div className="Movies">
        <h1 id="movieTitle">Search for Movies</h1>
        <div className="searchElement">
          <Dropdown placeholder='Select a genre' fluid selection options={genres} onChange={(e, { value }) => this.setGenre(value)}></Dropdown>
        </div>
        <div className="searchElement">
          <Dropdown className="searchElement" placeholder='Select your mood' fluid selection options={moods} onChange={(e, { value }) => this.setMood(value)}></Dropdown>
        </div>
        <Button className="searchElement" id="searchButton" onClick={() => this.getMovies()}>
          Search
        </Button>
        <div>{movies}</div>
      </div>
    )
  }
}

const genres = [
  { text: 'Action', value: 'Action'},
  { text: 'Adventure', value: 'Adventure'},
  { text: 'Comedy', value: 'Comedy'},
  { text: 'Documentary', value: 'Documentary'},
  { text: 'Drama', value: 'Drama'},
  { text: 'Family', value: 'Family'},
  { text: 'Horror', value: 'Horror'},
  { text: 'Science Fiction', value: 'Science Fiction'},
  { text: 'Thriller', value: 'Thriller'},
  { text: 'Western', value: 'Western'}
]

const genreID = {
  'Action': 28, 'Adventure': 12, 'Comedy': 35,
  'Documentary': 99, 'Drama': 18, 'Family':10751,
  'Horror': 27, 'Science Fiction': 878, 'Thriller': 53, 'Western': 37
}

let moods = [
  { text: 'angry', value: 'angry'},
  { text: 'energized', value: 'energized'},
  { text: 'happy', value: 'happy'},
  { text: 'peaceful', value: 'peaceful'}
]
export default Movies
