# backend/api/common/journal_training.py

import pandas as pd
import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multioutput import MultiOutputClassifier
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('stopwords')
nltk.download('wordnet')

# Define paths
TRAINING_DATA_PATH = 'backend/api/data/journal_entries_trainingdata.csv'  # Path to the training data CSV file
TFIDF_VECTORIZER_PATH = 'backend/api/ml/tfidf_vectorizer.pkl'
MODEL_PATH = 'backend/api/ml/multi_label_model.pkl'

# Function to preprocess text
def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = re.sub(r'[^\w\s]', '', text.lower())
    words = text.split()
    return ' '.join([lemmatizer.lemmatize(word) for word in words if word not in stop_words])

# Function to train and save the model
def train_and_save_model():
    # Load the training data
    training_data = pd.read_csv(TRAINING_DATA_PATH)

    # Preprocess text
    training_data['processed_sentence'] = training_data['journal_sentence'].apply(preprocess_text)

    # Prepare features and labels
    X = training_data['processed_sentence']
    y = training_data['journal_true_label'].str.get_dummies(sep=', ')

    # Vectorize text
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
    X_tfidf = tfidf_vectorizer.fit_transform(X)

    # Train model
    multi_label_model = MultiOutputClassifier(LogisticRegression(max_iter=1000, class_weight='balanced'))
    multi_label_model.fit(X_tfidf, y)

    # Save the model and vectorizer
    joblib.dump(tfidf_vectorizer, TFIDF_VECTORIZER_PATH)
    joblib.dump(multi_label_model, MODEL_PATH)
    print("Model and vectorizer saved successfully.")

# Run training if this script is executed directly
if __name__ == '__main__':
    train_and_save_model()
