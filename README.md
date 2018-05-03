# CS 410 Project: Mood Media
Mood Media is a web application that recommends songs and movies for users to consume based on their mood.

## Setup

Steps to test the app locally:  
  ### Setup and run the authorization login script:  
  1. `cd auth-server`  
  2.  Install dependencies: `npm install`  
  2. `cd authorization_code`  
  3. `node app.js`  
  ### Setup and run the mood-media backend in a new terminal:  
  1. From the mood-media director, run `cd mood-backend`  
  2. `npm install`  
  3. `npm run server`  
  ### Setup and run the mood-media front end in a new terminal:  
  1. From the mood-media directory, run `npm install`  
  2. `npm run dev`  
  3. Go to localhost:8080 on your browser
  ### Run the Python script in a new terminal:  
  1. From the mood-media directory, run `cd mood-backend`
  2. (For Mac/Unix users) Install NLTK: run `sudo pip install -U nltk`
  3. Run `python` then type `import nltk` 
  4. `nltk.download('stopwords')`
  5. `nltk.download('punkt')`
  6. `nltk.download('averaged_perceptron_tagger')`
  7. `nltk.download('wordnet')`

  ## Music App
  ### Implementation:
  1. Gathers songs from specific genre using Spotify API.
  2. Gets the lyrics for these songs from the Genius API.
  3. Python script parses song lyrics, and matches them with the user’s chosen mood.
  4. Songs that match the user’s mood are shown to them on the front end.
  
  ## Movies App
  ### Implementation:
  1. A list of movies matching the user’s genre are received from The Movie DB API.
  2. The movie overviews are parsed out and sent to the backend.
  3. The Python script is run on the movie overview to see if the movie matches the user’s mood.
  4. The movies matching the user’s mood are shown to the user.



