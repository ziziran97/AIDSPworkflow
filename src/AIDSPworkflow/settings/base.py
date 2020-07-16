LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

INSTALLED_APPS = [
    'aidsp',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'workload',
    'django_apscheduler',
    'dwebsocket',
]
AUTH_USER_MODEL = 'aidsp.User'
WEBSOCKET_ACCEPT_ALL = True