import re
from django.http import JsonResponse
from django.shortcuts import HttpResponseRedirect
from django.utils.deprecation import MiddlewareMixin

class LoginCheckMiddleware(MiddlewareMixin):
    def process_request(self, request):  
        # | 分隔要匹配的多个url，从左到右匹配，有匹配就返回匹配值，否则返回None。
        pattern = r'^(/$|/aidsp$|/aa)'

        # 如果 request.path 的开始位置能够找到这个正则样式的任意个匹配，就返回一个相应的匹配对象。
        # 如果不匹配，就返回None
        match = re.search(pattern, request.path)
        # 需要拦截的url
        if match and not request.user.is_authenticated:
            print('用户未登录URL拦截 >>: ', request.path)
            # 主页未登录
            return HttpResponseRedirect('/login/')
