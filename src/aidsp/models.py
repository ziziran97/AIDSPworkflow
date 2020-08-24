from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.utils import timezone
# Create your models here.
from datetime import datetime, timedelta
from django.db.models.fields.related import ManyToManyField


class Project(models.Model):

    id = models.AutoField(primary_key=True)
    project_id = models.CharField(max_length=50, verbose_name='项目id')
    # project_id = models.IntegerField(unique=True, auto_created=True, verbose_name='项目id', blank=True, null=True)
    project_name = models.CharField(max_length=50, verbose_name='项目名称')
    # tasks = models.ForeignKey(to='Task', to_field='project', related_name='project', on_delete=models.SET_NULL, verbose_name='任务')
    status = models.CharField(max_length=20, verbose_name='状态')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    end_time = models.DateTimeField(verbose_name='结束时间', blank=True, null=True)
    background = models.TextField(verbose_name='项目背景', help_text='填写此项目的需求背景，必须是markdown格式', blank=True, null=True)
    total_demand = models.PositiveIntegerField(verbose_name='需求总量')
    total_describe = models.CharField(max_length=200, verbose_name='需求数量描述', blank=True, null=True)
    deadline = models.DateTimeField(verbose_name='截止时间')
    # documents = models.ManyToManyField(to='Document',
    #                                    related_name='document_project',
    #                                    verbose_name='文档')
    requirement_documents = models.OneToOneField('Document', on_delete=models.CASCADE,
                                                 verbose_name='需求文档', related_name='需求文档',
                                                 blank=True, null=True)
    collection_documents = models.OneToOneField('Document', on_delete=models.CASCADE,
                                                 verbose_name='采集文档', related_name='采集文档',
                                                blank=True, null=True)
    labeling_documents = models.OneToOneField('Document', on_delete=models.CASCADE,
                                                 verbose_name='标注文档', related_name='标注文档',
                                              blank=True, null=True)
    # datasets = models.ManyToManyField(to='Dataset', related_name='project', verbose_name='数据集')
    quantity_week = models.CharField(max_length=100, verbose_name='本周工作量', blank=True, null=True)
    task_description = models.CharField(max_length=200, verbose_name='任务描述', blank=True, null=True)
    expected_time = models.DateTimeField(verbose_name='预计完成时间', blank=True, null=True)
    labels = models.ManyToManyField(to='Label',
                                    related_name='labels',
                                    verbose_name='标签',
                                    blank=True)
    users_found = models.ManyToManyField(to='User',
                                         related_name='users_found',
                                         verbose_name='创建人',
                                         blank=True)
    users_manager = models.ManyToManyField(to='User',
                                           related_name='users_manager',
                                           verbose_name='管理人',
                                           blank=True)
    users_attend = models.ManyToManyField(to='User',
                                          related_name='users_attend',
                                          verbose_name='参与人',
                                          blank=True)
    task_standard = models.CharField(max_length=200, verbose_name='任务标准', blank=True, null=True)
    basic_quantity = models.PositiveIntegerField(verbose_name='基础量', blank=True, null=True)


    def __str__(self):
        return self.project_id + '_' + self.project_name

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        # 判断状态是否改变
        try:
            oldP = Project.objects.get(id=self.id)
            if oldP.status != self.status == '完结':
                self.end_time = timezone.now()
        except:
            pass
        super().save(force_insert=False, force_update=False, using=None,
             update_fields=None)

    class Mata:
        verbose_name = verbose_name_plural = '项目'
        ordering = 'id'




