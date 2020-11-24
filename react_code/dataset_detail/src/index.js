import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
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
  Modal
} from "antd";
import reqwest from "reqwest";
const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

class Demo extends React.Component {
  state = {
    loading: false,
    Options: [],
    data: [],
    fileList: [],
    datapath: [],
    fileZip: [],
    uploading: false,
    img: "",
    dataset: ""
  };
  //提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        if (this.state.data.id) {
          fetch(
            window.location.protocol +
              "//" +
              window.location.host +
              "/aidsp/api/dataset/" +
              this.state.data.id +
              "/",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body:
                "name=" +
                values.name +
                "&project=" +
                values.project_id +
                (values.describe
                  ? "&describe=" + values.describe.replace(/&/g, "%26")
                  : "") +
                (values.quantity_detials
                  ? "&quantity_detials=" +
                    values.quantity_detials.replace(/&/g, "%26")
                  : "") +
                (this.state.imageUrl
                  ? "&img=" + this.state.imageUrl.replace(/&/g, "%26")
                  : "") +
                (values.path ? "&path=" + values.path.replace(/&/g, "%26") : "")
            }
          )
            .then((res) => {
              let pid = window.location.pathname.split("/")[
                window.location.pathname.split("/").length - 2
              ];
              if (res.status == 201 || res.status == 200) {
                Modal.success({
                  content: "提交成功",
                  onOk() {
                    window.location.href =
                      "/aidsp/dataset_display/" + pid + "/";
                  }
                });
              } else {
                return res.text();
              }
            })
            .then((data) => {
              if (data) {
                console.log(2);
                Modal.error({
                  title: "错误",
                  content: data
                });
              }
            });
        } else {
          fetch(
            window.location.protocol +
              "//" +
              window.location.host +
              "/aidsp/api/dataset/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body:
                "name=" +
                values.name +
                "&project=" +
                values.project_id +
                (values.describe
                  ? "&describe=" + values.describe.replace(/&/g, "%26")
                  : "") +
                (values.quantity_detials
                  ? "&quantity_detials=" +
                    values.quantity_detials.replace(/&/g, "%26")
                  : "") +
                (this.state.imageUrl
                  ? "&img=" + this.state.imageUrl.replace(/&/g, "%26")
                  : "") +
                (this.state.fileList[0]
                  ? "&path=" + this.state.fileList[0].name.replace(/&/g, "%26")
                  : "")
            }
          ).then((res) => {
            if (res.status == 201 || res.status == 200) {
              Modal.success({
                content: "提交成功",
                onOk() {
                  window.location.href = "/aidsp/dataset";
                }
              });
            } else {
              Modal.error({
                title: "错误" + res.status,
                content: "提交失败"
              });
            }
          });
          this.showDataset(this.state.dataset);
        }
      }
    });
  };

  showDataset = (name)=>{
    console.log(name)
    reqwest({
      url:
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/dataset/imglist/?name=${name}",
        method: "get"
    }).then((data) => {
      data = JSON.parse(data);
      data.map((station) => (
          fetch(
              window.location.protocol +
              "//" +
              window.location.host +
              "/aidsp/api/imgbase/",
              {
                method: "POST",
                headers:{
                  "Content-Type": "application/x-www-form-urlencode"
                },
                body: JSON.stringify({
                  "img_name": station.name,
                  "dataset": name,
                  "img_path": "aidsp/static/dataset/" + name,
                  "img_info": station.info,
                  "assignee": station.assignee,
                  "reviewer": station.reviewer,
                })
              }
          )
      ))

    })

  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.state.dataset = ${value}
    reqwest({
      url:
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/dataset/imgthum/?value=${value}",
        method: "get"
    }).then((data) => {
      this.state.img = data
    })

  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };

  handleUpload = () => {
    const { fileZip } = this.state;
    const formData = new FormData();
    formData.append('file', fileZip);

    this.setState({
      uploading: true,
    });
    reqwest({
      url: window.location.protocol +
              "//" +
              window.location.host +
              "aidsp/dataset/fileupload/?index=1",
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileZip,
          uploading: false,
        });
        Modal.success('upload successfully.');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        Modal.error('upload failed.');
      },
    })
  };

  componentDidMount() {
    this.fetch();
  }

  //获取编辑前信息
  fetch = (params = {}) => {
    console.log("params:", params);
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/project/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({ user_data: data });
      let Options = data.map((station) => (
        <Option value={station.id}>
          {station.project_id + "_" + station.project_name}
        </Option>
      ));
      this.setState({ Options: Options });
      console.log(Options);
    });
    let pid = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 2
    ];
    reqwest({
      url:
        window.location.protocol +
          "//" +
          window.location.host +
          "/aidsp/dataset/path/",
        method: "get"
    }).then((data) => {
      this.setState( {data_path: data});
      data = JSON.parse(data);
      let Options = data.map((station) => (
          <Option value={station.name}>
            {station.name}
          </Option>
      ));
      this.setState({datapath: Options });
      console.log(Options)
    });
    reqwest({
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        "/aidsp/api/dataset/" +
        pid +
        "/?format=json",
      method: "get"
    }).then((data) => {
      this.setState({ data: data });
      this.setState({ imageUrl: data.img });
      this.props.form.setFieldsValue(data);
      if (data.path) {
        this.setState({
          fileList: [
            {
              uid: 1,
              name: data.path,
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                "/aidsp/dataset/filedownload/" +
                data.path,
              status: "done"
            }
          ]
        });
      }
    });
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

    this.setState({ fileList });
  };
  showpreview = (e) => {
    console.log(e);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    const { uploading, fileZip } = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileZip.indexOf(file);
          const newFileList = state.fileZip.slice();
          newFileList.splice(index, 1);
          return {
            fileZip: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileZip: [...state.fileZip, file],
        }));
        return false;
      },
      fileZip,
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="数据集名称">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入数据集名称!" }]
          })(
            <Select
              placeholder="请选择所属数据集"
              showSearch
              onChange={ this.showModal }
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.datapath}
            </Select>
          )}
        </Form.Item>
        <Modal
          title="图片预览"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>a</p>
        </Modal>
        <Form.Item label="项目">
          {getFieldDecorator("project_id", {
            rules: [{ required: true, message: "请选择所属项目!" }]
          })(
            <Select
              placeholder="请选择所属项目"
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.Options}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="数据集描述">
          {getFieldDecorator(
            "describe",
            {}
          )(<Input placeholder="请输入数据集描述"></Input>)}
        </Form.Item>
        <Form.Item label="数量详情">
          {getFieldDecorator(
            "quantity_detials",
            {}
          )(<Input placeholder="请输入数量详情"></Input>)}
        </Form.Item>
        <Form.Item label="存储路径">
          {getFieldDecorator(
            "path",
            {}
          )(<Input placeholder="请输入存储路径"></Input>)}
        </Form.Item>

        <Form.Item label="略缩图">
          {getFieldDecorator(
            "xx",
            {}
          )(
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              onChange={this.handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          )}
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>

        <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传zip
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileZip.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload' }
        </Button>
      </div>
      </Form>
    );
  }
}

const WrappedDemo = Form.create({ name: "validate_other" })(Demo);

ReactDOM.render(<WrappedDemo />, document.getElementById("container"));
