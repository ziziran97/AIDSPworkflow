from django.urls import path, include
from . import views
from django.contrib import admin
from .views import project_index, project_detail, project_display
from .apis import ProjectViewSet, UserViewSet, LabelViewSet, QAViewSet, ProjectdisplayViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('project', ProjectViewSet, basename='api-project')
router.register('user', UserViewSet, basename='api-user')
router.register('label', LabelViewSet, basename='api-label')
router.register('qa', QAViewSet, basename='api-qa')
router.register('pdisplay', ProjectdisplayViewSet, basename='api-pdisplay')

urlpatterns = [
    path('', project_index),
    path('detail/<id>/', project_detail),
    path('api/', include((router.urls, str(router)), namespace='api')),
    path('newproject/', project_detail),
    path('display/<id>/', project_display),

]

