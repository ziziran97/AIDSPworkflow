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
  Statistic,
  Upload,
  Collapse,
  Table,
  DatePicker,
  message,
  Tooltip,
  Breadcrumb,
  Steps,
  Tree,
  Progress,
  Spin
} from "antd";
import {
  Chart,
  Tooltip as ChartTooltip,
  Axis,
  Bar,
  Coord,
  Line,
  Point
} from "viser-react";
import reqwest from "reqwest";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";

const { Countdown } = Statistic;
const { TextArea } = Input;
const { confirm } = Modal;
const { Option } = Select;
const { Panel } = Collapse;
const { Step } = Steps;
const { DirectoryTree } = Tree;
const qjpg =
  "data:image/jpg;base64,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";
const ajpg =
  "data:image/jpg;base64,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";
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <BraftEditor
        value={value}
        onChange={onChange}
        rows={4}
        className="fuwenben"
        contentStyle={{ height: 400 }}
      />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit}>
        添加
      </Button>
    </Form.Item>
  </div>
);

//回复编辑器
const ReplyEditor = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    state = {
      editorState: null
    };
    componentDidMount() {
      this.setState({
        editorState: BraftEditor.createEditorState(this.props.defaultValue)
      });
    }
    handleEditorChange = (editorState) => {
      this.setState({ editorState });
    };
    render() {
      const { onSubmit, defaultValue, onChange } = this.props;
      return (
        <div>
          <Form>
            <Form.Item>
              <BraftEditor
                defaultValue={BraftEditor.createEditorState(defaultValue)}
                rows={4}
                className="fuwenben"
                name="con"
                contentStyle={{ height: 300 }}
                onChange={this.handleEditorChange}
              />
            </Form.Item>
            <Button
              htmlType="button"
              onClick={onSubmit.bind(
                this,
                this.state.editorState ? this.state.editorState.toHTML() : null
              )}
            >
              提交
            </Button>
          </Form>
        </div>
      );
    }
  }
);
const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

