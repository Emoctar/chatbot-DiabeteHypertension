from django.contrib import admin
from .models import Conversation, Message
from django.utils.html import format_html

admin.site.register(Conversation)
admin.site.register(Message)

# Register your models here.
