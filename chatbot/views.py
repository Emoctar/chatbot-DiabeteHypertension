# views.py - Version mise à jour

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Message
from .services import LLMService
import json
import re


@login_required
def chatbot_interface(request):
    conversations = Conversation.objects.filter(user=request.user).order_by('-updated_at')

    if not conversations.exists():
        # Crée une nouvelle conversation si l'utilisateur est nouveau
        new_conversation = Conversation.objects.create(user=request.user, title="Nouvelle conversation")
        return redirect('chatbot:conversation_view', conversation_id=new_conversation.id)
    else:
        # Redirige vers la plus récente
        latest_conversation = conversations.first()
        return redirect('chatbot:conversation_view', conversation_id=latest_conversation.id)

@login_required
def conversation_view(request, conversation_id):
    # Récupérer toutes les conversations pour la sidebar
    conversations = Conversation.objects.filter(user=request.user).order_by('-updated_at')
    # Récupérer la conversation actuelle
    current_conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
    messages = current_conversation.messages.all().order_by('created_at')
    return render(request, 'chat_interface.html', {
        'current_conversation': current_conversation,
        'chat_messages': messages,
        'conversations': conversations
    })

@login_required
def delete_conversation(request, conversation_id):
    # Supprimer la conversation
    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
    conversation.delete()
    return redirect('chatbot:chatbot_interface')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_conversation(request):
    title = request.data.get('title', 'Nouvelle conversation')
    conversation = Conversation.objects.create(title=title, user=request.user)
    
    welcome_message = "Bonjour ! Je suis votre assistant santé spécialisé dans le diabète et l'hypertension. Comment puis-je vous aider aujourd'hui ?"
    Message.objects.create(
        conversation=conversation,
        role='assistant',
        content=welcome_message
    )
    
    redirect_url = reverse('chatbot:conversation_view', kwargs={'conversation_id': conversation.id})
    
    return Response({
        'id': conversation.id,
        'title': conversation.title,
        'redirect_url': redirect_url
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, conversation_id):
    try:
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        
        # Récupérer le message de l'utilisateur du corps de la requête
        try:
            data = request.data
            user_message = data.get('message', '')
        except json.JSONDecodeError:
            return Response({'error': 'Format JSON invalide'}, status=400)
        
        if not user_message:
            return Response({'error': 'Message vide'}, status=400)
        
        # Vérifier si c'est le premier message utilisateur de la conversation
        user_messages_count = conversation.messages.filter(role='user').count()
        is_first_user_message = user_messages_count == 0
        
        # Enregistrer le message de l'utilisateur
        Message.objects.create(
            conversation=conversation,
            role='user',
            content=user_message
        )
        
        # Si c'est le premier message utilisateur ET que le titre est générique, le mettre à jour
        if is_first_user_message and (conversation.title == "Nouvelle Conversation" or conversation.title.startswith("Nouvelle Conversation")):
            llm_service = LLMService()
            new_title = generate_conversation_title(user_message, llm_service)
            conversation.title = new_title
            conversation.save()
        
        # Récupérer l'historique des messages
        messages = conversation.messages.all().order_by('created_at')
        
        # Obtenir une réponse du LLM (Gemini)
        llm_service = LLMService()
        system_message = """You are a virtual assistant that specializes exclusively in diabetes and hypertension.
Your mission is to educate and inform users about these two chronic diseases using only general, factual, and educational information.

You must always:

Remain strictly within topics related to diabetes and hypertension (e.g., symptoms, prevention, treatment, diet, physical activity, complications, medical follow-up).

Politely refuse to answer any question not related to these two conditions.

Never give a diagnosis or personalized medical treatment.

Always encourage users to consult a qualified healthcare professional for any medical decision or concern.

Rely only on authoritative sources, such as:
• World Health Organization (WHO)
• International Diabetes Federation (IDF)
• Haute Autorité de Santé (HAS)
• American Heart Association (AHA)
• Société Francophone du Diabète (SFD)

Explain all concepts in simple, clear, and accessible French.

Use a caring, professional, and educational tone.

<br>
🔧 FORMAT INSTRUCTIONS (VERY IMPORTANT)
Your responses must be generated using valid, clean HTML, not Markdown.
The HTML must be real HTML, not escaped — do not display tags like <p> or <strong> as text.

✅ Use the following tags for structure and styling:

<p> for paragraphs

<strong> for bold

<em> for italic

<ul> and <li> for lists

<br> if needed

✅ Keep the output visually compact and clean:

Avoid large spaces between lines.

Use inline styles like style="margin:0 0 6px 0;" for <p> and style="margin:0 0 4px 0;" for <li> to control spacing.

Do not escape the HTML (e.g., never write &lt;p&gt;, just write <p>).

Final reminder: Always respond in French. Only output HTML that will be rendered, not displayed as raw text."""
        
        try:
            response = llm_service.get_completion(messages, system_message)
            
            # Vérifier que la réponse n'est pas vide
            if not response or response.strip() == "":
                response = "Je suis désolé, je n'ai pas pu générer une réponse appropriée. Pouvez-vous reformuler votre question sur le diabète ou l'hypertension ?"
            
            # Enregistrer la réponse de l'assistant
            assistant_message = Message.objects.create(
                conversation=conversation,
                role='assistant',
                content=response
            )
            
            # Mettre à jour la date de la conversation
            conversation.save()
            
            return Response({
                'message': assistant_message.content,
                'timestamp': assistant_message.created_at.isoformat(),
                'model_used': 'gemini',
                'conversation_title': conversation.title  # Retourner le titre mis à jour
            })
        
        except Exception as e:
            print(f"Erreur LLM Gemini: {str(e)}")
            
            # En cas d'erreur, essayer de donner une réponse de fallback
            fallback_response = "Je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants. En attendant, n'hésitez pas à consulter un professionnel de santé pour toute question urgente concernant votre diabète ou votre hypertension."
            
            assistant_message = Message.objects.create(
                conversation=conversation,
                role='assistant',
                content=fallback_response
            )
            
            return Response({
                'message': assistant_message.content,
                'timestamp': assistant_message.created_at.isoformat(),
                'error': 'Erreur LLM - Réponse de fallback utilisée',
                'conversation_title': conversation.title
            }, status=200)
    
    except Exception as e:
        print(f"Erreur générale: {str(e)}")
        return Response({'error': 'Une erreur inattendue s\'est produite'}, status=500)
 
def generate_conversation_title(user_message, llm_service):
    """
    Génère un titre de conversation basé sur le premier message de l'utilisateur
    """
    try:
        # Message système pour générer un titre court et pertinant
        title_system_message = """Tu es un assistant spécialisé en diabète et hypertension qui génère des titres courts et pertinents pour des conversations médicales.
        
Génère un titre de maximum 50 caractères qui résume le sujet principal de la question sur le diabète ou l'hypertension.
Le titre doit être:
- Court et concis (maximum 50 caractères)
- En français
- Sans guillemets
- Descriptif du sujet principal relatif au diabète ou à l'hypertension
- Professionnel et médical

Exemples de titres sur le diabète et l'hypertension:
- "Gestion du diabète de type 2"
- "Symptômes hypertension artérielle"
- "Alimentation diabétique équilibrée"
- "Exercice et contrôle glycémie"
- "Médicaments antihypertenseurs"
- "Insuline et dosage"
- "Tension artérielle élevée"

Réponds uniquement avec le titre médical, rien d'autre."""

        # Créer un objet Message compatible avec votre classe LLMService
        # Assumant que vous avez une classe Message définie quelque part
        class TempMessage:
            def __init__(self, role, content):
                self.role = role
                self.content = content
        
        # Créer la liste de messages au bon format
        title_messages = [TempMessage('user', user_message)]
        
        # Utiliser le service LLM passé en paramètre (ne pas en créer un nouveau)
        # Passer skip_keyword_check=True pour éviter la vérification des mots-clés sur les titres
        title = llm_service.get_completion(title_messages, title_system_message, skip_keyword_check=True)
        
        # Afficher la réponse brute pour debugging
        print(f"Réponse brute du modèle pour le titre: '{title}'")
        
        # Nettoyer le titre (enlever les guillemets, limiter la longueur)
        if title and isinstance(title, str) and len(title.strip()) > 0:
            title = title.strip().strip('"').strip("'")
            
            # Enlever "Assistant:" au début si présent
            if title.lower().startswith("assistant:"):
                title = title[10:].strip()
            
            # Limiter la longueur
            title = title[:50] if len(title) > 50 else title
            
            # Vérifier que le titre n'est pas vide après nettoyage
            if len(title.strip()) >= 3:
                print(f"Titre généré avec succès: '{title.strip()}'")
                return title.strip()
            else:
                print("Titre trop court après nettoyage")
        else:
            print("Réponse du modèle vide ou invalide")
        
        # Si le modèle n'a pas pu générer un titre valide, fallback
        print("Utilisation du fallback pour générer le titre")
        return "Consultation médicale"
            
    except Exception as e:
        print(f"Erreur génération titre: {str(e)}")
        return "Consultation médicale"