from django.urls import path, include
from . import views
from django.contrib import admin
from .views import project_index, project_detail, project_display, dataset_display, dataset_detail,\
    dataset_fileupload, dataset_filedownload, aidspRedirect, taskPost, taskGet, tasksChange, personalTasksGet,\
    extraProjectPost, getImg, postImg, finishImg, showFileList, tasksUpload, pic_screen, taskCopy, getImgTask, \
    workloadRm, mdView, mdList, percentage_workload, picRight, socket_tasksupload, task_standard_post, dataset_path,\
    img_thum, dataset_img,ddaabb
from .apis import ProjectViewSet, UserViewSet, LabelViewSet, QAViewSet, ProjectdisplayViewSet, ReplyViewSet, \
    DatasetViewSet, TaskViewSet, WorkloadViewSet, ImgBaseViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('project', ProjectViewSet, basename='api-project')
router.register('user', UserViewSet, basename='api-user')
router.register('label', LabelViewSet, basename='api-label')
router.register('qa', QAViewSet, basename='api-qa')
router.register('pdisplay', ProjectdisplayViewSet, basename='api-pdisplay')
router.register('reply', ReplyViewSet, basename='api-reply')
router.register('dataset', DatasetViewSet, basename='api-dataset')
router.register('imgbase', ImgBaseViewSet, basename='api-imgbase')
router.register('task', TaskViewSet, basename='api-task')
router.register('workload', WorkloadViewSet, basename='api-workload')

urlpatterns = [
    path('', aidspRedirect),
    path('project', project_index),
    path('dataset', project_index),
    path('personal', project_index),
    path('doc', project_index),
    path('daily', project_index),
    path('screen/<task_name>', pic_screen),
    path('detail/<id>/', project_detail),
    path('api/', include((router.urls, str(router)), namespace='api')),
    path('newproject/', project_detail),
    path('display/<id>/', project_display),
    path('dataset_display/<id>/', dataset_display),
    path('newdataset/', dataset_detail),
    path('dataset_detail/<id>/', dataset_detail),
    path('dataset/fileupload/', dataset_fileupload),
    path('dataset/path/', dataset_path),
    path('dataset/imglist/', dataset_img),
    path('dataset/imgthum/', img_thum),
    path('dataset/ddaabb', ddaabb),
    path('dataset/filedownload/<filename>', dataset_filedownload),
    path('project/tasksupload/', taskPost),
    path('project/tasksget/<id>/<type>/', taskGet),
    path('project/tasks_change/<id>/', tasksChange),
    path('project/personal_tasks/', personalTasksGet),
    path('project/extrapost/', extraProjectPost),
    path('project/imgget/<task_name>/', getImg),
    path('project/imgpost/', postImg),
    path('project/imgfinish/<task_name>/', finishImg),
    path('filelist/', showFileList),
    path('project/newtasksupload/', tasksUpload),
    path('project/newcopytask/', taskCopy),
    path('project/imgtaskget/', getImgTask),
    path('workloadrm', workloadRm),
    path('doc/<filename>', mdView),
    path('doclist', mdList),
    path('perworkload/<id>/', percentage_workload),
    path('project/picright/<task_name>/', picRight),
    path('sktasksupload', socket_tasksupload),
    path('taskstandardpost/', task_standard_post)
]