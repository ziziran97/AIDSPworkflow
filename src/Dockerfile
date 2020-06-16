# 从仓库拉取 带有 python 3.7 的 Linux 环境
FROM ubuntu:16.04

ENV LANG='C.UTF-8'  \
    LC_ALL='C.UTF-8'

RUN  sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN  apt-get clean
RUN apt-get update


RUN apt-get -y install xvfb gtk2-engines-pixbuf
RUN apt-get -y install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable
RUN apt-get -y install imagemagick x11-apps
RUN Xvfb -ac :99 -screen 0 1280x1024x16 & export DISPLAY=:99
RUN apt-get -y install wget
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - 
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update 
RUN apt-get -y install google-chrome-stable


RUN wget http://chromedriver.storage.googleapis.com/83.0.4103.39/chromedriver_linux64.zip
RUN apt-get -y install zip
RUN apt-get -y install unzip
RUN unzip chromedriver_linux64.zip
RUN cp chromedriver /usr/bin/

RUN apt-get -y install python3-dev
RUN apt-get -y install python3-pip
RUN apt-get -y install libpq-dev
# 设置 python 环境变量
ENV PYTHONUNBUFFERED 1

# 创建 code 文件夹并将其设置为工作目录
RUN mkdir /code
WORKDIR /code
# 更新 pip
RUN pip3 install --upgrade pip -i https://mirrors.aliyun.com/pypi/simple/ 
# 将 requirements.txt 复制到容器的 code 目录
ADD requirements.txt /code/
# 安装库
RUN pip3 install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
# 将当前目录复制到容器的 code 目录
ADD . /code/
# 设置环境变量
ENV PROJECT_PROFILE product
RUN apt-get -y install tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
ENV TZ Asia/Shanghai