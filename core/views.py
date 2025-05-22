# Create your views here.
from django.shortcuts import render

def home(request):
    return render(request, 'vitrine/accueil.html', {'title': 'Accueil'})

def apropos(request):
    return render(request, 'vitrine/apropos.html')

def contact(request):
    return render(request, 'vitrine/contact.html')


def ressources(request):
        return render(request, 'vitrine/ressource.html')
    
def admin_dashboard(request):
    return render(request, 'admin/dashboard.html')
