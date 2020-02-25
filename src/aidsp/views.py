from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework import viewsets
from .serializers import ProjectSerializer
from .models import Project
# Create your views here.

def project_index(request):
    return render(request, 'index.html')


def project_detail(request, project_id=None):
    try:
        post = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        post = None
    return render(request, 'project_detail.html', context={'post': post})

