# backend/api/common/journal_training.py
import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multioutput import MultiOutputClassifier
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from .text_processing import preprocess_for_keywords

nltk.download('stopwords')
nltk.download('wordnet')

# Define paths
TRAINING_DATA_PATH = os.path.join(os.path.dirname(__file__), "../journal_training_data/journal_entries_trainingdata.csv")
TFIDF_VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "../ml/label_columns.pkl")  # Path for saving labels


def train_and_save_model():
    # Load and preprocess training data
    training_data = pd.read_csv(TRAINING_DATA_PATH)
    training_data['processed_sentence'] = training_data['journal_sentence'].apply(preprocess_for_keywords)

    # Prepare features and labels
    X = training_data['processed_sentence']
    y = training_data['journal_true_label'].str.get_dummies(sep=', ')
    label_columns = y.columns.tolist()  # Convert Index to list

    # Vectorize text
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
    X_tfidf = tfidf_vectorizer.fit_transform(X)

    # Train model
    multi_label_model = MultiOutputClassifier(LogisticRegression(max_iter=1000, class_weight='balanced'))
    multi_label_model.fit(X_tfidf, y)

    # Save model, vectorizer, and label names as separate files
    #files have been saved to a folder called ml
    joblib.dump(tfidf_vectorizer, TFIDF_VECTORIZER_PATH)
    joblib.dump(multi_label_model, MODEL_PATH)
    joblib.dump(label_columns, LABELS_PATH)  # Save only labels list here
    print("Model, vectorizer, and labels saved successfully.")

# Run training if this script is executed directly
if __name__ == '__main__':
    train_and_save_model()