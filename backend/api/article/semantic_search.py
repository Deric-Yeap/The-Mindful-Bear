# semantic_search.py
import numpy as np
from transformers import pipeline
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from django.apps import apps
from django.conf import settings
from ..common.s3 import create_presigned_url
import string

# Download required NLTK resources
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)

class SemanticSearchEngine:
    _instance = None
    _is_initialized = False

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(SemanticSearchEngine, cls).__new__(cls)
        return cls._instance

    def __init__(self, relevancy_threshold=0.5):
        # Only initialize once
        if not SemanticSearchEngine._is_initialized:
            # Initialize models
            self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
            self.zero_shot_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=-1
            )
            
            # Initialize NLP tools
            self.lemmatizer = WordNetLemmatizer()
            self.stopwords = set(stopwords.words('english'))
            
            # Initialize session context
            self.session_history = []
            self.intent_history = []
            
            # Set relevancy threshold
            self.relevancy_threshold = relevancy_threshold
            
            # Store the API articles
            self.api_articles = None
            self.article_embeddings = None
            
            SemanticSearchEngine._is_initialized = True

            self.punctuation = set(string.punctuation)
            
            SemanticSearchEngine._is_initialized = True
            
        
    def fetch_articles_from_api(self):
        """Fetch pre-processed articles from database"""
        # If articles are already loaded, use them
        if self.api_articles is not None and self.article_embeddings is not None:
            print("Using cached articles")
            return True

        try:
            Article = apps.get_model('article', 'Article')
            articles = Article.objects.all()
            self.api_articles = []
            
            for article in articles:
                self.api_articles.append({
                    'article_id': article.pk,
                    'title': article.title,
                    'topic': article.topic,
                    'processed_contents': article.processed_contents,
                    'article_pdf_url': article.article_pdf_url,
                    'article_image_url': article.article_image_url
                })
            
            # Create embeddings using title and processed_contents
            texts = [
                f"{article['title']} {article['processed_contents']}" 
                for article in self.api_articles
            ]
            self.article_embeddings = self.sentence_transformer.encode(
                texts, 
                show_progress_bar=True
            )
            print(f"Loaded {len(self.api_articles)} articles successfully")
            return True
            
        except Exception as e:
            print(f"Error fetching articles: {e}")
            return False
    
    def extract_key_concepts(self, text):
        """Extract key concepts and entities from text"""
        # Tokenize and tag parts of speech
        text = self.preprocess_text(text)
        tokens = word_tokenize(text)
        pos_tags = nltk.pos_tag(tokens)
        
        # Extract noun phrases and important terms
        key_terms = []
        for word, tag in pos_tags:
            if (tag.startswith('NN') or tag.startswith('JJ')) and word not in self.stopwords:
                key_terms.append(self.lemmatizer.lemmatize(word))
        
        return set(key_terms)
    
    def detect_intent(self, query):
        """Detect the user's search intent using zero-shot classification"""
        candidate_intents = [
            "find specific information",
            "explore topic",
            "compare articles",
            "get latest updates",
            "understand concept",
            "find examples"
        ]
        
        results = self.zero_shot_classifier(
            query,
            candidate_intents,
            multi_label=True
        )
        
        return {
            'primary_intent': results['labels'][0],
            'confidence': results['scores'][0],
            'all_intents': dict(zip(results['labels'], results['scores']))
        }
    
    def get_contextual_importance(self, term, session_history):
        """Calculate term importance based on session history"""
        importance = 1.0
        for past_query in session_history[-3:]:
            if term in past_query.lower():
                importance += 0.5
        return importance

    def get_cloudfront_url(self, pdf_url):
        """Generate CloudFront URL for PDF"""
        if pdf_url:
            # Get the presigned url first
            presigned_url = create_presigned_url(pdf_url)
            if presigned_url:
                return presigned_url
            # If presigned URL generation fails, try CloudFront
            elif hasattr(settings, 'CLOUDFRONT_DOMAIN'):
                return f"https://{settings.CLOUDFRONT_DOMAIN}/{pdf_url}"
        return None
    
    def preprocess_text(self, text):
        """
        Preprocess text by removing punctuation, special characters,
        and normalizing whitespace
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation
        text = ''.join(char for char in text if char not in self.punctuation)
        
        # Replace multiple spaces with single space
        text = ' '.join(text.split())
        
        return text

    def semantic_search(self, query, top_k=5):
        """Perform semantic search with intent and context awareness"""
        if self.api_articles is None:
            if not self.fetch_articles_from_api():
                return [], None
            
        processed_query = self.preprocess_text(query)    
        # Detect intent
        intent_info = self.detect_intent(processed_query)
        self.intent_history.append(intent_info)
        
        # Get query embedding
        query_embedding = self.sentence_transformer.encode([processed_query])[0]
        
        # Calculate semantic similarity scores
        similarity_scores = cosine_similarity(
            [query_embedding], 
            self.article_embeddings
        )[0]
        
        # Extract key concepts from query
        query_concepts = self.extract_key_concepts(processed_query)
        
        # Apply intent-based adjustments
        adjusted_scores = similarity_scores.copy()
        for idx, article in enumerate(self.api_articles):
            article_text = f"{article['title']} {article['processed_contents']}"
            article_concepts = self.extract_key_concepts(article_text)
            
            concept_overlap = len(query_concepts & article_concepts) / max(len(query_concepts), 1)
            
            if intent_info['primary_intent'] == 'find specific information':
                adjusted_scores[idx] *= (1 + concept_overlap)
            elif intent_info['primary_intent'] == 'explore topic':
                adjusted_scores[idx] *= (1 + 0.5 * len(article_concepts))
            
            if self.session_history:
                for term in query_concepts:
                    importance = self.get_contextual_importance(term, self.session_history)
                    if term in article_text.lower():
                        adjusted_scores[idx] *= importance
        
        # Filter results based on relevancy threshold
        relevant_indices = np.where(adjusted_scores >= self.relevancy_threshold)[0]
        if len(relevant_indices) == 0:
            return [], intent_info
        
        # Get top results
        top_indices = relevant_indices[np.argsort(adjusted_scores[relevant_indices])[::-1][:top_k]]
        
        # Format results
        results = []
        for idx in top_indices:
            article = self.api_articles[idx]
            results.append({
                'article_id': article['article_id'],
                'title': article['title'],
                'topic': article['topic'],
                'processed_contents': article['processed_contents'],
                'article_pdf_url': self.get_cloudfront_url(article['article_pdf_url']),
                'article_image_url': article['article_image_url'],
                'score': float(adjusted_scores[idx])
            })
        
        # Update session history
        self.session_history.append(query)
        
        return results, intent_info

    def force_refresh(self):
        """Force refresh the article cache if needed"""
        self.api_articles = None
        self.article_embeddings = None
        return self.fetch_articles_from_api()