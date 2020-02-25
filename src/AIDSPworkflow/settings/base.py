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

]
AUTH_USER_MODEL = 'aidsp.User'
