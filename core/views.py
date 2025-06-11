import mimetypes
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, Http404, HttpResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.db.models import Q
from django.core.paginator import Paginator
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import os
import logging

from .models import Resource
from .forms import ResourceForm
from core import models



def home(request):
    return render(request, 'vitrine/accueil.html', {'title': 'Accueil'})

def apropos(request):
    return render(request, 'vitrine/apropos.html')

def contact(request):
    return render(request, 'vitrine/contact.html')


def ressources(request):
        return render(request, 'vitrine/ressource.html')
    


# Admin
def admin_dashboard(request):
    return render(request, 'admin/dashboard.html')


def admin_ressources(request):
    return render(request, 'admin/ressources.html')

#---------------------------------------------------
# Ressources publiques
def public_resources_list(request):
    """Vue pour afficher la page de ressources"""
    
    # Récupérer toutes les ressources actives
    resources = Resource.objects.filter(is_active=True).select_related('created_by')
    
    # Paramètres de recherche et filtrage
    search_query = request.GET.get('search', '').strip()
    category = request.GET.get('category', '')
    resource_type = request.GET.get('type', '')
    
    # Recherche textuelle
    if search_query:
        resources = resources.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    # Filtrage par catégorie
    if category and category != 'all':
        resources = resources.filter(category=category)
    
    # Filtrage par type de ressource
    if resource_type and resource_type != 'all':
        resources = resources.filter(resource_type=resource_type)
    
    # Tri par date de création (plus récent en premier)
    resources = resources.order_by('-created_at')
    
    # Pagination - 6 ressources par page pour correspondre au template
    paginator = Paginator(resources, 6)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    # CORRECTION: Récupérer les ressources avec un lien externe comme articles
    articles = [r for r in page_obj if r.format_type == 'link' and r.url]
    
    # Récupérer les ressources avec un fichier comme documents téléchargeables
    documents = [r for r in page_obj if r.format_type == 'file' and r.file]
    
    # Préparer les données pour les filtres
    available_categories = [
        ('diabetes', 'Diabète'),
        ('hypertension', 'Hypertension')
    ]
    
    available_types = [
        ('article', 'Articles'),
        ('document', 'Documents'),
        ('video', 'Vidéos'),
        ('website', 'Sites web')
    ]
    
    # Préparer les données pour les documents téléchargeables
    for doc in documents:
        # Déterminer le type d'icône en fonction de l'extension du fichier
        extension = doc.get_file_extension()
        if extension in ['.pdf']:
            doc.file_icon = 'file-pdf-fill'
            doc.file_icon_color = 'red'
        elif extension in ['.doc', '.docx']:
            doc.file_icon = 'file-word-fill'
            doc.file_icon_color = 'blue'
        elif extension in ['.xls', '.xlsx']:
            doc.file_icon = 'file-excel-fill'
            doc.file_icon_color = 'green'
        elif extension in ['.ppt', '.pptx']:
            doc.file_icon = 'file-powerpoint-fill'
            doc.file_icon_color = 'orange'
        else:
            doc.file_icon = 'file-fill'
            doc.file_icon_color = 'gray'
        
        # Récupérer la taille du fichier formatée
        doc.file_size_display = doc.get_file_size()
        
        # Déterminer le type de fichier pour l'affichage
        doc.file_type_display = doc.get_file_extension().upper().replace('.', '')
    
    # Formater les dates de publication pour les articles
    for article in articles:
        # Convertir la date au format français
        month_names = {
            1: 'janvier', 2: 'février', 3: 'mars', 4: 'avril', 5: 'mai', 6: 'juin',
            7: 'juillet', 8: 'août', 9: 'septembre', 10: 'octobre', 11: 'novembre', 12: 'décembre'
        }
        
        day = article.created_at.day
        month = month_names[article.created_at.month]
        year = article.created_at.year
        
        article.formatted_date = f"{day} {month} {year}"
    
    context = {
        'resources': page_obj,
        'articles': articles,
        'documents': documents,
        'search_query': search_query,
        'current_category': category,
        'current_type': resource_type,
        'available_categories': available_categories,
        'available_types': available_types,
        'page_obj': page_obj,
    }
    
    return render(request, 'vitrine/ressource.html', context)

