from django.db import models

# Create your models here.


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.CharField(max_length=50, unique=True, verbose_name='项目id')
    project_name = models.CharField(max_length=50, verbose_name='项目名称')
    # tasks = models.ForeignKey(to='Task', to_field='project', related_name='project', on_delete=models.SET_NULL, verbose_name='任务')
    status = models.CharField(max_length=20, verbose_name='状态')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    end_time = models.DateTimeField(verbose_name='结束时间')
    background = models.TextField(verbose_name='项目背景', help_text='填写此项目的需求背景，必须是markdown格式')
    total_demand = models.PositiveIntegerField(verbose_name='需求总量')
    total_describe = models.CharField(max_length=200, verbose_name='需求数量描述')
    deadline = models.DateTimeField(verbose_name='截止时间')
    documents = models.ManyToManyField(to='Document',
                                       related_name='document_project',
                                       verbose_name='文档')
    # datasets = models.ManyToManyField(to='Dataset', related_name='project', verbose_name='数据集')
    labels = models.ManyToManyField(to='Label',
                                    related_name='labels',
                                    verbose_name='标签')
    users_found = models.ManyToManyField(to='User',
                                         related_name='users_found',
                                         verbose_name='创建人')
    users_manager = models.ManyToManyField(to='User',
                                           related_name='users_manager',
                                           verbose_name='管理人')
    users_attend = models.ManyToManyField(to='User',
                                          related_name='users_attend',
                                          verbose_name='参与人')

    class Mata:
        verbose_name = verbose_name_plural = '项目'
        ordering = 'project_id'


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
    title = models.CharField(max_length=50, verbose_name='标题')
    content = models.TextField(verbose_name='文档内容')
    old_content = models.TextField(verbose_name='文档内容历史版本')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    update_time = models.DateTimeField(verbose_name='更新时间')
    author = models.ForeignKey(to='User',
                               to_field='name',
                               related_name='user_document',
                               verbose_name='姓名',
                               on_delete=models.DO_NOTHING)

    class Mata:
        verbose_name = verbose_name_plural = '文档'


class Dataset(models.Model):
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(to='Project',
                                to_field='project_id',
                                related_name='project_dataset',
                                verbose_name='所属项目',
                                on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=20, verbose_name='数据集名称')
    describe = models.CharField(max_length=200, verbose_name='数据集描述')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    update_time = models.DateTimeField(verbose_name='更新时间')
    quantity_detials = models.CharField(max_length=200, verbose_name='数量详情')
    path = models.CharField(max_length=200, verbose_name='存储路径')

    class Mata:
        verbose_name = verbose_name_plural = '数据集'


class Label(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, verbose_name='标签名')

    class Mata:
        verbose_name = verbose_name_plural = '标签'


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
    name = models.CharField(max_length=10, unique=True, verbose_name='姓名')
    username = models.CharField(max_length=10, verbose_name='用户名')
    phone = models.CharField(max_length=11, verbose_name='手机')
    email = models.EmailField(verbose_name='邮箱')
    position = models.PositiveIntegerField(choices=POSITIONS, verbose_name='职位')
    current_task = models.IntegerField(verbose_name='当前任务')
    # project_founder project_manager project_attend
    # tasks = models.ForeignKey()
    # tasks_review
    # q_a_Qs
    # q_a_As
    # q_a_approvals
    # performance

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
    documents = models.ManyToManyField(to='Document',
                                       related_name='QA_project',
                                       verbose_name='文档')
    question_content = models.TextField(verbose_name='问题内容', help_text='填写问题的内容，必须是markdown格式')
    q_author = models.ForeignKey(to='User',
                                 to_field='name',
                                 related_name='user_q_author',
                                 verbose_name='问题作者',
                                 on_delete=models.DO_NOTHING)
    q_label = models.CharField(max_length=50, verbose_name='问题标签')
    q_create_time = models.DateTimeField(auto_now_add=True, verbose_name='问题创建时间')
    answer_content = models.TextField(verbose_name='答案内容', help_text='填写答案的内容，必须是markdown格式')
    a_author = models.ForeignKey(to='User',
                                 to_field='name',
                                 related_name='user_a_author',
                                 verbose_name='答案作者',
                                 on_delete=models.DO_NOTHING)
    a_create_time = models.DateTimeField(verbose_name='答案创建时间')
    a_approval = models.ForeignKey(to='User',
                                 to_field='name',
                                 related_name='user_a_approval',
                                 verbose_name='问题点赞人',
                                 on_delete=models.DO_NOTHING)

    class Mata:
        verbose_name = verbose_name_plural = '问题与回答'


class Task(models.Model):
    STATUS_NOT_BEGIN = 0
    STATUS_DOING = 1
    STATUS_DONE = 2
    STATUS_PASS = 3
    STATUS_NOT_PASS = 4
    STATUS = (
        (STATUS_NOT_BEGIN, '未开始'),
        (STATUS_DOING, '正在进行'),
        (STATUS_DONE, '完成'),
        (STATUS_PASS, '通过'),
        (STATUS_NOT_PASS, '未通过'),
    )
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(to='Project',
                                to_field='project_id',
                                related_name='project_task',
                                verbose_name='所属项目',
                                on_delete=models.DO_NOTHING)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    task_name = models.CharField(max_length=20, unique=True, verbose_name='任务名称')
    task_link = models.URLField(verbose_name='任务链接')
    begin_time = models.DateTimeField(verbose_name='开始时间')
    done_time = models.DateTimeField(verbose_name='完成时间')
    time_label = models.DateTimeField(verbose_name='时间标记点')
    used_time = models.DateTimeField(verbose_name='任务用时')
    total_time = models.DateTimeField(verbose_name='任务历时')
    gross = models.IntegerField(verbose_name='此任务工作总量')
    quantity_available = models.IntegerField(verbose_name='此任务有效工作量')
    status = models.PositiveSmallIntegerField(choices=STATUS, verbose_name='状态')
    number_of_reviews = models.PositiveSmallIntegerField(default=0, verbose_name='审核次数')
    assignee = models.ForeignKey(to='User',
                                 to_field='name',
                                 related_name='assignee_task',
                                 verbose_name='标注员',
                                 on_delete=models.DO_NOTHING)
    reviewer = models.ForeignKey(to='User',
                                 to_field='name',
                                 related_name='reviewer_task',
                                 verbose_name='审核员',
                                 on_delete=models.DO_NOTHING)
    # suggestions = models.TextField(verbose_name='修改建议', help_text='填写此任务的修改建议，必须是markdown格式')

    class Mata:
        verbose_name = verbose_name_plural = '任务'


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
