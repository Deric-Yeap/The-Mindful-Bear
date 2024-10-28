import joblib
import os
from .text_processing import preprocess_text


# Paths to the saved model and vectorizer
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")

# Load the model and vectorizer
multi_label_model = joblib.load(MODEL_PATH)
tfidf_vectorizer = joblib.load(VECTORIZER_PATH)

def classify_text(text):
    # Preprocess the input text
    processed_text = preprocess_text(text)
    
    # Transform text to vector
    text_vector = tfidf_vectorizer.transform([processed_text])
    
    # Predict labels
    prediction = multi_label_model.predict(text_vector)
    
    # Get the label names
    label_columns = multi_label_model.classes_
    predicted_labels = [label_columns[i] for i in range(len(prediction[0])) if prediction[0][i] == 1]
    
    return predicted_labels