def download_resource(request, resource_id):
    """Vue pour télécharger un document"""
    
    try:
        resource = get_object_or_404(Resource, id=resource_id, is_active=True)
        
        # Vérifier que le fichier existe
        if not resource.file:
            messages.error(request, "Aucun fichier associé à cette ressource.")
            return redirect('resources:list')
        
        # Incrémenter le compteur de téléchargements
        resource.downloads_count = (resource.downloads_count or 0) + 1
        resource.save(update_fields=['downloads_count'])
        
        # Log du téléchargement
        logger.info(f"Téléchargement de la ressource '{resource.title}' (ID: {resource_id})")
        
        # Préparer la réponse de téléchargement
        file_path = resource.file.path
        file_name = os.path.basename(file_path)
        
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type=mimetypes.guess_type(file_path)[0])
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            
            return response
            
    except Exception as e:
        logger.error(f"Erreur lors du téléchargement de la ressource {resource_id}: {str(e)}")
        messages.error(request, "Erreur lors du téléchargement du fichier.")
        return redirect('resources:list')

def search_resources_ajax(request):
    """Vue pour la recherche AJAX de ressources"""
    
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        return JsonResponse({'error': 'Requête AJAX requise'}, status=400)
    
    query = request.GET.get('q', '').strip()
    
    if len(query) < 2:
        return JsonResponse({'results': []})
    
    # Recherche dans les ressources
    resources = Resource.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(tags__icontains=query),
        is_active=True
    )[:10]  # Limiter à 10 résultats
    
    results = []
    for resource in resources:
        results.append({
            'id': resource.id,
            'title': resource.title,
            'description': resource.description[:100] + '...' if len(resource.description) > 100 else resource.description,
            'category': dict(Resource.CATEGORY_CHOICES).get(resource.category, resource.category),
            'type': dict(Resource.RESOURCE_TYPE_CHOICES).get(resource.resource_type, resource.resource_type),
            'url': f'/resources/{resource.id}/',
            'download_url': f'/resources/{resource.id}/download/' if resource.file else None,
        })
    
    return JsonResponse({'results': results})

def resource_detail(request, resource_id):
    """Vue pour afficher le détail d'une ressource"""
    
    resource = get_object_or_404(Resource, id=resource_id, is_active=True)
    
    # Ressources similaires (même catégorie)
    similar_resources = Resource.objects.filter(
        category=resource.category,
        is_active=True
    ).exclude(id=resource.id)[:4]
    
    context = {
        'resource': resource,
        'similar_resources': similar_resources,
    }
    
    return render(request, 'resources/resource_detail.html', context)

