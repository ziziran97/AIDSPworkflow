from rest_framework import serializers

from .models import Project, User, Label, QA, Reply, Dataset, Task, ImgBase
from workload.models import Workload
# Create your views here.


class ProjectSerializer(serializers.ModelSerializer):

    labels = serializers.StringRelatedField(many=True)
    users_found = serializers.StringRelatedField(many=True)
    users_manager = serializers.StringRelatedField(many=True)
    users_attend = serializers.StringRelatedField(many=True)

    class Meta:
        model = Project
        fields = ['id', 'project_id', 'project_name', 'status', 'create_time', 'deadline', 'labels', 'users_found',
                  'users_manager', 'users_attend', 'quantity_week', 'task_description', 'expected_time']


class ProjectDetailSerializer(ProjectSerializer):
    labels = None
    users_found = None
    users_manager = None
    users_attend = None
    
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


class QASerializer(serializers.ModelSerializer):
    class Meta:
        model = QA
        fields = ['author', 'avatar', 'content', 'datetime', 'documents']


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ['author', 'avatar', 'content', 'datetime', 'toquestion']


class ProjectDisplaySerializer(serializers.ModelSerializer):
    labels = serializers.StringRelatedField(many=True)
    users_found = serializers.StringRelatedField(many=True)
    users_manager = serializers.StringRelatedField(many=True)
    # users_attend = serializers.StringRelatedField(many=True)
    # requirement_documents = serializers.StringRelatedField()
    # collection_documents = serializers.StringRelatedField()
    # labeling_documents = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = ['project_id', 'project_name', 'status', 'create_time', 'end_time', 'background', 'total_demand',
                  'total_describe', 'deadline', 'labels', 'users_found', 'users_manager', 'users_attend',
                  'requirement_documents', 'collection_documents', 'labeling_documents', 'quantity_week',
                  'task_description', 'expected_time', 'task_standard', 'basic_quantity']


class DatasetSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField()

    class Meta:
        model = Dataset
        fields = ['id', 'name', 'project', 'describe', 'create_time', 'update_time', 'quantity_detials',
                  'path', 'img',  'project_id']

class ImgBaseSerializer(serializers.ModelSerializer):
    project = None

    class Meta:
        model = ImgBase
        fields = ['id', 'img_name', 'dataset', 'img_path', 'size', 'img_info', 'assignee', 'reviewer', 'create_time', 'update_time']

class DatasetDetailSerializer(DatasetSerializer):
    project = None

    class Meta:
        model = Dataset
        fields = ['id', 'name', 'project', 'describe', 'create_time', 'update_time', 'quantity_detials',
                  'path', 'img',  'project_id']


class DatasetListSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField()

    class Meta:
        model = Dataset
        fields = ['id', 'name', 'project', 'describe', 'create_time', 'update_time', 'quantity_detials', 'project_id']


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id', 'task_name', 'total_time', 'project', 'status', 'task_type', 'used_time',
                  'task_link', 'current_workload', 'belong_task', 'quantity_available', 'done_time', 'create_time',
                  'number_of_reviews', 'gross', 'time_label', 'begin_time', 'reviewer', 'assignee']


class WorkloadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workload
        fields = ['id', 'assignee', 'updated_date', 'workcount', 'pointscount', 'task', 'project_detail_name',
                  'project_id']
