from __future__ import unicode_literals
from django.db import models


class Workload(models.Model):
    assignee = models.CharField(max_length=255, blank=True, null=True, verbose_name='标注员')
    updated_date = models.DateTimeField(blank=True, null=True, verbose_name='创建时间')
    workcount = models.IntegerField(blank=True, null=True, verbose_name='工作量')
    lastid = models.IntegerField(blank=True, null=True, verbose_name='最后id')
    task = models.CharField(max_length=255, blank=True, null=True, verbose_name='任务')

    class Meta:
        db_table = 'workload'