class Document(models.Model):
    TYPE_REQUIREMENT = 0
    TYPE_COLLECTION = 1
    TYPE_LABELING = 2
    TYPES = (
        (TYPE_REQUIREMENT, '需求文档'),
        (TYPE_COLLECTION, '采集文档'),
        (TYPE_LABELING, '标注文档'),
    )
    id = models.AutoField(primary_key=True)
    type = models.PositiveSmallIntegerField(choices=TYPES, verbose_name='文档类型')
    title = models.CharField(max_length=50, verbose_name='标题', blank=True, null=True)
    content = models.TextField(verbose_name='文档内容')
    old_content = models.TextField(verbose_name='文档内容历史版本', blank=True, null=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    update_time = models.DateTimeField(verbose_name='更新时间', blank=True, null=True)
    author = models.ForeignKey(to='User',
                               to_field='name',
                               verbose_name='姓名',
                               on_delete=models.DO_NOTHING, blank=True, null=True)

    class Mata:
        verbose_name = verbose_name_plural = '文档'

    def __str__(self):
        return self.content


class Dataset(models.Model):
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(to='Project',
                                to_field='id',
                                related_name='project_dataset',
                                verbose_name='所属项目',
                                on_delete=models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=20, verbose_name='数据集名称')
    describe = models.CharField(max_length=200, verbose_name='数据集描述', blank=True, null=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    update_time = models.DateTimeField(verbose_name='更新时间', auto_now=True)
    quantity_detials = models.CharField(max_length=200, verbose_name='数量详情', blank=True, null=True)
    path = models.CharField(max_length=200, verbose_name='存储路径', blank=True, null=True)
    img = models.TextField(verbose_name='略缩图', blank=True, null=True)

    class Mata:
        verbose_name = verbose_name_plural = '数据集'


class Label(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, verbose_name='标签名')

    class Mata:
        verbose_name = verbose_name_plural = '标签'

    def __str__(self):
        return self.name


class User(AbstractUser):
    POSITION_ALG = 0
    POSITION_MAN = 1
    POSITION_LAB = 2
    POSITIONS = (
        (POSITION_ALG, '算法工程师'),
        (POSITION_MAN, '生产管理员'),
        (POSITION_LAB, '标注员'),
    )
    name = models.CharField(max_length=10, unique=True, verbose_name='姓名')
    phone = models.CharField(max_length=11, verbose_name='手机')
    position = models.PositiveIntegerField(choices=POSITIONS, verbose_name='职位', null=True)
    current_task = models.IntegerField(verbose_name='当前任务', blank=True, null=True)
    # project_founder project_manager project_attend
    # tasks = models.ForeignKey()
    # tasks_review
    # q_a_Qs
    # q_a_As
    # q_a_approvals
    # performance

    def __str__(self):
        return self.name

    class Mata:
        verbose_name = verbose_name_plural = '用户'


class Performance(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(to='User',
                             to_field='name',
                             related_name='user_performance',
                             verbose_name='姓名',
                             on_delete=models.DO_NOTHING)
    performance = models.CharField(max_length=10, verbose_name='绩效')
    date = models.DateField(auto_now_add=True, verbose_name='打分日期')

    class Mata:
        verbose_name = verbose_name_plural = '员工绩效'


class QA(models.Model):
    id = models.AutoField(primary_key=True)
    # documents = models.ManyToManyField(to='Document',
    #                                    related_name='QA_project',
    #                                    verbose_name='文档')
    # question_content = models.TextField(verbose_name='问题内容', help_text='填写问题的内容，必须是markdown格式')
    # q_author = models.ForeignKey(to='User',
    #                              to_field='name',
    #                              related_name='user_q_author',
    #                              verbose_name='问题作者',
    #                              on_delete=models.DO_NOTHING)
    # q_label = models.CharField(max_length=50, verbose_name='问题标签')
    # q_create_time = models.DateTimeField(auto_now_add=True, verbose_name='问题创建时间')
    # answer_content = models.TextField(verbose_name='答案内容', help_text='填写答案的内容，必须是markdown格式')
    # a_author = models.ForeignKey(to='User',
    #                              to_field='name',
    #                              related_name='user_a_author',
    #                              verbose_name='答案作者',
    #                              on_delete=models.DO_NOTHING)
    # a_create_time = models.DateTimeField(verbose_name='答案创建时间')
    # a_approval = models.ForeignKey(to='User',
    #                              to_field='name',
    #                              related_name='user_a_approval',
    #                              verbose_name='问题点赞人',
    #                              on_delete=models.DO_NOTHING)
    author = models.CharField(max_length=50, verbose_name='作者')
    avatar = models.TextField(verbose_name='区分Q或A的头像')
    content = models.TextField(verbose_name='内容')
    datetime = models.DateTimeField(verbose_name='评论时间')
    documents = models.ForeignKey(to='Document', on_delete=models.CASCADE, verbose_name='文档')

    class Mata:
        verbose_name = verbose_name_plural = '问题与回答'


class Reply(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.CharField(max_length=50, verbose_name='作者')
    avatar = models.TextField(verbose_name='区分Q或A的头像')
    content = models.TextField(verbose_name='内容')
    datetime = models.DateTimeField(verbose_name='评论时间')
    toquestion = models.ForeignKey(to='QA', on_delete=models.CASCADE, verbose_name='问题')

    class Mata:
        verbose_name = verbose_name_plural = '回答'


class Task(models.Model):
    STATUS_NOT_BEGIN = 0
    STATUS_DOING = 1
    STATUS_DONE = 2
    STATUS_PASS = 3
    STATUS_NOT_PASS = 4
    STATUS_SUSPEND = 5
    STATUS = (
        (STATUS_NOT_BEGIN, '未开始'),
        (STATUS_DOING, '正在进行'),
        (STATUS_DONE, '待审核'),
        (STATUS_PASS, '通过'),
        (STATUS_NOT_PASS, '未通过'),
        (STATUS_SUSPEND, '暂停'),
    )
    TYPE_COLLECTION = 1
    TYPE_LABELING = 2
    TYPES = (
        (TYPE_COLLECTION, '采集任务'),
        (TYPE_LABELING, '标注任务'),
    )
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(to='Project',
                                to_field='id',
                                related_name='project_task',
                                verbose_name='所属项目',
                                on_delete=models.DO_NOTHING)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    task_name = models.CharField(max_length=100, unique=True, verbose_name='任务名称')
    belong_task = models.CharField(max_length=100, verbose_name='所属大任务')
    task_link = models.TextField(verbose_name='任务链接')
    begin_time = models.DateTimeField(verbose_name='开始时间', blank=True, null=True)
    done_time = models.DateTimeField(verbose_name='完成时间', blank=True, null=True)
    time_label = models.DateTimeField(verbose_name='重启标签', blank=True, null=True)
    used_time = models.CharField(max_length=20, verbose_name='任务用时', blank=True, null=True)
    total_time = models.CharField(max_length=20, verbose_name='任务历时', blank=True, null=True)
    gross = models.IntegerField(verbose_name='此任务工作总量', blank=True, null=True)
    current_workload = models.IntegerField(verbose_name='实时工作量', blank=True, null=True)
    current_points = models.IntegerField(verbose_name='实时点数', blank=True, null=True)
    quantity_available = models.IntegerField(verbose_name='此任务有效工作量', blank=True, null=True)
    status = models.PositiveSmallIntegerField(choices=STATUS, verbose_name='状态')
    number_of_reviews = models.PositiveSmallIntegerField(default=0, verbose_name='审核次数', blank=True, null=True)
    task_type = models.PositiveSmallIntegerField(choices=TYPES, verbose_name='任务类型')
    error_info = models.CharField(max_length=100, verbose_name='未通过理由', blank=True, null=True)
    # assignee = models.ForeignKey(to='User',
    #                              to_field='name',
    #                              related_name='assignee_task',
    #                              verbose_name='标注员',
    #                              on_delete=models.DO_NOTHING, blank=True, null=True)
    assignee = models.ManyToManyField(to='User',
                                      related_name='assignee_task',
                                      verbose_name='标注员',
                                      blank=True)
    # reviewer = models.ForeignKey(to='User',
    #                              to_field='name',
    #                              related_name='reviewer_task',
    #                              verbose_name='审核员',
    #                              on_delete=models.DO_NOTHING, blank=True, null=True)
    reviewer = models.ManyToManyField(to='User',
                                      related_name='reviewer_task',
                                      verbose_name='审核员',
                                      blank=True)
    # suggestions = models.TextField(verbose_name='修改建议', help_text='填写此任务的修改建议，必须是markdown格式')

    def __str__(self):
        return self.task_name

    class Mata:
        verbose_name = verbose_name_plural = '任务'

    def to_dict(self):
        data = {}
        for f in self._meta.concrete_fields + self._meta.many_to_many:
            value = f.value_from_object(self)
            if f.name == 'status':
                status_dict = dict(f.choices)
                value = status_dict[value]
            if isinstance(f, ManyToManyField):
                value = [i.id for i in value] if self.pk else None
            data[f.name] = value
        return data

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if self.id:
            oldT = Task.objects.get(id=self.id)
            # 当变成正在进行
            if oldT.status != int(self.status) == 1:
                if not self.begin_time:
                    self.begin_time = timezone.now()
                else:
                    self.time_label = timezone.now()
                # 当一个任务开始时暂停其他任务
                for eleAssignee in self.assignee.all():
                    allTask = Task.objects.filter(assignee=eleAssignee)
                    for eleTask in allTask:
                        if eleTask.status == 1:
                            eleTask.status = 5
                            eleTask.save()

            # 当变成暂停
            if oldT.status != int(self.status) == 5:
                # 计算工作用时
                if not self.used_time:
                    t = timezone.now() - self.begin_time
                    self.used_time = '%d天%d小时%d分钟' % (t.days, t.seconds / 3600, t.seconds % 3600 / 60)
                else:
                    t = timezone.now() - self.time_label
                    old_used_time = int(self.used_time.split('天')[1].split('小时')[0]) * 3600 + int(self.used_time.split('天')[1].split('小时')[1].split('分钟')[0]) * 60
                    d = int(self.used_time.split('天')[0]) + t.days
                    new_used_time = t.seconds + old_used_time
                    if new_used_time > 24 * 3600:
                        new_used_time = new_used_time - 24 * 3600
                        d = d + 1
                    self.used_time = '%d天%d小时%d分钟' % (d, new_used_time/3600, new_used_time % 3600 / 60)

            # 当变成待审核
            if oldT.status != int(self.status) == 2 and oldT.status != 4:
                # 计算工作用时
                if not self.used_time:
                    t = timezone.now() - self.begin_time
                    self.used_time = '%d天%d小时%d分钟' % (t.days, t.seconds / 3600, t.seconds % 3600 / 60)
                else:
                    t = timezone.now() - self.time_label
                    old_used_time = int(self.used_time.split('天')[1].split('小时')[0]) * 3600 + int(self.used_time.split('天')[1].split('小时')[1].split('分钟')[0]) * 60
                    d = int(self.used_time.split('天')[0]) + t.days
                    new_used_time = t.seconds + old_used_time
                    self.used_time = '%d天%d小时%d分钟' % (d, new_used_time/3600, new_used_time % 3600 / 60)
                # 计算工作历时
                if not self.done_time:
                    self.done_time = timezone.now()
                    t = timezone.now() - self.begin_time
                    self.total_time = '%d天%d小时%d分钟' % (t.days, t.seconds / 3600, t.seconds % 3600 / 60)
            # 当通过和不通过
            if oldT.status != int(self.status) == 3 or oldT.status != int(self.status) == 4:
                self.number_of_reviews = self.number_of_reviews + 1
        super().save(force_insert=False, force_update=False, using=None, update_fields=None)


class Suggestion(models.Model):
    id = models.AutoField(primary_key=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    update_time = models.DateTimeField(verbose_name='更新时间')
    task = models.ForeignKey(to='Task',
                             to_field='task_name',
                             related_name='suggestion_task',
                             verbose_name='任务',
                             on_delete=models.DO_NOTHING)
    index = models.IntegerField(verbose_name='图片序号')
    problem = models.TextField(verbose_name='问题内容', help_text='填写此图片的问题详情，必须是markdown格式')

    class Mata:
        verbose_name = verbose_name_plural = '修改建议'


class Img(models.Model):
    STATUS_RETAIN = 0
    STATUS_DELETE = 1
    STATUS = (
        (STATUS_RETAIN, '保留'),
        (STATUS_DELETE, '删除'),
    )
    id = models.AutoField(primary_key=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    url = models.CharField(max_length=100, verbose_name='链接')
    assignor = models.ForeignKey(to='User',
                               to_field='name',
                               verbose_name='姓名',
                               on_delete=models.DO_NOTHING, blank=True, null=True)
    status = models.PositiveSmallIntegerField(choices=STATUS, verbose_name='状态', blank=True, null=True)
    tasks = models.ForeignKey(to='Task',
                              to_field='task_name',
                              verbose_name='所属任务',
                               on_delete=models.CASCADE)

    class Mata:
        verbose_name = verbose_name_plural = '图片库'