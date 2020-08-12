"""check URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from workload.views import workload_list, hours_info, hour_persons_info, get_daily_info, scd_switch, task_workload, \
    real_time_job, get_updated_time
urlpatterns = [
    path('', workload_list),
    path('hoursinfo/', hours_info),
    path('hourpersonsinfo/', hour_persons_info),
    path('dailyinfo/', get_daily_info),
    path('scdenable', scd_switch),
    path('taskworkload/<task_name>', task_workload),
    path('realtimejob', real_time_job),
    path('getupdatedtime', get_updated_time),

]
