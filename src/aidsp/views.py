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
import zipfile
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import urllib3
from lxml import etree
from django.db.models import Sum
import collections

urllib3.disable_warnings()
inside_url = 'http://' + settings.CVATURL + ':8084'


def project_index(request, page=None):
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
    for ele in post.users_manager.values('id'):
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
    filedir = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/imgFile')
    filename = str(request.FILES['file'])
    while filename in os.listdir(filedir):
        filename = 'n_' + filename
    with open(os.path.join(filedir, filename), 'wb') as f:
        for chunk in request.FILES['file'].chunks():
            f.write(chunk)

    r = zipfile.is_zipfile(os.path.join(filedir, filename))
    if r:
        fz = zipfile.ZipFile(os.path.join(filedir, filename), 'r')
        for file in fz.namelist():
            fz.extract(file, filedir)
    else:
        print('This is not zip')

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
        # selenium修改cvat表单
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--headless')
        options.add_argument('--ignore-certificate-errors')  # 忽略https报错
        driver = webdriver.Chrome(chrome_options=options)
        driver.get(inside_url + "/dashboard/")
        signin_info = signin()
        driver.add_cookie({'name': 'csrftoken', 'value': signin_info['csrftoken']})
        driver.add_cookie({'name': 'sessionid', 'value': signin_info['sessionid']})
        if 'waf_sign_cookie' in signin_info:
            driver.add_cookie(
                {'name': 'waf_sign_cookie', 'value': signin_info['waf_sign_cookie']})
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
                                    massignee = User.objects.get(username=elename)
                                    ntask.assignee.clear()
                                    ntask.assignee.add(massignee)
                                    change_assignee(driver, ntask.task_name, elename)
                                except Exception as e:
                                    print(e)
                                    erroruser.append(elename)
                                    errorflog = True

                    if len(linedict) > 2:
                        for elename in linedict[2].split(' '):
                            if elename:
                                try:
                                    mreviewer = User.objects.get(username=elename)
                                    ntask.reviewer.clear()
                                    ntask.reviewer.add(mreviewer)
                                    change_owner(driver, ntask.task_name, elename)

                                except Exception as e:
                                    print(e)
                                    erroruser.append(elename)
                                    errorflog = True

                except Exception as e:
                    print(e)
                    errortask.append(linedict[0])
                    errorflog = True
        driver.quit()
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
        task_list = Task.objects.filter(project_id=id, task_type=type).order_by('id')
        rdata = {}
        # 添加任务信息到字典
        x = 0
        for ele_model in task_list:
            # 按大任务分类
            dict_ele = ele_model.to_dict()
            # dict_ele = model_to_dict(ele_model)
            # dict_ele.update({
            #     'create_time': ele_model.create_time,
            #     'assignee': [x.id for x in dict_ele['assignee']],
            #     'reviewer': [x.id for x in dict_ele['reviewer']],
            # })
            if ele_model.belong_task not in rdata:
                rdata[ele_model.belong_task] = [dict_ele]
            else:
                rdata[ele_model.belong_task].append(dict_ele)
        result = collections.OrderedDict(sorted(rdata.items(), key=None, reverse=True))
        return JsonResponse(result)
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
                    mtask.assignee.clear()
                    mtask.assignee.add(ele)
                    if mtask.task_link.startswith('https'):
                        # selenium修改cvat表单
                        options = webdriver.ChromeOptions()
                        options.add_argument('--no-sandbox')
                        options.add_argument('--headless')
                        options.add_argument('--ignore-certificate-errors')  # 忽略https报错
                        driver = webdriver.Chrome(chrome_options=options)
                        driver.get(inside_url + "/dashboard/")
                        signin_info = signin()
                        driver.add_cookie({'name': 'csrftoken', 'value': signin_info['csrftoken']})
                        driver.add_cookie({'name': 'sessionid', 'value': signin_info['sessionid']})
                        if 'waf_sign_cookie' in signin_info:
                            driver.add_cookie({'name': 'waf_sign_cookie', 'value': signin_info['waf_sign_cookie']})
                        n_name = User.objects.get(id=ele).username
                        try:
                            change_assignee(driver, mtask.task_name, n_name)
                        except:
                            driver.quit()
                            return HttpResponse("未找到任务", status=500)
                        driver.quit()

        if 'reviewer' in request.POST:
            mtask.reviewer.clear()
            if request.POST['reviewer']:
                rdict = request.POST['reviewer'].split(',')
                for ele in rdict:
                    mtask.reviewer.clear()
                    mtask.reviewer.add(ele)
                    if mtask.task_link.startswith('https'):
                        # selenium修改cvat表单
                        options = webdriver.ChromeOptions()
                        options.add_argument('--no-sandbox')
                        options.add_argument('--headless')
                        options.add_argument('--ignore-certificate-errors')  # 忽略https报错
                        driver = webdriver.Chrome(chrome_options=options)
                        driver.get(inside_url + "/dashboard/")
                        signin_info = signin()
                        driver.add_cookie({'name': 'csrftoken', 'value': signin_info['csrftoken']})
                        driver.add_cookie({'name': 'sessionid', 'value': signin_info['sessionid']})
                        if 'waf_sign_cookie' in signin_info:
                            driver.add_cookie({'name': 'waf_sign_cookie', 'value': signin_info['waf_sign_cookie']})
                        n_name = User.objects.get(id=ele).username
                        try:
                            change_owner(driver, mtask.task_name, n_name)
                        except:
                            driver.quit()
                            return HttpResponse("未找到任务", status=500)
                        driver.quit()
        if 'status' in request.POST:
            mtask.status = request.POST['status']
            mtask.save()
        if 'quantity_available' in request.POST:
            mtask.quantity_available = request.POST['quantity_available']
            mtask.save()
        if 'error_info' in request.POST:
            print(request.POST)
            mtask.error_info = request.POST['error_info']
            mtask.save()
        return HttpResponse('成功！')

    else:
        return HttpResponse('不允许的请求方式！')


