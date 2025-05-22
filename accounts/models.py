# accounts/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé avec deux types d'utilisateurs:
    - admin: pour accéder au tableau de bord
    - member: pour accéder au chatbot
    """
    USER_TYPE_CHOICES = [
        ('admin', 'Administrateur'),
        ('member', 'Membre'),
    ]

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='member',
        verbose_name="Type d'utilisateur"
    )

    bio = models.TextField(
        max_length=500,
        blank=True,
        verbose_name="Biographie"
    )

    # Méthodes pour vérifier le type d'utilisateur
    def is_admin_user(self):
        """Vérifie si l'utilisateur est de type admin"""
        return self.user_type == 'admin'

    def is_member_user(self):
        """Vérifie si l'utilisateur est de type member"""
        return self.user_type == 'member'

    def get_redirect_url(self):
        """Retourne l'URL de redirection en fonction du type d'utilisateur"""
        if self.is_admin_user():
            return reverse('accounts:admin_dashboard')
        else:
            return reverse('chatbot:chatbot_interface')

    def __str__(self):
        return self.username