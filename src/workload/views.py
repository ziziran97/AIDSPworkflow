from django.shortcuts import render, HttpResponse
from workload.models import Workload
from aidsp.models import Project, Task, Img
from django.db.models import Count, Max, Sum, Expression
from django.db.models import Q
from django.http import JsonResponse
from apscheduler.schedulers.background import BackgroundScheduler
import psycopg2
import datetime
from django.conf import settings


def my_job():
    """
    查询工作量
    """
    conn = psycopg2.connect(database='cvat', user='root',
                            password='', host='172.17.0.1',
                            port='65432')
    print('连接完成')
    cursor = conn.cursor()

    # 查询用户名和ID对照
    cursor.execute("select id,username from auth_user")
    rows = cursor.fetchall()
    user_ids = {}
    for row in rows:
        user_ids[row[0]] = row[1]
    tasks = Task.objects.filter()
    for task in tasks:
        # 当为筛选任务时
        if '_pick' in task.task_name:
            if len(task.assignee.all()) != 0:
                imgworkload = Img.objects.filter(~Q(status=None), tasks=task.belong_task,
                                                 assignor=task.assignee.all()[0])
                task.current_workload = len(imgworkload)
                task.save()
        else:
            # 查询task_id
            cursor.execute(
                "select id, assignee_id from engine_task where name='{taskname}' order by id desc".format(
                    taskname=task.task_name))
            rows = cursor.fetchall()
            if not rows:
                continue
            taskid = rows[0][0]
            user_id = rows[0][1]
            if user_id in user_ids:
                user_name = user_ids[user_id]
            else:
                user_name = '未分配'

            # 查询task下所属job_id
            cursor.execute("select id from engine_segment where task_id=%s" % taskid)
            job_ids = cursor.fetchall()

            # 没有标准的任务
            if not task.project.task_standard:
                exec_str = "select frame from engine_labeledshape where"
                for job_id in job_ids:
                    exec_str = exec_str + ' job_id=%s or' % job_id[0]
                exec_str = exec_str[:-3]
                exec_str = exec_str + ' group by frame'
                cursor.execute(exec_str)
                images_finish = cursor.fetchall()
                task.current_workload = len(images_finish)
                task.save()
            # 有标准的任务
            else:
                exec_str = "select a.frame, a.type, (select b.name from engine_label as b where b.id=a.label_id), a.points as label_name from engine_labeledshape as a where"
                for job_id in job_ids:
                    exec_str = exec_str + ' job_id=%s or' % job_id[0]
                exec_str = exec_str[:-3]
                task_standard = task.project.task_standard.split(',')  # 任务标准
                points_flag = False

                cursor.execute(exec_str)
                images_finish = cursor.fetchall()
                for ele in task_standard:
                    if 'POINTS' in ele:
                        points_flag = True
                        task_standard.remove(ele)
                if points_flag:
                    all_points = 0
                    for ele in images_finish:
                        if ele[1] == 'polygon':
                            all_points += len(ele[3].split(','))/2
                    task.current_points = all_points
                    task.save()
                label_dict = {}
                for ele in images_finish:
                    label_n = ele[1]+'_'+ele[2]
                    if label_n not in task_standard:
                        continue
                    if label_n not in label_dict:
                        label_dict[label_n] = [ele[0]]
                    else:
                        label_dict[label_n].append(ele[0])
                f = 0
                ins = {}
                for label_n in task_standard:
                    # 标签不全
                    if label_n not in label_dict:
                        ins = {}
                        break
                    if f == 0:
                        ins = set(label_dict[label_n])
                        f = f + 1
                    else:
                        ins = ins & set(label_dict[label_n])
                task.current_workload = len(ins)
                task.save()
        assignee_list = task.assignee.all()
        if len(assignee_list) == 0:
            assignee_name = '未分配任务'
        else:
            assignee_name = assignee_list[0].name
        # 点数
        lastPointsCount = Workload.objects.filter(task=task.task_name).aggregate(Sum('pointscount'))
        if not lastPointsCount:
            pointscount = task.current_points if task.current_points else 0
        else:
            pointscount = (task.current_points if task.current_points else 0) - (
                lastPointsCount['pointscount__sum'] if lastPointsCount['pointscount__sum'] else 0)
        # 图片数
        lastCount = Workload.objects.filter(task=task.task_name).aggregate(Sum('workcount'))
        if not lastCount:
            workcount = task.current_workload if task.current_workload else 0
        else:
            workcount = (task.current_workload if task.current_workload else 0) - (
                lastCount['workcount__sum'] if lastCount['workcount__sum'] else 0)
        if workcount == 0 and pointscount == 0:
            continue
        Workload.objects.create(assignee=assignee_name, workcount=workcount,
                                pointscount=pointscount,
                                task=task.task_name, project_id=task.project.id,
                                project_detail_name='{id}_{name}'.format(id=task.project.project_id,
                                                                         name=task.project.project_name))

    cursor.close()
    conn.close()
    last_data = Workload.objects.filter().last()
    last_data.lastid = last_data.id
    last_data.save()


