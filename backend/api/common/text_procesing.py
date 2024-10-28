#This function cleans and standardizes the text, transforming it into a simpler format that retains essential information. 
#It removes punctuation, lowercases the text, lemmatizes words, and removes common words (stopwords).

import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = re.sub(r'[^\w\s]', '', text.lower())
    words = text.split()
    return ' '.join([lemmatizer.lemmatize(word) for word in words if word not in stop_words])
