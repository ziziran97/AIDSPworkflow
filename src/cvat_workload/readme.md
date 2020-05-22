1.运行 docker cp workload cvat:/home/django/cvat/apps/ 

2.运行 docker exec -it cvat bash -ic 'vi ~/cvat/settings/base.py'
	在INSTALLED_APPS = [...]的最后添加
    'cvat.apps.workload',
    'django_apscheduler',



3. 运行 docker exec -it cvat bash -ic 'vi ~/cvat/urls.py'
	在urlpatterns = [...]的最后添加
    path('workload/',include('cvat.apps.workload.urls')),
   
   
   
4. 运行 docker exec -it cvat bash -ic 'pip3 install django_apscheduler'

   

5. 运行 docker exec -it cvat bash -ic 'pip3 install --no-cache-dir -r /tmp/requirements/${DJANGO_CONFIGURATION}.txt'

   

6. 重新启动
  docker-compose stop
  docker-compose up -d

  

7. 运行 docker exec -it cvat bash -ic 'vi ~/cvat/apps/workload/views.py'
  将# from apscheduler.schedulers.background import BackgroundScheduler
  至# my_job()处注释解除

  

8. 重启 docker-compose restar