def scheable():
    """
    开启定时工作
    """
    try:
        # 实例化调度器
        scheduler = BackgroundScheduler()
        # 调度器使用DjangoJobStore()
        # scheduler.add_jobstore(DjangoJobStore(), "default")
        # @register_job(scheduler,"cron", minute='55')
        scheduler.add_job(my_job, 'cron', minute='55')
        scheduler.start()
    except Exception as e:
        print(e)
        # scheduler.shutdown()
    my_job()


def workload_list(request):
    """
    项目任务查询
    """
    taskQuery = Project.objects.get(id=request.POST['pid']).project_task.all()
    tasklist = []
    for ele in taskQuery:
        tasklist.append(ele.task_name)
    # 当天工作量
    dayWorkload = Workload.objects.filter(task__in=tasklist, updated_date__date=datetime.date(int(request.POST['YY']),
                                                                                              int(request.POST['MM']),
                                                                                              int(request.POST['DD'])))
    dayWorkloadList = dayWorkload.values('assignee').annotate(workload=Sum('workcount'), pointsload=Sum('pointscount'))
    dataAll = {
        'picOrd': sorted(list(dayWorkloadList), key=lambda x: (x['workload'] if x['workload'] else 0), reverse=False),
        'poiOrd': sorted(list(dayWorkloadList), key=lambda x: (x['pointsload'] if x['pointsload'] else 0),
                         reverse=False),
    }
    return JsonResponse(dataAll, safe=False)


def hours_info(request):
    """
    小时工作量查询
    """
    taskQuery = Project.objects.get(id=request.POST['pid']).project_task.all()
    tasklist = []
    for ele in taskQuery:
        tasklist.append(ele.task_name)
    # 个人分时工作量
    dayWorkload = Workload.objects.filter(task__in=tasklist, updated_date__date=datetime.date(int(request.POST['YY']),
                                                                                              int(request.POST['MM']),
                                                                                              int(request.POST['DD'])))
    personWorkloadList = []
    hoursWorkload = dayWorkload.filter(assignee=request.POST['user']).values('updated_date__hour').annotate(
        workload=Sum('workcount'), pointsload=Sum('pointscount'))
    for elehour in hoursWorkload:
        personWorkloadList.append({'hour': '%d时' % elehour['updated_date__hour'], 'workload': elehour['workload'],
                                   'pointsload': elehour['pointsload']})
    return JsonResponse(personWorkloadList, safe=False)


def hour_persons_info(request):
    """
    小时工作量排行
    """
    taskQuery = Project.objects.get(id=request.POST['pid']).project_task.all()
    tasklist = []
    for ele in taskQuery:
        tasklist.append(ele.task_name)
    dayWorkload = Workload.objects.filter(task__in=tasklist, updated_date__date=datetime.date(int(request.POST['YY']),
                                                                                              int(request.POST['MM']),
                                                                                              int(request.POST['DD'])))
    hourPersonsWorkload = dayWorkload.filter(updated_date__hour=request.POST['hour'].split('时')[0]).values('assignee') \
        .annotate(workload=Sum('workcount'), pointsload=Sum('pointscount'))
    # dataInfo = sorted(list(hourPersonsWorkload), key=lambda x: x['workload'], reverse=False)
    dataAll = {
        'picOrd': sorted(list(hourPersonsWorkload), key=lambda x: (x['workload'] if x['workload'] else 0),
                         reverse=False),
        'poiOrd': sorted(list(hourPersonsWorkload), key=lambda x: (x['pointsload'] if x['pointsload'] else 0),
                         reverse=False),
    }
    return JsonResponse(dataAll, safe=False)


def get_daily_info(request):
    """
    团队日报信息
    """
    workload_set = Workload.objects.filter(updated_date__date=datetime.date(int(request.POST['YY']),
                                                                            int(request.POST['MM']),
                                                                            int(request.POST['DD'])),
                                           project_detail_name__isnull=False).\
        values('assignee', 'project_detail_name', 'project_id').annotate(
        workload=Sum('workcount'), pointsload=Sum('pointscount'))

    daily_info_ori = {}
    for ele_workload in workload_set:
        if ele_workload['assignee'] not in daily_info_ori:
            daily_info_ori[ele_workload['assignee']] = [{'project': ele_workload['project_detail_name'],
                                                        'workload': ele_workload['pointsload'] if
                                                        ele_workload['pointsload'] else ele_workload['workload'],
                                                         'project_id': ele_workload['project_id'],
                                                         'basic_quantity':Project.objects.get(
                                                                 id=ele_workload['project_id']).basic_quantity}]
        else:
            daily_info_ori[ele_workload['assignee']].append({'project': ele_workload['project_detail_name'],
                                                            'workload': ele_workload['pointsload'] if
                                                            ele_workload['pointsload'] else ele_workload['workload'],
                                                             'project_id': ele_workload['project_id'],
                                                             'basic_quantity': Project.objects.get(
                                                                 id=ele_workload['project_id']).basic_quantity})
    daily_info = []
    daily_info_sort = sorted(daily_info_ori.items(), key=lambda x: len(x[1]), reverse=True)
    for key, value in daily_info_sort:
        daily_info.append({'name': key, 'taskInfo': value})
    return JsonResponse(daily_info, safe=False)


