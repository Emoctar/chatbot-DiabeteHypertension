from django.shortcuts import render

# Create your views here.
def quiz(request):
    return render(request, 'quiz/quiz.html')

def autoevaluation(request):
    return render(request, 'quiz/autoevaluation.html')



