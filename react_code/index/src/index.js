import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import {
  Layout,
  Menu,
  Icon,
  Table,
  Tag,
  Button,
  Input,
  Tabs,
  Card,
  Collapse,
  Modal,
  Select,
  Tooltip,
  Radio,
  Divider,
  InputNumber,
  message,
  Badge,
  Typography,
  List,
  Col,
  DatePicker
} from "antd";
import { Slider as AntdSlider } from "antd";
import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Highlighter from "react-highlight-words";
import reqwest from "reqwest";
import moment from "moment"; // 时间插件
import qs from "qs";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Chart,
  Tooltip as ChartTooltip,
  Axis,
  Bar,
  Coord,
  Line,
  Point
} from "viser-react";

const { SubMenu } = Menu;
const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;
//项目页面
class App extends React.Component {
  // 搜索功能
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });
  columns_proj = [
    {
      title: "",
      dataIndex: "project_id",
      ...this.getColumnSearchProps("project_id"),
      render: (text, record) => <p></p>,
      width: 20
    },
    {
      title: "项目名",
      dataIndex: "project_name",
      sorter: (a, b) =>
        a.project_name.charCodeAt() - b.project_name.charCodeAt(),
      ...this.getColumnSearchProps("project_name"),
      render: (text, record) => (
        <a onClick={this.showModal} href={"display/" + record.id}>
          {record.project_id + "_" + text}
        </a>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      filters: [
        {
          text: "未开始",
          value: "未开始"
        },
        {
          text: "准备中",
          value: "准备中"
        },
        {
          text: "数据采集",
          value: "数据采集"
        },
        {
          text: "数据标注",
          value: "数据标注"
        },
        {
          text: "暂停",
          value: "暂停"
        },
        {
          text: "完结",
          value: "完结"
        }
      ],
      onFilter: (value, record) => record.status.indexOf(value) == 0
    },
    {
      title: "创建日期",
      dataIndex: "create_time",
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
      render: (text, record) =>
        record.create_time ? new Date(record.create_time).toLocaleString() : ""
    },
    {
      title: "剩余时间",
      dataIndex: "remaining_time",
      sorter: (a, b) =>
        (a.remaining_time != "已结束"
          ? a.remaining_time.split("天")[0]
          : 9999) -
        (b.remaining_time != "已结束" ? b.remaining_time.split("天")[0] : 9999)
    },
    {
      title: "标签",
      dataIndex: "labels",
      sorter: (a, b) => a.labels.length - b.labels.length,
      render: (labels) => (
        <span>
          {labels.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      )
    },
    {
      title: "创建人",
      dataIndex: "users_found",
      render: (users_found) => (
        <span>
          {users_found.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      )
    },
    {
      title: "管理人",
      dataIndex: "users_manager",
      render: (users_manager) => (
        <span>
          {users_manager.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      )
    },
    {
      title: "参与人",
      width: 220,
      dataIndex: "users_attend",
      render: (users_attend) => (
        <span>
          {users_attend.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      )
    },
    {
      title: "本周工作量",
      dataIndex: "quantity_week",
      sorter: (a, b) =>
        (a.quantity_week ? a.quantity_week.length : 0) -
        (b.quantity_week ? b.quantity_week.length : 0),
      ellipsis: true
    },
    {
      title: "任务描述",
      dataIndex: "task_description",
      sorter: (a, b) =>
        (a.task_description ? a.task_description.length : 0) -
        (b.task_description ? b.task_description.length : 0),
      ellipsis: true
    },
    {
      title: "预计完成时间",
      dataIndex: "expected_time",
      sorter: (a, b) => new Date(a.expected_time) - new Date(b.expected_time),
      render: (text, record) =>
        record.expected_time
          ? new Date(record.expected_time).toLocaleString()
          : ""
    }
  ];
  columns_pers = [
    {
      title: "",
      dataIndex: "project_id",
      ...this.getColumnSearchProps("project_id"),
      render: (text, record) => <p></p>,
      width: 1
    },
    {
      title: "项目名",
      dataIndex: "project_name",
      sorter: (a, b) =>
        (a.project_name != "空闲" ? a.project_name.charCodeAt() : "k") -
        (b.project_name != "空闲" ? b.project_name.charCodeAt() : "k"),
      ...this.getColumnSearchProps("project_name"),
      render: (text, record) =>
        record.project_name != "空闲" ? (
          <a onClick={this.showModal} href={"display/" + record.id}>
            {record.project_id + "_" + text}
          </a>
        ) : (
          <a>空闲</a>
        )
    },
    {
      title: "状态",
      dataIndex: "status",
      filters: [
        {
          text: "未开始",
          value: "未开始"
        },
        {
          text: "准备中",
          value: "准备中"
        },
        {
          text: "数据采集",
          value: "数据采集"
        },
        {
          text: "数据标注",
          value: "数据标注"
        },
        {
          text: "暂停",
          value: "暂停"
        },
        {
          text: "完结",
          value: "完结"
        }
      ],
      onFilter: (value, record) => record.status.indexOf(value) != -1,
      render: (text, record) => (record.project_name != "空闲" ? text : "")
    },
    {
      title: "创建日期",
      dataIndex: "create_time",
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
      render: (text, record) =>
        record.create_time ? new Date(record.create_time).toLocaleString() : ""
    },
    {
      title: "剩余时间",
      dataIndex: "remaining_time",
      sorter: (a, b) =>
        (a.remaining_time
          ? a.remaining_time != "已结束"
            ? a.remaining_time.split("天")[0]
            : 9999
          : "k") -
        (b.remaining_time
          ? b.remaining_time != "已结束"
            ? b.remaining_time.split("天")[0]
            : 9999
          : "k")
    },
    {
      title: "正在进行人员",
      dataIndex: "now_person",
      render: (users_manager) => (
        <span>
          {users_manager.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      ),
      sorter: (a, b) =>
        (a.now_person ? a.now_person.length : 0) -
        (b.now_person ? b.now_person.length : 0)
    }
  ];
  state = {
    loading: false,
    visible: false,
    searchText: "",
    searchedColumn: "",
    data: [],
    sta: "proj"
  };
  // 搜索按钮
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };
  // 搜索重置按钮
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  showModal() {}

  componentDidMount() {
    this.fetch();
  }
  // 获取项目基本信息
  fetch = (params = {}) => {
    console.log("params:", params);
    this.setState({ loading: true });
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/project/?format=json",

      method: "get"
    }).then((data) => {
      this.setState({ data: data });
      this.setState({ loading: false });
    });
  };
  staChange = (e) => {
    this.setState({
      sta: e.target.value
    });
  };
  
  //清空本周工作量
  rm_workload = (e) => {
    confirm({
      title: "确定",
      icon: <ExclamationCircleOutlined />,
      content: "您确定要清空本周工作量？",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        message.loading({
          content: "提交中。。。",
          key: "rm_workload",
          duration: null
        });
        reqwest({
          url: "/aidsp/workloadrm",
          method: "get"
        }).then((res) => {
          if (res == "清空完毕！") {
            message.success({ content: "清空完毕!", key: "rm_workload" });
            this.fetch();
          } else {
            message.info({ content: res, key: "rm_workload" });
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  render() {
    const { sta } = this.state;
    return (
      <div>
        <Button
          href="newproject"
          type="primary"
          style={{ float: "left", marginRight: "20px" }}
        >
          新建项目
        </Button>
        <Radio.Group value={sta} onChange={this.staChange}>
          <Radio.Button value="proj">项目详情</Radio.Button>
          <Radio.Button value="pers">人员状态</Radio.Button>
        </Radio.Group>
        <Button style={{ marginLeft: "20px" }} onClick={this.rm_workload}>
          清空本周工作量
        </Button>

        <br />
        <br />
        {this.state.sta == "proj" ? (
          <Table
            style={{ width: 2000, overflowX: "auto" }}
            columns={this.columns_proj}
            dataSource={this.state.data.filter(
              (item) => item.project_name != "空闲"
            )}
            rowKey={(record) => record.id}
            loading={this.state.loading}
          />
        ) : (
          <Table
            columns={this.columns_pers}
            dataSource={this.state.data}
            rowKey={(record) => record.id}
            loading={this.state.loading}
          />
        )}
      </div>
    );
  }
}
//数据集页面
class DataSetApp extends React.Component {
  state = {
    loading: false,
    visible: false,
    searchText: "",
    searchedColumn: "",
    data: []
  };
  //搜索功能
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });
  //搜索按钮
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };
  //筛选重置按钮
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  showModal() {}
  columns = [
    {
      ...this.getColumnSearchProps("name"),
      render: (text, record) => (
        <a href={"dataset_display/" + record.id}>{record.name}</a>
      ),
      title: "数据集名称",
      dataIndex: "name",
      sorter: (a, b) => a.name.charCodeAt() - b.name.charCodeAt()
    },
    {
      title: "所属项目",
      dataIndex: "project"
    },
    {
      title: "数据集描述",
      dataIndex: "describe",
      ellipsis: true
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time),
      render: (text, record) => new Date(record.create_time).toLocaleString()
    },
    {
      title: "更新时间",
      dataIndex: "update_time",
      sorter: (a, b) => new Date(a.update_time) - new Date(b.update_time),
      render: (text, record) => new Date(record.update_time).toLocaleString()
    },
    {
      title: "数量详情",
      dataIndex: "quantity_detials"
    }
  ];

  componentDidMount() {
    this.fetch();
  }
  //数据集信息获取
  fetch = (params = {}) => {
    console.log("params:", params);
    this.setState({ loading: true });
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/dataset/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({ data: data });
      this.setState({ loading: false });
    });
  };
  render() {
    return (
      <div>
        <Button href="newdataset" type="primary">
          新建数据集
        </Button>
        <br />
        <br />

        <Table
          columns={this.columns}
          dataSource={this.state.data}
          rowKey={(record) => record.id}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
//个人页面
class Personal extends React.Component {
  state = {
    data: {}
  };

  assignee_change(id, is_admin) {
    return (e) => {
      if (is_admin) {
        message.loading({ content: "提交中。。。", key: "assignee_change" });

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
            body: qs.stringify({ assignee: e ? e.toString() : [], id: id })
          }
        ).then((res) => {
          if (res.status == 201 || res.status == 200) {
            this.fetch();
            message.success({ content: "提交成功!", key: "assignee_change" });
          } else {
            message.error({
              content: "错误" + res.status + " 提交失败",
              key: "assignee_change"
            });
          }
        });
      }
    };
  }
  reviewer_change(id, is_admin) {
    return (e) => {
      if (is_admin) {
        message.loading({ content: "提交中。。。", key: "reviewer_change" });

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
            body: qs.stringify({ reviewer: e ? e.toString() : [], id: id })
          }
        ).then((res) => {
          if (res.status == 201 || res.status == 200) {
            this.fetch();
            message.success({ content: "提交成功!", key: "reviewer_change" });
          } else {
            message.error({
              content: "错误" + res.status + " 提交失败",
              key: "reviewer_change"
            });
          }
        });
      }
    };
  }
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
          message.loading({ content: "提交中。。。", key: "taskStatusChange" });

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
              this.fetch();
              message.success({
                content: "提交成功!",
                key: "taskStatusChange"
              });
            } else {
              message.error({
                content: "错误" + res.status + " 提交失败",
                key: "taskStatusChange"
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

  //有效工作量修改
  quantity_available_change(task_id) {
    return ({ target: { value } }) => {
      if (value) {
        message.loading({ content: "提交中。。。", key: "quantity_available" });
        fetch("/aidsp/project/tasks_change/" + task_id + "/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: qs.stringify({ id: task_id, quantity_available: value })
        }).then((res) => {
          if (res.status == 201 || res.status == 200) {
            this.fetch();
            message.success({
              content: "提交成功!",
              key: "quantity_available"
            });
          } else {
            message.error("错误" + res.status);
          }
        });
      }
    };
  }

  // 未通过信息修改
  error_info_change(task_id) {
    return ({ target: { value } }) => {
      if (value) {
        message.loading({ content: "提交中。。。", key: "error_info_change" });
        fetch("/aidsp/project/tasks_change/" + task_id + "/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: qs.stringify({ id: task_id, error_info: value })
        }).then((res) => {
          if (res.status == 201 || res.status == 200) {
            this.fetch();
            message.success({ content: "提交成功!", key: "error_info_change" });
          } else {
            message.error("错误" + res.status);
          }
        });
      }
    };
  }
  componentDidMount() {
    this.fetch();
  }

  //用户获取
  fetch = (params = {}) => {
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
        "/aidsp/project/personal_tasks/",
      method: "get"
    }).then((data) => {
      this.setState({ data: data });
    });
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
      dataIndex: "quantity_available",
      render: (text, record) =>
        record.is_admin && record.status == "通过" ? (
          <InputNumber
            value={record.quantity_available}
            onBlur={this.quantity_available_change(record.id)}
          />
        ) : (
          record.quantity_available
        )
    },
    {
      title: "状态",
      dataIndex: "status"
    },
    {
      title: "未通过理由",
      width: 500,
      dataIndex: "error_info",
      render: (text, record) =>
        record.is_admin ? (
          <TextArea
            placeholder=""
            autoSize
            defaultValue={record.error_info}
            onBlur={this.error_info_change(record.id)}
          />
        ) : (
          record.error_info
        )
    },
    {
      title: "审核次数",
      dataIndex: "number_of_reviews",
      sorter: (a, b) => a.number_of_reviews - b.number_of_reviews
    },
    {
      title: "标注员",
      dataIndex: "assignee",
      render: (text, record) => (
        <span>
          <Select
            mode="multiple"
            optionFilterProp="children"
            style={{ width: "100%" }}
            value={record.assignee}
            disabled={true}
            onChange={this.assignee_change(record.id, record.is_admin)}
          >
            {this.state.Options}
          </Select>
          ,
        </span>
      )
    },
    {
      title: "审核员",
      dataIndex: "reviewer",
      render: (text, record) => (
        <span>
          <Select
            mode="multiple"
            optionFilterProp="children"
            style={{ width: "100%" }}
            value={record.reviewer}
            disabled={true}
            onChange={this.reviewer_change(record.id, record.is_admin)}
          >
            {this.state.Options}
          </Select>
          ,
        </span>
      )
    },
    {
      title: "操作",
      dataIndex: "",
      render: (text, record) => (
        <div>
          {!record.is_admin &&
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
          {!record.is_admin && record.status == "正在进行" ? (
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
          {!record.is_admin &&
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
          {record.is_admin && record.status == "待审核" ? (
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
          {record.is_admin && record.status == "待审核" ? (
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
        </div>
      )
    }
  ];

  //待审核数量计算
  reviewer_done_count = (e) => {
    let count = 0;
    if (this.state.data.reviewer) {
      for (let i in this.state.data.reviewer["2"]) {
        count = count + this.state.data.reviewer["2"][i].length;
      }
      return count;
    }
    return count;
  };
  //未通过数量计算
  assignee_not_pass_count = (e) => {
    let count = 0;
    if (this.state.data.assignee) {
      for (let i in this.state.data.assignee["4"]) {
        count = count + this.state.data.assignee["4"][i].length;
      }
      return count;
    }
    return count;
  };
  render() {
    return (
      <div>
        <Card title="审核任务" style={{ width: "100%" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="未开始" key="0">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.reviewer["0"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="正在进行" key="1">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.reviewer["1"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane
              tab={
                <Badge count={this.reviewer_done_count()}>
                  <span>待审核</span>
                </Badge>
              }
              key="2"
            >
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.reviewer["2"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="未通过" key="4">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.reviewer["4"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="通过" key="3">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.reviewer["3"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
          </Tabs>
        </Card>
        <br />
        <Card title="标注任务" style={{ width: "100%" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="未开始" key="0">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.assignee["0"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="正在进行" key="1">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.assignee["1"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="待审核" key="2">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.assignee["2"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane
              tab={
                <Badge count={this.assignee_not_pass_count()}>
                  <span>未通过</span>
                </Badge>
              }
              key="4"
            >
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.assignee["4"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
            <TabPane tab="通过" key="3">
              <Collapse>
                {Object.entries(
                  this.state.data.reviewer ? this.state.data.assignee["3"] : {}
                ).map((item, index) => {
                  return (
                    <Panel header={item[0]} key={index}>
                      <Table columns={this.columns} dataSource={item[1]} />
                    </Panel>
                  );
                })}
              </Collapse>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

const input = "# This is a header\n\nAnd this is a paragraph";
// 文档页面
class DocList extends React.Component {
  state = {
    data: [],
    mdDetail: "",
    showWhat: 0,
    nowdoc: ""
  };

  componentDidMount() {}
  //显示文档
  showMD = (e) => {
    this.setState({ nowdoc: e });
    reqwest({
      url: "/aidsp/doc/" + e,
      method: "get"
    }).then((data) => {
      this.setState({ mdDetail: data });
    });
    this.setState({ showWhat: 1 });
  };
  returnList = (e) => {
    this.setState({ showWhat: 0 });
  };
  render() {
    return (
      <div className="demo-infinite-container">
        {this.state.showWhat == 0 && (
          <List
            itemLayout="horizontal"
            dataSource={this.state.data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<a onClick={this.showMD.bind(this, item)}>{item}</a>}
                />
              </List.Item>
            )}
          />
        )}
        {this.state.showWhat == 1 && (
          <div>
            <Button onClick={this.returnList}>返回</Button>
            <br />
            <br />

            <div
              onCopy={(e) => e.preventDefault()}
              dangerouslySetInnerHTML={{ __html: this.state.mdDetail }}
            />
          </div>
        )}
      </div>
    );
  }
}

// 团队日报页面
class DailyApp extends React.Component {
  state = {
    dataPickervalue: moment(),
    data: [],
    chartVisible: false,
    hoursShow: true,
    person_data: {},
    picorpoi: "pic"
  };

  //日期修改
  dataPickerChange = (dataPickervalue) => {
    var YY = dataPickervalue.format("YYYY");
    var MM = dataPickervalue.format("MM");
    var DD = dataPickervalue.format("DD");
    var datadate = [YY, MM, DD];
    this.data_fetch(datadate);
    this.setState({ dataPickervalue });
  };

  //日报信息获取
  data_fetch = (e) => {
    const _this = this;
    let formData = new FormData();
    formData.append("YY", e[0]);
    formData.append("MM", e[1]);
    formData.append("DD", e[2]);
    axios
      .post("/aidsp/workload/dailyinfo/", formData)
      .then(function (response) {
        let data = response.data;
        _this.setState({ data: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //最近更新时间获取
  updated_time_fetch = (e) => {
    const _this = this;
    axios
      .get("/aidsp/workload/getupdatedtime")
      .then(function (response) {
        let data = response.data;
        _this.setState({ updated_time: data.updated_time });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  componentDidMount() {
    var YY = moment().format("YYYY");
    var MM = moment().format("MM");
    var DD = moment().format("DD");
    var datadate = [YY, MM, DD];
    this.data_fetch(datadate);
    this.updated_time_fetch();
  }

  //获取日报
  showDetail = (e) => {
    this.setState({ person_data: {} });
    var x = e.name;
    this.setState({ nowPerson: x });
    var YY = this.state.dataPickervalue.format("YYYY");
    var MM = this.state.dataPickervalue.format("MM");
    var DD = this.state.dataPickervalue.format("DD");
    const _this = this;
    let formData = new FormData();
    this.pid = e.pid;
    this.project = e.project;
    this.basic_quantity = e.basic_quantity;
    formData.append("pid", e.pid);
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
  // 显示小时排行
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
  columns = [
    {
      title: "姓名",
      width: 100,
      dataIndex: "name",
      sorter: (a, b) =>
        String(a.name ? a.name : " ").localeCompare(
          String(b.name ? b.name : " "),
          "zh"
        )
    },
    {
      title: "任务详情",
      dataIndex: "taskInfo",
      render: (text, record) =>
        record.taskInfo.map((Item) => {
          return (
            <span>
              <a href={"/aidsp/display/" + Item.project_id} target="_blank">
                {Item.project}
              </a>
              ：
              <a
                onClick={this.showDetail.bind(this, {
                  name: record.name,
                  pid: Item.project_id,
                  project: Item.project,
                  basic_quantity: Item.basic_quantity
                })}
              >
                {Item.workload}
              </a>
              ；
            </span>
          );
        })
    }
  ];
  
  //开启定时任务
  start_sdc = (e) => {
    message.loading({ content: "请求中...", key: "start_sdc", duration: 0 });
    const _this = this;
    axios
      .get("/aidsp/workload/scdenable")
      .then(function (response) {
        if (response.data == "定时任务开启完成") {
          message.success({ content: response.data, key: "start_sdc" });
          _this.setState({ dataPickervalue: moment() });
          _this.componentDidMount();
        } else {
          message.info({ content: response.data, key: "start_sdc" });
        }
      })
      .catch(function (error) {
        message.error({ content: error.response.data, key: "start_sdc" });
      });
  };

  //点或图数量显示切换
  picorpoi_onchange = (e) => {
    this.setState({ picorpoi: e.target.value });
  };

  //立即更新按钮
  real_time_job = (e) => {
    message.loading({
      content: "请求中...",
      key: "real_time_job",
      duration: 0
    });
    const _this = this;
    axios
      .get("/aidsp/workload/realtimejob")
      .then(function (response) {
        message.success({ content: response.data, key: "real_time_job" });
        _this.setState({ dataPickervalue: moment() });
        _this.componentDidMount();
      })
      .catch(function (error) {
        message.error({ content: error.response.data, key: "real_time_job" });
      });
  };
  render() {
    return (
      <div>
        <DatePicker
          value={this.state.dataPickervalue}
          onChange={this.dataPickerChange}
        />
        <Button
          type="primary"
          style={{ marginLeft: "20px" }}
          onClick={this.start_sdc}
        >
          启动定时任务
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "20px", marginRight: "20px" }}
          onClick={this.real_time_job}
        >
          立即更新查询
        </Button>
        <Text code>最后更新时间:</Text>
        {this.state.updated_time}
        <br />
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
              <div>
                <p style={{ float: "left" }}>{this.state.nowPerson}</p>
                <p style={{ float: "right" }}>
                  {"\t\t\t基础量：" + this.basic_quantity}
                </p>
              </div>
              <br />
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
              <div>
                <p style={{ float: "left" }}>
                  {this.project + " " + this.state.nowHour}
                </p>
                <p style={{ float: "right" }}>
                  {"\t\t\t基础量：" + this.basic_quantity}
                </p>
              </div>
              <br />
              <br />
              <Button onClick={this.show_person_hours}>返回</Button>
            </div>
          )}
        </Modal>
        <Table columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }
}

const { Header, Sider, Content } = Layout;

//主页面
class SiderDemo extends React.Component {
  state = {
    main_show: Personal,
    collapsed: false,
    silderValue: [1],
    current: window.location.pathname
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  menuSelect = (e) => {
    if (e.key == "/aidsp/project") {
      this.setState({ main_show: App });
    }
    if (e.key == "/aidsp/dataset") {
      this.setState({ main_show: DataSetApp });
    }
    if (e.key == "/aidsp/personal") {
      this.setState({ main_show: Personal });
    }
    if (e.key == "/aidsp/daily") {
      this.setState({ main_show: DailyApp });
    }
  };

  pagechange = (key) => {
    if (key == "/aidsp/project") {
      this.setState({ main_show: App });
    }
    if (key == "/aidsp/dataset") {
      this.setState({ main_show: DataSetApp });
    }
    if (key == "/aidsp/personal") {
      this.setState({ main_show: Personal });
    }
    if (key == "/aidsp/daily") {
      this.setState({ main_show: DailyApp });
    }
  };
  componentDidMount() {
    this.pagechange(window.location.pathname);
    reqwest({
      url: "/aidsp/doclist",
      method: "get"
    }).then((data) => {
      this.setState({ meaulist: data });
    });
  }
  tit_ref = (e) => {
    this.setState({ main_show: this.state.main_show.split("#")[0] + e });
  };
  getMenuNodes = (menuList) => {
    return menuList.map((item) => {
      return (
        <SubMenu
          title={<a href={"#" + item.title}>{item.title}</a>}
          onTitleClick={this.tit_ref.bind(
            this,
            "#" + item.title.replace(/[.]/g, "").replace(/[ ]/g, "-")
          )}
        >
          {this.getMenuNodes(item.children)}
        </SubMenu>
      );
      // }
    });
  };

  // 禁用复制
  ban_copy = (e) => {
    let iframeDom = document.getElementById("myiframe").contentWindow.document;
    if (iframeDom.all) {
      iframeDom.onselectstart = function () {
        return false;
      }; //for ie
    } else {
      iframeDom.onmousedown = function () {
        return false;
      };
      iframeDom.onmouseup = function () {
        return true;
      };
    }
    iframeDom.onselectstart = new Function("event.returnValue=false;");
  };
  
  //显示文档
  showMD = (e) => {
    this.setState({
      main_show: "/aidsp/static/" + e.key + ".html",
      current: null
    });
    setTimeout(this.ban_copy, 1000);
  };

  silderOnChange = (value) => {
    let iframeDom = document.getElementById("myiframe").contentWindow.document;
    iframeDom.body.style.zoom = value[0];
    if (isNaN(value)) {
      return;
    }
    this.setState({
      silderValue: value
    });
  };

  //缩小
  zoomOut = (e) => {
    var x = this.state.silderValue;
    x[0] = x[0] - 0.01;
    this.setState({ silderValue: x });
  };

  //放大
  zoomIn = (e) => {
    var x = this.state.silderValue;
    x[0] = x[0] + 0.01;
    this.setState({ silderValue: x });
  };
  marks = {
    0.5: {
      onclick: this.aa,
      label: <Icon type="zoom-out" onClick={this.zoomOut} />
    },
    2: {
      onclick: this.aa,
      label: <Icon type="zoom-in" onClick={this.zoomIn} />
    }
  };
  handleClick = (e) => {
    this.setState({
      current: e.key
    });
  };
  render() {
    // const pathName = window.location.pathname;
    return (
      <BrowserRouter>
        <Layout
          style={{
            minHeight: "100vh",
            height: "100%",
            width: "100%",
            border: "1px",
            position: "fixed",
            left: 0,
            top: 0
          }}
        >
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">
              <h1
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  fontSize: "20px"
                }}
              >
                {!this.state.collapsed ? "数据集生产管理" : ""}
              </h1>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              // defaultSelectedKeys={[pathName]}
              selectedKeys={[this.state.current]}
              onSelect={this.menuSelect}
              onClick={this.handleClick}
            >
              <Menu.Item key="/aidsp/personal">
                <Link to="/aidsp/personal">
                  <Icon type="user" />
                  <span>个人</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="/aidsp/daily">
                <Link to="/aidsp/daily">
                  <Icon type="solution" />
                  <span>团队日报</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="/aidsp/project">
                <Link to="/aidsp/project">
                  <Icon type="appstore-o" />
                  <span>项目</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="/aidsp/dataset">
                <Link to="/aidsp/dataset">
                  <Icon type="appstore-o" />
                  <span>数据集</span>
                </Link>
              </Menu.Item>

              <SubMenu
                title={
                  <span>
                    <Icon type="file-text" />
                    <span>{"文档"}</span>
                  </span>
                }
              >
                {this.state.meaulist &&
                  Object.entries(this.state.meaulist).map((item) => {
                    return (
                      <SubMenu
                        title={
                          <span>
                            <span>{item[1].title}</span>
                          </span>
                        }
                        key={item[1].title}
                        mode="horizontal"
                        onTitleClick={this.showMD}
                      >
                        >{this.getMenuNodes(item[1].children)}
                      </SubMenu>
                    );
                  })}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
                style={{ float: "left" }}
              />
              <p style={{ color: "red", fontSize: "30px" }}>
                要么不标，要标就要标对， 理解清楚规则后再标，
                最新规则所有人及时同步！！
              </p>
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 280,
                overflowY: "auto"
              }}
            >
              {typeof this.state.main_show == "function" && (
                <this.state.main_show />
              )}
              {typeof this.state.main_show != "function" && (
                <div
                  style={{ height: "100%", width: "100%" }}
                  oncontextmenu={function () {
                    return false;
                  }}
                  onselectstart={function () {
                    return false;
                  }}
                >
                  <Col span={6} style={{ float: "right" }}>
                    <AntdSlider
                      range
                      min={0.5}
                      max={2}
                      onChange={this.silderOnChange}
                      step={0.01}
                      marks={this.marks}
                      value={this.state.silderValue}
                    />
                  </Col>
                  <iframe
                    id="myiframe"
                    src={this.state.main_show}
                    height={"100%"}
                    width={"100%"}
                    frameborder={0}
                  ></iframe>
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}
ReactDOM.render(<SiderDemo />, document.getElementById("container"));
