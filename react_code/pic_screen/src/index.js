import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import {
  Radio,
  Modal,
  InputNumber,
  Button,
  Typography,
  Icon,
  Tooltip,
  message
} from "antd";
import { Slider as AntdSlider } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Slider from "react-slick";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import qs from "qs";
const { Text } = Typography;
const { confirm } = Modal;

class PicScreen extends React.Component {
  state = {
    slideIndex: 0,
    marks: {},
    max: 0,
    imgshowdist: [],
    tf: "t",
    ModalCount: 100,
    visible: false,
    confirmLoading: false,
    data: [],
    finishMin: 0,
    finishMax: 100,
    task_data: []
  };
  componentWillMount() {
    // 拦截判断是否离开当前页面
    window.addEventListener("beforeunload", this.beforeunload);
  }
  componentWillUnmount() {
    // 销毁拦截判断是否离开当前页面
    window.removeEventListener("beforeunload", this.beforeunload);
  }
  beforeunload = (e) => {
    let confirmationMessage = "你确定离开此页面吗?";
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  //下一张事件
  next() {
    this.slider.slickNext();
    if (this.state.data) {
      let mmarks = this.state.marks;
      if (
        this.state.data[this.state.slideIndex].status === null &&
        this.state.data[this.state.slideIndex]
      ) {
        mmarks[this.state.slideIndex] =
          this.state.tf === "f"
            ? {
                style: {
                  color: "#DC143C"
                },
                label: <strong>×</strong>
              }
            : {
                style: {
                  color: "#3CB371"
                },
                label: <strong>√</strong>
              };
        this.state.data[this.state.slideIndex].status =
          this.state.tf === "f" ? 1 : 0;
      }
    }
  }

  //上一张事件
  previous() {
    this.slider.slickPrev();
  }

  componentWillUmount() {
    document.removeEventListener("keydown", this.handleEenterKey);
  }
  componentDidMount() {
    const _this = this;
    let data = new FormData();
    let belong_task = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
    data.append("belong_task", belong_task);
    axios
      .post("/aidsp/project/imgtaskget/", data)
      .then(function (response) {
        _this.setState({ task_data: response.data });
      })
      .catch(function (error) {
        Modal.error({
          title: "错误" + error.response.status,
          content: "无法获取当前所属任务",
          onOk: (e) => {
            e = null;
          }
        });
      });
    // }
  }

  //键盘快捷键
  handleKeyDown = (e) => {
    if (e.keyCode === 65) {
      this.previous();
    }
    if (e.keyCode === 68) {
      this.next();
    }
    if (e.keyCode === 83) {
      this.errorMark();
    }
  };


  //错误标记
  errorMark = (e) => {
    let mmarks = this.state.marks;
    let mdata = this.state.data;
    mmarks[this.state.slideIndex] =
      this.state.data[this.state.slideIndex].status !== 1
        ? {
            style: {
              color: "#DC143C"
            },
            label: <strong>×</strong>
          }
        : {
            style: {
              color: "#3CB371"
            },
            label: <strong>√</strong>
          };

    mdata[this.state.slideIndex].status =
      mdata[this.state.slideIndex].status === 1 ? 0 : 1;

    this.setState({ data: mdata, marks: mmarks });
  };

  //改变对错标记
  tfChange = (e) => {
    this.setState({ tf: e.target.value });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  //获取图片
  handleOk = () => {
    this.picSubmit();
    if (this.state.data.length == 0) {
      this.setState({
        confirmLoading: true
      });
      const _this = this;
      var taskname = window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 1
      ];
      var data = new FormData();
      data.append("count", this.state.ModalCount);
      axios
        .post("/aidsp/project/imgget/" + taskname + "/", data)
        .then(function (response) {
          let data = response.data;
          if (data.length != 0) {
            _this.setState({ data: data });
            let imgShow = [];
            for (let item of data) {
              imgShow.push(
                <img src={"/aidsp" + item["url"]} alt="" class="spic" />
              );
            }
            _this.setState({
              imgshowdist: imgShow,
              max: response.data.length - 1
            });

            if (
              _this.state.task_data.status == 0 ||
              _this.state.task_data.status == 5
            ) {
              fetch(
                window.location.protocol +
                  "//" +
                  window.location.host +
                  "/aidsp/project/tasks_change/" +
                  _this.state.task_data.id +
                  "/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: qs.stringify({
                    id: _this.state.task_data.id,
                    status: 1
                  })
                }
              ).then((res) => {
                if (res.status == 200) {
                  message.success({ content: "提交成功!" });
                  _this.componentDidMount();
                } else {
                  Modal.error({
                    title: "错误" + res.status,
                    content: "提交失败"
                  });
                }
              });
            }
          } else {
            Modal.info({
              title: "抱歉",
              content: "暂无更多图片"
            });
          }
          _this.setState({
            visible: false,
            confirmLoading: false
          });
        })
        .catch(function (error) {
          console.log(error);
          _this.setState({
            visible: false,
            confirmLoading: false
          });
        });
    }
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };
  ModalCountonChange = (value) => {
    this.setState({ ModalCount: value });
  };

  //提交图片
  picSubmit = () => {
    if (this.state.data.length != 0) {
      const _this = this;
      axios
        .post("/aidsp/project/imgpost/", this.state.data)
        .then(function (response) {
          Modal.success({
            content: "提交成功",
            onOk: () => {
              _this.setState({
                slideIndex: 0,
                marks: {},
                max: 0,
                imgshowdist: [],
                data: []
              });
              _this.child.componentDidMount();
              _this.componentDidMount();
            }
          });
        })
        .catch(function (error) {
          Modal.error({
            title: "错误" + error.response.status,
            content: error.response.statusText
          });
        });
    }
  };
  onRef = (ref) => {
    this.child = ref;
  };

  //改变任务状态
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
              message.success({ content: "提交成功!" });
              this.componentDidMount();
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
  render() {
    var settings = {
      infinite: false,
      dots: false,
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: () =>
        this.setState((state) => ({ updateCount: state.updateCount + 1 })),
      beforeChange: (current, next) => this.setState({ slideIndex: next })
    };
    const { visible, confirmLoading } = this.state;

    return (
      <div>
        <div onKeyDown={this.handleKeyDown}>
          <Text code style={{ fontSize: "20px" }}>
            {this.state.task_data.info}
          </Text>
          <br />
          <br />
          <p>当前: {this.state.slideIndex} </p>
          <AntdSlider
            onChange={(e) => this.slider.slickGoTo(e)}
            value={this.state.slideIndex}
            min={0}
            max={this.state.max}
            marks={this.state.marks}
          />
          <br />
          <Button
            className="button"
            onClick={this.previous}
            style={{ marginRight: 8 }}
          >
            上一张
          </Button>
          <Button
            className="button"
            onClick={this.next}
            style={{ marginRight: 8 }}
          >
            下一张
          </Button>
          <Radio.Group
            value={this.state.tf}
            onChange={this.tfChange}
            style={{ marginRight: 8 }}
          >
            <Radio.Button value="t">默认√</Radio.Button>
            <Radio.Button value="f">默认×</Radio.Button>
          </Radio.Group>
          <Button
            className="button"
            style={{ marginRight: 20 }}
            onClick={this.errorMark}
          >
            标记
          </Button>
          {(() => {
            if (this.state.data[this.state.slideIndex]) {
              switch (this.state.data[this.state.slideIndex].status) {
                case 1:
                  return (
                    <Icon
                      type="close-circle"
                      theme="twoTone"
                      twoToneColor="#DC143C "
                    />
                  );
                  break;
                case 0:
                  return (
                    <Icon
                      type="check-circle"
                      theme="twoTone"
                      twoToneColor="#3CB371 "
                    />
                  );
                  break;
                default:
                  return null;
              }
            }
          })()}
          <br />
          <br />
          <Button
            className="button"
            style={{ marginRight: 8 }}
            onClick={this.showModal}
          >
            获取图片
          </Button>
          <Modal
            title="获取图片"
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <InputNumber
              min={1}
              max={300}
              value={this.state.ModalCount}
              onChange={this.ModalCountonChange}
            />
          </Modal>
          <Button
            className="button"
            style={{ marginRight: 20 }}
            onClick={this.picSubmit}
          >
            提交
          </Button>

          {this.state.task_data.status == "0" ||
          this.state.task_data.status == "5" ? (
            <Tooltip title="开始">
              <Icon
                type="play-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(this.state.task_data.id, 1)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.task_data.status == "1" ? (
            <Tooltip title="暂停">
              <Icon
                type="pause-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(this.state.task_data.id, 5)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          {this.state.task_data.status == "1" ||
          this.state.task_data.status == "4" ? (
            <Tooltip title="提交审核">
              <Icon
                type="plus-circle"
                theme="twoTone"
                onClick={this.taskStatusChange(this.state.task_data.id, 2)}
                style={{ marginRight: "5px" }}
              />
            </Tooltip>
          ) : (
            ""
          )}
          <br />
          <br />
          <Slider
            style={{ width: "600px" }}
            ref={(slider) => (this.slider = slider)}
            {...settings}
          >
            {this.state.imgshowdist}
          </Slider>
          <br />
          <br />

          <Text mark style={{ fontSize: "20px" }}>
            已完成图片
          </Text>
          <br />
          <br />
        </div>
        <div>
          <PicScreen_2 onRef={this.onRef} />
        </div>
      </div>
    );
  }
}
class PicScreen_2 extends React.Component {
  state = {
    slideIndex: 0,
    marks: {},
    max: 0,
    imgshowdist: [],
    ModalCount: 100,
    visible: false,
    confirmLoading: false,
    data: [],
    finishMin: 0,
    finishMax: 100,
    tfshow: "all",
    alldata: [],
    tdata: [],
    fdata: []
  };

  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  //下一张事件
  next() {
    if (this.state.slideIndex < this.state.data.length - 1) {
      this.slider.slickNext();
      if (this.state.slideIndex >= this.state.finishMax) {
        this.setState({
          finishMax: this.state.slideIndex + 1,
          finishMin: this.state.slideIndex - 99
        });
      }
      if (this.data) {
        let mmarks = this.state.marks;
        if (!mmarks[this.state.slideIndex]) {
          mmarks[this.state.slideIndex] =
            this.state.tf === "f"
              ? {
                  style: {
                    color: "#DC143C"
                  },
                  label: <strong>×</strong>
                }
              : {
                  style: {
                    color: "#3CB371"
                  },
                  label: <strong>√</strong>
                };
          this.data[this.state.slideIndex].status =
            this.state.tf === "f" ? 1 : 0;
        }
      }
    }
  }

