from django.db import models

# Create your models here.
class Project(models.model):
    id = models.AutoField(primary_key=True)
    project_id = models.CharField(max_length=50, verbose_name='项目id')
    project_name = models.CharField(max_length=50, verbose_name='项目名称')
    tasks = models.ForeignKey(to='')
    status = models.CharField(max_length=20, verbose_name='状态')
    background = models.TextField(verbose_name='项目背景', help_text='填写此项目的需求背景，必须是markdown格式')
    total_demand = models.PositiveIntegerField(verbose_name='需求总量')
    total_describe = models.CharField(max_length=200, verbose_name='需求数量描述')
    deadline = models.