# 获取个人任务
def personalTasksGet(request):
    rdata = {
            0: collections.OrderedDict(),
            1: collections.OrderedDict(),
            2: collections.OrderedDict(),
            3: collections.OrderedDict(),
            4: collections.OrderedDict(),
            5: collections.OrderedDict(),
    }
    rtask_list = Task.objects.filter(reviewer=request.user.id).order_by('id')
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
        0: collections.OrderedDict(),
        1: collections.OrderedDict(),
        2: collections.OrderedDict(),
        3: collections.OrderedDict(),
        4: collections.OrderedDict(),
        5: collections.OrderedDict(),
    }
    atask_list = Task.objects.filter(assignee=request.user.id).order_by('id')
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
            if key == 'task_standard':
                tproject.task_standard = request.POST['task_standard']
            if key == 'basic_quantity':
                tproject.basic_quantity = request.POST['basic_quantity']
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
    task_db = Task.objects.filter()
    task_list = []
    for ele in task_db:
        if ele.task_name.endswith('_pick'):
            tn = ele.task_name[:-5]
        else:
            tn = ele.task_name
        task_list.append(tn)
        # if ele.belong_task not in task_list:
        #     task_list.append(ele.belong_task)

    def appendFile(dir):
        dirlist = []
        filedir = os.listdir(dir)
        filedir.sort(key=lambda x: os.path.getmtime(os.path.join(dir, x)), reverse=True)
        for file in filedir:
            if os.path.isdir(os.path.join(dir, file)):
                dirlist.append({
                    'title': file if file not in task_list else '(已添加)' + file,
                    'key': file,
                    'children': appendFile(os.path.join(dir, file)) if file not in task_list else None,
                    'selectable': True if dir == os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/imgFile') and (file not in task_list) else False
                })
            else:
                if file != '.gitignore' and not file.endswith('.zip'):
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
                task_name = task_name.replace('(%d)' % i, '(%d)' % (i + 1))
            i = i + 1
        Task.objects.create(project=mpid, task_name=task_name,
                            task_link=request.POST['task_link'],
                            gross=0, status=0, belong_task=request.POST['belong_task'],
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


# 导出正确结果
def picRight(request, task_name=None):
    mtask = Task.objects.filter(belong_task=task_name)
    rightImgs = Img.objects.filter(status=0, tasks__in=mtask)
    wrongImgs = Img.objects.filter(status=1, tasks__in=mtask)
    result = ''
    for rightImg in rightImgs:
        filename = os.path.basename(rightImg.url)
        result = result + filename + ' Ture\n'
    for wrongImg in wrongImgs:
        filename = os.path.basename(wrongImg.url)
        result = result + filename + ' False\n'
    response = FileResponse(result)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment; filename={0}.txt'.format(task_name)
    return response

# 清空本周工作量
def workloadRm(request):
    if request.user.is_superuser:
        all_peoject = Project.objects.filter().all()
        for ele_project in all_peoject:
            ele_project.quantity_week = None
            ele_project.save()
            print('删除完毕')
        return HttpResponse('清空完毕！')
    else:
        return HttpResponse('您不是超级用户！')


def hTagList(it, level, n):
    hlist = []
    while True:
        if n is None:
            return {'list': hlist, 'n': None}

        # print('当前等级（%d）,当前文档（%s）,标签等级（%s）' % (level, n.xpath('string(.)'),n.tag))
        if int(n.tag[1:2]) == level:
            hlist.append({'title':n.xpath('string(.)'),'children': []})
            try:
                n = it.__next__()
                continue
            except Exception as e:
                return {'list': hlist, 'n': None}

        if int(n.tag[1:2]) > level:
            ren = hTagList(it=it, level=int(n.tag[1:2]), n=n)
            hlist[-1]['children']=ren['list']
            n = ren['n']
            continue

        if int(n.tag[1:2]) < level:
            return {'list': hlist, 'n': n }
            break
        break

    return {'list': hlist, 'n': n}

# 显示markdown
def mdView(request, filename=None):
    mddir = os.path.join(os.path.dirname(settings.BASE_DIR), 'doc')

    # 直接读html
    mdfile = os.path.join(mddir, filename + '.html')
    if not os.path.exists(mdfile):
        return HttpResponse('**不存在的html文件**')
    with open(mdfile, 'r', encoding='utf-8') as f:
        text = f.read()
    html = text
    text = text.replace('images/', '/aidsp/static/').replace('images\\', '/aidsp/static/')

    html = etree.HTML(html)
    h1_list = html.xpath('//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]')
    for ele in h1_list:
        old_ele = etree.tostring(ele).decode('utf-8')
        new_ele = old_ele.replace('<span>', '<span id="%s">' % ele.xpath('string(.)'))

        text = text.replace(old_ele, new_ele)

    return HttpResponse(text)


#显示文档列表
def mdList(requests):
    mddir = os.path.join(os.path.dirname(settings.BASE_DIR), 'doc')
    mdlist = []
    for file in os.listdir(mddir):
        if file.endswith('.html'):
            mdfile = os.path.join(mddir, file)
            with open(mdfile, 'r', encoding='utf-8') as f:
                text = f.read()
            html = etree.HTML(text)
            h1_list = html.xpath('//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]')
            it = iter(h1_list)
            n = it.__next__()
            a = hTagList(it, int(n.tag[1:2]), n)
            mdlist.append({'title': file.replace('.html', ''), 'children': a['list']})
    return JsonResponse(mdlist, safe=False)


def change_assignee(driver, task_name, assignee):
    driver.get(inside_url + "/admin/engine/task/?q=%s" % task_name)
    tn = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.LINK_TEXT, task_name)))
    tn.click()
    ass = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, 'id_assignee')))
    ass.send_keys(assignee)
    save = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.NAME, '_save')))
    save.click()
    wait = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'paginator')))