//上传zip
const UploadCollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      fileList: []
    };
    beforeUpload(file) {
      return false;
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        fileList: nextProps.fileList
      });
    }
    render() {
      const { visible, onCancel, onCreate, form, onChange } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="上传zip"
          cancelText="关闭"
          okText="返回"
          onCancel={onCancel}
          onOk={onCancel}
        >
          <Form>
            <Form.Item label="zip文件">
              {getFieldDecorator("zipFile", {
                rules: [{ required: true, message: "请上传zip文件！" }]
              })(
                <Upload
                  onChange={onChange}
                  fileList={this.state.fileList}
                  accept=".zip"
                  action="/aidsp/dataset/fileupload/"
                >
                  {this.state.fileList[0] ? (
                    ""
                  ) : (
                    <Button>
                      <Icon type="upload" /> 点击上传zip文件
                    </Button>
                  )}
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

// 分配
const DisCollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      fileList: []
    };
    beforeUpload(file) {
      return false;
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        fileList: nextProps.fileList
      });
    }
    render() {
      const { visible, onCancel, onCreate, form, onChange } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新建任务"
          cancelText="关闭"
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form>
            <Form.Item
              label="csv文件"
              extra="任务名,标注员,审核员(多参数用空格分隔)"
            >
              {getFieldDecorator("csvFile", {
                rules: [{ required: true, message: "请上传csv文件！" }]
              })(
                <Upload
                  beforeUpload={this.beforeUpload}
                  onChange={onChange}
                  fileList={this.state.fileList}
                  accept=".csv"
                >
                  {this.state.fileList[0] ? (
                    ""
                  ) : (
                    <Button>
                      <Icon type="upload" /> 点击上传csv文件
                    </Button>
                  )}
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

// 新建任务
const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    state = {
      current: 0,
      filename: "",
      subLongding: false
    };
    onSelect = (keys, event) => {
      this.setState({ filename: keys[0] });
    };

    onExpand = () => {
      console.log("Trigger Expand");
    };
    componentDidMount() {
      const _this = this;
      axios
        .get("/aidsp/filelist/")
        .then(function (response) {
          let data = response.data;
          _this.setState({ data: data });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    next() {
      const current = this.state.current + 1;
      this.setState({ current });
    }

    prev() {
      const _this = this;
      axios
        .get("/aidsp/filelist/")
        .then(function (response) {
          let data = response.data;
          _this.setState({ data: data });
        })
        .catch(function (error) {
          console.log(error);
        });
      const current = this.state.current - 1;
      this.setState({ current });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const { visible, onCancel, onCreate, form, onChange } = this.props;

      let steps = [
        {
          title: "选择文件夹",
          content: (
            <DirectoryTree
              style={{ height: 500, overflowY: "auto" }}
              treeData={this.state.data}
              onSelect={this.onSelect}
            />
          )
        },
        {
          title: "提交表单",
          content: (
            <Form
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              onSubmit={onCreate}
            >
              <Form.Item label="任务名">
                {getFieldDecorator("belong_task", {
                  rules: [{ required: true, message: "请输入任务名" }],
                  initialValue: this.state.filename
                })(<Input disabled={true} />)}
              </Form.Item>
              <Form.Item label="任务类型" hasFeedback>
                {getFieldDecorator("select", {
                  rules: [{ required: true, message: "请选择任务类型" }]
                })(
                  <Select placeholder="请选择任务类型">
                    <Option value="screen">筛选任务</Option>
                    <Option value="tagging">标注任务</Option>
                    <Option value="tagging">对比任务</Option>
                  </Select>
                )}
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.subLongding}
                onClick={() => {
                  this.setState({ subLongding: true });
                }}
              >
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            </Form>
          )
        }
      ];
      const { current } = this.state;

      return (
        <Modal
          visible={visible}
          title="新建任务"
          footer={null}
          onCancel={onCancel}
        >
          <Steps current={current} size="small">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <br />
          {this.state.data ? (
            <div className="steps-content">{steps[current].content}</div>
          ) : (
            <Spin />
          )}
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                下一步
              </Button>
            )}
          </div>
        </Modal>
      );
    }
  }
);
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
    Option: [],
    fileList: [],
    task_data: [],
    quantity_week_value: "",
    task_description_value: "",
    editorState: null,
    comments_editorState: null,
    dataPickervalue: moment(),
    chartVisible: false,
    person_data: [],
    chartData: [],
    perdata: {},
    hoursShow: true,
    result: [],
    picorpoi: "pic"
  };
  columns = [
    {
      title: "任务名称",
      dataIndex: "task_name"
    },
    {
      title: "任务链接",
      dataIndex: "task_link",
      render: (text, record) => (
        <div>
          {Object.entries(record.task_link.split(" ")).map((item, index) => {
            return (
              <a href={item[1]} target="_blank">
                {item[1]}
                <br />
              </a>
            );
          })}
        </div>
      )
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
      render: (text, record) => new Date(record.create_time).toLocaleString()
    },
    {
      title: "开始时间",
      dataIndex: "begin_time",
      sorter: (a, b) => new Date(a.begin_time) - new Date(b.begin_time),
      render: (text, record) =>
        record.begin_time ? new Date(record.begin_time).toLocaleString() : ""
    },
    {
      title: "完成时间",
      dataIndex: "done_time",
      sorter: (a, b) => new Date(a.done_time) - new Date(b.done_time),
      render: (text, record) =>
        record.done_time ? new Date(record.done_time).toLocaleString() : ""
    },
    {
      title: "重启时间",
      dataIndex: "time_label",
      sorter: (a, b) => new Date(a.time_label) - new Date(b.time_label),
      render: (text, record) =>
        record.time_label ? new Date(record.time_label).toLocaleString() : ""
    },
    {
      title: "任务用时",
      dataIndex: "used_time"
    },
    {
      title: "任务历时",
      dataIndex: "total_time"
    },
    {
      title: "工作总量",
      dataIndex: "gross"
    },
    {
      title: "有效工作量",
      dataIndex: "quantity_available"
    },
    {
      title: "状态",
      dataIndex: "status"
    },
    {
      title: "审核次数",
      dataIndex: "number_of_reviews",
      sorter: (a, b) => a.number_of_reviews - b.number_of_reviews
    },
    {
      title: "标注员",
      width: 140,
      dataIndex: "assignee",
      render: (text, record) => (
        <span>
          <Select
            mode="multiple"
            optionFilterProp="children"
            style={{ width: "100%" }}
            value={record.assignee}
            disabled={!this.state.data.is_admin}
            onChange={this.assignee_change(record.id)}
          >
            {this.state.Options}
          </Select>
        </span>
      )
    },
    {
      title: "审核员",
      width: 140,
      dataIndex: "reviewer",
      render: (text, record) => (
        <span>
          <Select
            mode="multiple"
            optionFilterProp="children"
            style={{ width: "100%" }}
            value={record.reviewer}
            disabled={!this.state.data.is_admin}
            onChange={this.reviewer_change(record.id)}
          >
            {this.state.Options}
          </Select>
        </span>
      )
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record) => (
        <div>
          {this.state.data.is_admin &&
          (record.status == "未开始" || record.status == "暂停") ? (
            <Tooltip title="开始">
              <Icon
                type="play-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(record.id, 1)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.data.is_admin && record.status == "正在进行" ? (
            <Tooltip title="暂停">
              <Icon
                type="pause-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(record.id, 5)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.data.is_admin &&
          (record.status == "正在进行" || record.status == "未通过") ? (
            <Tooltip title="提交审核">
              <Icon
                type="plus-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(record.id, 2)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.data.is_admin && record.status == "待审核" ? (
            <Tooltip title="通过">
              <Icon
                type="check-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(record.id, 3)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.data.is_admin && record.status == "待审核" ? (
            <Tooltip title="不通过">
              <Icon
                type="close-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(record.id, 4)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.data.is_admin && (
            <Tooltip title="添加新任务">
              <Icon
                type="folder-add"
                theme="twoTone"
                onClick={this.newcopytask(record)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          )}
        </div>
      )
    }
  ];
  // 任务状态修改
  taskStatusChange(id, status) {
    return (e) => {
      let title;
      switch (status) {
        case 1:
          title = "开始";
          break;
        case 5:
          title = "暂停";
          break;
        case 2:
          title = "提交审核";
          break;
        case 3:
          title = "通过";
          break;
        case 4:
          title = "不通过";
          break;

        default:
          title = "未知";
      }
      confirm({
        title: title,
        icon: <ExclamationCircleOutlined />,
        content: "您确定要" + title + "这个任务？",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          fetch(
            window.location.protocol +
              "//" +
              window.location.host +
              "/aidsp/project/tasks_change/" +
              id +
              "/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: qs.stringify({ id: id, status: status })
            }
          ).then((res) => {
            if (res.status == 200) {
              Modal.success({
                content: "提交成功",
                onOk() {}
              });
              this.task_fetch();
            } else {
              Modal.error({
                title: "错误" + res.status,
                content: "提交失败"
              });
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    };
  }

  //项目基本信息获取
  project_fetch = (params = {}) => {
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
    });

    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/pdisplay/" +
        this.pid +
        "/?format=json",
      method: "get"
    }).then((data) => {
      let xqa = data.req_qa ? data.req_qa : [];
      for (let i in xqa) {
        xqa[i].actions = data.is_admin
          ? [
              <span
                key="comment-list-reply-to-0"
                onClick={this.aclick(i, xqa[i].id)}
              >
                解答
              </span>,
              <span key="edit" onClick={this.commnet_eidt(i, xqa[i].id)}>
                编辑
              </span>
            ]
          : [];
        xqa[i].content = (
          <div dangerouslySetInnerHTML={{ __html: xqa[i].content }} />
        );

        if (xqa[i].havechildren) {
          xqa[i].children = (
            <Comment
              avatar={<Avatar src={xqa[i].havechildren.avatar} />}
              author={xqa[i].havechildren.author}
              datetime={xqa[i].havechildren.datetime}
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: xqa[i].havechildren.content
                  }}
                />
              }
            />
          );
        }
      }
      this.setState({
        data: data,
        reqId: data.requirement_documents,
        colId: data.collection_documents,
        labId: data.labeling_documents,
        duibiId: data.duibi_documents,
        req_qa: data.req_qa,
        col_qa: data.col_qa,
        lab_qa: data.lab_qa,
        duibi_qa: data.duibi_qa,
        comments: xqa,
        quantity_week_value: data.quantity_week,
        task_description_value: data.task_description,
        expected_time: data.expected_time,
        task_standard: data.task_standard ? data.task_standard.split(",") : [],
        basic_quantity: data.basic_quantity
      });
    });
  };
  //任务信息获取
  task_fetch = (params = {}) => {
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/project/tasksget/" +
        this.pid +
        "/1/",
      method: "get"
    }).then((data) => {
      this.setState({ col_task_data: data });
      if (this.state.key == "col_doc") {
        this.setState({ task_data: data });
      }
    });
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/project/tasksget/" +
        this.pid +
        "/2/",
      method: "get"
    }).then((data) => {
      this.setState({ lab_task_data: data });
      if (this.state.key == "lab_doc") {
        this.setState({ task_data: data });
      }
    });
  };

  //工作量获取
  chart_fetch = (e) => {
    const _this = this;
    let formData = new FormData();
    formData.append("pid", this.pid);
    formData.append("YY", e[0]);
    formData.append("MM", e[1]);
    formData.append("DD", e[2]);
    axios
      .post("/aidsp/workload/", formData)
      .then(function (response) {
        let data = response.data;
        _this.setState({ chartData: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //任务完成度百分比获取
  per_fetch = (e) => {
    const _this = this;
    axios
      .get("/aidsp/perworkload/" + this.pid + "/")
      .then(function (response) {
        let data = response.data;
        _this.setState({ perdata: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  componentDidMount() {
    const htmlContent =
      // Use BraftEditor.createEditorState to convert html strings to editorState data needed by the editor
      this.setState({
        editorState: BraftEditor.createEditorState(htmlContent)
      });
    this.project_fetch();
    this.task_fetch();
    this.per_fetch();
    var YY = moment().format("YYYY");
    var MM = moment().format("MM");
    var DD = moment().format("DD");
    var datadate = [YY, MM, DD];
    this.chart_fetch(datadate);
  }
  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  };
  tabList = [
    {
      key: "req_doc",
      tab: "需求文档"
    },
    {
      key: "col_doc",
      tab: "采集文档"
    },
    {
      key: "lab_doc",
      tab: "标注文档"
    },
    {
      key: "duibi_doc",
      tab: "对比文档"
    }
  ];
  // 解答、编辑切换为废弃方案
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
    if (key == "req_doc") {
      let xcomments = this.state.req_qa ? this.state.req_qa : [];
      for (let i in xcomments) {
        if (this.state.data.is_admin) {
          xcomments[i].actions = [
            <span
              key="comment-list-reply-to-0"
              onClick={this.aclick(i, xcomments[i].id)}
            >
              解答
            </span>,
            <span key="edit" onClick={this.commnet_eidt(i, xcomments[i].id)}>
              编辑
            </span>
          ];
        }
        if (xcomments[i].havechildren) {
          xcomments[i].children = (
            <Comment
              avatar={<Avatar src={xcomments[i].havechildren.avatar} />}
              author={xcomments[i].havechildren.author}
              datetime={xcomments[i].havechildren.datetime}
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: xcomments[i].havechildren.content
                  }}
                />
              }
            />
          );
        }
      }
      this.state.comments = xcomments;
      this.setState({ comments: xcomments });
    }
    if (key == "col_doc") {
      let xcomments = this.state.col_qa ? this.state.col_qa : [];

      for (let i in xcomments) {
        if (this.state.data.is_admin) {
          xcomments[i].actions = [
            <span
              key="comment-list-reply-to-0"
              onClick={this.aclick(i, xcomments[i].id)}
            >
              解答
            </span>,
            <span key="edit" onClick={this.commnet_eidt(i, xcomments[i].id)}>
              编辑
            </span>
          ];
        }
        if (xcomments[i].havechildren) {
          xcomments[i].children = (
            <Comment
              avatar={<Avatar src={xcomments[i].havechildren.avatar} />}
              author={xcomments[i].havechildren.author}
              datetime={xcomments[i].havechildren.datetime}
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: xcomments[i].havechildren.content
                  }}
                />
              }
            />
          );
        }
      }

      this.state.comments = xcomments;
      this.setState({ comments: xcomments });
      this.setState({ task_data: this.state.col_task_data });
    }
    if (key == "lab_doc") {
      let xcomments = this.state.lab_qa ? this.state.lab_qa : [];
      for (let i in xcomments) {
        if (this.state.data.is_admin) {
          xcomments[i].actions = [
            <span
              key="comment-list-reply-to-0"
              onClick={this.aclick(i, xcomments[i].id)}
            >
              解答
            </span>,
            <span key="edit" onClick={this.commnet_eidt(i, xcomments[i].id)}>
              编辑
            </span>
          ];
        }
        if (xcomments[i].havechildren) {
          xcomments[i].children = (
            <Comment
              avatar={<Avatar src={xcomments[i].havechildren.avatar} />}
              author={xcomments[i].havechildren.author}
              datetime={xcomments[i].havechildren.datetime}
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: xcomments[i].havechildren.content
                  }}
                />
              }
            />
          );
        }
      }
      this.state.comments = xcomments;
      this.setState({ comments: xcomments });
      this.setState({ task_data: this.state.lab_task_data });
    }
    let xcomments = this.state.comments;
    for (let i in xcomments) {
      if (this.state.data.is_admin) {
        xcomments[i].actions = [
          <span
            key="comment-list-reply-to-0"
            onClick={this.aclick(i, xcomments[i].id)}
          >
            解答
          </span>,
          <span key="edit" onClick={this.commnet_eidt(i, xcomments[i].id)}>
            编辑
          </span>
        ];
      }
      if (xcomments[i].havechildren) {
        xcomments[i].children = (
          <Comment
            avatar={<Avatar src={xcomments[i].havechildren.avatar} />}
            author={xcomments[i].havechildren.author}
            datetime={xcomments[i].havechildren.datetime}
            content={
              <div
                dangerouslySetInnerHTML={{
                  __html: xcomments[i].havechildren.content
                }}
              />
            }
          />
        );
      }
    }
    this.setState({ comments: xcomments });
  };
  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };
  replaysub(id, uid) {
    return (e) => {
      let rcontent = (
        <div
          dangerouslySetInnerHTML={{
            __html: e
          }}
        />
      ); //提交回复
      fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/api/reply/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body:
            "author=" +
            this.state.data.now_user +
            "&avatar=" +
            ajpg
              .replace(/;/g, "%3B")
              .replace(/&/g, "%26")
              .replace(/[+]/g, "%2B") +
            "&content=" +
            e.replace(/;/g, "%3B").replace(/&/g, "%26").replace(/[+]/g, "%2B") +
            "&datetime=" +
            moment().format("YYYY-MM-DD HH:mm:ss") +
            "&toquestion=" +
            uid
        }
      ).then((res) => {
        if (res.status == 201 || res.status == 200) {
          Modal.success({
            content: "提交成功",
            onOk() {}
          });
          let x = this.state.comments;
          x[id].children = (
            <Comment
              avatar={<Avatar src={ajpg} />}
              author={this.state.data.now_user}
              datetime={moment().format("YYYY-MM-DD HH:mm:ss")}
              content={rcontent}
            />
          );
          this.setState({ comments: x });
        } else {
          Modal.error({
            title: "错误" + res.status,
            content: "提交失败"
          });
        }
      });
    };
  }
  reply_onchange = (e) => {
    this.setState({ comments_editorState: e });
  };
  aclick(id, uid) {
    return (e) => {
      let x = this.state.comments;
      let comments_editorState = BraftEditor.createEditorState(
        this.state.comments[id].children
          ? this.state.comments[id].children.props.content.props
              .dangerouslySetInnerHTML.__html
          : ""
      );
      this.setState({ comments_editorState: comments_editorState });
      x[id].children = (
        <Comment
          avatar={<Avatar src={ajpg} />}
          content={
            <ReplyEditor
              onSubmit={this.replaysub(id, uid)}
              defaultValue={comments_editorState}
              onChange={this.reply_onchange}
            />
          }
        />
      );
      this.setState({ comments: x });
    };
  }
  commnet_eidt(id, uid) {
    return (e) => {
      let x = this.state.comments;
      let defaultvalue = x[id].content;
      let comments_editorState = BraftEditor.createEditorState(
        defaultvalue ? defaultvalue.props.dangerouslySetInnerHTML.__html : ""
      );
      this.setState({ comments_editorState: comments_editorState });
      x[id].content = (
        <ReplyEditor
          defaultValue={comments_editorState}
          onSubmit={this.eidtsub(id, uid)}
          onChange={this.reply_onchange}
        />
      );
      this.setState({ comments: x });
    };
  }
  //提问编辑
  eidtsub(id, uid) {
    return (e) => {
      let rcontent = (
        <div
          dangerouslySetInnerHTML={{
            __html: e
          }}
        />
      );
      fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/api/qa/" +
          uid +
          "/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body:
            "author=" +
            this.state.comments[id].author +
            "&avatar=" +
            this.state.comments[id].avatar
              .replace(/;/g, "%3B")
              .replace(/&/g, "%26")
              .replace(/[+]/g, "%2B") +
            "&content=" +
            e.replace(/;/g, "%3B").replace(/&/g, "%26").replace(/[+]/g, "%2B") +
            "&datetime=" +
            this.state.comments[id].datetime +
            "&documents=" +
            this.state.comments[id].documents
        }
      ).then((res) => {
        if (res.status == 201 || res.status == 200) {
          Modal.success({
            content: "提交成功",
            onOk() {}
          });
          let x = this.state.comments;
          x[id].content = rcontent;
          this.setState({ comments: x });
        } else {
          Modal.error({
            title: "错误" + res.status,
            content: "提交失败"
          });
        }
      });
    };
  }
  //新建提问
  handleQASubmit = (e) => {
    e.preventDefault();
    if (!this.state.editorState.toHTML()) {
      return;
    }

    this.setState({
      submitting: true
    });

    setTimeout(() => {
      var nid = 0;
      if (this.state.key == "req_doc") {
        nid = this.state.reqId;
      }
      if (this.state.key == "col_doc") {
        nid = this.state.colId;
      }
      if (this.state.key == "lab_doc") {
        nid = this.state.labId;
      }
      if (!nid) {
        Modal.error({
          title: "错误",
          content: "请输入文档后再提交评论！"
        });
        this.setState({
          submitting: false
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
            (this.state.qastatus == "Q" ? qjpg : ajpg)
              .replace(/;/g, "%3B")
              .replace(/&/g, "%26")
              .replace(/[+]/g, "%2B") +
            "&content=" +
            this.state.editorState
              .toHTML()
              .replace(/;/g, "%3B")
              .replace(/&/g, "%26")
              .replace(/[+]/g, "%2B") +
            "&datetime=" +
            moment().format("YYYY-MM-DD HH:mm:ss") +
            "&documents=" +
            nid
        }
      ).then((res) => {
        res.text().then((val) => {
          if (res.status == 201 || res.status == 200) {
            Modal.success({
              content: "提交成功",
              onOk() {}
            });
            this.setState(
              {
                submitting: false,
                editorState: BraftEditor.createEditorState(),
                comments: [
                  ...this.state.comments,

                  {
                    id: JSON.parse(val).id,
                    actions: this.state.data.is_admin
                      ? [
                          <span
                            key="comment-list-reply-to-0"
                            onClick={this.aclick(
                              this.state.comments.length,
                              JSON.parse(val).id
                            )}
                          >
                            解答
                          </span>,
                          <span
                            key="edit"
                            onClick={this.commnet_eidt(
                              this.state.comments.length,
                              JSON.parse(val).id
                            )}
                          >
                            编辑
                          </span>
                        ]
                      : [],
                    author: this.state.data.now_user,
                    avatar: qjpg,
                    content: (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.state.editorState.toHTML()
                        }}
                      />
                    ),
                    datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    documents: nid
                  }
                ]
              },
              function () {
                if (this.state.key == "req_doc") {
                  this.state.req_qa = this.state.comments;
                }
                if (this.state.key == "col_doc") {
                  this.state.col_qa = this.state.comments;
                }
                if (this.state.key == "lab_doc") {
                  this.state.lab_qa = this.state.comments;
                }
              }
            );
          } else {
            Modal.error({
              title: "错误" + res.status,
              content: "提交失败"
            });
          }
        });
      });
    }, 100);
  };
  handleQAChange = (e) => {
    this.setState({
      qastatus: e.target.value
    });
  };
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
            "/aidsp/api/pdisplay/" +
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
      }
    });
  };
  //参与人修改
  attend_change = (e) => {
    if (this.state.data.is_admin) {
      let ndata = this.state.data;
      ndata.users_attend = e;
      this.setState({ data: ndata });
      this.project_post();
    }
  };
  //项目状态修改
  status_change = (e) => {
    if (this.state.data.is_admin) {
      let ndata = this.state.data;
      ndata.status = e;
      this.setState({ data: ndata });
      this.project_post();
    }
  };
  //标注员修改
  assignee_change(id) {
    return (e) => {
      if (this.state.data.is_admin) {
        message.loading({
          content: "提交中。。。",
          key: "assignee_change",
          duration: null
        });

        const _this = this;
        let formData = new FormData();
        formData.append("assignee", e ? e.toString() : []);
        formData.append("id", id);
        axios
          .post("/aidsp/project/tasks_change/" + id + "/", formData)
          .then(function (response) {
            let data = response.data;
            message.success({ content: "提交成功", key: "assignee_change" });
            Modal.success({
              content: "提交成功",
              onOk() {}
            });
            _this.task_fetch();
          })
          .catch(function (error) {
            message.error({ content: "提交失败", key: "assignee_change" });
            Modal.error({
              title: "错误" + error.response.status,
              content: error.response.data
            });
            _this.task_fetch();
          });
      }
    };
  }
  //审核员修改
  reviewer_change(id) {
    return (e) => {
      if (this.state.data.is_admin) {
        message.loading({
          content: "提交中。。。",
          key: "reviewer_change",
          duration: null
        });
        const _this = this;
        let formData = new FormData();
        formData.append("reviewer", e ? e.toString() : []);
        formData.append("id", id);
        axios
          .post("/aidsp/project/tasks_change/" + id + "/", formData)
          .then(function (response) {
            let data = response.data;
            message.success({ content: "提交成功", key: "reviewer_change" });
            Modal.success({
              content: "提交成功",
              onOk() {}
            });
            _this.task_fetch();
          })
          .catch(function (error) {
            message.error({ content: "提交失败", key: "reviewer_change" });
            Modal.error({
              title: "错误" + error.response.status,
              content: error.response.data
            });
            _this.task_fetch();
          });
      }
    };
  }
  // 部分项目信息提交
  project_post() {
    let pid = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 2
    ];
    const pdata = {
      project_id: this.state.data.project_id,
      status: this.state.data.status,
      users_attend: this.state.data.users_attend
        ? this.state.data.users_attend.toString()
        : []
    };
    fetch(
      window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/pdisplay/" +
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
          onOk: () => {
            this.project_fetch();
          }
        });
      } else {
        Modal.error({
          title: "错误" + res.status,
          content: "提交失败"
        });
      }
    });
  }
  // 项目其他信息提交
  nproject_post(key_info) {
    return ({ target: { value } }) => {
      let pid = window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 2
      ];
      const pdata = {
        [key_info]: value,
        id: pid
      };
      fetch("/aidsp/project/extrapost/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify(pdata)
      }).then((res) => {
        if (res.status == 201 || res.status == 200) {
          message.success("提交成功");
          this.project_fetch();
        } else {
          message.error("错误" + res.status);
        }
      });
    };
  }
  tquantity_week_onChange = ({ target: { value } }) => {
    this.setState({ quantity_week_value: value });
  };
  task_description_onChange = ({ target: { value } }) => {
    this.setState({ task_description_value: value });
  };
  basic_quantity_onchange = ({ target: { value } }) => {
    this.setState({ basic_quantity: value });
  };
  task_standard_onchane = (e) => {
    this.setState({ task_standard: e });
  };

  // 预计完成时间提交
  expected_time_post = (value) => {
    let pid = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 2
    ];
    const pdata = {
      expected_time: value.format("YYYY-MM-DD HH:mm:ss"),
      id: pid
    };
    fetch("/aidsp/project/extrapost/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify(pdata)
    }).then((res) => {
      if (res.status == 201 || res.status == 200) {
        message.success("提交成功");
        this.project_fetch();
      } else {
        message.error("错误" + res.status);
      }
    });
  };
  expected_time_onChange = (value) => {
    this.setState({
      expected_time: value
    });
  };
  showTaskMoadl = () => {
    this.setState({ taskVisible: true });
  };
  disshowTaskMoadl = () => {
    this.setState({ distaskVisible: true });
  };
  uploadshowTaskMoadl = () => {
    this.setState({ uploadtaskVisible: true });
  };
  cancelTaskMoadl = () => {
    this.setState({ taskVisible: false });
  };
  discancelTaskMoadl = () => {
    this.setState({ distaskVisible: false });
    this.setState({ fileList: [] });
  };
  uploadcancelTaskMoadl = () => {
    this.setState({ uploadtaskVisible: false });
    this.setState({ fileList: [] });
  };
  // 任务批量分配
  taskSubmit = () => {
    const { form } = this.disformRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", values.csvFile.file);
      let formData = new FormData();
      formData.append("taskName", values.taskName);
      formData.append("project_id", this.pid);
      formData.append("csvFile", values.csvFile.file);
      formData.append("task_type", this.state.key == "col_doc" ? 1 : 2);
      const _this = this;
      message.loading({
        content: "提交中。。。",
        key: "taskSubmit",
        duration: null
      });

      axios
        .post("/aidsp/project/tasksupload/", formData)
        .then(function (res) {
          form.resetFields();
          _this.setState({ distaskVisible: false });
          _this.setState({ fileList: [] });
          _this.task_fetch();
          if (res.status == 201 || res.status == 200) {
            message.success({ content: "提交成功", key: "taskSubmit" });
            Modal.success({
              content: "提交成功",
              onOk() {}
            });
          } else if (res.status == 203) {
            message.success({ content: "部分提交成功", key: "taskSubmit" });
            Modal.success({
              content: "部分提交成功\n" + res.data,
              onOk() {}
            });
          }
        })
        .catch(function (error) {
          message.error({
            content: "错误" + error.response.status,
            key: "taskSubmit"
          });
          Modal.error({
            title: "错误" + error.response.status,
            content: error.response.data
          });
        });
    });
  };
  // 任务上传
  new_taskSubmit = (e) => {
    e.preventDefault();
    let pid = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 2
    ];
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      if (!err) {
        message.loading({
          content: "提交中。。。",
          key: "new_taskSubmit",
          duration: null
        });
        let data = new FormData();
        data.append("type", values.select);
        data.append("task", values.belong_task);
        data.append("project", pid);
        data.append("task_type", this.state.key == "col_doc" ? 1 : 2);
        data = {
          type: values.select,
          task: values.belong_task,
          project: pid,
          task_type: this.state.key == "col_doc" ? 1 : 2
        };

        var socket = new WebSocket(
          "ws:" + window.location.host + "/aidsp/sktasksupload"
        );
        socket.onopen = function () {
          socket.send(JSON.stringify(data));
          console.log("WebSocket open"); //成功连接上Websocket
        };
        socket.onmessage = (e) => {
          console.log("message: " + e.data); //打印服务端返回的数据
          if (e.data.startsWith("提")) {
            message.loading({
              content: e.data,
              key: "new_taskSubmit",
              duration: null
            });
          } else if (e.data.startsWith("添加完成")) {
            this.per_fetch();
            message.success({ content: e.data, key: "new_taskSubmit" });
            Modal.success({
              title: "成功",
              content: e.data,
              onOk: () => {
                this.task_fetch();
              }
            });
            socket.onclose();
          } else {
            message.error({ content: e.data, key: "new_taskSubmit" });
            Modal.error({
              title: "错误",
              content: e.data
            });
            socket.onclose();
          }
        };
        socket.onclose = (e) => {
          console.log(e);
          message.info({ content: "连接关闭", key: "new_taskSubmit" });
          socket.close(); //关闭TCP连接
        };
        if (socket.readyState == WebSocket.OPEN) {
          socket.onopen();
        }
      }
      form.resetFields();
      this.setState({ taskVisible: false });
    });
  };

  //复制任务
  newcopytask(record) {
    return () => {
      confirm({
        title: "复制",
        icon: <ExclamationCircleOutlined />,
        content: "您确定要复制这个任务？",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          const _this = this;
          let data = new FormData();
          data.append("task_type", record.task_type);
          data.append("task_name", record.task_name);
          data.append("belong_task", record.belong_task);
          data.append("project", record.project);
          data.append("gross", record.gross);
          data.append("task_link", record.task_link);
          axios
            .post("/aidsp/project/newcopytask/", data)
            .then(function (res) {
              Modal.success({
                content: "提交成功",
                onOk() {}
              });
              _this.task_fetch();
            })
            .catch(function (error) {
              Modal.error({
                title: "错误" + error.response.status,
                content: error.response.statusText
              });
            });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    };
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  dissaveFormRef = (formRef) => {
    this.disformRef = formRef;
  };
  uploadsaveFormRef = (formRef) => {
    this.uploadformRef = formRef;
  };
  uploadOnchange = (info) => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    if (fileList[0] && fileList[0].status == "done") {
      fileList[0].name = fileList[0].response;
      fileList[0].url =
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/dataset/filedownload/" +
        fileList[0].response;
    }
    this.state.fileList = fileList;
    this.setState({ fileList });
  };
  // 选择查询日期
  dataPickerChange = (dataPickervalue) => {
    var YY = dataPickervalue.format("YYYY");
    var MM = dataPickervalue.format("MM");
    var DD = dataPickervalue.format("DD");
    var datadate = [YY, MM, DD];
    this.chart_fetch(datadate);
    this.setState({ dataPickervalue });
  };
  // 显示用户各小时分布工作量
  showDetail = (e) => {
    this.setState({ person_data: {} });
    var x = e.data._origin.assignee;
    this.setState({ nowPerson: x });
    var YY = this.state.dataPickervalue.format("YYYY");
    var MM = this.state.dataPickervalue.format("MM");
    var DD = this.state.dataPickervalue.format("DD");
    const _this = this;
    let formData = new FormData();
    formData.append("pid", this.pid);
    formData.append("user", x);
    formData.append("YY", YY);
    formData.append("MM", MM);
    formData.append("DD", DD);
    axios
      .post("/aidsp/workload/hoursinfo/", formData)
      .then(function (response) {
        let data = response.data;
        _this.setState({ person_data: data });
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({
      chartVisible: true
    });
  };
  chartHideModal = () => {
    this.setState({
      chartVisible: false,
      hoursShow: true
    });
  };
  // 显示小时用户工作量排行
  show_all_hours = (e) => {
    if (!this.state.hoursShow) {
      return;
    }
    this.setState({ hourPersonsInfo: {} });
    var x = e.data._origin.hour;
    this.setState({ nowHour: x });
    var YY = this.state.dataPickervalue.format("YYYY");
    var MM = this.state.dataPickervalue.format("MM");
    var DD = this.state.dataPickervalue.format("DD");
    const _this = this;
    let formData = new FormData();
    formData.append("pid", this.pid);
    formData.append("hour", x);
    formData.append("YY", YY);
    formData.append("MM", MM);
    formData.append("DD", DD);
    axios
      .post("/aidsp/workload/hourpersonsinfo/", formData)
      .then(function (response) {
        let data = response.data;
        _this.setState({ hourPersonsInfo: data });
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({
      chartVisible: true
    });
    this.setState({ hoursShow: false });
  };
  show_person_hours = (e) => {
    this.setState({ hoursShow: true });
  };
  handleSearch = (value) => {
    let result;
    if (!value || value.indexOf("@") >= 0) {
      result = [];
    } else {
      result = ["rectangle", "polygon", "polyline", "points"].map(
        (domain) => `${domain}_${value}`
      );
    }
    this.setState({ result });
  };
  //任务标准修改
  task_standard_post = (e) => {
    message.loading({
      content: "提交中。。。",
      key: "task_standard_post",
      duration: null
    });
    let formData = new FormData();
    formData.append("pid", this.pid);
    formData.append("standard", e.toString());
    axios
      .post("/aidsp/taskstandardpost/", formData)
      .then(function (response) {
        let data = response.data;
        message.success({
          content: "提交成功",
          key: "task_standard_post"
        });
      })
      .catch(function (error) {
        console.log(error);
        message.error({
          content: "提交失败",
          key: "task_standard_post"
        });
      });
  };
  //点或图工作量显示切换
  picorpoi_onchange = (e) => {
    this.setState({ picorpoi: e.target.value });
  };
  //单任务工作量查询
  real_task_get = (txt) => {
    axios
      .get("/aidsp/workload/taskworkload/" + txt)
      .then(function (response) {
        let data = response.data;
        if ("info" in data) {
          Modal.info({
            title: "信息",
            content: data.info
          });
        } else {
          Modal.success({
            title: "查询成功",
            content:
              (data.current_workload
                ? "图片数：" + data.current_workload + "； "
                : "") +
              (data.current_points
                ? "点数：" + data.current_points + "； "
                : "")
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        Modal.error({
          title: "错误",
          content: "连接服务器失败"
        });
      });
  };
  render() {
    const { Search } = Input;
    const children = this.state.result.map((domain) => (
      <Option key={domain}>{domain}</Option>
    ));
    const { comments, submitting, value } = this.state;
    let adminbotton;
    if (this.state.data.is_admin) {
      adminbotton = (
        <div>
          <Button type="primary" href={"/aidsp/detail/" + this.pid}>
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
          <Breadcrumb.Item href="/aidsp/project">
            <Icon type="appstore" />
            <span>项目</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {this.state.data.project_id + "_" + this.state.data.project_name}
          </Breadcrumb.Item>
        </Breadcrumb>
        <br />
        {adminbotton}
        <Descriptions bordered title="详情">
          <Descriptions.Item label="项目名称" span={2}>
            {this.state.data.project_id + "_" + this.state.data.project_name}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            {
              <span>
                <Select
                  style={{ minWidth: 300 }}
                  value={this.state.data.status}
                  onChange={this.status_change}
                  disabled={!this.state.data.is_admin}
                >
                  <Option value="未开始">未开始</Option>
                  <Option value="准备中">准备中</Option>
                  <Option value="数据采集">数据采集</Option>
                  <Option value="数据标注">数据标注</Option>
                  <Option value="暂停">暂停</Option>
                  <Option value="完结">完结</Option>
                </Select>
              </span>
            }
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {new Date(this.state.data.create_time).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="结束时间">
            {this.state.data.end_time
              ? new Date(this.state.data.end_time).toLocaleString()
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="截止时间">
            {new Date(this.state.data.deadline).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="需求总量">
            {this.state.data.total_demand}
          </Descriptions.Item>
          <Descriptions.Item label="需求数量描述">
            {this.state.data.total_describe}
          </Descriptions.Item>

          <Descriptions.Item label="标签">
            {Array(this.state.data.labels).join("，")}
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            {Array(this.state.data.users_found).join("，")}
          </Descriptions.Item>
          <Descriptions.Item label="管理人">
            {Array(this.state.data.users_manager).join("，")}
          </Descriptions.Item>
          <Descriptions.Item label="参与人">
            <span>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                disabled={!this.state.data.is_admin}
                optionFilterProp="children"
                value={this.state.data.users_attend}
                onChange={this.attend_change}
                maxTagCount={3}
              >
                {this.state.Options}
              </Select>
              ,
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="本周工作量" height>
            <TextArea
              placeholder=""
              autoSize
              disabled={!this.state.data.is_admin}
              onBlur={this.nproject_post("quantity_week")}
              value={this.state.quantity_week_value}
              onChange={this.tquantity_week_onChange}
            />
          </Descriptions.Item>
          <Descriptions.Item label="任务描述">
            <TextArea
              placeholder=""
              autoSize
              disabled={!this.state.data.is_admin}
              onBlur={this.nproject_post("task_description")}
              value={this.state.task_description_value}
              onChange={this.task_description_onChange}
            />
          </Descriptions.Item>
          <Descriptions.Item label="预计完成时间">
            <DatePicker
              showTime
              placeholder="Select Time"
              value={
                this.state.expected_time ? moment(this.state.expected_time) : ""
              }
              onChange={this.expected_time_onChange}
              disabled={!this.state.data.is_admin}
              onOk={this.expected_time_post}
            />
          </Descriptions.Item>
        </Descriptions>
        <br />
        {this.state.data.status == "完结" ? (
          <Countdown title="剩余时间" format="已完结" />
        ) : new Date(this.state.data.deadline) > Date.now() ? (
          <Countdown
            title="剩余时间"
            value={this.state.data.deadline}
            format="D 天 H 时 m 分 s 秒"
          />
        ) : (
          <Countdown
            title="剩余时间"
            value={Date.now() * 2 - new Date(this.state.data.deadline)}
            format="D 天 H 时 m 分"
            prefix="-"
          />
        )}
        <br />
        <Card style={{ width: "100%" }} title="项目背景">
          <div
            dangerouslySetInnerHTML={{ __html: this.state.data["background"] }}
          />
        </Card>
        <br />

        <Descriptions bordered>
          <Descriptions.Item label="选择查询日期：">
            <DatePicker
              value={this.state.dataPickervalue}
              onChange={this.dataPickerChange}
            />
          </Descriptions.Item>
          <Descriptions.Item label="任务标准">
            <Select
              mode="tags"
              style={{ minWidth: 500 }}
              onSearch={this.handleSearch}
              onBlur={this.task_standard_post}
              disabled={!this.state.data.is_admin}
              value={this.state.task_standard ? this.state.task_standard : []}
              onChange={this.task_standard_onchane}
            >
              {children}
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="基础量">
            <Input
              onBlur={this.nproject_post("basic_quantity")}
              disabled={!this.state.data.is_admin}
              value={this.state.basic_quantity ? this.state.basic_quantity : ""}
              onChange={this.basic_quantity_onchange}
            ></Input>
          </Descriptions.Item>
          <Descriptions.Item label="任务量实时查询">
            <Search onSearch={this.real_task_get} enterButton />
          </Descriptions.Item>
          <Descriptions.Item />
          <Descriptions.Item />
        </Descriptions>
        <br />
        <Radio.Group
          value={this.state.picorpoi}
          onChange={this.picorpoi_onchange}
        >
          <Radio.Button value="pic">图片张数</Radio.Button>
          <Radio.Button value="poi">点数</Radio.Button>
        </Radio.Group>
        <br />

        <Modal
          visible={this.state.chartVisible}
          onCancel={this.chartHideModal}
          footer={null}
        >
          {this.state.hoursShow ? (
            <div>
              <Chart
                forceFit
                height={500}
                padding="50"
                data={this.state.person_data}
                scale={[
                  {
                    dataKey: "workload",
                    alias: "图片数"
                  },
                  {
                    dataKey: "pointsload",
                    alias: "点数"
                  }
                ]}
              >
                <ChartTooltip />
                <Axis />
                <Bar position="hour*workload" onClick={this.show_all_hours} />
                <Line position="hour*pointsload" />
                <Point position="hour*pointsload" />
              </Chart>
              <p>{this.state.nowPerson}</p>
            </div>
          ) : (
            <div>
              <Radio.Group
                value={this.state.picorpoi}
                onChange={this.picorpoi_onchange}
                size="small"
              >
                <Radio.Button value="pic">图片张数</Radio.Button>
                <Radio.Button value="poi">点数</Radio.Button>
              </Radio.Group>
              <br />
              <Chart
                forceFit
                height={400}
                data={
                  this.state.picorpoi == "pic"
                    ? this.state.hourPersonsInfo.picOrd
                    : this.state.hourPersonsInfo.poiOrd
                }
                scale={[
                  {
                    dataKey: "workload",
                    alias: "图片数"
                  },
                  {
                    dataKey: "pointsload",
                    alias: "点数"
                  }
                ]}
              >
                <Coord type="rect" direction="LB" />
                <ChartTooltip />
                <Axis dataKey="assignee" label={{ offset: 12 }} />
                <Bar
                  position={
                    this.state.picorpoi == "pic"
                      ? "assignee*workload"
                      : "assignee*pointsload"
                  }
                />
              </Chart>
              <p>{this.state.nowHour}</p>
              <Button onClick={this.show_person_hours}>返回</Button>
            </div>
          )}
        </Modal>
        <br />

        <Chart
          forceFit
          height={400}
          data={
            this.state.picorpoi == "pic"
              ? this.state.chartData.picOrd
              : this.state.chartData.poiOrd
          }
          scale={[
            {
              dataKey: "workload",
              alias: "图片数"
            },
            {
              dataKey: "pointsload",
              alias: "点数"
            }
          ]}
        >
          <Coord type="rect" direction="LB" />
          <ChartTooltip />
          <Axis dataKey="assignee" label={{ offset: 12 }} />
          <Bar
            position={
              this.state.picorpoi == "pic"
                ? "assignee*workload"
                : "assignee*pointsload"
            }
            onClick={this.showDetail}
          />
        </Chart>
        <br />
        <br />
        <Card
          style={{ width: "100%" }}
          title="文档"
          tabList={this.tabList}
          activeTabKey={this.state.key}
          onTabChange={(key) => {
            this.onTabChange(key, "key");
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.data[this.state.key]
            }}
          />
        </Card>
        <br />
        {this.state.key == "req_doc" ? (
          ""
        ) : (
          <div>
            {this.state.data.is_admin ? (
              <div>
                <Button type="primary" onClick={this.showTaskMoadl}>
                  {this.state.key == "col_doc"
                    ? "新建采集任务"
                    : "新建标注任务"}
                </Button>
                <Button
                  type="primary"
                  onClick={this.disshowTaskMoadl}
                  style={{ marginLeft: 20 }}
                >
                  批量分配任务
                </Button>


                <Button
                  type="primary"
                  onClick={this.uploadshowTaskMoadl}
                  style={{ marginLeft: 20 }}
                >
                  上传任务zip
                </Button>

                <br />
              </div>
            ) : (
              ""
            )}
            <br />
            {(this.state.key == "col_doc"
              ? this.state.perdata.all_percentage1
              : this.state.perdata.all_percentage2) && (
              <div>
                <br />
                <Tooltip
                  title={
                    (this.state.key == "col_doc"
                      ? this.state.perdata.all_percentage1
                      : this.state.perdata.all_percentage2
                    ).quantity_available +
                    "/" +
                    (this.state.key == "col_doc"
                      ? this.state.perdata.all_percentage1
                      : this.state.perdata.all_percentage2
                    ).current_workload +
                    "/" +
                    (this.state.key == "col_doc"
                      ? this.state.perdata.all_percentage1
                      : this.state.perdata.all_percentage2
                    ).gross
                  }
                >
                  <Progress
                    percent={
                      ((this.state.key == "col_doc"
                        ? this.state.perdata.all_percentage1
                        : this.state.perdata.all_percentage2
                      ).current_workload /
                        (this.state.key == "col_doc"
                          ? this.state.perdata.all_percentage1
                          : this.state.perdata.all_percentage2
                        ).gross) *
                      100
                    }
                    successPercent={
                      ((this.state.key == "col_doc"
                        ? this.state.perdata.all_percentage1
                        : this.state.perdata.all_percentage2
                      ).quantity_available /
                        (this.state.key == "col_doc"
                          ? this.state.perdata.all_percentage1
                          : this.state.perdata.all_percentage2
                        ).gross) *
                      100
                    }
                    status="active"
                    showInfo={false}
                  />
                </Tooltip>
                <br />
              </div>
            )}
            {this.state.task_data ? (
              <Collapse>
                {Object.entries(this.state.task_data).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      {item[0].indexOf("_pick") != -1 && (
                        <Button
                          type="primary"
                          href={"/aidsp/project/picright/" + item[0] + "/"}
                        >
                          导出结果
                        </Button>
                      )}
                      <Tooltip
                        title={
                          this.state.perdata.each_percentage[item[0]]
                            .quantity_available +
                          "/" +
                          this.state.perdata.each_percentage[item[0]]
                            .current_workload +
                          "/" +
                          this.state.perdata.each_percentage[item[0]].gross
                        }
                      >
                        <Progress
                          percent={
                            (this.state.perdata.each_percentage[item[0]]
                              .current_workload /
                              this.state.perdata.each_percentage[item[0]]
                                .gross) *
                            100
                          }
                          successPercent={
                            (this.state.perdata.each_percentage[item[0]]
                              .quantity_available /
                              this.state.perdata.each_percentage[item[0]]
                                .gross) *
                            100
                          }
                          status="active"
                          showInfo={false}
                        />
                      </Tooltip>

                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            ) : (
              <Spin size="large" />
            )}

            <br />
            {this.state.taskVisible && (
              <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.taskVisible}
                onCancel={this.cancelTaskMoadl}
                onCreate={this.new_taskSubmit}
                onChange={this.uploadOnchange}
                fileList={this.state.fileList}
              />
            )}
            <br />

            <br />
            <DisCollectionCreateForm
              wrappedComponentRef={this.dissaveFormRef}
              visible={this.state.distaskVisible}
              onCancel={this.discancelTaskMoadl}
              onCreate={this.taskSubmit}
              onChange={this.uploadOnchange}
              fileList={this.state.fileList}
            />

            <br />
            <br />
            <UploadCollectionCreateForm
              wrappedComponentRef={this.uploadsaveFormRef}
              visible={this.state.uploadtaskVisible}
              onCancel={this.uploadcancelTaskMoadl}
              onCreate={this.upload_taskSubmit}
              onChange={this.uploadOnchange}
              fileList={this.state.fileList}
            />

            <br />
          </div>
        )}

        {comments.length > 0 && <CommentList comments={comments} />}

        <Comment
          avatar={<Avatar src={qjpg} />}
          content={
            <Editor
              onChange={this.handleEditorChange}
              onSubmit={this.handleQASubmit}
              submitting={submitting}
              value={this.state.editorState}
            />
          }
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById("container"));