def scd_switch(request):
    """
    开启定时任务
    """
    if request.user.is_superuser:
        if settings.SCHEDULETENABLE:
            return HttpResponse('定时任务已开启')
        scheable()
        settings.SCHEDULETENABLE = True
        return HttpResponse('定时任务开启完成')
    else:
        return HttpResponse('您不是超级用户', status=403)


def task_workload(request, task_name=None):
    """
    查询单个任务工作量
    """
    conn = psycopg2.connect(database='cvat', user='root',
                            password='', host='172.17.0.1',
                            port='65432')
    print('连接完成')
    result = {}
    cursor = conn.cursor()
    try:
        task = Task.objects.get(task_name=task_name)
    except:
        return JsonResponse({'info': 'aidsp不存在任务' + task_name}, safe=False)
    # 当为筛选任务时
    if '_pick' in task.task_name:
        if len(task.assignee.all()) != 0:
            imgworkload = Img.objects.filter(~Q(status=None), tasks=task.belong_task,
                                             assignor=task.assignee.all()[0])
            result.update({'current_workload': len(imgworkload)})
        else:
            return JsonResponse({'info': '该任务尚未分配'}, safe=False)

    else:
        # 查询task_id
        cursor.execute(
            "select id, assignee_id from engine_task where name='{taskname}' order by id desc".format(
                taskname=task.task_name))
        rows = cursor.fetchall()
        if not rows:
            return JsonResponse({'info': 'cvat不存在任务' + task_name}, safe=False)

        taskid = rows[0][0]
        user_id = rows[0][1]

        # 查询task下所属job_id
        cursor.execute("select id from engine_segment where task_id=%s" % taskid)
        job_ids = cursor.fetchall()

        # 没有标准的任务
        if not task.project.task_standard:
            exec_str = "select frame from engine_labeledshape where"
            for job_id in job_ids:
                exec_str = exec_str + ' job_id=%s or' % job_id[0]
            exec_str = exec_str[:-3]
            exec_str = exec_str + ' group by frame'
            cursor.execute(exec_str)
            images_finish = cursor.fetchall()
            result.update({'current_workload': len(images_finish)})
        # 有标准的任务
        else:
            exec_str = "select a.frame, a.type, (select b.name from engine_label as b where b.id=a.label_id), a.points as label_name from engine_labeledshape as a where"
            for job_id in job_ids:
                exec_str = exec_str + ' job_id=%s or' % job_id[0]
            exec_str = exec_str[:-3]
            task_standard = task.project.task_standard.split(',')  # 任务标准
            points_flag = False

            cursor.execute(exec_str)
            images_finish = cursor.fetchall()
            for ele in task_standard:
                if 'POINTS' in ele:
                    points_flag = True
                    task_standard.remove(ele)
            if points_flag:
                all_points = 0
                for ele in images_finish:
                    if ele[1] == 'polygon':
                        all_points += len(ele[3].split(',')) / 2
                result.update({'current_points': all_points})
            label_dict = {}
            for ele in images_finish:
                label_n = ele[1] + '_' + ele[2]
                if label_n not in task_standard:
                    continue
                if label_n not in label_dict:
                    label_dict[label_n] = [ele[0]]
                else:
                    label_dict[label_n].append(ele[0])
            f = 0
            ins = {}
            for label_n in task_standard:
                # 标签不全
                if label_n not in label_dict:
                    ins = {}
                    break
                if f == 0:
                    ins = set(label_dict[label_n])
                    f = f + 1
                else:
                    ins = ins & set(label_dict[label_n])
            result.update({'current_workload': len(ins)})
    cursor.close()
    conn.close()
    return JsonResponse(result, safe=False)


def real_time_job(request):
    """
    立即更新工作量查询
    """
    if request.user.is_superuser:
        my_job()
        return HttpResponse('更新完毕')
    else:
        return HttpResponse('您不是超级用户', status=403)


def get_updated_time(request):
    """
    获取工作量最后更新时间
    """
    last_data = Workload.objects.filter(~Q(lastid=None)).last()
    return JsonResponse({'updated_time': last_data.updated_date.strftime('%Y-%m-%d %H:%M:%S')}, safe=False)
