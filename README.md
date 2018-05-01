# CS 410 Project: Mood Media
Mood Media is a web application that recommends songs and movies for users to consume based on their mood.

## Setup

Steps to test the app locally:  
  ### Setup and run the authorization login script:  
    1. `cd auth-server`  
    2. `npm install`  
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
  2. Run `Python`
  3. `import nltk`  
  4. `nltk.download('stopwords')`
  5. `nltk.download('punkt')`
  6. `nltk.download('averaged_perceptron_tagger')`
  7. `nltk.download('wordnet')`

