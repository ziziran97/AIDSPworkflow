from django.shortcuts import render
from django.contrib.auth import authenticate,login,logout
from django.shortcuts import render,redirect,reverse
from django.http import HttpResponse

def Login(request):
    if request.method == 'GET':
        return render(request, 'login.html', {'status': '请输入用户名和密码'})
    if request.method == 'POST':
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                #登录，向session中添加SESSION_KEY, 便于对用户进行跟踪:
                login(request, user)
                # 如果调用login方法以后，
                # request对象就会激活user属性，这个属性不管登录或者未登录都是存在
                return HttpResponse("登录成功")
            else:
                return render(request, 'login.html', {'status': '用户未激活'})
        else:
            return render(request, 'login.html', {'status': '用户名或密码错误，请重新输入'})
