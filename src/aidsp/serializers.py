from rest_framework import serializers

from .models import Project, User, Label
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
                  'total_describe', 'deadline', 'documents', 'labels', 'users_found', 'users_manager', 'users_attend']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']