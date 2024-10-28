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
TRAINING_DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/journal_entries_trainingdata.csv") #defines training csv path
TFIDF_VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl") #location to save the trainined vectorizer
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")#location to save the trainined model

#Each journal entry text (in the journal_sentence column) is preprocessed using the preprocess_text function (from text_processing.py), 
#which performs steps like lowercasing, removing punctuation, and lemmatizing words.
def train_and_save_model():
    training_data = pd.read_csv(TRAINING_DATA_PATH)
    training_data['processed_sentence'] = training_data['journal_sentence'].apply(preprocess_text)
    X = training_data['processed_sentence']
    y = training_data['journal_true_label'].str.get_dummies(sep=', ')


#This vectorizer converts the preprocessed text into numerical features that the machine learning model can understand, using TFIDF
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
    X_tfidf = tfidf_vectorizer.fit_transform(X)


#The MultiOutputClassifier allows classification into multiple categories simultaneously. It uses a logistic regression model to predict labels based on the extracted TF-IDF features.
    multi_label_model = MultiOutputClassifier(LogisticRegression(max_iter=1000, class_weight='balanced'))
    multi_label_model.fit(X_tfidf, y)

#Important
#The trained model and vectorizer are saved as .pkl files so they can be loaded later for real-time predictions without retraining.
    joblib.dump(tfidf_vectorizer, TFIDF_VECTORIZER_PATH)
    joblib.dump(multi_label_model, MODEL_PATH)
    print("Model and vectorizer saved successfully.")

if __name__ == '__main__':
    train_and_save_model()