def change_owner(driver, task_name, owner):
    driver.get(inside_url + "/admin/engine/task/?q=%s" % task_name)
    tn = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.LINK_TEXT, task_name)))
    tn.click()
    ass = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, 'id_owner')))
    ass.send_keys(owner)
    save = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.NAME, '_save')))
    save.click()
    wait = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'paginator')))


def signin():
    baseurl = inside_url
    ss = requests.session()
    admin_url = baseurl + '/admin/login/?next=/admin/'
    print('开始登录')
    res = ss.get(admin_url, verify=False)
    html = etree.HTML(res.text)
    x = html.xpath('//*[@id="login-form"]/input')
    for ele in x:
        token = ele.attrib['value']
    data = {
        'csrfmiddlewaretoken': token,
        'username': 'cvat',
        'password': 'cvat_Cpv17d0Da2',
        'next': '/admin/',
    }
    adres = ss.post(admin_url, verify=False, data=data)
    print('登录完毕')
    return ss.cookies

# 查询工作量百分比
def percentage_workload(request, id=None):
    task_query = Project.objects.get(id=id).project_task.all()
    all_percentage1 = task_query.filter(task_type=1).aggregate(current_workload=Sum('current_workload'),
                                          quantity_available=Sum('quantity_available'),
                                          gross=Sum('gross'))
    all_percentage2 = task_query.filter(task_type=2).aggregate(current_workload=Sum('current_workload'),
                                          quantity_available=Sum('quantity_available'),
                                          gross=Sum('gross'))
    each_percentage_query = task_query.values('belong_task').annotate(current_workload=Sum('current_workload'),
                                                                      quantity_available=Sum('quantity_available'),
                                                                      gross=Sum('gross'))
    each_percentage = {}
    for ele in each_percentage_query:
        each_percentage[ele['belong_task']] = ele
    dataAll = {
        'all_percentage1': all_percentage1,
        'all_percentage2': all_percentage2,
        'each_percentage': each_percentage,
    }
    return JsonResponse(dataAll, safe=False)