  //上一站事件
  previous() {
    if (this.state.slideIndex !== 0) {
      this.slider.slickPrev();
      if (this.state.slideIndex <= this.state.finishMin) {
        this.setState({
          finishMax: this.state.slideIndex + 99,
          finishMin: this.state.slideIndex - 1
        });
      }
    }
  }

  componentWillUmount() {
    document.removeEventListener("keydown", this.handleEenterKey);
  }
  componentDidMount() {
    this.props.onRef(this);
    const _this = this;
    var taskname = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
    axios
      .get("/aidsp/project/imgfinish/" + taskname + "/")
      .then(function (response) {
        let data = response.data;
        if (data.length != 0) {
          _this.setState({
            data: data,
            alldata: data,
            tdata: data.filter((item) => item.status === 0),
            fdata: data.filter((item) => item.status === 1)
          });
          let imgShow = [];
          var i = 0;
          let mmarks = _this.state.marks;
          for (let item of data) {
            imgShow.push(
              <img src={"/aidsp" + item["url"]} alt="" class="spic" />
            );
            mmarks[i] =
              data[i].status === 1
                ? {
                    style: {
                      color: "#DC143C"
                    },
                    label: <strong>×</strong>
                  }
                : {
                    style: {
                      color: "#3CB371"
                    },
                    label: <strong>√</strong>
                  };
            i = i + 1;
          }
          _this.setState({
            imgshowdist: imgShow,
            finishMax:
              response.data.length > 100 ? 100 : response.data.length - 1,
            marks: mmarks
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //键盘快捷键
  handleKeyDown = (e) => {
    if (e.keyCode === 65) {
      this.previous();
    }
    if (e.keyCode === 68) {
      this.next();
    }
    if (e.keyCode === 83) {
      this.errorMark();
    }
  };


  //错误标记
  errorMark = (e) => {
    let mmarks = this.state.marks;
    let mdata = this.state.data;
    mmarks[this.state.slideIndex] =
      this.state.data[this.state.slideIndex].status !== 1
        ? {
            style: {
              color: "#DC143C"
            },
            label: <strong>×</strong>
          }
        : {
            style: {
              color: "#3CB371"
            },
            label: <strong>√</strong>
          };

    mdata[this.state.slideIndex].status =
      mdata[this.state.slideIndex].status === 1 ? 0 : 1;

    this.setState({ data: mdata, marks: mmarks });
  };

  //提交图片
  picSubmit = () => {
    const _this = this;
    axios
      .post("/aidsp/project/imgpost/", this.state.alldata)
      .then(function (response) {
        Modal.success({
          content: "提交成功",
          onOk() {}
        });
      })
      .catch(function (error) {
        Modal.error({
          title: "错误" + error.response.status,
          content: error.response.statusText
        });
      });
  };

  //拖动显示区域
  percentageOnChange = (value) => {
    if (this.state.data.length > 100) {
      if (
        value * 0.01 * (this.state.data.length - 100) >
        this.state.slideIndex
      ) {
        this.setState({
          slideIndex: parseInt(value * 0.01 * (this.state.data.length - 100))
        });
      }
      if (
        value * 0.01 * (this.state.data.length - 100) + 100 <
        this.state.slideIndex
      ) {
        this.setState({
          slideIndex: parseInt(
            value * 0.01 * (this.state.data.length - 100) + 100
          )
        });
      }
      this.setState({
        finishMin: parseInt(value * 0.01 * (this.state.data.length - 100)),
        finishMax: parseInt(value * 0.01 * (this.state.data.length - 100) + 100)
      });
    } else {
    }
  };

  //改变显示状态（全显示或只显示对或只显示错）
  showChange = (e) => {
    this.slider.slickGoTo("0");
    this.setState({ tfshow: e.target.value });
    var data;
    if (e.target.value === "all") {
      this.setState({ data: this.state.alldata });
      this.state.data = this.state.alldata;
    } else if (e.target.value === "cha") {
      this.setState({ data: this.state.fdata });
      this.state.data = this.state.fdata;
    } else if (e.target.value === "gou") {
      this.setState({ data: this.state.tdata });
      this.state.data = this.state.tdata;
    }
    let imgShow = [];
    var i = 0;
    let mmarks = this.state.marks;
    mmarks = [];
    data = this.state.data;
    for (let item of data) {
      imgShow.push(<img src={"/aidsp" + item["url"]} alt="" class="spic" />);
      mmarks[i] =
        data[i].status === 1
          ? {
              style: {
                color: "#DC143C"
              },
              label: <strong>×</strong>
            }
          : {
              style: {
                color: "#3CB371"
              },
              label: <strong>√</strong>
            };
      i = i + 1;
    }
    this.setState({
      imgshowdist: imgShow,
      finishMin: 0,
      finishMax: data.length > 100 ? 100 : data.length - 1,
      marks: mmarks
    });
  };
  silderOnchang = (e) => {
    try {
      this.slider.slickGoTo(e);
    } catch (ex) {
      console.log("错误" + ex);
    }
  };
  render() {
    var settings = {
      // lazyLoad: true,
      dots: false,
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1,
      lazyLoad: true,
      infinite: false,
      afterChange: () =>
        this.setState((state) => ({ updateCount: state.updateCount + 1 })),
      beforeChange: (current, next) => this.setState({ slideIndex: next })
    };
    const { visible, confirmLoading } = this.state;

    return (
      <div
        onKeyDown={this.handleKeyDown}
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <p>当前: {this.state.slideIndex} </p>
        <AntdSlider
          onChange={this.silderOnchang}
          value={this.state.slideIndex}
          min={this.state.finishMin}
          max={this.state.finishMax}
          marks={this.state.marks}
        />
        <br />
        <AntdSlider
          min={0}
          max={100}
          onChange={this.percentageOnChange}
          marks={{
            0: "0%",
            100: "100%"
          }}
        />
        <br />
        <Button
          className="button"
          onClick={this.previous}
          style={{ marginRight: 8 }}
        >
          上一张
        </Button>
        <Button
          className="button"
          onClick={this.next}
          style={{ marginRight: 8 }}
        >
          下一张
        </Button>
        <Radio.Group
          value={this.state.tfshow}
          onChange={this.showChange}
          style={{ marginRight: 8 }}
        >
          <Radio.Button value="all">全部显示</Radio.Button>
          <Radio.Button value="cha">只显示×</Radio.Button>
          <Radio.Button value="gou">只显示√</Radio.Button>
        </Radio.Group>
        <Button
          className="button"
          style={{ marginRight: 20 }}
          onClick={this.errorMark}
        >
          标记
        </Button>
        {(() => {
          if (this.state.data[this.state.slideIndex]) {
            switch (this.state.data[this.state.slideIndex].status) {
              case 1:
                return (
                  <Icon
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="#DC143C "
                  />
                );
                break;
              case 0:
                return (
                  <Icon
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#3CB371 "
                  />
                );
                break;
              default:
                return null;
            }
          }
        })()}
        <br />
        <br />
        <Modal
          title="获取图片"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <InputNumber
            min={1}
            max={300}
            value={this.state.ModalCount}
            onChange={this.ModalCountonChange}
          />
        </Modal>
        <Button
          className="button"
          style={{ marginRight: 20 }}
          onClick={this.picSubmit}
          onKeydown={this.handleKeyDown}
        >
          提交
        </Button>
        <br />
        <br />
        <Slider
          style={{ width: "600px" }}
          ref={(slider) => (this.slider = slider)}
          {...settings}
        >
          {this.state.imgshowdist}
        </Slider>
      </div>
    );
  }
}

ReactDOM.render(<PicScreen />, document.getElementById("container"));
