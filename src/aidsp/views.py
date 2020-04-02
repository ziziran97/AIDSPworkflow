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
    return HttpResponseRedirect('personal')


def taskPost(request):
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

# 模型转换字典
def get_dict(ele_model,rdata):
    if ele_model.belong_task not in rdata:
        dict_ele = model_to_dict(ele_model)

        adict = []
        for a_ele in dict_ele['assignee']:
            adict.append(a_ele.id)
        dict_ele['assignee'] = adict
        rdict = []
        for r_ele in dict_ele['reviewer']:
            rdict.append(r_ele.id)
        dict_ele['reviewer'] = rdict

        dict_ele['status'] = ele_model.get_status_display()
        dict_ele.update({'create_time': ele_model.create_time})
        rdata[ele_model.belong_task] = [dict_ele]
    else:
        dict_ele = model_to_dict(ele_model)
        adict = []
        for a_ele in dict_ele['assignee']:
            adict.append(a_ele.id)
        dict_ele['assignee'] = adict
        rdict = []
        for r_ele in dict_ele['reviewer']:
            rdict.append(r_ele.id)
        dict_ele['reviewer'] = rdict

        dict_ele['status'] = ele_model.get_status_display()
        dict_ele.update({'create_time': ele_model.create_time})
        rdata[ele_model.belong_task].append(dict_ele)
    return rdata


def taskGet(request, id=None, type=None):
    if request.method == 'GET':
        task_list = Task.objects.filter(project_id=id, task_type=type)
        rdata = {}
        # 添加任务信息到字典
        for ele in task_list:
            # 按大任务分类
            rdata = get_dict(ele, rdata)
        return JsonResponse(rdata)
    else:
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


def personalTasksGet(request):
    rdata = {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
    }
    rtask_list = Task.objects.filter(reviewer=request.user.id)
    for ele in rtask_list:
        if ele.status == 5:
            rdata[1] = get_dict(ele, rdata[1])
        else:
            rdata[ele.status] = get_dict(ele, rdata[ele.status])
    for sele in rdata:
        for bele in rdata[sele]:
            for tele in rdata[sele][bele]:
                tele.update({'is_admin': True})
    adata = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
    }
    atask_list = Task.objects.filter(assignee=request.user.id)
    for ele in atask_list:
        if ele.status == 5:
            adata[1] = get_dict(ele, adata[1])
        else:
            adata[ele.status] = get_dict(ele, adata[ele.status])
    for sele in adata:
        for bele in adata[sele]:
            for tele in adata[sele][bele]:
                tele.update({'is_admin': False})
    pdata = {
        'reviewer': rdata,
        'assignee': adata,
    }
    return JsonResponse(pdata)


def extraProjectPost(request):
    if request.method == 'POST':
        tproject = Project.objects.get(id = request.POST['id'])
        for key in request.POST:
            print(key)
            if key == 'quantity_week':
                tproject.quantity_week = request.POST['quantity_week']
            if key == 'task_description':
                tproject.task_description = request.POST['task_description']
            if key == 'expected_time':
                print('11111111111111111111111')
                tproject.expected_time = request.POST['expected_time']

        tproject.save()
        return HttpResponse('aaa')

    else:
        return HttpResponse('不允许的请求方式！')

