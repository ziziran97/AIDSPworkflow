# Generated by Django 2.2.7 on 2020-12-24 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aidsp', '0009_duibi_task_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='duibi',
            name='task_name',
            field=models.CharField(max_length=50, verbose_name='任务名'),
        ),
    ]
