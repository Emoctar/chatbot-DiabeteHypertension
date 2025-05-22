# accounts/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class LoginForm(AuthenticationForm):
    """
    Formulaire de connexion personnalisé qui utilise le nom d'utilisateur et le mot de passe
    """
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:border-primary transition-colors',
                'placeholder': 'Votre nom d\'utilisateur',
                'id': 'id_username',
            }
        )
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:border-primary transition-colors',
                'placeholder': 'Votre mot de passe',
                'id': 'id_password',
            }
        )
    )
    
    remember_me = forms.BooleanField(
        required=False,
        initial=False,
        widget=forms.CheckboxInput(
            attrs={
                'class': 'custom-checkbox',
                'id': 'remember',
            }
        )
    )
    
    def clean(self):
        # Appel de la méthode clean du parent pour validation standard
        cleaned_data = super().clean()
        
        # Si le formulaire inclut l'option "remember me"
        if self.cleaned_data.get('remember_me'):
            # Définir la durée de la session à 2 semaines (ou autre durée souhaitée)
            self.request.session.set_expiry(1209600)  # 2 semaines en secondes
        
        return cleaned_data

class RegisterForm(UserCreationForm):
    """Formulaire d'inscription personnalisé basé sur le template SantéChat"""

    name = forms.CharField(
        label="Nom complet",
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-button text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-0',
            'placeholder': 'Entrez votre nom',
            'id': 'name'
        })
    )

    email = forms.EmailField(
        label="Adresse email",
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-button text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-0',
            'placeholder': 'Entrez votre email',
            'id': 'email'
        })
    )

    password1 = forms.CharField(
        label="Mot de passe",
        widget=forms.PasswordInput(attrs={
            'class': 'w-full pl-10 pr-10 py-2 border border-gray-300 rounded-button text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-0',
            'placeholder': 'Créez un mot de passe',
            'id': 'password'
        })
    )

    password2 = forms.CharField(
        label="Confirmer le mot de passe",
        widget=forms.PasswordInput(attrs={
            'class': 'w-full pl-10 pr-10 py-2 border border-gray-300 rounded-button text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-0',
            'placeholder': 'Confirmez votre mot de passe',
            'id': 'confirm-password'
        })
    )

    terms = forms.BooleanField(
        label="J'accepte les conditions d'utilisation et la politique de confidentialité",
        required=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'custom-checkbox',
            'id': 'terms'
        })
    )

    class Meta:
        model = User
        fields = ('name', 'email', 'password1', 'password2', 'terms')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Cette adresse email est déjà utilisée.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        # Séparer le nom complet en prénom/nom (facultatif)
        name_parts = self.cleaned_data['name'].split(' ', 1)
        user.first_name = name_parts[0]
        if len(name_parts) > 1:
            user.last_name = name_parts[1]

        user.email = self.cleaned_data['email']
        user.username = self.cleaned_data['email']  # Utiliser l'email comme nom d'utilisateur

        if commit:
            user.save()
        return user