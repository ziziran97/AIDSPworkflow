from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Project, User, Label, Document, QA, Reply, Dataset
from .serializers import ProjectSerializer, ProjectDetailSerializer, UserSerializer, LabelSerializer, QASerializer, \
    ProjectDisplaySerializer, ReplySerializer, DatasetSerializer, DatasetDetailSerializer, DatasetListSerializer
from django.forms.models import model_to_dict
from django.utils import timezone
from django.db.models import Max
import datetime
from django.db.models import Q


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.filter()
    # permisson_classes = [IsAdminUser]

    # def list(self):
    #     return super().list()

    def retrieve(self, request, *args, **kwargs):
        if kwargs['pk'] == 'newproject':
            ndata = {
                'users_found': [request.user.id],
                'users_manager': [request.user.id]
            }
            return Response(ndata)

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
        except Exception as e:
            print(e)
        try:
            dqueryset = Document.objects.get(id=ndata['collection_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qalist.append(model_to_dict(qa))
            ndata['col_doc'] = dqueryset.content
            ndata['col_qa'] = qalist
        except Exception as e:
            print(e)
        try:
            dqueryset = Document.objects.get(id=ndata['labeling_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qalist.append(model_to_dict(qa))
            ndata['lab_doc'] = dqueryset.content
            ndata['lab_qa'] = qalist
        except Exception as e:
            print(e)
        ndata['now_user'] = str(request.user)
        ndata['is_admin'] = request.user.id in ndata['users_found'] or request.user.id in ndata['users_manager']
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
        project_mo = Project.objects.get(project_id=data['project_id'])
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
        create_time = timezone.now().strftime("%Y%m%d")
        maxid = Project.objects.all().aggregate(Max('project_id'))['project_id__max']
        if maxid:
            if maxid.split('_')[0] == create_time:
                data['project_id'] = '%s_%02d' % (create_time, int(maxid.split('_')[1]) + 1)
            else:
                data['project_id'] = '%s_01' % create_time
        else:
            data['project_id'] = '%s_01' % create_time
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).order_by('project_id')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        pdata = []
        # 列出所有用户查找空闲的人
        all_user = []
        for eleuser in User.objects.filter(~Q(position=0)):
            all_user.append(eleuser.name)
        for ele in serializer.data:
            pdict = dict(ele)
            # 计算剩余时间
            if pdict['status'] == '完结':
                pdict['remaining_time'] = '已结束'
            else:
                try:
                    td = datetime.datetime.strptime(pdict['deadline'], "%Y-%m-%dT%H:%M:%S") - timezone.now()
                except:
                    td = datetime.datetime.strptime(pdict['deadline'], "%Y-%m-%dT%H:%M:%S.%f") - timezone.now()
                if td.days >= 0:
                    pdict['remaining_time'] = "%d天%d小时%d分钟" % (td.days, td.seconds/3600, (td.seconds/60) % 60)
                else:
                    try:
                        td = timezone.now() - datetime.datetime.strptime(pdict['deadline'], "%Y-%m-%dT%H:%M:%S")
                    except:
                        td = timezone.now() - datetime.datetime.strptime(pdict['deadline'], "%Y-%m-%dT%H:%M:%S.%f")
                    pdict['remaining_time'] = "-%d天%d小时%d分钟" % (td.days, td.seconds/3600, (td.seconds/60) % 60)
            # 查找当前任务正在进行的人
            pdict['now_person'] = []
            mproject = Project.objects.get(id=ele['id'])
            for eletask in mproject.project_task.all():
                if eletask.status == 1:
                    for eleperson in eletask.assignee.all():
                        pdict['now_person'].append(eleperson.name)
                        if eleperson.name in all_user:
                            all_user.remove(eleperson.name)
            pdata.append(pdict)
        pdata.append({
            'id': '0',
            'project_id': '0',
            'project_name': '空闲',
            'now_person': all_user,
            'status': '未开始准备中数据采集数据标注暂停完结',
            "labels": [],
            "users_found": [],
            "users_manager": [],
            "users_attend": [],

        })

        # print(serializer.data)
        # pdata.append({'remaining_time'})
        return Response(pdata[::-1])


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter()


class LabelViewSet(viewsets.ModelViewSet):
    serializer_class = LabelSerializer
    queryset = Label.objects.filter()


class QAViewSet(viewsets.ModelViewSet):
    serializer_class = QASerializer
    queryset = QA.objects.filter()

    def create(self, request, *args, **kwargs ):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qaobj = QA.objects.create(author=serializer.data['author'],
                                  avatar=serializer.data['avatar'],
                                  content=serializer.data['content'],
                                  datetime=serializer.data['datetime'],
                                  documents=Document.objects.get(id=serializer.data['documents']),
                                  )
        qaobj.save()
        # self.perform_create(serializer)
        pdata = dict(serializer.data)
        pdata.update({'id': qaobj.id})
        headers = self.get_success_headers(serializer.data)
        return Response(pdata, status=status.HTTP_201_CREATED, headers=headers)


class ReplyViewSet(viewsets.ModelViewSet):
    serializer_class = ReplySerializer
    queryset = Reply.objects.filter()


class ProjectdisplayViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectDisplaySerializer
    queryset = Project.objects.filter()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        ndata = dict(serializer.data)
        try:
            dqueryset = Document.objects.get(id=ndata['requirement_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qamdict = model_to_dict(qa)
                replys = qa.reply_set.all()
                if replys:
                    replymdict = model_to_dict(replys[len(replys)-1])
                    qamdict['havechildren'] = replymdict
                qalist.append(qamdict)
            ndata['req_qa'] = qalist
            ndata['req_doc'] = dqueryset.content

        except Exception as e:
            print(e)
        try:
            dqueryset = Document.objects.get(id=ndata['collection_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qamdict = model_to_dict(qa)
                replys = qa.reply_set.all()
                if replys:
                    replymdict = model_to_dict(replys[len(replys)-1])
                    qamdict['havechildren'] = replymdict
                qalist.append(qamdict)
            ndata['col_qa'] = qalist
            ndata['col_doc'] = dqueryset.content

        except Exception as e:
            print(e)
        try:
            dqueryset = Document.objects.get(id=ndata['labeling_documents'])
            qas = dqueryset.qa_set.all()
            qalist = []
            for qa in qas:
                qamdict = model_to_dict(qa)
                replys = qa.reply_set.all()
                if replys:
                    replymdict = model_to_dict(replys[len(replys)-1])
                    qamdict['havechildren'] = replymdict
                qalist.append(qamdict)
            ndata['lab_qa'] = qalist
            ndata['lab_doc'] = dqueryset.content

        except Exception as e:
            print(e)
        ndata['now_user'] = str(request.user)
        ndata['is_admin'] = request.user.name in ndata['users_found'] or request.user.name in ndata['users_manager']
        return Response(ndata)

    def update(self, request, *args, **kwargs):
        data = request.POST
        if 'project_name' not in data and data['status']:
            partc = Project.objects.get(project_id=data['project_id'])
            partc.status = data['status']
            if data['users_attend']:
                usesalist = data['users_attend'].split(',')
            else:
                usesalist = []
            partc.users_attend.set(usesalist)
            partc.save()

            return Response(['成功？'])
        return Response(['do nothing'])


class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    queryset = Dataset.objects.filter()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        pdata = dict(serializer.data)
        partc = Project.objects.get(id=pdata['project_id'])
        pdata['is_admin'] = request.user in partc.users_found.all() or request.user.name in partc.users_manager.all()
        return Response(pdata)

    def create(self, request, *args, **kwargs):
        self.serializer_class = DatasetDetailSerializer
        data = request.POST
        _mutable = data._mutable
        # 设置_mutable为True
        data._mutable = True
        for ele in data:
            if len(ele) > 100:
                ele = ele.replace(' ', '+')
                data['img'] = data['img'] + ';' + ele
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        self.serializer_class = DatasetDetailSerializer
        data = request.POST
        _mutable = data._mutable
        # 设置_mutable为True
        data._mutable = True
        for ele in data:
            if len(ele) > 100:
                ele = ele.replace(' ', '+')
                data['img'] = data['img'] + ';' + ele

        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = DatasetListSerializer
        queryset = self.filter_queryset(self.get_queryset()[::-1])
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)