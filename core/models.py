from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator
import os

class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('diabetes', 'Diabète'),
        ('hypertension', 'Hypertension'),
        ('general', 'Général'),
    ]
    
    TYPE_CHOICES = [
        ('article', 'Article'),
        ('document', 'Document'),
        ('video', 'Vidéo'),
        ('website', 'Site web'),
    ]
    
    RESOURCE_FORMAT_CHOICES = [
        ('file', 'Fichier'),
        ('link', 'Lien externe'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES, 
        verbose_name="Catégorie"
    )
    resource_type = models.CharField(
        max_length=20, 
        choices=TYPE_CHOICES, 
        verbose_name="Type de ressource"
    )
    format_type = models.CharField(
        max_length=10,
        choices=RESOURCE_FORMAT_CHOICES,
        default='file',
        verbose_name="Format"
    )
    
    # Pour les fichiers
    file = models.FileField(
        upload_to='media/files/', 
        blank=True, 
        null=True,
        verbose_name="Fichier"
    )
    
    # Pour les liens externes
    url = models.URLField(
        blank=True, 
        null=True,
        validators=[URLValidator()],
        verbose_name="URL"
    )
    
    # Image pour les ressources externes
    image = models.ImageField(
        upload_to='media/images/', 
        blank=True, 
        null=True,
        verbose_name="Image"
    )
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        verbose_name="Créé par"
    )
    downloads_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Ressource"
        verbose_name_plural = "Ressources"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def get_file_extension(self):
        """Retourne l'extension du fichier"""
        if self.file:
            return os.path.splitext(self.file.name)[1].lower()
        return ''
    
    def get_file_size(self):
        """Retourne la taille du fichier formatée"""
        if self.file:
            size = self.file.size
            if size < 1024:
                return f"{size} bytes"
            elif size < 1048576:
                return f"{size/1024:.1f} KB"
            else:
                return f"{size/1048576:.1f} MB"
        return ''
    
    def get_icon_class(self):
        """Retourne la classe d'icône appropriée selon le type"""
        if self.format_type == 'link':
            if self.resource_type == 'video':
                return 'fas fa-play-circle'
            elif self.resource_type == 'website':
                return 'fas fa-globe'
            else:
                return 'fas fa-link'
        else:
            extension = self.get_file_extension()
            if extension in ['.pdf']:
                return 'fas fa-file-pdf'
            elif extension in ['.doc', '.docx']:
                return 'fas fa-file-word'
            elif extension in ['.xls', '.xlsx']:
                return 'fas fa-file-excel'
            elif extension in ['.ppt', '.pptx']:
                return 'fas fa-file-powerpoint'
            elif extension in ['.jpg', '.jpeg', '.png', '.gif']:
                return 'fas fa-file-image'
            else:
                return 'fas fa-file'
    
    def clean(self):
        """Validation personnalisée"""
        from django.core.exceptions import ValidationError
        
        if self.format_type == 'file' and not self.file:
            raise ValidationError('Un fichier est requis pour ce type de ressource.')
        
        if self.format_type == 'link' and not self.url:
            raise ValidationError('Une URL est requise pour ce type de ressource.')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)