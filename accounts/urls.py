# accounts/urls.py

from django.urls import path
from . import views


app_name = 'accounts'

urlpatterns = [
    
    # Authentification
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.logout_view, name='logout'),

    # Redirection selon le type d'utilisateur
    path('redirect/', views.user_redirect_view, name='user_redirect'),

    # Tableau de bord administrateur
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
]