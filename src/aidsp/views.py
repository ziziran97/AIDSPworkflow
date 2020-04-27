from django.db.models import QuerySet
from django.http import FileResponse, JsonResponse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from .models import Project, Task, User, Img
# Create your views here.
import os
from django.forms.models import model_to_dict
from django.db.models import Q
import json
import urllib
from django.conf import settings
from django.db.models import Count
from django.utils import timezone
from .cli.cvat import create_tasks

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

def pic_screen(request,task_name=None):
    return render(request, 'pic_screen.html')

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


# 任务分配
def taskPost(request):
    if request.method == 'POST':
        line = request.FILES['csvFile'].readline()
        errorflog = False
        errortask = []
        erroruser = []
        # 读取csv
        while line:
            linedict = line.decode("gbk").replace('\r', '').replace('\n', '').split(',')
            line = request.FILES['csvFile'].readline()
            if linedict[0]:
                try:
                    ntask = Task.objects.get(task_name=linedict[0])
                    # 添加人员
                    if len(linedict) > 1:
                        for elename in linedict[1].split(' '):
                            if elename:
                                try:
                                    massignee = User.objects.get(name=elename)
                                    ntask.assignee.add(massignee)
                                except Exception as e:
                                    print(e)
                                    erroruser.append(elename)
                                    errorflog = True

                    if len(linedict) > 2:
                        for elename in linedict[2].split(' '):
                            if elename:
                                try:
                                    mreviewer = User.objects.get(name=elename)
                                    ntask.reviewer.add(mreviewer)
                                except Exception as e:
                                    print(e)
                                    erroruser.append(elename)
                                    errorflog = True

                except Exception as e:
                    print(e)
                    errortask.append(linedict[0])
                    errorflog = True
        if errorflog:
            return HttpResponse('任务名%s不存在\n用户%s不存在' % (errortask, erroruser), status=203)
        else:
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


# 获取任务信息
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


# 改变任务状态
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
        if 'quantity_available' in request.POST:
            mtask.quantity_available = request.POST['quantity_available']
            mtask.save()
        return HttpResponse('成功！')

    else:
        return HttpResponse('不允许的请求方式！')


# 获取个人任务
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


# 项目展示页面提交
def extraProjectPost(request):
    if request.method == 'POST':
        tproject = Project.objects.get(id=request.POST['id'])
        for key in request.POST:
            if key == 'quantity_week':
                tproject.quantity_week = request.POST['quantity_week']
            if key == 'task_description':
                tproject.task_description = request.POST['task_description']
            if key == 'expected_time':
                tproject.expected_time = request.POST['expected_time']
        tproject.save()
        return HttpResponse('ok')

    else:
        return HttpResponse('不允许的请求方式！')


# 获取图片
def getImg(request, task_name=None):
    if request.method == 'POST':
        # 查找未完成图片放空
        mtask = Task.objects.get(task_name=task_name)
        noneImg = Img.objects.filter(assignor=request.user, status=None, tasks=mtask)
        noneImg.update(assignor=None)
        # 分配图片
        new = Img.objects.filter(assignor=None, tasks=mtask)[:int(request.POST['count'])]
        value = [{'id': i[0], 'url': i[1], 'status': i[2]}for i in new.values_list('id', 'url', 'status')]
        Img.objects.filter(id__in=new).update(assignor=request.user)
        return JsonResponse(value, safe=False)

    else:
        return HttpResponse('不允许的请求方式！')


# 提交图片
def postImg(request):
    if request.method == 'POST':
        rightImg = Img.objects.none()
        errorImg = Img.objects.none()
        noneImg = Img.objects.none()
        for ele in json.loads(request.body):
            if ele['status'] == 1:
                errorImg = errorImg | Img.objects.filter(id=ele['id'])
            if ele['status'] == 0:
                rightImg = rightImg | Img.objects.filter(id=ele['id'])
            if ele['status'] is None:
                noneImg = noneImg | Img.objects.filter(id=ele['id'])
        rightImg.update(status=0)
        errorImg.update(status=1)
        noneImg.update(assignor=None)
        return HttpResponse('更新成功！')

    else:
        return HttpResponse('不允许的请求方式！')


# 已完成图片
def finishImg(request, task_name=None):
    mtask = Task.objects.get(task_name=task_name)
    left = Img.objects.filter(~Q(status=None), assignor=request.user, tasks=mtask)
    value = [{'id': i[0], 'url': i[1], 'status': i[2]} for i in left.values_list('id', 'url', 'status')]
    return JsonResponse(value, safe=False)


# 显示文件列表
def showFileList(request):
    dir = settings.IMGFILEDIR
    task_db = Task.objects.values('belong_task').annotate(dcount=Count('belong_task'))
    task_list = []
    for ele in task_db:
        task_list.append(ele['belong_task'])
    def appendFile(dir):
        dirlist = []
        for file in os.listdir(dir):
            if os.path.isdir(os.path.join(dir, file)):
                dirlist.append({
                    'title': file if file not in task_list else '(已添加)' + file,
                    'key': file,
                    'children': appendFile(os.path.join(dir, file)) if file not in task_list else None,
                    'selectable': True if dir == os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/imgFile') and (file not in task_list) else False
                })
            else:
                if file != '.gitignore':
                    dirlist.append({
                        'title': file,
                        'key': file,
                        'isLeaf': True,
                        'selectable': False,
                    })
        return dirlist
    img_list = appendFile(dir)
    return JsonResponse(img_list, safe=False)


