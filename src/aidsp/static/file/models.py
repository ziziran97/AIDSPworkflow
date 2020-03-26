from __future__ import unicode_literals
from django.db import models


class Workload(models.Model):
    assignee = models.CharField(max_length=255, blank=True, null=True)
    updated_date = models.DateTimeField(blank=True, null=True)
    workcount = models.IntegerField(blank=True, null=True)
    lastid = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'workload'