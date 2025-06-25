from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

app_name = 'core'

urlpatterns = [

    #Accueil
    path('', views.home, name='index'),
    path('apropos/', views.apropos, name='apropos'),
    path('contact/', views.contact, name='contact'),
    # path('ressources/', views.ressources, name='ressources'),
    
    # ------------------------------------------
    # Ressources
    path('ressources/', views.public_resources_list, name='list'),
    path('ressources/<int:resource_id>/', views.resource_detail, name='detail'),
    path('ressources/<int:resource_id>/download/', views.download_resource, name='download'),
    path('ressources/category/<str:category>/', views.resources_by_category, name='by_category'),

    # Vues AJAX
    path('search/', views.search_resources, name='search'),
    path('stats/', views.resources_stats, name='stats'),
    
    
    # ------------------------------------------
    # Admin
    # ------------------------------------------
    path('core/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('core/ressources/', views.resources_list, name='resources_list'),
    path('core/add/', views.add_resource, name='add'),
    path('core/edit/<int:resource_id>/', views.edit_resource, name='edit'),
    path('core/delete/<int:resource_id>/', views.delete_resource, name='delete'),



]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)