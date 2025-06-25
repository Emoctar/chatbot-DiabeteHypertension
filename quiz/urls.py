from django.urls import path
from . import views

app_name = 'quiz'
urlpatterns = [
    path('quiz/', views.quiz, name='quiz'),
    path('autoevaluation/', views.autoevaluation, name='autoevaluation'),
    
    # Endpoint to submit the score
    path('submit-score/', views.submit_score, name='submit_score'),

    path('dashboard/', views.dashboard_view, name='quiz_dashboard'),

]

