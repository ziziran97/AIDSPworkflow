from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Project, User, Label, Document, QA
from .serializers import ProjectSerializer, ProjectDetailSerializer, UserSerializer, LabelSerializer, QASerializer
from django.forms.models import model_to_dict

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.filter()
    # permisson_classes = [IsAdminUser]

    # def list(self):
    #     return super().list()

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        ndata = dict(serializer.data)
        try:
            dqueryset = Document.objects.get(id=ndata['requirement_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qalist.append(model_to_dict(qa))
            ndata['req_doc'] = dqueryset.content
            ndata['req_qa'] = qalist
            dqueryset = Document.objects.get(id=ndata['collection_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qalist.append(model_to_dict(qa))
            ndata['col_doc'] = dqueryset.content
            ndata['col_qa'] = qalist

            dqueryset = Document.objects.get(id=ndata['labeling_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qalist.append(model_to_dict(qa))
            ndata['lab_doc'] = dqueryset.content
            ndata['lab_qa'] = qalist
        except Exception as e:
            print(e)
        return Response(ndata)

    def update(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        data = request.POST
        _mutable = data._mutable
        # 设置_mutable为True
        data._mutable = True
        # 字符串转数组
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
        # 文档保存方式
        project_mo = Project.objects.get(id=data['project_id'])
        if data['requirement_documents']:
            if not project_mo.requirement_documents:
                ndoc = Document.objects.create(type=0, content=data['requirement_documents'])
                project_mo.requirement_documents = ndoc
            else:
                project_mo.requirement_documents.content = data['requirement_documents']
                project_mo.requirement_documents.save()
        if data['collection_documents']:
            if not project_mo.collection_documents:
                project_mo.collection_documents = Document.objects.create(type=1, content=data['collection_documents'])
            else:
                project_mo.collection_documents.content = data['collection_documents']
                project_mo.collection_documents.save()

        if data['labeling_documents']:
            if not project_mo.labeling_documents:
                project_mo.labeling_documents = Document.objects.create(type=2, content=data['labeling_documents'])
            else:
                project_mo.labeling_documents.content = data['labeling_documents']
                project_mo.labeling_documents.save()
        project_mo.save()
        del data['requirement_documents']
        del data['collection_documents']
        del data['labeling_documents']
        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.serializer_class = ProjectDetailSerializer
        data = request.POST
        _mutable = data._mutable
        # 设置_mutable为True
        data._mutable = True
        # 字符串转数组
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
        bdata = {}
        bdata['requirement_documents'] = data['requirement_documents']
        bdata['collection_documents'] = data['collection_documents']
        bdata['labeling_documents'] = data['labeling_documents']
        data.pop('requirement_documents')
        data.pop('collection_documents')
        data.pop('labeling_documents')

        # 文档保存方式
        if bdata['requirement_documents']:
            ndoc = Document.objects.create(type=0, content=bdata['requirement_documents'])
            data.update({'requirement_documents': ndoc.id})
        if bdata['collection_documents']:
            ndoc = Document.objects.create(type=0, content=bdata['collection_documents'])
            data.update({'collection_documents': ndoc.id})
        if bdata['labeling_documents']:
            ndoc = Document.objects.create(type=0, content=bdata['labeling_documents'])
            data.update({'labeling_documents': ndoc.id})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter()


class LabelViewSet(viewsets.ModelViewSet):
    serializer_class = LabelSerializer
    queryset = Label.objects.filter()


class QAViewSet(viewsets.ModelViewSet):
    serializer_class = QASerializer
    queryset = QA.objects.filter()



