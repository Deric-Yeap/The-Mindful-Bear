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
from datetime import datetime
from collections import defaultdict

# nltk.download('punkt', quiet=True)
# nltk.download('wordnet', quiet=True)
# nltk.download('stopwords', quiet=True)
# nltk.download('averaged_perceptron_tagger', quiet=True)

class SemanticSearchEngine:
    _instance = None
    _is_initialized = False

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(SemanticSearchEngine, cls).__new__(cls)
        return cls._instance

    def __init__(self, relevancy_threshold=0.5):
        if not SemanticSearchEngine._is_initialized:
            try:
                self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
                self.zero_shot_classifier = pipeline(
                    "zero-shot-classification",
                    model="facebook/bart-large-mnli",
                    device=-1
                )
                
                self.lemmatizer = WordNetLemmatizer()
                self.stopwords = set(stopwords.words('english'))
                
                self.session_history = []
                self.intent_history = []
                
                self.relevancy_threshold = relevancy_threshold
                
                self.api_articles = None
                self.article_embeddings = None
                
                self.punctuation = set(string.punctuation)
                
                SemanticSearchEngine._is_initialized = True
            except Exception as e:
                print(f"Initialization error: {e}")
                raise

    def preprocess_text(self, text):
        try:
            if not isinstance(text, str):
                return ""
            
            text = text.lower()
            
            text = ''.join(char for char in text if char not in self.punctuation)
            
            text = ' '.join(text.split())
            
            return text
        except Exception as e:
            print(f"Text preprocessing error: {e}")
            return ""

    def extract_key_concepts(self, text):
        try:
            if not isinstance(text, str):
                return set()

            tokens = word_tokenize(self.preprocess_text(text))
            pos_tags = nltk.pos_tag(tokens)
            
            key_terms = []
            for word, tag in pos_tags:
                if (tag.startswith('NN') or tag.startswith('JJ')) and word not in self.stopwords:
                    key_terms.append(self.lemmatizer.lemmatize(word))
            
            return set(key_terms)
        except Exception as e:
            print(f"Key concept extraction error: {e}")
            return set()

    def detect_intent(self, query):
        try:
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
        except Exception as e:
            print(f"Intent detection error: {e}")
            return {
                'primary_intent': "find specific information",
                'confidence': 1.0,
                'all_intents': {}
            }

    def get_contextual_importance(self, term, session_history):
        try:
            importance = 1.0
            if not session_history:
                return importance

            for past_query in session_history[-3:]:
                if not isinstance(past_query, str):
                    continue
                if term in past_query.lower():
                    importance += 0.5
            return importance
        except Exception as e:
            print(f"Contextual importance calculation error: {e}")
            return 1.0

    def get_cloudfront_url(self, pdf_url):
        try:
            if not pdf_url:
                return None

            # Get the presigned url first
            presigned_url = create_presigned_url(pdf_url)
            if presigned_url:
                return presigned_url

            # If presigned URL generation fails, try CloudFront
            if hasattr(settings, 'CLOUDFRONT_DOMAIN'):
                return f"https://{settings.CLOUDFRONT_DOMAIN}/{pdf_url}"
            return None
        except Exception as e:
            print(f"CloudFront URL generation error: {e}")
            return None

    def calculate_article_weights(self, user_history_data):
        article_weights = {}
        total_clicks = 0

        history_data = user_history_data.get('data', []) if isinstance(user_history_data, dict) else user_history_data

        for search in history_data:
            try:
                search_time = datetime.fromisoformat(search.get('last_searched', '').replace('Z', '+00:00'))
                time_weight = 1.0 

                clicks = search.get('clicks', [])
                for click in clicks:
                    if isinstance(click, dict):  
                        total_clicks += 1
                        article_title = click.get('articleTitle', '')
                        rank_position = click.get('rankPosition', 1)

                        rank_weight = 1.0 / max(rank_position, 1)
                        if article_title not in article_weights:
                            article_weights[article_title] = 1.0
                        article_weights[article_title] += rank_weight * time_weight
            except Exception as e:
                print(f"Error processing search entry: {e}")
                continue

        if total_clicks > 0:
            for title in article_weights:
                article_weights[title] = 1.0 + (article_weights[title] / total_clicks)

        return defaultdict(lambda: 1.0, article_weights)

    def fetch_articles_from_api(self):
        try:
            if self.api_articles is not None and self.article_embeddings is not None:
                return True

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
            
            texts = [f"{article['title']} {article['processed_contents']}" 
                    for article in self.api_articles]
            self.article_embeddings = self.sentence_transformer.encode(
                texts, 
                show_progress_bar=True
            )
            return True
        except Exception as e:
            print(f"Error fetching articles: {e}")
            import traceback
            traceback.print_exc()
            return False

    def semantic_search(self, user_history_data, query, top_k=5):
        try:
            if self.api_articles is None:
                if not self.fetch_articles_from_api():
                    return [], None

            if not query or not isinstance(query, str):
                return [], None

            processed_query = self.preprocess_text(query)
            query_embedding = self.sentence_transformer.encode([processed_query])[0]
            
            print("User history type:", type(user_history_data))
            print("User history content:", user_history_data)

            similar_queries = []
            history_data = []
            if isinstance(user_history_data, dict):
                history_data = user_history_data.get('data', [])
            elif isinstance(user_history_data, list):
                history_data = user_history_data

            for search in history_data:
                if isinstance(search, dict) and 'query' in search:
                    past_query = search['query']
                    past_embedding = self.sentence_transformer.encode([past_query])[0]
                    similarity = cosine_similarity([query_embedding], [past_embedding])[0][0]

                    if similarity > 0.7:  
                        similar_queries.append(past_query)

            similarity_scores = cosine_similarity(
                [query_embedding], 
                self.article_embeddings
            )[0]

            intent_info = self.detect_intent(processed_query)
            self.intent_history.append(intent_info)

            article_weights = {}
            total_clicks = 0

            for search in history_data:
                try:
                    search_time = datetime.fromisoformat(search.get('last_searched', '').replace('Z', '+00:00'))
                    time_weight = 1.0

                    clicks = search.get('clicks', [])
                    for click in clicks:
                        if isinstance(click, dict):
                            total_clicks += 1
                            article_title = click.get('articleTitle', '')
                            rank_position = click.get('rankPosition', 1)

                            rank_weight = 1.0 / max(rank_position, 1)
                            if article_title not in article_weights:
                                article_weights[article_title] = 1.0
                            article_weights[article_title] += rank_weight * time_weight
                except Exception as e:
                    print(f"Error processing search entry: {e}")
                    continue

            if total_clicks > 0:
                for title in article_weights:
                    article_weights[title] = 1.0 + (article_weights[title] / total_clicks)

            article_weights = defaultdict(lambda: 1.0, article_weights)

            query_concepts = self.extract_key_concepts(processed_query)
            for past_query in similar_queries:
                query_concepts.update(self.extract_key_concepts(past_query))
            
            adjusted_scores = similarity_scores.copy()
            for idx, article in enumerate(self.api_articles):
                weight = article_weights[article['title']]
                adjusted_scores[idx] *= weight
                
                article_text = f"{article['title']} {article['processed_contents']}"
                article_concepts = self.extract_key_concepts(article_text)
                
                concept_overlap = len(query_concepts & article_concepts) / max(len(query_concepts), 1)
                
                if intent_info['primary_intent'] == 'find specific information':
                    adjusted_scores[idx] *= (1 + concept_overlap)
                elif intent_info['primary_intent'] == 'explore topic':
                    adjusted_scores[idx] *= (1 + 0.5 * len(article_concepts))
                elif intent_info['primary_intent'] == 'get latest updates':
                    if 'date' in article:
                        adjusted_scores[idx] *= 1.5


                for search in history_data:
                    if search.get('query') in similar_queries:
                        for click in search.get('clicks', []):
                            if click.get('articleTitle') == article['title']:
                                adjusted_scores[idx] *= 1.2  
            
            relevant_indices = np.where(adjusted_scores >= self.relevancy_threshold)[0]
            if len(relevant_indices) == 0:
                return [], intent_info
            
            top_indices = relevant_indices[np.argsort(adjusted_scores[relevant_indices])[::-1][:top_k]]
            
            results = []
            for idx in top_indices:
                article = self.api_articles[idx]
                preview_text = f"{article['title']} {article['processed_contents']}"[:200] + "..."
                
                result = {
                    'article_id': article.get('article_id'),
                    'title': article['title'],
                    'topic': article['topic'],
                    'score': float(adjusted_scores[idx]),
                    'personalization_weight': float(article_weights[article['title']]),
                    'text': preview_text
                }
                
                if article.get('article_pdf_url'):
                    result['article_pdf_url'] = self.get_cloudfront_url(article['article_pdf_url'])
                if article.get('article_image_url'):
                    result['article_image_url'] = self.get_cloudfront_url(article['article_image_url'])
                
                results.append(result)

            print("\nSimilar queries found:", similar_queries)
            print("Query concepts:", query_concepts)
            
            self.session_history.append(query)
            
            return results, intent_info

        except Exception as e:
            print(f"Semantic search error: {e}")
            print(f"Error details: {str(e)}")
            import traceback
            traceback.print_exc()
            return [], None
    def force_refresh(self):
        try:
            self.api_articles = None
            self.article_embeddings = None
            return self.fetch_articles_from_api()
        except Exception as e:
            print(f"Force refresh error: {e}")
            return False