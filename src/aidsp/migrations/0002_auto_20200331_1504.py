# Generated by Django 2.2.7 on 2020-03-31 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aidsp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='expected_time',
            field=models.DateTimeField(blank=True, null=True, verbose_name='预计完成时间'),
        ),
        migrations.AddField(
            model_name='task',
            name='quantity_week',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='本周工作量'),
        ),
        migrations.AddField(
            model_name='task',
            name='task_description',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='任务描述'),
        ),
    ]