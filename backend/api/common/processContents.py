import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords




def ensure_nltk_resources():
    resources = [
        ('stopwords', 'stopwords'),
        ('wordnet', 'wordnet'),
        ('punkt', 'punkt'),
        ('averaged_perceptron_tagger', 'averaged_perceptron_tagger')

    ]

    for resource, package in resources:
        try:
            nltk.data.find(resource)
        except LookupError:
            nltk.download(package, quiet=True)


def extract_key_concepts(text):
    # Ensure stopwords are downloaded only once
    ensure_nltk_resources()
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    
    """Extract key concepts and entities from text"""
    # Tokenize and tag parts of speech
    tokens = word_tokenize(text.lower())
    pos_tags = nltk.pos_tag(tokens)
    
    # Extract noun phrases and important terms
    key_terms = []
    for word, tag in pos_tags:
        if (tag.startswith('NN') or tag.startswith('JJ')) and word not in stop_words:
            key_terms.append(lemmatizer.lemmatize(word))

    return set(key_terms)