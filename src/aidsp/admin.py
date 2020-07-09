from .models import Project, User, Dataset, QA, Task, Img
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy
from workload.models import Workload


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


class TaskAdmin(admin.ModelAdmin):
    search_fields = ['task_name']


admin.site.register(Project)
admin.site.register(User, UserProfileAdmin)
admin.site.register(Task, TaskAdmin)
