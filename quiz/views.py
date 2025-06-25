from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import QuizSubmission
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Avg

# Create your views here.
def quiz(request):
    return render(request, 'quiz/quiz.html')

def autoevaluation(request):
    return render(request, 'quiz/autoevaluation.html')


@require_POST
def submit_score(request):
    data = json.loads(request.body)

    QuizSubmission.objects.create(
        quiz_type=data['quiz_type'],
        score=data['score'],
        duration=data['duration']
    )
    return JsonResponse({'status': 'success'})

@staff_member_required
def dashboard_view(request):
    stats = QuizSubmission.objects.aggregate(
        total=Count('id'),
        avg_score=Avg('score'),
        avg_duration=Avg('duration')
    )
    return render(request, 'quiz/testdashbord.html', {'stats': stats})



