from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from .models import NewsletterSubscriber

def notify_subscribers(resource, request):
    """
    Envoie un e-mail HTML + texte aux abonnés, avec lien vers la ressource.
    """
    if resource.format_type == 'link' and resource.url:
        link = resource.url
    elif resource.format_type == 'file' and resource.file:
        link = request.build_absolute_uri(resource.file.url)
    else:
        link = request.build_absolute_uri("/")

    subject = "🆕 Nouvelle ressource disponible"

    # Version texte (fallback)
    text_content = f"""\
Bonjour,

Une nouvelle ressource vient d'être publiée :
Titre : {resource.title}
Catégorie : {resource.category}

Accédez à la ressource : {link}

Merci de votre fidélité !
"""

    # Version HTML
    html_content = render_to_string("newsletter/welcome_email.html", {
        "title": resource.title,
        "category": resource.category,
        "description": resource.description,
        "link": link,
    })

    recipients = NewsletterSubscriber.objects.filter(consented=True).values_list("email", flat=True)

    if recipients:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=list(recipients)
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
