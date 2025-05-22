from django.urls import path
from . import views

app_name = 'chatbot'
urlpatterns = [
    path('chatbot/', views.chatbot_interface, name='chatbot_interface'),
    path('conversation/<int:conversation_id>/', views.conversation_view, name='conversation_view'),
    path('api/conversation/create/', views.create_conversation, name='create_conversation'),
    path('api/conversation/<int:conversation_id>/send/', views.send_message, name='send_message'),
]

