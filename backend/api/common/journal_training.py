# backend/api/common/journal_training.py
import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multioutput import MultiOutputClassifier
from api.common.text_processing import preprocess_text
 # Import the shared preprocessing function

# Paths
TRAINING_DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/journal_entries_trainingdata.csv")
TFIDF_VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")

def train_and_save_model():
    training_data = pd.read_csv(TRAINING_DATA_PATH)
    training_data['processed_sentence'] = training_data['journal_sentence'].apply(preprocess_text)
    X = training_data['processed_sentence']
    y = training_data['journal_true_label'].str.get_dummies(sep=', ')

    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
    X_tfidf = tfidf_vectorizer.fit_transform(X)

    multi_label_model = MultiOutputClassifier(LogisticRegression(max_iter=1000, class_weight='balanced'))
    multi_label_model.fit(X_tfidf, y)

    joblib.dump(tfidf_vectorizer, TFIDF_VECTORIZER_PATH)
    joblib.dump(multi_label_model, MODEL_PATH)
    print("Model and vectorizer saved successfully.")

if __name__ == '__main__':
    train_and_save_model()