from dwebsocket.decorators import accept_websocket

#  创建任务长连接
@accept_websocket
def socket_tasksupload(request):
    if request.is_websocket():
        for message in request.websocket:
            if not message:
                continue
            post_data = json.loads(message.decode())
            try:
                # 筛选任务
                if post_data['type'] == 'screen':
                    taskdir = os.path.join(settings.IMGFILEDIR, post_data['task'])
                    for file in os.listdir(taskdir):
                        if os.path.isdir(os.path.join(taskdir, file)):
                            # return HttpResponse('筛选任务的文件夹中不能包含文件夹', status=500)
                            request.websocket.send('筛选任务的文件夹中不能包含文件夹'.encode('utf-8'))

                            return

                    mpid = Project.objects.get(id=post_data['project'])
                    if not post_data['task'].endswith('_pick'):
                        task_name = post_data['task'] + '_pick'
                    # 创建任务
                    ntask = Task.objects.create(project=mpid, task_name=task_name, task_link='/aidsp/screen/'+task_name,
                                                gross=len(os.listdir(taskdir)), status=0, belong_task=task_name,
                                                task_type=post_data['task_type'])
                    # 添加图片
                    img_list = []
                    for file in os.listdir(taskdir):
                        img = Img(tasks=ntask, url='/static/imgFile/'+post_data['task']+'/'+file)
                        img_list.append(img)
                    Img.objects.bulk_create(img_list)
                    # return HttpResponse('添加完成')
                    request.websocket.send('添加完成'.encode('utf-8'))
                    return
                #标注任务
                elif post_data['type'] == 'tagging':
                    auth = 'cvat:cvat_Cpv17d0Da2'
                    # create_tasks_files()
                    task_name = post_data['task']
                    imgdir = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/static/imgFile')
                    cli_path = os.path.join(os.path.dirname(settings.BASE_DIR), 'aidsp/cli/cli.py')
                    taskdir = os.path.join(imgdir, task_name)
                    count = -1
                    for file in os.listdir(taskdir):
                        if file.endswith('.jpg') or file.endswith('.png'):
                            request.websocket.send('标注任务的文件夹中不能包含图片'.encode('utf-8'))
                            return
                        count = count + 1
                    value = create_tasks(auth, task_name, imgdir, cli_path)
                    i = 0
                    while True:
                        try:
                            ele = next(value)
                            i = i + 1
                            if ele == '跳过':
                                i = i - 1
                                continue
                            request.websocket.send(('提交中...  %d/%d' % (i, count)).encode('utf-8'))
                            task_link = ''
                            for job in ele['segments']:
                                if task_link != '':
                                    task_link = task_link + ' '
                                task_link = task_link + 'https://218.207.208.20:8080/?id=%s' % job['jobs'][0]['id']

                            mpid = Project.objects.get(id=post_data['project'])
                            Task.objects.create(project=mpid, task_name=ele['name'],
                                                task_link=task_link,
                                                gross=ele['size'], status=0, belong_task=post_data['task'],
                                                task_type=post_data['task_type'])
                        except StopIteration as e:
                            break
                        except Exception as e:
                            print(e)
                            i = i - 1
                            break
                    if i == -1:
                        request.websocket.send(('文件夹内格式无措').encode('utf-8'))
                    elif i == 0:
                        request.websocket.send(('没有可以创建的任务').encode('utf-8'))
                    else:
                        request.websocket.send(('添加完成 %d/%d' % (i, count)).encode('utf-8'))
            except Exception as e:
                request.websocket.send(str(e).encode('utf-8'))
                return

    else:
        return HttpResponse('不支持websocket')


def task_standard_post(request):
    tproject = Project.objects.get(id=request.POST['pid'])
    if request.POST['standard']:
        for ele in request.POST['standard'].split(','):
            if ele.split('_')[0] not in ["rectangle", "polygon", "polyline", "points"]:
                return HttpResponse('标签格式不规范', status=500)
        tproject.task_standard = request.POST['standard']
    else:
        tproject.task_standard = None
    tproject.save()
    return HttpResponse('成功')


