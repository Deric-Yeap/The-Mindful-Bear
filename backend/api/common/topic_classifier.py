# topic_classifier.py
import os
import joblib
from api.common.text_processing import preprocess_text
from sklearn.feature_extraction.text import CountVectorizer

# Paths
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "../ml/label_columns.pkl")

# Load pre-trained model, vectorizer, and labels
tfidf_vectorizer = joblib.load(VECTORIZER_PATH)
multi_label_model = joblib.load(MODEL_PATH)
label_columns = joblib.load(LABELS_PATH)

def classify_text(journal_text):
    # Step 1: Preprocess and vectorize the journal text
    processed_text = preprocess_text(journal_text)
    text_tfidf = tfidf_vectorizer.transform([processed_text])
    
    # Step 2: Predict topic labels
    prediction = multi_label_model.predict(text_tfidf)
    predicted_labels = [label_columns[i] for i, value in enumerate(prediction[0]) if value == 1]
    
    # Step 3: Identify top 2-word keywords using CountVectorizer
    top_keywords = {}
    if processed_text:  # Check if processed_text has content after preprocessing
        try:
            count_vectorizer = CountVectorizer(ngram_range=(2, 2), max_features=10)
            text_counts = count_vectorizer.fit_transform([processed_text])
            feature_names = count_vectorizer.get_feature_names_out()
            keyword_counts = text_counts.toarray().sum(axis=0)
            
            # Map keywords with their frequency counts
            keywords_with_counts = sorted(
                zip(feature_names, keyword_counts),
                key=lambda x: x[1],
                reverse=True
            )
            # Prepare the top keywords list with count information
            for label in predicted_labels:
                top_keywords[label] = [{"keyword": kw, "count": count} for kw, count in keywords_with_counts]
        except ValueError as e:
            print(f"Keyword extraction skipped due to: {e}")
    
    # Format the response for frontend
    response_data = {
        "topics": [
            {
                "topic": label,
                "keywords": top_keywords.get(label, [])
            }
            for label in predicted_labels
        ]
    }

    # Print for debugging (optional)
    print(f"Response Data: {response_data}")
    
    return response_data
