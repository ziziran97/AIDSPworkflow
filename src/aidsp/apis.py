from rest_framework import viewsets

from .models import Project, User, Label
from .serializers import ProjectSerializer, ProjectDetailSerializer, UserSerializer, LabelSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.filter()
    # permisson_classes = [IsAdminUser]

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        return super().update(request, *args, **kwargs)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter()


class LabelViewSet(viewsets.ModelViewSet):
    serializer_class = LabelSerializer
    queryset = Label.objects.filter()
