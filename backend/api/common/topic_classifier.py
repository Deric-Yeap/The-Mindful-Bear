
#C:\The-Mindful-Bear\backend\api\common\topic_classifier.py
import os
import joblib
from api.common.text_processing import split_sentences, preprocess_for_keywords
from sklearn.feature_extraction.text import CountVectorizer

# Paths to saved models and vectorizer
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "../ml/label_columns.pkl")

# Load the pre-trained model, vectorizer, and labels
tfidf_vectorizer = joblib.load(VECTORIZER_PATH)
multi_label_model = joblib.load(MODEL_PATH)
label_columns = joblib.load(LABELS_PATH)

def classify_text(journal_text):
    # Step 1: Split the journal text into original sentences
    sentences = split_sentences(journal_text)

    sentence_classifications = []
    for sentence in sentences:
        if sentence:
            # Vectorize the original sentence for classification
            text_tfidf = tfidf_vectorizer.transform([sentence])

            # Predict topic labels
            prediction = multi_label_model.predict(text_tfidf)
            predicted_labels = [label_columns[i] for i, value in enumerate(prediction[0]) if value == 1]

            # Step 2: Process sentence for keyword extraction
            cleaned_sentence = preprocess_for_keywords(sentence)

            # Extract keywords using CountVectorizer
            top_keywords = {}
            try:
                count_vectorizer = CountVectorizer(ngram_range=(2, 2), max_features=10)
                text_counts = count_vectorizer.fit_transform([cleaned_sentence])
                feature_names = count_vectorizer.get_feature_names_out()
                keyword_counts = text_counts.toarray().sum(axis=0)

                # Map keywords with their frequency counts
                keywords_with_counts = sorted(
                    zip(feature_names, keyword_counts),
                    key=lambda x: x[1],
                    reverse=True
                )

                for label in predicted_labels:
                    top_keywords[label] = [{"keyword": kw, "count": count} for kw, count in keywords_with_counts]
            except ValueError as e:
                print(f"Keyword extraction skipped due to: {e}")

            # Add classification and keywords for the sentence
            sentence_classifications.append({
                "sentence": sentence,  # Original sentence for context
                "predicted_topics": [
                    {
                        "topic": label,
                        "keywords": top_keywords.get(label, [])
                    } for label in predicted_labels
                ]
            })

    # Format response for frontend
    response_data = {
        "topics": sentence_classifications
    }
    return response_data
