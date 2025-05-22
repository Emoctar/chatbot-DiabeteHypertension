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
    path('ressources/', views.ressources, name='ressources'),
    
    # ------------------------------------------
    # Admin
    # ------------------------------------------
     path('core/', views.admin_dashboard, name='admin_dashboard'),
    


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)