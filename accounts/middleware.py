# accounts/middleware.py

from django.shortcuts import redirect
from django.urls import reverse
from django.contrib import messages


class UserTypeMiddleware:
    """
    Middleware pour gérer les redirections selon le type d'utilisateur.
    Empêche les membres d'accéder aux pages réservées aux administrateurs.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code exécuté avant la vue
        response = self.get_response(request)
        # Code exécuté après la vue
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Ce middleware vérifie si l'utilisateur essaie d'accéder
        à une page réservée aux administrateurs.
        """
        # Si l'utilisateur n'est pas connecté, on ne fait rien
        if not request.user.is_authenticated:
            return None

        # Vérifiez si l'URL contient 'admin-dashboard'
        if 'admin-dashboard' in request.path:
            # Si l'utilisateur n'est pas un administrateur, redirigez-le
            if not request.user.is_admin_user():
                messages.error(request, "Vous n'avez pas accès à cette page.")
                return redirect(reverse('chatbot:chatbot_interface'))

        # Si tout est en ordre, on continue normalement
        return None