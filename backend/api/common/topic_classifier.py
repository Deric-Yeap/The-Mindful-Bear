# C:\The-Mindful-Bear\backend\api\common\topic_classifier.py

import os
import joblib
from api.common.text_processing import split_sentences, preprocess_for_keywords
from sklearn.feature_extraction.text import CountVectorizer
from collections import defaultdict

# Paths to saved models and vectorizer
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "../ml/tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/multi_label_model.pkl")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "../ml/label_columns.pkl")

# Load the pre-trained model, vectorizer, and labels
tfidf_vectorizer = joblib.load(VECTORIZER_PATH)
multi_label_model = joblib.load(MODEL_PATH)
label_columns = joblib.load(LABELS_PATH)

def classify_text(journal_text):
    # Split journal text into sentences
    sentences = split_sentences(journal_text)
    topic_keyword_counts = defaultdict(lambda: defaultdict(int))

    print("Starting classification of journal text...")

    for sentence in sentences:
        if sentence:
            print(f"\nProcessing original sentence: '{sentence}'")
            
            # Classify the sentence
            text_tfidf = tfidf_vectorizer.transform([sentence])
            prediction = multi_label_model.predict(text_tfidf)
            predicted_labels = [label_columns[i] for i, value in enumerate(prediction[0]) if value == 1]
            
            # Check if any topics were predicted for the sentence
            if not predicted_labels:
                print("No topics predicted for this sentence.")
                continue
            print(f"Predicted topics for the sentence: {predicted_labels}")

            # Extract keywords from the cleaned sentence
            cleaned_sentence = preprocess_for_keywords(sentence)
            print(f"Cleaned sentence for keyword extraction: '{cleaned_sentence}'")

            # Skip further processing if cleaned_sentence is empty or contains only stop words
            if not cleaned_sentence.strip():
                print("Cleaned sentence is empty or contains only stop words; skipping.")
                continue

            # Extract top keywords using CountVectorizer
            try:
                count_vectorizer = CountVectorizer(ngram_range=(2, 2), max_features=10)
                text_counts = count_vectorizer.fit_transform([cleaned_sentence])
                feature_names = count_vectorizer.get_feature_names_out()
                keyword_counts = text_counts.toarray().sum(axis=0)

                # Update counts for each topic
                for label in predicted_labels:
                    for keyword, count in zip(feature_names, keyword_counts):
                        topic_keyword_counts[label][keyword] += count

                print(f"Keywords for topics {predicted_labels}: {dict(zip(feature_names, keyword_counts))}")
            
            except ValueError as e:
                print(f"Error with CountVectorizer on sentence '{sentence}': {e}")

    # Display the final aggregated keyword counts for each topic
    print("\nFinal aggregated topic keyword counts:")
    for topic, keywords in topic_keyword_counts.items():
        print(f"Topic: {topic}")
        for keyword, count in keywords.items():
            print(f"  {keyword}: {count}")

    return topic_keyword_counts
