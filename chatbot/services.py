# chat/services.py
# Implémentation de base du service LLM

import os
import json
from openai import OpenAI
import requests
from typing import List
from .models import Message


def _get_mock_response(messages: List[Message]) -> str:
    """
    Génère une réponse de démonstration quand l'API n'est pas configurée.
    Utilisé uniquement pour le développement et les tests.
    """
    # Récupérer le dernier message (de l'utilisateur)
    user_message = ""
    for msg in reversed(messages):
        if msg.role == "user":
            user_message = msg.content.lower()
            break

    # Réponses prédéfinies basées sur des mots-clés
    if "diabète" in user_message:
        return "Le diabète est une maladie chronique caractérisée par un taux élevé de sucre dans le sang. Il existe plusieurs types de diabète, notamment le type 1, le type 2 et le diabète gestationnel. Pour gérer le diabète, il est important de suivre un régime alimentaire équilibré, de faire de l'exercice régulièrement et de prendre les médicaments prescrits. N'hésitez pas à consulter votre médecin pour un suivi régulier."

    elif "hypertension" in user_message:
        return "L'hypertension artérielle est une condition médicale où la pression exercée par le sang contre les parois des artères est constamment élevée. Pour la gérer, il est recommandé de réduire sa consommation de sel, de maintenir un poids santé, de faire de l'exercice régulièrement et de limiter la consommation d'alcool. Dans certains cas, des médicaments peuvent être nécessaires. Un suivi médical régulier est essentiel."

    elif "symptôme" in user_message:
        return "Les symptômes courants du diabète incluent une soif excessive, des mictions fréquentes, une fatigue inhabituelle et une vision floue. Pour l'hypertension, les symptômes peuvent être absents (d'où son surnom de 'tueur silencieux'), mais certaines personnes peuvent ressentir des maux de tête, des étourdissements ou des saignements de nez. Si vous présentez ces symptômes, consultez un professionnel de santé pour un diagnostic approprié."

    elif "alimentation" in user_message or "régime" in user_message:
        return "Une alimentation équilibrée est essentielle pour gérer à la fois le diabète et l'hypertension. Privilégiez les légumes, les fruits, les grains entiers, les protéines maigres et limitez les aliments transformés, riches en sucres ajoutés et en sel. L'approche DASH (Dietary Approaches to Stop Hypertension) est particulièrement recommandée pour l'hypertension, tandis que le comptage des glucides peut être utile pour les personnes diabétiques."

    else:
        return "Je suis votre assistant santé spécialisé dans le diabète et l'hypertension. Je peux vous fournir des informations générales sur ces conditions, leurs symptômes, les traitements disponibles et les recommandations de mode de vie. N'hésitez pas à me poser une question spécifique. N'oubliez pas que je ne remplace pas l'avis d'un professionnel de santé."


class LLMService:
    """
    Service pour gérer les interactions avec un modèle de langage.
    Cette implémentation peut utiliser OpenAI, Anthropic ou un autre fournisseur.
    """
    
    def __init__(self):
        # Récupérer la clé API de l'environnement
        self.api_key = os.environ.get("OPENAI_API_KEY")
        self.api_url = os.environ.get("LLM_API_URL", "https://api.openai.com/v1/chat/completions")
       
        
        # Vérification des erreurs de configuration
        if not self.api_key:
            print("⚠️ Attention: LLM_API_KEY n'est pas définie. Utilisation du mode mock.")
    
    def format_messages(self, messages: List[Message], system_message: str) -> List[dict]:
        """
        Formate les messages de la conversation pour l'API du LLM.
        """
        formatted_messages = [
            {"role": "system", "content": system_message}
        ]
        
        for message in messages:
            formatted_messages.append({
                "role": message.role,  # 'user' ou 'assistant'
                "content": message.content
            })
        
        return formatted_messages
    
    
    def get_completion(self, messages, system_message):
    # Construit le prompt avec message système + historique
        chat_history = [{"role": "system", "content": system_message}]
        for msg in messages:
            chat_history.append({"role": msg.role, "content": msg.content})

        # Appel à l'API OpenAI via HTTP
        response = requests.post(
            self.api_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4",
                "messages": chat_history,
                "temperature": 0.5,
                "max_tokens": 800
            }
        )

        # Vérifie que la requête a réussi
        if response.status_code != 200:
            print(f"Erreur API OpenAI: {response.status_code} - {response.text}")
            return "Une erreur est survenue lors de la communication avec le modèle de langage."

        # Extraction correcte de la réponse
        result = response.json()
        assistant_reply = result["choices"][0]["message"]["content"].strip()

        # Vérifie si la réponse reste dans le domaine diabète / hypertension
        allowed_keywords = [
            'diabète', 'hypertension', 'glycémie', 'insuline', 'tension artérielle',
            'glucose', 'traitement', 'HAS', 'OMS', 'IDF', 'AHA', 'SFD', 'régime', 'activité physique'
        ]

        if not any(keyword in assistant_reply.lower() for keyword in allowed_keywords):
            return ("Je suis désolé, je suis un assistant spécialisé uniquement dans le diabète et l'hypertension. "
                    "Merci de poser une question en rapport avec ces sujets.")

        return assistant_reply

    
