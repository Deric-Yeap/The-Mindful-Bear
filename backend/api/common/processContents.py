import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.corpus import stopwords


def ensure_nltk_resources():
    resources = [
        ('corpora/stopwords.zip', 'stopwords'),
        ('corpora/wordnet.zip', 'wordnet'),
        ('taggers/averaged_perceptron_tagger_eng', 'averaged_perceptron_tagger_eng'),
        ('tokenizers/punkt', 'punkt'),
    ]

    for resource, package in resources:
        try:
            nltk.data.find(resource)
        except LookupError:
            nltk.download(package, quiet=True)


def extract_key_concepts(text):
    # Check if text is None or empty
    if not text:
        print("Warning: Empty text received")
        return ""
        
    # Convert to string if not already
    if not isinstance(text, str):
        text = str(text)
    
    # Ensure stopwords are downloaded only once
    ensure_nltk_resources()
    lemmatizer = WordNetLemmatizer()
    stemmer = PorterStemmer()
    stopwords_set = set(stopwords.words('english'))
    
    # Tokenize
    tokens = word_tokenize(text.lower())
    
    # Tag parts of speech
    pos_tags = nltk.pos_tag(tokens)
    
    # Process words while maintaining order
    seen_words = set()  # To track unique words
    processed_words = []
    
    for word, tag in pos_tags:
        # Only process if word is not a stopword and is alphanumeric
        if word not in stopwords_set and word.isalnum():
            current_forms = set()  # Track forms for current word
            
            # Process original word
            if word not in seen_words:
                processed_words.append(word)
                seen_words.add(word)
                current_forms.add(word)
            
            # Process lemmatized form
            lemmatized = lemmatizer.lemmatize(word)
            if lemmatized not in current_forms and lemmatized not in seen_words:
                processed_words.append(lemmatized)
                seen_words.add(lemmatized)
                current_forms.add(lemmatized)
            
            # Process stemmed form
            stemmed = stemmer.stem(word)
            if stemmed not in current_forms and stemmed not in seen_words:
                processed_words.append(stemmed)
                seen_words.add(stemmed)
    
    # Join words with commas, preserving order
    return ", ".join(processed_words)