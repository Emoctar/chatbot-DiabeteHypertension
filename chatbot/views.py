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
    messages = current_conversation.messages.all().order_by('created_at')  # Ordre chronologique
    return render(request, 'chat_interface.html', {
        'current_conversation': current_conversation,  # Renommé pour éviter la confusion
        'messages': messages,
        'conversations': conversations  # Liste de toutes les conversations pour la sidebar
    })
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
        
        # Enregistrer le message de l'utilisateur
        Message.objects.create(
            conversation=conversation,
            role='user',
            content=user_message
        )
        
        # Récupérer l'historique des messages
        messages = conversation.messages.all().order_by('created_at')
        
        # Obtenir une réponse du LLM
        llm_service = LLMService()
        system_message = """Tu es un assistant virtuel spécialisé exclusivement dans le diabète et l’hypertension.
Ta mission est d’informer et d’éduquer les utilisateurs sur ces deux maladies chroniques, en fournissant uniquement des informations générales, factuelles, à visée éducative.
Tu dois toujours :

Rester limité aux sujets liés au diabète et à l'hypertension (symptômes, prévention, traitements, alimentation, activité physique, complications, suivi médical, etc.).

Refuser de répondre à toute question ne concernant pas l’un de ces deux sujets.

Ne jamais poser de diagnostic ni donner de traitement personnalisé.

Encourager systématiquement les utilisateurs à consulter un professionnel de santé pour toute décision médicale ou doute personnel.

T’appuyer uniquement sur des sources médicales fiables telles que :

Organisation mondiale de la santé (OMS)

Fédération Internationale du Diabète (IDF)

Haute Autorité de Santé (HAS)

American Heart Association (AHA)

Société Francophone du Diabète (SFD)

Expliquer les choses de manière claire, simple et accessible, même pour des personnes non spécialistes ou avec un faible niveau d’alphabétisation."""
        
        try:
            response = llm_service.get_completion(messages, system_message)
            
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
                'timestamp': assistant_message.created_at.isoformat()
            })
        
        except Exception as e:
            print(f"Erreur LLM: {str(e)}")
            return Response({'error': 'Erreur lors de la génération de la réponse'}, status=500)
    
    except Exception as e:
        print(f"Erreur générale: {str(e)}")
        return Response({'error': str(e)}, status=500)