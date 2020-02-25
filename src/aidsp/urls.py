from django.urls import path, include
from . import views
from django.contrib import admin
from .views import project_index, project_detail
from .apis import ProjectViewSet, UserViewSet, LabelViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('project', ProjectViewSet, basename='api-project')
router.register('user', UserViewSet, basename='api-user')
router.register('label', LabelViewSet, basename='api-label')

urlpatterns = [
    path('', project_index),
    path('detail/<project_id>/', project_detail),
    path('api/', include((router.urls, str(router)), namespace='api')),
]