# 上传任务
def tasksUpload(request):

    if request.method == 'POST':
        # 筛选任务
        if request.POST['type'] == 'screen':
            taskdir = os.path.join(settings.IMGFILEDIR, request.POST['task'])
            for file in os.listdir(taskdir):
                if os.path.isdir(os.path.join(taskdir, file)):
                    return HttpResponse('筛选任务的文件夹中不能包含文件夹', status=500)

            mpid = Project.objects.get(id=request.POST['project'])
            # 创建任务
            ntask = Task.objects.create(project=mpid, task_name=request.POST['task'], task_link='/aidsp/screen/'+request.POST['task'],
                                        gross=len(os.listdir(taskdir)), status=0, belong_task=request.POST['task'],
                                        task_type=request.POST['task_type'])
            # 添加图片
            img_list = []
            for file in os.listdir(taskdir):
                img = Img(tasks=ntask, url='/static/imgFile/'+request.POST['task']+'/'+file)
                img_list.append(img)
            Img.objects.bulk_create(img_list)
            return HttpResponse('添加完成')
        #标注任务
        elif request.POST['type'] == 'tagging':
            auth = 'cvat:cvat_Cpv17d0Da2'
            # create_tasks_files()
            task_name = request.POST['task']
            imgdir = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/imgFile')
            cli_path = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/cli/cli.py')
            taskdir = os.path.join(imgdir, task_name)
            for file in os.listdir(taskdir):
                if file.endswith('.jpg'):
                    return HttpResponse('标注任务的文件夹中不能包含图片', status=500)
            value = create_tasks(auth, task_name, imgdir, cli_path)
            for ele in value:
                task_link = ''
                for job in ele['segments']:
                    if task_link != '':
                        task_link = task_link + ' '
                    task_link = task_link + 'https://218.207.208.20:8080/?id=%s' % job['jobs'][0]['id']
                mpid = Project.objects.get(id=request.POST['project'])
                Task.objects.create(project=mpid, task_name=ele['name'],
                                    task_link=task_link,
                                    gross=ele['size'], status=0, belong_task=request.POST['task'],
                                    task_type=request.POST['task_type'])
            return HttpResponse('添加完成！')

    return HttpResponse('不允许的请求方式！')


# 复制新任务
def taskCopy(request):
    if request.method == 'POST':
        mpid = Project.objects.get(id=request.POST['project'])
        task_name = request.POST['task_name']
        i = 0
        while Task.objects.filter(task_name=task_name):
            if not task_name.endswith(')'):
                task_name = task_name + '(2)'
            else:
                print(('(%d)' % i, '(%d)' % (i + 1)))
                task_name = task_name.replace('(%d)' % i, '(%d)' % (i + 1))
                print(task_name)
            i = i + 1
        Task.objects.create(project=mpid, task_name=task_name,
                            task_link=request.POST['task_link'],
                            gross=request.POST['gross'], status=0, belong_task=request.POST['belong_task'],
                            task_type=request.POST['task_type'])
        return HttpResponse('添加完成')
    return HttpResponse('不允许的请求方式！')


# 获取图片任务信息
def getImgTask(request):
    if request.method == 'POST':
        mtask = request.user.assignee_task.filter(belong_task=urllib.parse.unquote(request.POST['belong_task'])).first()
        value = model_to_dict(mtask)
        value.pop('assignee')
        value.pop('reviewer')
        left = Img.objects.filter(~Q(status=None), assignor=request.user, tasks=mtask.belong_task)
        # 计算图片通过率
        passimg = 0
        unpassimg = 0
        for i in left.values_list('status'):
            if i[0] == 0:
                passimg += 1
            if i[0] == 1:
                unpassimg += 1
        # 计算已用时间
        used_time = '0天0小时0分'
        if mtask.status == 1:
            if mtask.time_label:
                t = timezone.now() - mtask.time_label
                old_used_time = int(mtask.used_time.split('天')[1].split('小时')[0]) * 3600 + \
                                int(mtask.used_time.split('天')[1].split('小时')[1].split('分钟')[0]) * 60
                d = int(mtask.used_time.split('天')[0]) + t.days
                new_used_time = t.seconds + old_used_time
                if new_used_time > 24*3600:
                    new_used_time = new_used_time - 24*3600
                    d = d + 1
                used_time = '%d天%d小时%d分钟' % (d, new_used_time / 3600, new_used_time % 3600 / 60)
            else:
                t = timezone.now() - mtask.begin_time
                used_time = '%d天%d小时%d分钟' % (t.days, t.seconds / 3600, t.seconds % 3600 / 60)

        else:
            used_time = mtask.used_time
        info = '状态：%s  已用时间：%s  通过图片：%d张  不通过图片：%d张  通过率：%d%%' % \
               (mtask.get_status_display(), used_time, passimg, unpassimg, passimg/(passimg+unpassimg)*100 if passimg+unpassimg != 0 else 0)
        value['info'] = info
        return JsonResponse(value, safe=False)
    return HttpResponse('不允许的请求方式！')