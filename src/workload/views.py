from django.shortcuts import render
from workload.models import Workload
from aidsp.models import Project, Task
from django.db.models import Count, Max, Sum, Expression
import netifaces
from django.db.models import Q
from django.http import JsonResponse
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
import psycopg2
import datetime
from collections import defaultdict
from django.db import connection
from django.conf import settings


# 开启定时工作
if settings.SCHEDULETENABLE:
    try:
        # 实例化调度器
        scheduler = BackgroundScheduler()
        # 调度器使用DjangoJobStore()
        scheduler.add_jobstore(DjangoJobStore(), "default")
        # 设置定时任务，选择方式为interval，时间间隔为1小时
        @register_job(scheduler,"cron", minute='55')
        def my_job():
            # 这里写你要执行的任务
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
                # 查询task_id
                cursor.execute(
                    "select id, assignee_id from engine_task where name='{taskname}'".format(taskname=task.task_name))
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
                # 查询属于任务id的shape
                exec_str = "select frame from engine_labeledshape where"
                for job_id in job_ids:
                    exec_str = exec_str + ' job_id=%s or' % job_id[0]
                exec_str = exec_str[:-3]
                exec_str = exec_str + ' group by frame'
                cursor.execute(exec_str)
                images_finish = cursor.fetchall()
                task.current_workload = len(images_finish)
                task.save()
                assignee_list = task.assignee.all()
                if len(assignee_list) == 0:
                    assignee_name = '未分配任务'
                else:
                    assignee_name = assignee_list[0].name
                lastCount = Workload.objects.filter(task=task.task_name).aggregate(Sum('workcount'))
                if not lastCount:
                    workcount = len(images_finish)
                else:
                    workcount = len(images_finish) - (lastCount['workcount__sum'] if lastCount['workcount__sum'] else 0)
                if workcount == 0:
                    continue
                Workload.objects.create(assignee=assignee_name, workcount=workcount,
                                        task=task.task_name, project_id=task.project.id,
                                        project_detail_name='{id}_{name}'.format(id=task.project.project_id,
                                                                                 name=task.project.project_name))

            cursor.close()
            conn.close()
        register_events(scheduler)
        scheduler.start()
    except Exception as e:
        print(e)
        # scheduler.shutdown()
    my_job()


def workload_list(request):
    # 项目任务查询
    taskQuery = Project.objects.get(id=request.POST['pid']).project_task.all()
    tasklist = []
    for ele in taskQuery:
        tasklist.append(ele.task_name)
    # 当天工作量
    dayWorkload = Workload.objects.filter(task__in=tasklist, updated_date__date=datetime.date(int(request.POST['YY']),
                                                                                              int(request.POST['MM']),
                                                                                              int(request.POST['DD'])))
    dayWorkloadList = dayWorkload.values('assignee').annotate(workload=Sum('workcount'))
    # 个人分时工作量
    # personWorkloadList = {}
    # personList = Workload.objects.filter().values_list('assignee').distinct()
    #
    # for person in personList:
    #     personWorkloadList[person[0]] = []
    #     for i in range(0, 24):
    #         hourWorkload = dayWorkload.filter(updated_date__hour=i, assignee=person[0]).values_list('assignee')\
    #             .annotate(workload=Sum('workcount'))
    #         if len(hourWorkload) == 0:
    #             continue
    #         personWorkloadList[person[0]].append({'hour': '%d时' % i, 'workload': hourWorkload[0][1]})

    dataAll = {
        'dayInfo': sorted(list(dayWorkloadList), key=lambda x: x['workload'], reverse=False),
        # 'housInfo': personWorkloadList
    }
    return JsonResponse(dataAll, safe=False)


