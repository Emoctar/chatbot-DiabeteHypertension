# accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views import View
from django.utils.decorators import method_decorator
from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import get_user_model

from .forms import LoginForm, RegisterForm
from chatbot.models import Conversation, Message

User = get_user_model()


# Fonction utilitaire pour compter les statistiques
def get_admin_stats():
    return {
        'users_count': User.objects.filter(user_type='member').count(),
        'conversations_count': Conversation.objects.count(),
        'messages_count': Message.objects.count(),
    }



# Vue de connexion (basée sur une classe)

class LoginView(FormView):
    template_name = 'login.html'
    form_class = LoginForm
    
    def get_form_kwargs(self):
        """Passe la requête au formulaire pour gérer l'option "se souvenir de moi"."""
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        # Récupère les données nettoyées du formulaire
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        remember_me = form.cleaned_data.get('remember_me', False)

        # Authentifie l'utilisateur
        user = authenticate(username=username, password=password)

        if user is not None:
            # Connecte l'utilisateur
            login(self.request, user)
            
            # Gestion de "se souvenir de moi"
            if not remember_me:
                # Si l'utilisateur ne veut pas être mémorisé, paramétrer la session pour
                # qu'elle expire quand le navigateur est fermé
                self.request.session.set_expiry(0)
                
            messages.success(self.request, f"Bienvenue, {user.username} !")

            # Redirige vers la page appropriée selon le type d'utilisateur
            return redirect(user.get_redirect_url())
        else:
            messages.error(self.request, "Nom d'utilisateur ou mot de passe incorrect.")
            return self.form_invalid(form)

    def get_success_url(self):
        # Cette méthode est appelée lorsque form_valid est appelée
        # Elle est redondante ici car nous gérons la redirection dans form_valid
        return reverse_lazy('accounts:user_redirect')

# Vue d'inscription (basée sur une classe)
class RegisterView(FormView):
    template_name = 'register.html'
    form_class = RegisterForm
    success_url = reverse_lazy('chatbot:chatbot_interface')

    def form_valid(self, form):
        # Enregistre l'utilisateur
        user = form.save()

        # Connecte automatiquement l'utilisateur après l'inscription
        login(self.request, user)

        messages.success(self.request, "Inscription réussie ! Bienvenue sur notre plateforme.")
        return super().form_valid(form)


# Vue de déconnexion
def logout_view(request):
    logout(request)
    messages.info(request, "Vous avez été déconnecté avec succès.")
    return redirect('accounts:login')


# Vue de redirection selon le type d'utilisateur
@login_required
def user_redirect_view(request):
    """
    Redirige l'utilisateur vers la page appropriée selon son type
    """
    user = request.user
    return redirect(user.get_redirect_url())


# Vue du tableau de bord administrateur
@login_required
def admin_dashboard_view(request):
    """
    Vue du tableau de bord pour les administrateurs
    """
    # Vérifie si l'utilisateur est un administrateur
    if not request.user.is_admin_user():
        messages.error(request, "Vous n'avez pas accès à cette page.")
        return redirect('chatbot:chatbot_interface')

    # Récupère les statistiques
    stats = get_admin_stats()

    # Récupère les utilisateurs récents
    recent_users = User.objects.filter(user_type='member').order_by('-date_joined')[:10]

    # Récupère les conversations récentes
    recent_conversations = Conversation.objects.select_related('user').order_by('-created_at')[:10]

    context = {
        **stats,
        'recent_users': recent_users,
        'recent_conversations': recent_conversations,
    }

    return redirect('core:admin_dashboard')