from django.core.management.base import BaseCommand
from aidsp.models import Project, User, Label, QA, Reply, Dataset
from django.contrib.auth.hashers import make_password
from django.db.utils import IntegrityError
class Command(BaseCommand):
    def handle(self, *args, **options):
        with open('user.csv', 'r') as f:
            line = f.readline()
            while line:
                linelist = line.split(',')
                if not linelist[0] and not linelist[1] and not linelist[2] and not linelist[3] and not linelist[4]:
                    break
                password = make_password(linelist[4])
                try:
                    User.objects.create(name=linelist[0], phone=linelist[1], position=linelist[2],
                                        username=linelist[3], password=password)
                    print('添加%s成功' % linelist[0])
                except IntegrityError as e:
                    print('用户名%s重复，跳过' % linelist[3])
                line = f.readline()
        print('添加完成')


