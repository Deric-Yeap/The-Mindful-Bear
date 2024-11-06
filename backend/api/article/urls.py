from django.urls import path
from . import views

urlpatterns = [
    path("create",views.ArticleCreateView.as_view(),name="article-create"),
    path("get",views.ArticleListView.as_view(),name="article-get"),
    path("getArticleById/<int:pk>", views.ArticleGetByIdView.as_view(), name="article-get-article-by-id"),
    path("update/<int:pk>", views.ArticleUpdateDestroyView.as_view(), name="article-update"),
    path("delete/<int:pk>", views.ArticleUpdateDestroyView.as_view(), name="article-delete"),
    path('semantic-search/', views.SemanticSearchView.as_view(), name='semantic-search'),

]