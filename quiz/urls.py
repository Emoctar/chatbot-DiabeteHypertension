from django.urls import path
from . import views

app_name = 'quiz'
urlpatterns = [
    path('quiz/', views.quiz, name='quiz'),
    path('autoevaluation/', views.autoevaluation, name='autoevaluation'),

]