@require_http_methods(["GET"])
def download_resource(request, resource_id):
    """Vue pour télécharger une ressource"""
    
    try:
        resource = get_object_or_404(Resource, id=resource_id, is_active=True)
        
        # Vérifier que le fichier existe
        if not resource.file:
            messages.error(request, "Aucun fichier associé à cette ressource.")
            return redirect('resources:detail', resource_id=resource_id)
        
        # Incrémenter le compteur de téléchargements
        if hasattr(resource, 'downloads_count'):
            resource.downloads_count = (resource.downloads_count or 0) + 1
            resource.save(update_fields=['downloads_count'])
        
        # Log du téléchargement
        logger.info(f"Téléchargement de la ressource '{resource.title}' (ID: {resource_id})")
        
        # Préparer la réponse de téléchargement
        response = HttpResponse(resource.file.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{resource.file.name.split("/")[-1]}"'
        
        return response
        
    except Exception as e:
        logger.error(f"Erreur lors du téléchargement de la ressource {resource_id}: {str(e)}")
        messages.error(request, "Erreur lors du téléchargement du fichier.")
        return redirect('resources:list')

@cache_page(60 * 15)  # Cache pendant 15 minutes
def resources_by_category(request, category):
    """Vue pour afficher les ressources d'une catégorie spécifique"""
    
    # Vérifier que la catégorie existe
    if not Resource.objects.filter(category=category, is_active=True).exists():
        raise Http404("Catégorie non trouvée")
    
    resources = Resource.objects.filter(
        category=category, 
        is_active=True
    ).order_by('-created_at')
    
    # Pagination
    paginator = Paginator(resources, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Nom de catégorie pour affichage
    category_names = {
        'diabetes': 'Diabète',
        'hypertension': 'Hypertension',
        'nutrition': 'Nutrition',
        'exercise': 'Exercice physique',
        'general': 'Général'
    }
    
    category_display = category_names.get(category, category.title())
    
    context = {
        'resources': page_obj,
        'category': category,
        'category_display': category_display,
        'total_resources': resources.count(),
        'page_obj': page_obj,
    }
    
    return render(request, 'resources/category_resources.html', context)

def search_resources(request):
    """Vue pour la recherche AJAX de ressources"""
    
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        return JsonResponse({'error': 'Requête AJAX requise'}, status=400)
    
    query = request.GET.get('q', '').strip()
    
    if len(query) < 2:
        return JsonResponse({'results': []})
    
    # Recherche dans les ressources
    resources = Resource.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(tags__icontains=query),
        is_active=True
    )[:10]  # Limiter à 10 résultats
    
    results = []
    for resource in resources:
        results.append({
            'id': resource.id,
            'title': resource.title,
            'description': resource.description[:100] + '...' if len(resource.description) > 100 else resource.description,
            'category': resource.get_category_display(),
            'type': resource.get_resource_type_display(),
            'url': f'/resources/{resource.id}/',
            'download_url': f'/resources/{resource.id}/download/' if resource.file else None,
        })
    
    return JsonResponse({'results': results})

def resources_stats(request):
    """Vue pour obtenir les statistiques des ressources (AJAX)"""
    
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        return JsonResponse({'error': 'Requête AJAX requise'}, status=400)
    
    try:
        # Statistiques générales
        stats = {
            'total_resources': Resource.objects.filter(is_active=True).count(),
            'total_downloads': Resource.objects.filter(is_active=True).aggregate(
                total=models.Sum('downloads_count')
            )['total'] or 0,
            'categories_count': Resource.objects.filter(is_active=True).values('category').distinct().count(),
        }
        
        # Ressources par catégorie
        categories_stats = {}
        for category in Resource.objects.filter(is_active=True).values_list('category', flat=True).distinct():
            categories_stats[category] = Resource.objects.filter(
                category=category, 
                is_active=True
            ).count()
        
        stats['by_category'] = categories_stats
        
        return JsonResponse(stats)
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des statistiques: {str(e)}")
        return JsonResponse({'error': 'Erreur serveur'}, status=500)


@login_required
def resources_list(request):
    """Vue pour afficher la liste des ressources"""
    
    # Debug: Vérifier le nombre total de ressources
    total_resources = Resource.objects.count()
    print(f"Total des ressources dans la DB: {total_resources}")
    
    # Commencer avec toutes les ressources
    resources = Resource.objects.all()
    
    # Récupérer les paramètres de filtrage
    category = request.GET.get('category', 'all')
    resource_type = request.GET.get('type', 'all')
    sort_by = request.GET.get('sort', 'recent')
    
    # Debug: Afficher les paramètres reçus
    print(f"Paramètres de filtrage: category={category}, type={resource_type}, sort={sort_by}")
    
    # Filtrage par catégorie (seulement si différent de 'all')
    if category and category != 'all':
        resources = resources.filter(category=category)
        print(f"Après filtrage catégorie '{category}': {resources.count()} ressources")
    
    # Filtrage par type (seulement si différent de 'all')
    if resource_type and resource_type != 'all':
        resources = resources.filter(resource_type=resource_type)
        print(f"Après filtrage type '{resource_type}': {resources.count()} ressources")
    
    # Tri
    if sort_by == 'popular':
        # Vérifier si le champ downloads_count existe
        try:
            resources = resources.order_by('-downloads_count')
        except:
            print("Champ downloads_count introuvable, tri par date")
            resources = resources.order_by('-created_at')
    elif sort_by == 'az':
        resources = resources.order_by('title')
    else:  # 'recent' par défaut
        resources = resources.order_by('-created_at')
    
    print(f"Nombre final de ressources: {resources.count()}")
    
    # Debug: Afficher quelques exemples de données
    if resources.exists():
        first_resource = resources.first()
        print(f"Première ressource: {first_resource.title} (catégorie: {first_resource.category})")
    
    context = {
        'resources': resources,
        'current_category': category,
        'current_type': resource_type,
        'current_sort': sort_by,
        'total_count': total_resources,  # Pour debug
    }
    
    return render(request, 'admin/ressources.html', context)

import logging
logger = logging.getLogger(__name__)

@login_required
def add_resource(request):
    """Vue pour ajouter une nouvelle ressource"""
    try:
        logger.info(f"Méthode de requête: {request.method}")
        logger.info(f"Données POST: {dict(request.POST)}")
        logger.info(f"Fichiers: {dict(request.FILES)}")
        
        if request.method == 'POST':
            form = ResourceForm(request.POST, request.FILES)
            
            # Debug: afficher toutes les données du formulaire
            logger.info(f"Données du formulaire:")
            for field_name, field_value in request.POST.items():
                logger.info(f"  {field_name}: {field_value}")
            
            logger.info(f"Formulaire valide: {form.is_valid()}")
            
            if form.is_valid():
                resource = form.save(commit=False)
                resource.created_by = request.user
                resource.save()
                logger.info(f"Ressource créée avec succès: {resource.id}")
                
                messages.success(request, 'Ressource ajoutée avec succès!')
                return JsonResponse({
                    'success': True,
                    'message': 'Ressource ajoutée avec succès!',
                    'resource_id': resource.id
                })
            else:
                logger.error(f"Erreurs de formulaire: {form.errors}")
                logger.error(f"Erreurs non-field: {form.non_field_errors()}")
                
                # Formatage des erreurs pour un affichage plus clair
                formatted_errors = {}
                for field, errors in form.errors.items():
                    formatted_errors[field] = [str(error) for error in errors]
                
                return JsonResponse({
                    'success': False, 
                    'errors': formatted_errors,
                    'message': 'Veuillez corriger les erreurs dans le formulaire.'
                })
        
        return JsonResponse({
            'success': False, 
            'error': 'Méthode non autorisée',
            'message': 'Seules les requêtes POST sont autorisées.'
        })
        
    except Exception as e:
        logger.error(f"Erreur dans add_resource: {str(e)}", exc_info=True)
        return JsonResponse({
            'success': False, 
            'error': f'Erreur serveur: {str(e)}',
            'message': 'Une erreur inattendue s\'est produite.'
        })

@login_required
def edit_resource(request, resource_id):
    """Vue pour modifier une ressource"""
    resource = get_object_or_404(Resource, id=resource_id)
    
    if request.method == 'POST':
        form = ResourceForm(request.POST, request.FILES, instance=resource)
        if form.is_valid():
            form.save()
            messages.success(request, 'Ressource modifiée avec succès!')
            return redirect('resources:list')
    else:
        form = ResourceForm(instance=resource)
    
    return render(request, 'resources/edit_resource.html', {
        'form': form, 
        'resource': resource
    })

@login_required
def delete_resource(request, resource_id):
    """Vue pour supprimer une ressource"""
    resource = get_object_or_404(Resource, id=resource_id)
    
    if request.method == 'POST':
        try:
            # Supprimer le fichier associé s'il existe
            if resource.file:
                if default_storage.exists(resource.file.name):
                    default_storage.delete(resource.file.name)
            
            # Supprimer l'image associée s'elle existe
            if resource.image:
                if default_storage.exists(resource.image.name):
                    default_storage.delete(resource.image.name)
            
            resource_title = resource.title
            resource.delete()
            
            logger.info(f"Ressource '{resource_title}' supprimée avec succès")
            messages.success(request, f'Ressource "{resource_title}" supprimée avec succès!')
            
            return JsonResponse({
                'success': True,
                'message': f'Ressource "{resource_title}" supprimée avec succès!'
            })
            
        except Exception as e:
            logger.error(f"Erreur lors de la suppression de la ressource {resource_id}: {str(e)}")
            return JsonResponse({
                'success': False, 
                'error': f'Erreur lors de la suppression: {str(e)}'
            })
    
    return JsonResponse({
        'success': False, 
        'error': 'Méthode non autorisée'
    })