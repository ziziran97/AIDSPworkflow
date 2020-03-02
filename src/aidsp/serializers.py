from rest_framework import serializers
from django.forms.models import model_to_dict

from .models import Project, User, Label, Document
# Create your views here.


class ProjectSerializer(serializers.ModelSerializer):

    labels = serializers.StringRelatedField(many=True)
    users_found = serializers.StringRelatedField(many=True)
    users_manager = serializers.StringRelatedField(many=True)

    class Meta:
        model = Project
        fields = ['project_id', 'project_name', 'status', 'create_time', 'labels', 'users_found', 'users_manager']


class ProjectDetailSerializer(ProjectSerializer):
    labels = None
    users_found = None
    users_manager = None

    class Meta:
        model = Project
        fields = ['project_id', 'project_name', 'status', 'create_time', 'end_time', 'background', 'total_demand',
                  'total_describe', 'deadline', 'labels', 'users_found', 'users_manager', 'users_attend',
                  'requirement_documents', 'collection_documents', 'labeling_documents']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['content']

