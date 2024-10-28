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
    top_keywords = []
    if processed_text:  # Check if processed_text has content after preprocessing
        try:
            count_vectorizer = CountVectorizer(ngram_range=(2, 2), max_features=10)
            text_counts = count_vectorizer.fit_transform([processed_text])
            feature_names = count_vectorizer.get_feature_names_out()
            keyword_counts = text_counts.toarray().sum(axis=0)
            
            # Map keywords with their frequency counts
            keywords = sorted(
                zip(feature_names, keyword_counts),
                key=lambda x: x[1],
                reverse=True
            )
            top_keywords = [kw for kw, _ in keywords]  # Only get the keywords, not their counts
        except ValueError as e:
            print(f"Keyword extraction skipped due to: {e}")
    
    # Print for debugging (optional)
    print(f"Predicted topics: {predicted_labels}")
    print(f"Top keywords: {top_keywords}")
    
    return {
        "topics": predicted_labels,
        "keywords": top_keywords
    }
