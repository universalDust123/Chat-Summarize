from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListCreateView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/messages/', views.MessageCreateView.as_view(), name='message-create'),
    path('conversations/<int:pk>/end/', views.EndConversationView.as_view(), name='conversation-end'),
]
