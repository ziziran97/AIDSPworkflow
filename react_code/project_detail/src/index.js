import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import moment from "moment"; // 时间插件
import qs from "qs";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Rate,
  Checkbox,
  Row,
  Col,
  Input,
  DatePicker,
  Comment,
  Avatar,
  List,
  Divider,
  Modal
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import reqwest from "reqwest";
import LEdit from "wangeditor";
const ButtonGroup = Button.Group;
const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit}>
        添加
      </Button>
    </Form.Item>
  </div>
);
const { Option } = Select;
const props = {
  onChange({ file, fileList }) {
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
  },
  defaultFileList: [
    {
      uid: "1",
      name: "xxx.png",
      status: "done",
      response: "Server Error 500", // custom error message to show
      url: "http://www.baidu.com/xxx.png"
    }
  ]
};
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}
const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="创建一个新标签"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="标签">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入标签！" }]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
class Demo extends React.Component {
  state = {
    data: [],
    user_data: [{ id: "", name: "" }],
    Options: [],
    label_data: [{ id: "", name: "" }],
    Options_label: [],
    nowDoc: "reqDoc",
    reqDoc: { doc: "", qa: [] },
    colDoc: { doc: "", qa: [] },
    labDoc: { doc: "", qa: [] },
    editor: [],
    comments: [],
    submitting: false,
    value: "",
    qastatus: "Q",
    bacDoc: "",
    visible: false,
    editor_2: [],
    reqId: "",
    colId: "",
    labId: "",
    subloading: false
  };
  //提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const pid = window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 2
      ];

      if (!err) {
        this.setState({ subloading: true });
        if (pid != "newproject") {
          const pdata = {
            project_id: this.state.data.project_id,
            project_name: values.project_name,
            status: values.status,
            background: this.state.bacDoc,
            total_demand: values.total_demand,
            total_describe: values.total_describe,
            deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
            labels: values.labels ? values.labels.toString() : null,
            users_found: values.users_found
              ? values.users_found.toString()
              : null,
            users_manager: values.users_manager
              ? values.users_manager.toString()
              : null,
            users_attend: values.users_attend
              ? values.users_attend.toString()
              : null,
            requirement_documents: this.state.reqDoc.doc,
            collection_documents: this.state.colDoc.doc,
            labeling_documents: this.state.labDoc.doc
          };
          fetch(
            window.location.protocol +
              "//" +
              window.location.host +
              "/aidsp/api/project/" +
              pid +
              "/",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: qs.stringify(pdata)
            }
          ).then((res) => {
            if (res.status == 201 || res.status == 200) {
              Modal.success({
                content: "提交成功",
                onOk() {
                  window.location.href = "/aidsp/display/" + pid;
                }
              });
            } else {
              Modal.error({
                title: "错误" + res.status,
                content: "提交失败"
              });
            }
            this.setState({ subloading: false });
          });
        } else {
          const pdata = {
            project_name: values.project_name,
            status: values.status,
            background: this.state.bacDoc,
            total_demand: values.total_demand,
            total_describe: values.total_describe,
            deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
            labels: values.labels ? values.labels.toString() : null,
            users_found: values.users_found
              ? values.users_found.toString()
              : null,
            users_manager: values.users_manager
              ? values.users_manager.toString()
              : null,
            users_attend: values.users_attend
              ? values.users_attend.toString()
              : null,
            requirement_documents: this.state.reqDoc.doc,
            collection_documents: this.state.colDoc.doc,
            labeling_documents: this.state.labDoc.doc
          };
          fetch(
            window.location.protocol +
              "//" +
              window.location.host +
              "/aidsp/api/project/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: qs.stringify(pdata)
            }
          ).then((res) => {
            if (res.status == 201 || res.status == 200) {
              Modal.success({
                content: "提交成功",
                onOk() {
                  window.location.href = "/aidsp";
                }
              });
            } else {
              Modal.error({
                title: "错误" + res.status,
                content: "提交失败"
              });
            }
            this.setState({ subloading: false });
          });
        }
      }
    });
  };

  normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  componentDidMount() {
    const elemMenu = this.refs.editorElemMenu;
    const elemBody = this.refs.editorElemBody;
    const editor = new LEdit(elemMenu, elemBody);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html) => {
      this.edonchange();
    };
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 100;
    editor.create();
    this.setState({
      editor: editor
    });
    editor.txt.html(this.state.reqDoc.doc);
    const elemMenu_2 = this.refs.editorElemMenu_2;
    const elemBody_2 = this.refs.editorElemBody_2;
    const editor_2 = new LEdit(elemMenu_2, elemBody_2);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor_2.customConfig.onchange = (html) => {
      this.setState({
        bacDoc: editor_2.txt.html()
      });
    };

    editor_2.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    editor_2.customConfig.uploadImgShowBase64 = true;
    editor_2.customConfig.zIndex = 100;
    editor_2.create();
    this.setState({
      editor_2: editor_2
    });
    this.project_fetch();
  }
  // 获取编辑前信息
  project_fetch = (params = {}) => {
    const pid = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 2
    ];
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/project/" +
        pid +
        "/?format=json",
      method: "get"
    }).then((data) => {
      if (data.create_time) {
        data.create_time = moment(data.create_time, "YYYY-MM-DD HH:mm:ss");
      }
      if (data.deadline) {
        data.deadline = moment(data.deadline, "YYYY-MM-DD HH:mm:ss");
      }
      this.setState({ data: data });
      this.props.form.setFieldsValue(this.state.data);
      this.setState({
        bacDoc: data.background,
        reqDoc: {
          doc: data.req_doc ? data.req_doc : "",
          qa: data.req_qa ? data.req_qa : []
        },
        colDoc: {
          doc: data.col_doc ? data.col_doc : "",
          qa: data.col_qa ? data.col_qa : []
        },
        labDoc: {
          doc: data.lab_doc ? data.lab_doc : "",
          qa: data.lab_qa ? data.lab_qa : []
        },
        reqId: data.requirement_documents,
        colId: data.collection_documents,
        labId: data.labeling_documents
      });
      this.state.editor_2.txt.html(data.background);
      this.state.editor.txt.html(this.state.reqDoc.doc);
      this.setState({ comments: this.state.reqDoc.qa });
    });
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/user/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({ user_data: data });
      let Options = data.map((station) => (
        <Option value={station.id}>{station.name}</Option>
      ));
      this.setState({ Options: Options });

      console.log(Options);
    });
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/label/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({ label_data: data });
      let Options_label = data.map((station) => (
        <Option value={station.id}>{station.name}</Option>
      ));
      this.setState({ Options_label: Options_label });
    });
  };
  handleSizeChange = (e) => {
    this.setState({ nowDoc: e.target.value });
    this.state.nowDoc = e.target.value;
    if (this.state.nowDoc == "reqDoc") {
      this.state.editor.txt.html(this.state.reqDoc.doc);
      this.setState({ comments: this.state.reqDoc.qa });
    }
    if (this.state.nowDoc == "colDoc") {
      this.state.editor.txt.html(this.state.colDoc.doc);
      this.setState({ comments: this.state.colDoc.qa });
    }
    if (this.state.nowDoc == "labDoc") {
      this.state.editor.txt.html(this.state.labDoc.doc);
      this.setState({ comments: this.state.labDoc.qa });
    }
  };
  edonchange = (e) => {
    if (this.state.nowDoc == "reqDoc") {
      this.state.reqDoc.doc = this.state.editor.txt.html();
    }
    if (this.state.nowDoc == "colDoc") {
      this.state.colDoc.doc = this.state.editor.txt.html();
    }
    if (this.state.nowDoc == "labDoc") {
      this.state.labDoc.doc = this.state.editor.txt.html();
    }
  };

  handleQASubmit = (e) => {
    e.preventDefault();
    if (
      window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 2
      ] == "newproject"
    ) {
      Modal.warning({
        title: "警告",
        content: "请在新建项目提交后再添加Q&A"
      });
      return;
    }
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true
    });

    setTimeout(() => {
      var nid = 0;
      if (this.state.nowDoc == "reqDoc") {
        nid = this.state.reqId;
      }
      if (this.state.nowDoc == "colDoc") {
        nid = this.state.colId;
      }
      if (this.state.nowDoc == "labDoc") {
        nid = this.state.labId;
      }
      if (!nid) {
        Modal.warning({
          title: "警告",
          content: "请在项目文档a保存后再添加Q&A"
        });
        return;
      }
      fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/api/qa/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body:
            "author=" +
            this.state.data.now_user +
            "&avatar=" +
            (this.state.qastatus == "Q"
              ? "https://goss.veer.com/creative/vcg/veer/800water/veer-128081877.jpg"
              : "https://goss.veer.com/creative/vcg/veer/800water/veer-129496482.jpg") +
            "&content=" +
            this.state.value +
            "&datetime=" +
            moment().format("YYYY-MM-DD HH:mm:ss") +
            "&documents=" +
            nid
        }
      );
      this.setState(
        {
          submitting: false,
          value: "",
          comments: [
            ...this.state.comments,

            {
              author: this.state.qastatus == "Q" ? "Q" : "A",
              avatar:
                this.state.qastatus == "Q"
                  ? "https://goss.veer.com/creative/vcg/veer/800water/veer-128081877.jpg"
                  : "https://goss.veer.com/creative/vcg/veer/800water/veer-129496482.jpg",
              content: <p>{this.state.value}</p>,
              datetime: moment().format("YYYY-MM-DD HH:mm:ss")
            }
          ]
        },
        function () {
          if (this.state.nowDoc == "reqDoc") {
            this.state.reqDoc.qa = this.state.comments;
          }
          if (this.state.nowDoc == "colDoc") {
            this.state.colDoc.qa = this.state.comments;
          }
          if (this.state.nowDoc == "labDoc") {
            this.state.labDoc.qa = this.state.comments;
          }
        }
      );
    }, 100);
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };
  handleQAChange = (e) => {
    this.setState({
      qastatus: e.target.value
    });
  };
  //获取标签
  tag_fetch = (e) => {
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/label/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({ label_data: data });
      let Options_label = data.map((station) => (
        <Option value={station.id}>{station.name}</Option>
      ));
      this.setState({ Options_label: Options_label });
    });
  };
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  // 创建标签
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/api/label/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: qs.stringify(values)
        }
      );

      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      data: this.state.data
    };

    const { comments, submitting, value } = this.state;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="项目名称">
          {getFieldDecorator("project_name", {
            rules: [{ required: true, message: "请输入项目名称!" }]
          })(<Input placeholder="请输入项目名称" key="sddsd"></Input>)}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator("status", {
            rules: [{ required: true, message: "请选择状态!" }]
          })(
            <Select placeholder="请选择状态">
              <Option value="未开始">未开始</Option>
              <Option value="准备中">准备中</Option>
              <Option value="数据采集">数据采集</Option>
              <Option value="数据标注">数据标注</Option>
              <Option value="暂停">暂停</Option>
              <Option value="完结">完结</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="创建时间">
          {getFieldDecorator(
            "create_time",
            {}
          )(<DatePicker showTime disabled />)}
        </Form.Item>
        <Form.Item label="需求总量">
          {getFieldDecorator("total_demand", {
            rules: [{ required: true, message: "请输入需求总量!" }]
          })(<InputNumber></InputNumber>)}
        </Form.Item>
        <Form.Item label="需求数量描述">
          {getFieldDecorator(
            "total_describe",
            {}
          )(<Input placeholder="请输入需求数量描述"></Input>)}
        </Form.Item>
        <Form.Item label="截止时间">
          {getFieldDecorator("deadline", {
            rules: [
              { type: "object", required: true, message: "Please select time!" }
            ]
          })(<DatePicker showTime />)}
        </Form.Item>

        <Form.Item label="标签" onClick={this.tag_fetch}>
          {getFieldDecorator(
            "labels",
            {}
          )(
            <Select
              placeholder="请输入标签"
              mode="multiple"
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    style={{ padding: "4px 8px", cursor: "pointer" }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={this.showModal}
                  >
                    <Icon type="plus" /> Add item
                  </div>
                </div>
              )}
            >
              {this.state.Options_label}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="创建人">
          {getFieldDecorator("users_found", {
            rules: [{ required: true, message: "请输入创建人!" }]
          })(
            <Select placeholder="请输入创建人" mode="multiple">
              {this.state.Options}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="管理人">
          {getFieldDecorator(
            "users_manager",
            {}
          )(
            <Select placeholder="请输入管理人" mode="multiple">
              {this.state.Options}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="参与人">
          {getFieldDecorator(
            "users_attend",
            {}
          )(
            <Select placeholder="请输入参与人" mode="multiple">
              {this.state.Options}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="项目背景">
          {getFieldDecorator("background", {
            valuePropName: "fileList",
            getValueFromEvent: this.normFile
          })(
            <div className="shop">
              <div className="text-area">
                <div
                  ref="editorElemMenu_2"
                  style={{
                    backgroundColor: "#f1f1f1",
                    border: "1px solid #ccc"
                  }}
                  className="editorElem-menu"
                ></div>
                <div
                  style={{
                    padding: "0 10px",
                    height: 300,
                    border: "1px solid #ccc",
                    borderTop: "none"
                  }}
                  ref="editorElemBody_2"
                  className="editorElem-body"
                ></div>
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item label="文档">
          <Radio.Group
            value={this.state.nowDoc}
            onChange={this.handleSizeChange}
          >
            <Radio.Button value="reqDoc">需求文档</Radio.Button>
            <Radio.Button value="colDoc">采集文档</Radio.Button>
            <Radio.Button value="labDoc">标注文档</Radio.Button>
          </Radio.Group>
          <div
            ref="editorElemMenu"
            style={{ backgroundColor: "#f1f1f1", border: "1px solid #ccc" }}
            className="editorElem-menu"
          ></div>
          <div
            style={{
              padding: "0 10px",
              height: 300,
              border: "1px solid #ccc",
              borderTop: "none"
            }}
            ref="editorElemBody"
            className="editorElem-body"
          ></div>
          <div></div>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.subloading}
          >
            提交
          </Button>
        </Form.Item>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </Form>
    );
  }
}
const WrappedDemo = Form.create({ project_name: "validate_other" })(Demo);

ReactDOM.render(<WrappedDemo />, document.getElementById("container"));
