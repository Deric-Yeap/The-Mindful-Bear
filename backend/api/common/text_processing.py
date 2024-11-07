#C:\The-Mindful-Bear\backend\api\common\text_processing.py
#This function cleans and standardizes the text, transforming it into a simpler format that retains essential information. 
#It removes punctuation, lowercases the text, lemmatizes words, and removes common words (stopwords).

# text_processing.py
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('stopwords')
nltk.download('wordnet')

# Initialize components outside the function to avoid reinitializing on each call
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
custom_stop_words = {"today", "make", "take", "feel", "edge", "going", "much", "wrong", "like", "couldnt", "everything", "felt", "didnt", "im"}
stop_words.update(custom_stop_words)

def split_sentences(text):
    # Split text into sentences using punctuation as delimiters
    sentences = re.split(r'(?<=[.!?])\s+', text)
    print(f"Split text into sentences: {sentences}")
    return sentences

def preprocess_for_keywords(sentence):
    # Process the sentence for keyword extraction only, applying stopword removal and lemmatization
    words = re.sub(r'[^\w\s]', '', sentence.lower()).split()
    keywords = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
    print(f"Keywords extracted from '{sentence}': {keywords}")
    return " ".join(keywords)