def hours_info(request):
    # 项目任务查询
    taskQuery = Project.objects.get(id=request.POST['pid']).project_task.all()
    tasklist = []
    for ele in taskQuery:
        tasklist.append(ele.task_name)
    # 个人分时工作量
    dayWorkload = Workload.objects.filter(task__in=tasklist, updated_date__date=datetime.date(int(request.POST['YY']),
                                                                                              int(request.POST['MM']),
                                                                                              int(request.POST['DD'])))
    personWorkloadList = []
    for i in range(0, 24):
        hourWorkload = dayWorkload.filter(updated_date__hour=i, assignee=request.POST['user']).values_list('assignee')\
            .annotate(workload=Sum('workcount'))
        if len(hourWorkload) == 0:
            continue
        personWorkloadList.append({'hour': '%d时' % i, 'workload': hourWorkload[0][1]})
    return JsonResponse(personWorkloadList, safe=False)


def hour_persons_info(request):
    # 项目任务查询
    taskQuery = Project.objects.get(id=request.POST['pid']).project_task.all()
    tasklist = []
    for ele in taskQuery:
        tasklist.append(ele.task_name)
    dayWorkload = Workload.objects.filter(task__in=tasklist, updated_date__date=datetime.date(int(request.POST['YY']),
                                                                                              int(request.POST['MM']),
                                                                                              int(request.POST['DD'])))
    hourPersonsWorkload = dayWorkload.filter(updated_date__hour=request.POST['hour'].split('时')[0]).values('assignee') \
        .annotate(workload=Sum('workcount'))
    dataInfo = sorted(list(hourPersonsWorkload), key=lambda x: x['workload'], reverse=False)
    return JsonResponse(dataInfo, safe=False)


def get_daily_info(request):
    print(request.POST)
    workload_set = Workload.objects.filter(updated_date__date=datetime.date(int(request.POST['YY']),
                                                                            int(request.POST['MM']),
                                                                            int(request.POST['DD'])),
                                           project_detail_name__isnull=False).\
                    values('assignee', 'project_detail_name', 'project_id').annotate(workload=Sum('workcount'))
    daily_info_ori = {}
    for ele_workload in workload_set:
        if ele_workload['assignee'] not in daily_info_ori:
            daily_info_ori[ele_workload['assignee']] = [{'project': ele_workload['project_detail_name'],
                                                        'workload': ele_workload['workload'],
                                                         'project_id': ele_workload['project_id']}]
        else:
            daily_info_ori[ele_workload['assignee']].append({'project': ele_workload['project_detail_name'],
                                                            'workload': ele_workload['workload'],
                                                             'project_id': ele_workload['project_id']})
    daily_info = []
    daily_info_sort = sorted(daily_info_ori.items(), key=lambda x: len(x[1]), reverse=True)
    for key, value in daily_info_sort:
        daily_info.append({'name': key, 'taskInfo': value})
    return JsonResponse(daily_info, safe=False)


# def xx():
#     # project_task = Project.objects.filter(~Q(status='完结'))
#     # project_task_dict = {}
#     # for project in project_task:
#     #     for task in project.project_task.all():
#     #         if project.project_id + '_' + project.project_name not in project_task_dict:
#     #             project_task_dict[project.project_id + '_' + project.project_name] = [task.task_name]
#     #         project_task_dict[project.project_id + '_' + project.project_name].append(task.task_name)
#     # print(project_task_dict)
#     # updated_date__date=datetime.date(2020, 6, 16),project_detail_name__isnull=False
#     workload_set = Workload.objects.filter().\
#         values('assignee', 'project_detail_name').annotate(workload=Sum('workcount'))
#     daily_info_ori = {}
#     for ele_workload in workload_set:
#         if ele_workload['assignee'] not in daily_info_ori:
#             daily_info_ori[ele_workload['assignee']] = [{'project': ele_workload['project_detail_name'],
#                                                         'workload': ele_workload['workload']}]
#         else:
#             daily_info_ori[ele_workload['assignee']].append({'project': ele_workload['project_detail_name'],
#                                                              'workload': ele_workload['workload']})
#     daily_info = []
#     for key, value in daily_info_ori.items():
#         daily_info.append({'name': key, 'project': value})
#     print(daily_info)

