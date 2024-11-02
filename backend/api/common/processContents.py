import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.corpus import stopwords

def ensure_nltk_resources():
    """Ensure all required NLTK resources are downloaded"""
    resources = [
        ('punkt', 'punkt'),
        ('wordnet', 'wordnet'),
        ('stopwords', 'stopwords'),
        ('averaged_perceptron_tagger', 'averaged_perceptron_tagger')
    ]
    
    for resource, package in resources:
        try:
            nltk.data.find(f'tokenizers/{resource}')
        except LookupError:
            nltk.download(package, quiet=True)

def process_all_words(text, lemmatizer, stemmer, stopwords_set):
    """Process and show all words with their stemmed forms"""
    if not text:
        print("Warning: Empty text received")
        return []
        
    if not isinstance(text, str):
        text = str(text)
    
    tokens = word_tokenize(text.lower())
    processed_words = []
    
    for token in tokens:
        if token.isalnum():  # Only process alphanumeric tokens
            stemmed = stemmer.stem(token)
            lemmatized = lemmatizer.lemmatize(token)
            processed_words.append({
                'original': token,
                'stemmed': stemmed,
                'lemmatized': lemmatized,
                'is_stopword': token in stopwords_set
            })
    
    return processed_words

def extract_key_concepts(text):
    """Process input text and return processed content in the same format as original code"""
    # Check if text is None or empty
    if not text:
        print("Warning: Empty text received")
        return ""
        
    # Convert to string if not already
    if not isinstance(text, str):
        text = str(text)
    
    # Ensure NLTK resources are available
    ensure_nltk_resources()
    
    # Initialize NLP tools
    lemmatizer = WordNetLemmatizer()
    stemmer = PorterStemmer()
    stopwords_set = set(stopwords.words('english'))
    
    # Process all words
    processed_words = process_all_words(text, lemmatizer, stemmer, stopwords_set)
    
    # Create processed content string with comma separation
    # Only include stemmed forms of non-stopwords, matching original format
    processed_content = ", ".join([word_info['stemmed'] 
                                 for word_info in processed_words 
                                 if not word_info['is_stopword'] and word_info['stemmed']])
    
    return processed_content