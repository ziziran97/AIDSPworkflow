from rest_framework import viewsets
from rest_framework.response import Response

from .models import Project, User, Label, Document, QA
from .serializers import ProjectSerializer, ProjectDetailSerializer, UserSerializer, LabelSerializer, DocumentSerializer
from django.forms.models import model_to_dict

import json
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.filter()
    # permisson_classes = [IsAdminUser]

    # def list(self):
    #     return super().list()

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        data = request.POST
        _mutable = data._mutable
        # 设置_mutable为True
        data._mutable = True

        dlist = data['labels'].split(',')
        data.pop('labels')
        for ele in dlist:
            if ele != '':
                data.update({'labels': int(ele)})

        dlist = data['users_found'].split(',')
        data.pop('users_found')
        for ele in dlist:
            if ele != '':
                data.update({'users_found': int(ele)})

        dlist = data['users_manager'].split(',')
        data.pop('users_manager')
        for ele in dlist:
            if ele != '':
                data.update({'users_manager': int(ele)})

        dlist = data['users_attend'].split(',')
        data.pop('users_attend')
        for ele in dlist:
            if ele != '':
                data.update({'users_attend': int(ele)})

        project_mo = Project.objects.get(id=data['project_id'])
        if data['requirement_documents']:
            print(project_mo.requirement_documents)
            if not project_mo.requirement_documents:
                ndoc = Document.objects.create(type=0, content=data['requirement_documents'])
                project_mo.requirement_documents = ndoc
            else:
                project_mo.requirement_documents.content = data['requirement_documents']
            project_mo.save()

        if data['collection_documents']:
            if not project_mo.collection_documents:
                project_mo.collection_documents = Document.objects.create(type=1, content=data['collection_documents'])
            else:
                project_mo.collection_documents.content = data['collection_documents']
            project_mo.save()

        if data['labeling_documents']:
            if not project_mo.labeling_documents:
                project_mo.labeling_documents = Document.objects.create(type=2, content=data['labeling_documents'])
            else:
                project_mo.labeling_documents.content = data['labeling_documents']
            project_mo.save()
        del data['requirement_documents']
        del data['collection_documents']
        del data['labeling_documents']
        return super().update(request, *args, **kwargs)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter()


class LabelViewSet(viewsets.ModelViewSet):
    serializer_class = LabelSerializer
    queryset = Label.objects.filter()


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    queryset = Document.objects.filter()

    def retrieve(self, request, *args, **kwargs):
        response = []
        try:
            dqueryset = self.queryset.get(id=kwargs['pk'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qalist.append(model_to_dict(qa))
            response.append({'qa': qalist, 'content': dqueryset.content})
        except:
            response = {'detail': 'None'}
        return Response(response)

