from django.contrib import admin
from .models import Project, Document, User, Dataset
# Register your models here.

admin.site.register(Project)
admin.site.register(User)


# @admin.register(Project)
# class ProjectAdmin(admin.ModelAdmin):
#     list_display = ['project_id', 'project_name', 'status']
#     fields = ['project_id', 'project_name']


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'name', 'describe',
                    'create_time', 'update_time',
                    'quantity_detials', 'path']
    fields = ['name', 'path']
