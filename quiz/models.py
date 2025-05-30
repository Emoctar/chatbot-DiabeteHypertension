from django.db import models

# Create your models here.
class QuizSubmission(models.Model):
    quiz_type = models.CharField(max_length=100)
    score = models.FloatField()
    duration = models.FloatField()  # en secondes
    submitted_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "Quiz Submission"
        verbose_name_plural = "Quiz Submissions"