from .models import Project, User, Dataset, QA, Task, Img
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy


class UserProfileAdmin(UserAdmin):
    list_display = ('username', 'name', 'is_superuser', 'is_staff', 'is_active', 'date_joined')
    fieldsets = (
        (None, {'fields': ('username', 'password', 'name', 'phone', 'email', 'position', 'current_task')}),

        # (gettext_lazy('User Information'), {'fields': ('user', 'birthday', 'gender', 'mobile')}),
        #
        (gettext_lazy('Permissions'), {'fields': ('is_superuser', 'is_staff', 'is_active',
                                                  'groups', 'user_permissions')}),
        #
        # (gettext_lazy('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )


admin.site.register(Project)
admin.site.register(User, UserProfileAdmin)
admin.site.register(Task)


# @admin.register(Project)
# class ProjectAdmin(admin.ModelAdmin):
#     list_display = ['project_id', 'project_name', 'status']
#     fields = ['project_id', 'project_name']


# @admin.register(Dataset)
# class DatasetAdmin(admin.ModelAdmin):
#     list_display = ['id', 'project', 'name', 'describe',
#                     'create_time', 'update_time',
#                     'quantity_detials', 'path']
#     fields = ['name', 'path']
