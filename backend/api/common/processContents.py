import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
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

# Call this function at the start of your application or before you use nltk features


def extract_key_concepts(text):
    # Ensure stopwords are downloaded only once
    ensure_nltk_resources()
    lemmatizer = WordNetLemmatizer()
    stopwords_set = set(stopwords.words('english'))
    
    """Extract key concepts and entities from text"""
    # Tokenize and tag parts of speech
    tokens = word_tokenize(text.lower())
    pos_tags = nltk.pos_tag(tokens)
    
    # Extract noun phrases and important terms
    key_terms = []
    for word, tag in pos_tags:
        if (tag.startswith('NN') or tag.startswith('JJ')) and word not in stopwords_set:
            key_terms.append(lemmatizer.lemmatize(word))
    
    return set(key_terms)