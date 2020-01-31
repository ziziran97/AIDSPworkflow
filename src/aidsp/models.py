from django.db import models

# Create your models here.
class Project(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.CharField(max_length=50, verbose_name='项目id')
    project_name = models.CharField(max_length=50, verbose_name='项目名称')
    #tasks = models.ForeignKey(to='Task', to_field='project', related_name='project', on_delete=models.SET_NULL, verbose_name='任务')
    status = models.CharField(max_length=20, verbose_name='状态')
    background = models.TextField(verbose_name='项目背景', help_text='填写此项目的需求背景，必须是markdown格式')
    total_demand = models.PositiveIntegerField(verbose_name='需求总量')
    total_describe = models.CharField(max_length=200, verbose_name='需求数量描述')
    deadline = models.DateTimeField(verbose_name='截止渐渐')
    documents = models.ManyToManyField(to='Document', related_name='projects', verbose_name='文档')
    #datasets = models.ManyToManyField(to='Dataset', related_name='project', verbose_name='数据集')
    labels = models.ManyToManyField(to='Label', related_name='labels', verbose_name='标签')
    users_found = models.ManyToManyField(to='User', related_name='users_found', verbose_name='创建人')
    users_manager = models.ManyToManyField(to='User', related_name='users_manager', verbose_name='管理人')
    users_attend = models.ManyToManyField(to='User', related_name='users_attend', verbose_name='参与人')

    class Mata:
        verbose_name = verbose_name_plural = '项目'
        ordering = 'project_id'


class User(models.Model):
    POSITION_ALG = 0
    POSITION_MAN = 1
    POSITION_LAB = 2
    POSITIONS = (
        (POSITION_ALG, '算法工程师'),
        (POSITION_MAN, '生产管理员'),
        (POSITION_LAB, '标注员'),
    )
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=10, verbose_name='姓名')
    username = models.CharField(max_length=10, verbose_name='用户名')
    phone = models.CharField(max_length=11, verbose_name='手机')
    email = models.EmailField(verbose_name='邮箱')
    position = models.PositiveIntegerField(choices=POSITIONS, verbose_name='职位')
    current_task = models.IntegerField(verbose_name='当前任务')
