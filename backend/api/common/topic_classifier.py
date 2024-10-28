# backend/api/common/topic_classifier.py
import os
import joblib
from api.common.text_processing import preprocess_text
# Import the shared preprocessing function

# Paths
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")

# Load pre-trained model and vectorizer
tfidf_vectorizer = joblib.load(VECTORIZER_PATH)
multi_label_model = joblib.load(MODEL_PATH)

def classify_text(journal_text):
    processed_text = preprocess_text(journal_text)
    text_tfidf = tfidf_vectorizer.transform([processed_text])
    prediction = multi_label_model.predict(text_tfidf)

    label_columns = multi_label_model.classes_
    predicted_labels = [label_columns[i] for i in range(len(prediction[0])) if prediction[0][i] == 1]
    return predicted_labels
