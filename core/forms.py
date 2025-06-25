from django import forms
from django.core.exceptions import ValidationError
from .models import Resource

class ResourceForm(forms.ModelForm):
    class Meta:
        model = Resource
        fields = ['title', 'description', 'category', 'resource_type', 'format_type', 'file', 'url', 'image']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Entrez le titre de la ressource'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control form-textarea',
                'placeholder': 'Décrivez brièvement cette ressource',
                'rows': 4
            }),
            'category': forms.Select(attrs={
                'class': 'form-select'
            }),
            'resource_type': forms.Select(attrs={
                'class': 'form-select'
            }),
            'format_type': forms.HiddenInput(),
            'url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'https://'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Ajouter des choix vides pour les selects
        self.fields['category'].empty_label = "Sélectionnez une catégorie"
        self.fields['resource_type'].empty_label = "Sélectionnez un type"
        
        # Rendre certains champs optionnels selon le contexte
        self.fields['file'].required = False
        self.fields['url'].required = False
        self.fields['image'].required = False
        
        # Ajouter des classes CSS
        self.fields['file'].widget.attrs.update({'class': 'form-control-file'})
        self.fields['image'].widget.attrs.update({'class': 'form-control-file'})
    
    def clean(self):
        cleaned_data = super().clean()
        format_type = cleaned_data.get('format_type')
        file = cleaned_data.get('file')
        url = cleaned_data.get('url')
        
        # Debug: afficher les données reçues
        print(f"Format type reçu: {format_type}")
        print(f"Fichier reçu: {file}")
        print(f"URL reçue: {url}")
        
        if format_type == 'file':
            if not file:
                raise ValidationError('Un fichier est requis pour ce type de ressource.')
            
            # Validation de la taille du fichier (max 10MB)
            if file.size > 10 * 1024 * 1024:
                raise ValidationError('La taille du fichier ne doit pas dépasser 10MB.')
            
            # Validation des types de fichiers autorisés
            allowed_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', 
                                '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.txt']
            
            file_name = file.name.lower()
            file_extension = '.' + file_name.split('.')[-1] if '.' in file_name else ''
            
            if file_extension not in allowed_extensions:
                raise ValidationError(f'Type de fichier non autorisé. Extensions autorisées: {", ".join(allowed_extensions)}')
        
        elif format_type == 'link':
            if not url:
                raise ValidationError('Une URL est requise pour ce type de ressource.')
            
            # Validation basique de l'URL
            if not url.startswith(('http://', 'https://')):
                raise ValidationError('L\'URL doit commencer par http:// ou https://')
        
        return cleaned_data
    
    def clean_title(self):
        title = self.cleaned_data.get('title')
        if not title or len(title.strip()) < 3:
            raise ValidationError('Le titre doit contenir au moins 3 caractères.')
        return title.strip()
    
    def clean_description(self):
        description = self.cleaned_data.get('description')
        if not description or len(description.strip()) < 10:
            raise ValidationError('La description doit contenir au moins 10 caractères.')
        return description.strip()