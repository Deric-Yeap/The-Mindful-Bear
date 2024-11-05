# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Article
from .serializer import ArticleCreateSerializer, ArticleSerializer, ArticleUpdateSerializer,SearchQuerySerializer,SearchResultItemSerializer,IntentSerializer,SearchResultSerializer
from ..common.permission import CustomDjangoModelPermissions
from .semantic_search import SemanticSearchEngine
from rest_framework.permissions import IsAuthenticated
from ..searchHistory.views import SearchHistoryViewSet

class ArticleCreateView(generics.CreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Article.objects.all()
    serializer_class = ArticleCreateSerializer
    
class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ArticleGetByIdView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            article = self.get_object()
            serializer = self.get_serializer(article)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({'detail': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ArticleUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Article.objects.all()
    serializer_class = ArticleUpdateSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_200_OK)
    
class SemanticSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SearchResultSerializer
    queryset = Article.objects.all()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.search_engine = SemanticSearchEngine(relevancy_threshold=0.5)
    
    def post(self, request):
        serializer = SearchQuerySerializer(data=request.data)
        if serializer.is_valid():
            query = serializer.validated_data['query']
            top_k = serializer.validated_data.get('top_k', 5)
            
            # Initialize search engine if not already done
            if self.search_engine.api_articles is None:
                success = self.search_engine.fetch_articles_from_api()
                if not success:
                    return Response(
                        {"error": "Failed to fetch articles"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            # Instead of using viewset directly, create an instance and call the method
            history_viewset = SearchHistoryViewSet()
            history_viewset.request = request
            history_viewset.format_kwarg = None
            
            try:
                user_history_response = history_viewset.user_history(request)
                if user_history_response.status_code == status.HTTP_200_OK:
                    user_history_data = user_history_response.data
                else:
                    return Response(
                        {"error": "Failed to retrieve user history"},
                        status=user_history_response.status_code
                    )
            except Exception as e:
                return Response(
                    {"error": f"Failed to retrieve user history: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Perform search
            results, intent_info = self.search_engine.semantic_search(
                user_history_data,
                query,
                top_k=top_k
            )
            
            # Prepare response
            response_data = {
                "intent": intent_info,
                "results": results
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )