import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import {
  Descriptions,
  Card,
  Comment,
  Radio,
  Avatar,
  Form,
  Input,
  Button,
  List,
  Modal,
  Select,
  Divider,
  Icon,
  Breadcrumb
} from "antd";
import reqwest from "reqwest";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

class Demo extends React.Component {
  pid = window.location.pathname.split("/")[
    window.location.pathname.split("/").length - 2
  ];

  state = {
    data: "",
    key: "req_doc",
    comments: [],
    submitting: false,
    value: "",
    qastatus: "Q",
    Option: []
  };

  //获取项目主要信息
  project_fetch = (params = {}) => {
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/dataset/" +
        this.pid +
        "/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({
        data: data
      });
    });
  };
  componentDidMount() {
    this.project_fetch();
  }

  showDeleteConfirm = (e) => {
    confirm({
      title: "删除",
      icon: <ExclamationCircleOutlined />,
      content: "您确定要删除这个项目？",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        let pid = window.location.pathname.split("/")[
          window.location.pathname.split("/").length - 2
        ];
        fetch(
          window.location.protocol +
            "//" +
            window.location.host +
            "/aidsp/api/dataset/" +
            pid,
          {
            method: "DELETE"
          }
        ).then((res) => {
          if (res.status == 204) {
            window.location.href = "/aidsp";
          } else {
            Modal.error({
              title: "错误" + res.status + "（如果是20开头其实是成功了）",
              content: "提交失败"
            });
          }
        });
      },
      onCancel() {
        console.log("Cancel");
        // fetch(window.location.protocol + "//"+window.location.host+'/aidsp/api/qa/', {
      }
    });
  };

  render() {
    const { comments, submitting, value } = this.state;
    let adminbotton;

    if (this.state.data.is_admin) {
      adminbotton = (
        <div>
          <Button type="primary" href={"/aidsp/dataset_detail/" + this.pid}>
            编辑
          </Button>
          <Button type="danger" onClick={this.showDeleteConfirm}>
            删除
          </Button>
          <br />
          <br />
        </div>
      );
    } else {
    }

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="/aidsp">
            <Icon type="home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/aidsp/dataset">
            <Icon type="appstore" />
            <span>数据集</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.data.name}</Breadcrumb.Item>
        </Breadcrumb>
        <br />
        {adminbotton}

        <Descriptions bordered title="详情">
          <Descriptions.Item label="数据集名称" span={2}>
            {this.state.data.name}
          </Descriptions.Item>
          <Descriptions.Item label="所属项目" span={1}>
            {this.state.data.project}
          </Descriptions.Item>

          <Descriptions.Item label="数据集描述">
            {this.state.data.describe}
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {new Date(this.state.data.create_time).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="更新时间">
            {new Date(this.state.data.update_time).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="数量详情">
            {this.state.data.quantity_detials}
          </Descriptions.Item>

          <Descriptions.Item label="存储路径">
            {this.state.data.path}
          </Descriptions.Item>
        </Descriptions>
        <br />

        <Card style={{ width: "100%" }} title="略缩图">
          <img src={this.state.data.img} height="200" />
        </Card>
        <br />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById("container"));
