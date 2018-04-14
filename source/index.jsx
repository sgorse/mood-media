import React from 'react'
import {render} from 'react-dom'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Button } from 'semantic-ui-react'

// Include your new Components here
import HomeView from './components/Home/Home.jsx';
import MusicView from './components/Music/Music.jsx';
import MoviesView from './components/Movies/Movies.jsx';

// Include any new stylesheets here
// Note that components' stylesheets should NOT be included here.
// They should be 'require'd in their component class file.
require('./styles/main.scss')
var access_token = ''
var loggedIn = false
let set_access_token = (new_access_token) => {
  access_token = new_access_token
}
let set_loggedIn = (isLoggedIn) => {
  loggedIn = isLoggedIn
}
let get_loggedIn = () => {
  return loggedIn
}
let get_access_token = () => {
  return access_token
}

const AllViews = () => (
  <main>
    <h4>{access_token}</h4>
    <Router>
      <div>
        <Route exact path="/" render={props => (<HomeView {...props} set_access_token={set_access_token} set_loggedIn={set_loggedIn}/>
        )}/>
        <Route path="/music" render={props => (<MusicView {...props} get_access_token={get_access_token} get_loggedIn={get_loggedIn}/> )}/>
        <Route path="/movies" component={MoviesView}/>
      </div>
    </Router>
  </main>
)



render(

    <AllViews />,
    // Define your router and replace <Home /> with it!
    document.getElementById('app')
);
