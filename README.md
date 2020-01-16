# 介绍

AIDSPworkflow（AI data sets production workflow manage system）即AI数据集生产工作流管理系统。主要用于AI数据生产管理统筹的web工具，主要包含了需求管理、文档管理、任务管理、人员管理等功能。工具主要采用工作流的管理思想，从需求提出、文档编辑、问题解决、工期计划、工作安排、数据归档、周日报生成等工作流程，统一管理数据生产的方方面面。

# 需求描述

从工具使用用户角度分析：

# 管理员

- 后端管理
- 拥有所有操作权限
- 员工当前工作状态
- 管理数据集

## 算法工程师

- 创建数据需求项目
- 自动生成项目批次号
- 填写项目必要的属性（联合提出人、数据类型、使用目的、需求量、截止时间等）
- 填写项目描述细节，富文本编辑器，图文编辑
- Q&A编辑器，回答细节问题

## 数据生产管理员

- 项目信息编辑权限
- 项目任务委派、标注任务链接生成安排给标注员，审核员委派
- 数据采集/标注方案文档编辑，富文本编辑器
- 项目状态修改，在看板中体现
- 数据集存储管理、存储位置记录
- 导出工作日、周报

## 标注员

- 审核员可以编辑审核结果
- 标注员可以查看审核结果
- Q&A编辑器，提出问题
- 日常工作登记、工作量登记

## 所有用户

- 项目看板
- 工作手册
- 文档可以导出pdf

# 模型设计

- project(项目)
    - id
    - project_id 项目id
    - project_name 项目名称
    - partner（user）需求伙伴
    - labels(label) 项目类型标签
    - status(status)  项目状态
    - background 项目背景
    - total_demand 需求总量
    - total_describe 需求数量描述
    - dead_line 完成期限
    - requirements_document(document) 需求详细说明文档
    - collection_document(document) 采集方案文档
    - annotation_document(document) 标注方案文档
    - qa(qa) Q&A
    - tasks(task) 任务列表
    - reviewer 审核员
    - dataset(dataset) 产生数据集
    
- user(用户)
    - id
    - name 姓名
    - username 用户名
    - phone 手机
    - email 电子邮箱
    - position 职位
    - performance(performance) 绩效
    - current_task(task) 当前任务
    
- label(项目标签)
    - id 
    - project_id(project) 项目id
    - name 标签名
    
- status(项目状态)
    - id 
    - serial_number 看板序号
    - name 状态名
    - project_id(project) 项目id
    
- document(文档)
    - id
    - project_id(project) 项目id
    - type 文档类型
    - title 文档标题
    - content 文档内容
    - old_content 历史文档内容
    - create_time 创建时间
    - update_time 更新时间
    - author(user) 作者

- task(任务)
    - id
    - project_id(project) 项目id
    - create_time 创建时间
    - task_name 任务名称
    - task_link 任务链接
    - assignee(user) 标注员
    - begin_time 开始时间
    - done_time 完成时间
    - time_label 时间标记
    - used_time 任务用时
    - total_time 任务历时
    - gross 任务总数
    - quantity_available 实际总数
    - status 状态
    - number_of_reviews 审核次数
    - reviewer(user) 审核员
    - suggestion 修改建议
    
- qa(Q&A)
    - id
    - document_id(document) 文档id
    - question_content 问题内容
    - q_babel 问题标签
    - q_create_time 问题创建时间
    - answer_content 答案内容
    - a_create_time
    
- performance(绩效)
    - id
    - name(user) 用户名
    - performance 绩效
    - date 考评日期

- dataset(数据集)
    - id
    - project_id(project) 项目id
    - name 数据集名称
    - describe 描述
    - quantity_details 数量详情
    - path 存储路径