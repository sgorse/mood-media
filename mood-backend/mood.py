# TODO :: Integrate with Austin's code

import sys
import nltk
import string
from string import punctuation
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet

def strip_punctuation(s):
    return ''.join(c for c in s if c not in punctuation)

def moodMatches(mood, lyrics):
    if lyrics == "":
        print("False")
        return False

    similarityThres = 0.01
    moodScore = 0.0
    ##raw_lyrics = str.maketrans('', '', string.punctuation)
    lyrics = strip_punctuation(lyrics)
    ##lyrics.translate(raw_lyrics)
    ##lyrics = lyrics.translate(None, string.punctuation) ##strips lyrics of punctuations
    stop_words = set(stopwords.words('english')) ##gets stopwords from nltk library
    lyric_tokens = word_tokenize(lyrics) ##tokenizes lyrics into list to parse for stopwords

    filtered_lyrics = [w for w in lyric_tokens if not w in stop_words] ##removes stopwords from lyrics
    lyrLen = len(filtered_lyrics) ##number of non-stop words lyrics
    ##lyric_tag = nltk.pos_tag(filtered_lyrics)

    for word in filtered_lyrics:
        word_tag = nltk.tag.pos_tag([word]) ##tags current word as part of speech
        #print(word_tag[0][1])
        if word_tag[0][1] == 'NN' or word_tag[0][1] == 'JJ' or word_tag[0][1] == 'VB':
            if word_tag[0][1] == 'NN':
                wordTemp = word + ".n.01"
                moodTemp = mood + ".n.01"
            elif word_tag[0][1] == 'JJ':
                wordTemp = word + ".a.01"
                moodTemp = mood + ".a.01"
            elif word_tag[0][1] == 'VB':
                wordTemp = word + ".v.01"
                moodTemp = mood + ".v.01"

            try:
                moodSyn = wordnet.synset(moodTemp) ##returns synonym word bank for the mood
                wordSyn = wordnet.synset(wordTemp) ##returns synonym word bank for the current word
                wordSimilarity = moodSyn.wup_similarity(wordSyn) ##calculates similarity between current word and mood
                moodScore += wordSimilarity

            except (nltk.corpus.reader.wordnet.WordNetError, TypeError):
                continue
        else:
            moodScore += 0.05

    ##print('hi')
    avgSimilarity = moodScore / lyrLen ##calculates average similarity of each non stop word in corpus
    if avgSimilarity > similarityThres: #returns whether  lyrics match mood based on how average word compares to mood
        print('True')
    else:
        print('False')


sampleLyrics = ["Dont think Ive ever seen your kind of pretty Wandering around this midnight mad house city You got a look that says youve got it' all together So if you dont mind, I\'d like to know you better"
 , 'I took my love, I took it down Climbed a mountain and I turned around And I saw my reflection in the snow covered hills Til the landslide brought it down Oh, mirror in the sky',
 "Pages between us Written with no end So many words we're not saying Don't wanna wait 'til it's gone You make me strong", 'happiness']


numLyrics = len(sys.argv)
currentMood = sys.argv[numLyrics - 1]
for lyricToDo in sys.argv:
    if lyricToDo != sys.argv[numLyrics - 1]:
        moodMatches(currentMood, lyricToDo)

'''
numLyrics = len(sampleLyrics)
currentMood = sampleLyrics[numLyrics - 1]
for lyricToDo in sampleLyrics:
    if lyricToDo != sampleLyrics[numLyrics - 1]:
        moodMatches(currentMood, lyricToDo)
        '''
