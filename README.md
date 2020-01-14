# 介绍

AIDSPworkflow（AI data sets production workflow manage system）即AI数据集生产工作流管理系统。主要用于AI数据生产管理统筹的web工具，主要包含了需求管理、文档管理、任务管理、人员管理等功能。工具主要采用工作流的管理思想，从需求提出、文档编辑、问题解决、工期计划、工作安排、数据归档、周日报生成等工作流程，统一管理数据生产的方方面面。

# 需求描述

从工具使用用户角度分析：

# 管理员

- 后端管理
- 拥有所有操作权限
- 员工当前工作状态

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

# 模型设计

- project(项目)
    - id
    - project_id
    - partner（user）
    - type
    - labels(label)
    - status(status)
    - background
    - total_demand
    - total_describe
    - dead_line
    - requirements_document(document)
    - collection_document(document)
    - annotation_documnet(document)
    - qa(qa)
    - tasks(task)
    
- user(用户)
    - id
    - name
    - username
    - phone
    - email
    - position
    - performance(performance)
    - current_task(task)
    

- 
    