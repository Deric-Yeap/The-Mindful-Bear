import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
from collections import defaultdict
from difflib import SequenceMatcher

nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def clean_and_split_response(response):
    sentences = re.split(r'(?<=[.!?])\s+', response)
    cleaned_sentences = []
    for sentence in sentences:
        words = re.sub(r'[^\w\s]', '', sentence.lower()).split()
        keywords = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
        if len(keywords) > 1:
            cleaned_sentences.append((" ".join(sorted(keywords)), sentence.strip()))
    return cleaned_sentences

def is_similar(sentence1, sentence2, threshold=0.7):
    return SequenceMatcher(None, sentence1, sentence2).ratio() > threshold

def process_and_count_responses(responses, top_n=5):
    cleaned_responses = []
    for response in responses:
        cleaned_responses.extend(clean_and_split_response(response))

    response_counts = defaultdict(lambda: {"count": 0, "longest_response": ""})
    
    for cleaned, original in cleaned_responses:
        found = False
        for existing_cleaned, details in response_counts.items():
            if is_similar(cleaned, existing_cleaned):
                response_counts[existing_cleaned]["count"] += 1
                if len(original) > len(details["longest_response"]):
                    response_counts[existing_cleaned]["longest_response"] = original
                found = True
                break
        if not found:
            response_counts[cleaned]["count"] = 1
            response_counts[cleaned]["longest_response"] = original

    sorted_responses = sorted(
        response_counts.values(),
        key=lambda x: x["count"],
        reverse=True
    )[:top_n]

    return [{"response": item["longest_response"], "count": item["count"]} for item in sorted_responses]
