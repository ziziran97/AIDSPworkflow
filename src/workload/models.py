from __future__ import unicode_literals
from django.db import models


class Workload(models.Model):
    assignee = models.CharField(max_length=255, blank=True, null=True, verbose_name='标注员')
    updated_date = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='创建时间')
    workcount = models.IntegerField(blank=True, null=True, verbose_name='工作量')
    pointscount = models.IntegerField(blank=True, null=True, verbose_name='点数量')
    lastid = models.IntegerField(blank=True, null=True, verbose_name='最后id')
    task = models.CharField(max_length=255, blank=True, null=True, verbose_name='任务')
    project_detail_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='项目全名')
    project_id = models.IntegerField(blank=True, null=True, verbose_name='项目id')

    class Meta:
        db_table = 'workload'
