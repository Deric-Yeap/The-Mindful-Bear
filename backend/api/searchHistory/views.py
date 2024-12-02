from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Max
from .models import SearchHistory
from .serializer import SearchHistorySerializer, SearchClickSerializer


class SearchHistoryViewSet(viewsets.ModelViewSet):
    """
    Manage Search History

    Provides functionality to record, retrieve, and analyze user search history and clicks.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SearchHistorySerializer

    def get_queryset(self):
        """
        Retrieve search history for the authenticated user.

        Includes related user and article information.
        """
        return SearchHistory.objects.filter(
            userID=self.request.user
        ).select_related('userID', 'articleID')

    @action(detail=False, methods=['GET'])
    def list(self, request):
        """
        List All History

        Retrieves all search history records.
        """
        history = SearchHistory.objects.all()
        return Response(self.get_serializer(history, many=True).data)

    @action(detail=False, methods=['POST'])
    def record_search(self, request):
        """
        Record Search

        Records a search query for the authenticated user.
        """
        query = request.data.get('query')
        if not query:
            return Response(
                {'error': 'Query is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        search_history = SearchHistory.objects.create(
            userID=request.user,
            query=query
        )

        serializer = self.get_serializer(search_history)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'])
    def record_click(self, request):
        """
        Record Click

        Records a click on an article from search results.
        """
        serializer = SearchClickSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(userID=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def user_history(self, request):
        """
        Get User History

        Retrieves the search history of the authenticated user grouped by query.
        """
        history = self.get_queryset().order_by('-created_at')[:50]
        serializer = self.get_serializer(history, many=True)

        grouped_history = {}
        for item in serializer.data:
            query = item['query']
            if query not in grouped_history:
                grouped_history[query] = {
                    'query': query,
                    'last_searched': item['created_at'],
                    'clicks': []
                }
            if item['articleTitle']:
                grouped_history[query]['clicks'].append({
                    'articleTitle': item['articleTitle'],
                    'rankPosition': item['rankPosition']
                })

        return Response(list(grouped_history.values()))

    @action(detail=False, methods=['GET'])
    def popular_searches(self, request):
        """
        Get Popular Searches

        Retrieves the most popular searches made by the user.
        """
        popular = SearchHistory.objects.filter(
            userID=request.user
        ).values('query').annotate(
            search_count=Count('searchID'),
            last_searched=Max('created_at'),
            click_count=Count('articleID', distinct=True)
        ).order_by('-search_count')[:10]

        return Response(list(popular))

    @action(detail=False, methods=['GET'])
    def clicked_articles(self, request):
        """
        Get Clicked Articles

        Retrieves articles clicked from search results.
        """
        clicked = SearchHistory.objects.filter(
            userID=request.user,
            articleID__isnull=False
        ).values(
            'articleID__article_id',
            'articleID__title',
            'articleID__topic'
        ).annotate(
            click_count=Count('searchID'),
            avg_position=Avg('rankPosition'),
            last_clicked=Max('created_at')
        ).order_by('-click_count')[:10]

        return Response(list(clicked))
