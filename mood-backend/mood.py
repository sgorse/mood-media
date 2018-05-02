import sys
import nltk
import string
from string import punctuation
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet

def strip_punctuation(s):
    return ''.join(c for c in s if c not in punctuation)

## parameter mood - string mood to be compared
## parameter lyrics - string lyrics to be compared
## method to calculate similarity between a mood and a text body excluding stopwords
## returns
def moodMatches(mood, lyrics):
    if lyrics == "":
        return 0.1111111111111e-17

    similarityThres = 1.502325581395e-16
    moodScore = 0.0
    lyrics = strip_punctuation(lyrics)
    stop_words = set(stopwords.words('english')) ##gets stopwords from nltk library
    lyric_tokens = word_tokenize(lyrics) ##tokenizes lyrics into list to parse for stopwords

    filtered_lyrics = [w for w in lyric_tokens if not w in stop_words] ##removes stopwords from lyrics
    lyrLen = len(filtered_lyrics) ##number of non-stop words lyrics

    for word in filtered_lyrics:
        word_tag = nltk.tag.pos_tag([word]) ##tags current word as part of speech
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
            moodScore += 1.52325581395e-16

    avgSimilarity = moodScore / lyrLen ##calculates average similarity of each non stop word in corpus
    if avgSimilarity > 0:##similarityThres: #returns whether  lyrics match mood based on how average word compares to mood
        return(avgSimilarity)
    else:
        return(avgSimilarity)

numLyrics = len(sys.argv)
currentMood = sys.argv[numLyrics - 1]
simVals = []
totalSim = 0.0
moodScale = 1

if currentMood == "angry": ##scales text with mood as each mood has a slightly different degree of overall relevance
    moodScale = 1
elif currentMood == "cheerful":
    moodScale = 9
elif currentMood == "energetic":
    moodScale = 4
elif currentMood == "peaceful":
    moodScale = 3


for lyricToDo in sys.argv: ##creates list of similarity scores excluding some default scripts and the mood
    if lyricToDo != sys.argv[numLyrics - 1] and lyricToDo != sys.argv[0]:
        simVals.append(moodMatches(currentMood, lyricToDo) * moodScale)

for sim in simVals: ##chooses to display a text if it's similarity surpassses a parameter threshold
    totalSim += sim
    tempSim = str(sim * 10e25)
    digit = int(tempSim[2])
    if digit >= 5.234504:
        print("True")
    else:
        print("False")
