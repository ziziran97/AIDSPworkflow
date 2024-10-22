'''
@Author: your name
@Date: 2019-11-26 10:09:18
@LastEditTime: 2019-11-26 10:45:54
@LastEditors: Please set LastEditors
@Description: In User Settings Edit
@FilePath: /AIdatasets_production_processing/scripts/0.generally/cvat_scripts/create_tasks.py
'''
import os
import shutil
import subprocess
import re
import time
import json
from django.conf import settings as product
import psycopg2
'''

'''


# if not os.path.exists(img_task_dir):
#    os.mkdir(img_task_dir)

# label list
# labels_list = ['hand','error']
# labels_list = ['gesture_0001', 'gesture_0014']
# labels_list = ['left_eyebrow_134', 'right_eyebrow_134', 'left_eye_134', 'right_eye_134', 'mouth_134','error']
# labels_list = ['hand', 'cover_hand', 'error']
# labels_list = ['left_uncover_hand', 'left_cover_hand', 'right_uncover_hand', 'right_cover_hand']
# labels_list = ['left_uncover_hand', 'right_uncover_hand']
# labels_list = ['left_gesture_0019', 'right_gesture_0019']
# labels_list = ['warm_bg']
# labels_list = ['body', 'error']
# labels_list = ['error']
# labels_list = ['human','error']
# labels_list = ['mu_zhi', 'shi_zhi', 'zhong_zhi', 'wu_ming_zhi', 'xiao_zhi', 'error']
# labels_list = ['face', 'ear']
# labels_list = ['cheek','left_eyebrow','right_eyebrow','left_eye','right_eye','nose','mouth','error']
# labels_list = ['left_hand', 'error']
# labels_list = ['right_hand', 'error']
# labels_list = ['left_eyeball','right_eyeball','error']
# labels_list = ['hat','hair','face','neck','body','background','error']

def create_tasks_files():
    # sum of all pics
    img_sum = len(os.listdir(img_dir))
    # each task amount
    each_tasks_sum = 3150

    # task amount
    tasks_num = img_sum // each_tasks_sum

    pic_count = 0
    dir_count = 0
    for img in os.listdir(img_dir):
        if pic_count % each_tasks_sum == 0:
            img_task_path = os.path.join(img_task_dir, project_num + '_%04d' % dir_count)
            if not os.path.exists(img_task_path):
                os.mkdir(img_task_path)
            dir_count += 1
        ori_img_path = os.path.join(img_dir, img)
        to_img_path = os.path.join(img_task_path, img)
        shutil.copy(ori_img_path, to_img_path)
        pic_count += 1


def create_tasks(auth, task_name, imgdir, cli_path):
    global project_num, img_dir, img_task_dir
    project_num = task_name
    img_dir = os.path.join(imgdir, project_num)
    img_task_dir = os.path.join(imgdir, project_num )
    # generate label.json
    labels_file = os.path.join(img_task_dir, 'labels.txt')
    with open(labels_file, 'r', encoding='utf-8') as f:
        labels_list = f.read().replace('\n', '').split(',')

    print(labels_list)
    data_labels = []
    for label in labels_list:
        labels_dict = {}
        labels_dict['attributes'] = []
        labels_dict['name'] = label
        data_labels.append(labels_dict)
    print(data_labels)
    # with open('labels.json', 'w', encoding = 'utf-8') as f:
    #    f.write(str(data_labels))

    # la = "\'[{\"name\": \"hand\", \"attributes\": []}]\'"
    labels = ''
    for label in labels_list:
        labels += '{"name":"%s", "attributes": []},' % label
    labels_str = '[%s]' % labels[:-1]

    '''create_tasks'''

    dirs = os.listdir(img_task_dir)
    dirs.sort()
    res = []
    conn = psycopg2.connect(database='postgres', user='postgres',
                            password='postgres', host='db',
                            port='5432')
    cursor = conn.cursor()
    for Dir in dirs:
        if 'labels.txt' in Dir:
            continue
        task_name = Dir
        cursor.execute("select id from aidsp_task where task_name='{task_name}'".format(task_name=task_name))
        rows = cursor.fetchall()
        if len(rows) != 0:
            yield '跳过'
            continue
        try:
            k = "python3 {} --auth {} --server-host {} --server-port 8084 create '{}' --labels '{}' local {}/{}/*".format(
                cli_path, auth, product.CVATURL, task_name,  labels_str, img_task_dir, task_name)
            result = subprocess.check_output(k, shell=True)
        except:
            yield '跳过'
            continue
        yield json.loads(result.decode('utf-8'))
    #     res.append(json.loads(result.decode('utf-8')))
    # return res


if __name__ == '__main__':
    # auth = input("auth:")
    print(product.CVATURL)
    # auth = 'cvat:cvat_Cpv17d0Da2'
    # # create_tasks_files()
    # task_name = '1dir'
    # imgdir = '../static/imgFile'
    # cli_path = 'cli.py'
    # create_tasks(auth, task_name, imgdir, cli_path)
    #
    #


