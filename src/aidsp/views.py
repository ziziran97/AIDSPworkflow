from django.db.models import QuerySet
from django.http import FileResponse, JsonResponse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from .models import Project, Task, User
# Create your views here.
import os
from django.conf import settings
from django.forms.models import model_to_dict
from django.db.utils import IntegrityError


def project_index(request,page=None):
    return render(request, 'index.html')


def project_detail(request, id=None):
    try:
        post = Project.objects.get(id=id)
    except Project.DoesNotExist:
        post = None
        return render(request, 'project_detail.html')
    for ele in post.users_found.values('id'):
        if request.user.id == ele['id']:
            return render(request, 'project_detail.html')
    return HttpResponse('对不起，您没有编辑该项目的权限')


def project_display(request, id=None):
    return render(request, 'project_display.html')


def dataset_display(request, id=None):
    return render(request, 'dataset_display.html')


def dataset_detail(request, id=None):
    return render(request, 'dataset_detail.html')


def dataset_fileupload(request):
    filedir = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/file')
    filename = str(request.FILES['file'])
    while filename in os.listdir(filedir):
        filename = 'n_' + filename
    with open(os.path.join(filedir, filename), 'wb') as f:
        for chunk in request.FILES['file'].chunks():
            f.write(chunk)
    # 文件路径
    return HttpResponse(filename)


def dataset_filedownload(request, filename=None):
    filedir = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/file')
    file = open(os.path.join(filedir, filename), 'rb')
    response =FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    return response


def aidspRedirect(request):
    return HttpResponseRedirect('project')


def taskPost(request):
    # for chunk in request.FILES['csvFile'].chunks():
    #     print(chunk)
    #     print('11')
    if request.method == 'POST':
        line = request.FILES['csvFile'].readline()
        while line:
            linedict = line.decode("gbk").replace('\r', '').replace('\n', '').split(',')
            line = request.FILES['csvFile'].readline()
            mpid = Project.objects.get(id=request.POST['project_id'])
            ntask = Task.objects.create(project=mpid, task_name=linedict[0], task_link=linedict[1],
                                        gross=linedict[2], status=0, belong_task=request.POST['taskName'],
                                        task_type=request.POST['task_type'])
            if len(linedict) > 3:
                for elename in linedict[3].split(' '):
                    try:
                        massignee = User.objects.get(name=elename)
                        ntask.assignee.add(massignee)

                    except:
                        pass
            if len(linedict) > 4:
                for elename in linedict[4].split(' '):
                    try:
                        mreviewer = User.objects.get(name=elename)
                        ntask.reviewer.add(mreviewer)
                    except:
                        pass
        return HttpResponse('上传完成')

    else:
        return HttpResponse('不允许的请求方式！')


def taskGet(request, id=None, type=None):
    if request.method == 'GET':
        task_list = Task.objects.filter(project_id=id, task_type=type)
        rdata = {}
        # 添加任务信息到字典
        for ele in task_list:
            # 按大任务分类
            if ele.belong_task not in rdata:
                dict_ele = model_to_dict(ele)

                adict = []
                for a_ele in dict_ele['assignee']:
                    adict.append(a_ele.id)
                    print(a_ele.id)
                dict_ele['assignee'] = adict
                rdict = []
                for r_ele in dict_ele['reviewer']:
                    rdict.append(r_ele.id)
                dict_ele['reviewer'] = rdict

                dict_ele['status'] = ele.get_status_display()
                dict_ele.update({'create_time': ele.create_time})
                rdata[ele.belong_task] = [dict_ele]
            else:
                dict_ele = model_to_dict(ele)

                adict = []
                for a_ele in dict_ele['assignee']:
                    adict.append(a_ele.id)
                dict_ele['assignee'] = adict
                rdict = []
                for r_ele in dict_ele['reviewer']:
                    rdict.append(r_ele.id)
                dict_ele['reviewer'] = rdict

                dict_ele['status'] = ele.get_status_display()
                dict_ele.update({'create_time': ele.create_time})
                rdata[ele.belong_task].append(dict_ele)
        return JsonResponse(rdata)
    # else:
        return HttpResponse('不允许的请求方式！')


def tasksChange(request, id=None):
    if request.method == 'POST':
        mtask = Task.objects.get(id=request.POST['id'])
        if 'assignee' in request.POST:
            mtask.assignee.clear()
            if request.POST['assignee']:
                adict = request.POST['assignee'].split(',')
                for ele in adict:
                    mtask.assignee.add(ele)
        if 'reviewer' in request.POST:
            mtask.reviewer.clear()
            if request.POST['reviewer']:
                rdict = request.POST['reviewer'].split(',')
                for ele in rdict:
                    mtask.reviewer.add(ele)
        if 'status' in request.POST:
            mtask.status = request.POST['status']
            mtask.save()
        return HttpResponse('成功！')

    else:
        return HttpResponse('不允许的请求方式！')
