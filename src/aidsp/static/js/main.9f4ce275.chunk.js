(this["webpackJsonpx6rqob.run"] = this["webpackJsonpx6rqob.run"] || []).push([[0], {
    171: function (e, t, a) {
        e.exports = a(172)
    }, 172: function (e, t, a) {
        "use strict";
        a.r(t);
        var n = a(164), o = a(148), i = a(149), l = a(165), r = a(150), s = a(167), c = a(0), d = a.n(c), p = a(4),
            u = a.n(p), m = (a(177), a(178), a(169)), h = a(66), f = a(5), w = a(32), g = a(85), b = a(366), v = a(31),
            y = a(108), E = a.n(y), j = m.a.Option;

        function O(e, t) {
            var a = new FileReader;
            a.addEventListener("load", (function () {
                return t(a.result)
            })), a.readAsDataURL(e)
        }

        var _ = function (e) {
            function t() {
                var e, a;
                Object(o.a)(this, t);
                for (var i = arguments.length, s = new Array(i), c = 0; c < i; c++) s[c] = arguments[c];
                return (a = Object(l.a)(this, (e = Object(r.a)(t)).call.apply(e, [this].concat(s)))).state = {
                    loading: !1,
                    Options: [],
                    data: [],
                    fileList: [],
                    datapath: [],
                    fileZip: [],
                    uploading: !1,
                    visible: !1,
                    img: "",
                    dataset: ""
                }, a.handleSubmit = function (e) {
                    e.preventDefault(), a.props.form.validateFields((function (e, t) {
                        e || (console.log("Received values of form: ", t), a.state.data.id ? fetch(window.location.protocol + "//" + window.location.host + "/aidsp/api/dataset/" + a.state.data.id + "/", {
                            method: "PUT",
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            body: "name=" + t.name.replace(/&/g, "%26") + "&project=" + t.project_id + (t.describe ? "&describe=" + t.describe.replace(/&/g, "%26") : "") + (t.quantity_detials ? "&quantity_detials=" + t.quantity_detials.replace(/&/g, "%26") : "") + (a.state.imageUrl ? "&img=" + a.state.imageUrl.replace(/&/g, "%26") : "") + (t.path ? "&path=" + t.path.replace(/&/g, "%26") : "")
                        }).then((function (e) {
                            var t = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2];
                            if (201 != e.status && 200 != e.status) return e.text();
                            h.a.success({
                                content: "\u63d0\u4ea4\u6210\u529f", onOk: function () {
                                    window.location.href = "/aidsp/dataset_display/" + t + "/"
                                }
                            })
                        })).then((function (e) {
                            e && (console.log(2), h.a.error({title: "\u9519\u8bef", content: e}))
                        })) : fetch(window.location.protocol + "//" + window.location.host + "/aidsp/api/dataset/", {
                            method: "POST",
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            body: "name=" + t.name.replace(/&/g, "%26") + "&project=" + t.project_id + (t.describe ? "&describe=" + t.describe.replace(/&/g, "%26") : "") + (t.quantity_detials ? "&quantity_detials=" + t.quantity_detials.replace(/&/g, "%26") : "") + (a.state.imageUrl ? "&img=" + a.state.imageUrl.replace(/&/g, "%26") : "") + (a.state.fileList[0] ? "&path=" + a.state.fileList[0].name.replace(/&/g, "%26") : "")
                        }).then((function (e) {
                            201 == e.status || 200 == e.status ? h.a.success({
                                content: "\u63d0\u4ea4\u6210\u529f",
                                onOk: function () {
                                    window.location.href = "/aidsp/dataset"
                                }
                            }) : h.a.error({title: "\u9519\u8bef" + e.status, content: "\u63d0\u4ea4\u5931\u8d25"})
                        }))), a.showDataset(a.state.dataset)
                    }))
                },
                    a.showDataset = function (e) { console.log(e);E()({
                    url: window.location.protocol + "//" + window.location.host + "/aidsp/dataset/imglist/?name=" + e,
                    method: "get"
                    }).then((function (t) {
                    (t = JSON.parse(t)).map((function (t) {
                        return fetch(window.location.protocol + "//" + window.location.host + "/aidsp/api/imgbase/", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                "img_name": t.name, "dataset": e, "img_path": "aidsp/static/dataset/" + e, "img_info": t.info,
                                "assignee": t.assignee, "reviewer": t.reviewer,
                            })
                            })
                        }))
                    }))
                },
                    a.showModal = function(t) {
                   a.setState({visible:! 0}),
                   a.state.dataset = t, E()({
                    url: window.location.protocol + "//" + window.location.host + "/aidsp/dataset/imgthum/?value=" + "".concat(t),
                    method: "get"
                }).then((function (t) {
                    a.state.img = t
                }))},
                    a.handleCancel = function() {
                   a.setState({visible: !0})
                },
                    a.handleOk = function() {
                   a.setState({visible: 0}),
                   a.state.img= ""
                },
                    a.normFile = function (e) {
                    return console.log("Upload event:", e), Array.isArray(e) ? e : e && e.fileList
                }, a.handleChange = function (e) {
                    "uploading" !== e.file.status ? "done" === e.file.status && O(e.file.originFileObj, (function (e) {
                        return a.setState({imageUrl: e, loading: !1})
                    })) : a.setState({loading: !0})
                },

                    a.handleUpload = function () {
                    var t = a.state.fileZip, n = new FormData;
                    n.append("file", t[0]), a.setState({uploading: !0}), E()({
                    url: window.location.protocol + "//" + window.location.host + "/aidsp/dataset/fileupload/?index=1",
                    method: "post",
                    processData: !1,
                    data: n,
                    success: function () {
                        a.setState({fileZip: t, uploading: !1}), h.a.success({content:"upload successfully."})
                    },
                    error: function () {
                        a.setState({uploading: !1}), h.a.error({content:"upload failed."})
                    }
                })
            },

                    a.fetch = function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    console.log("params:", e), E()({
                        url: window.location.protocol + "//" + window.location.host + "/aidsp/api/project/?format=json",
                        method: "get"
                    }).then((function (e) {
                        a.setState({user_data: e});
                        var t = e.map((function (e) {
                            return d.a.createElement(j, {value: e.id}, e.project_id + "_" + e.project_name)
                        }));
                        a.setState({Options: t}), console.log(t)
                    }));
                    var t = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2];
                    E()({
                        url: window.location.protocol + "//" + window.location.host + "/aidsp/dataset/path/",
                        method: "get"
                    }).then((function (e) {
                        a.setState({data_path: e});
                        var t = (e = JSON.parse(e)).map((function (e) {
                            return d.a.createElement(j, {value: e.name}, e.name)
                        }));
                        a.setState({datapath: t}), console.log(t)
                    })),
                        E()({
                            url: window.location.protocol + "//" + window.location.host + "/aidsp/api/dataset/" + t + "/?format=json",
                            method: "get"
                        }).then((function (e) {
                            a.setState({data: e}), a.setState({imageUrl: e.img}), a.props.form.setFieldsValue(e), e.path && a.setState({
                                fileList: [{
                                    uid: 1,
                                    name: e.path,
                                    url: window.location.protocol + "//" + window.location.host + "/aidsp/dataset/filedownload/" + e.path,
                                    status: "done"
                                }]
                            })
                        }))
                }, a.uploadOnchange = function (e) {
                    var t = Object(n.a)(e.fileList);
                    (t = (t = t.slice(-2)).map((function (e) {
                        return e.response && (e.url = e.response.url), e
                    })))[0] && "done" == t[0].status && (t[0].name = t[0].response, t[0].url = window.location.protocol + "//" + window.location.host + "/aidsp/dataset/filedownload/" + t[0].response), a.setState({fileList: t})
                }, a.showpreview = function (e) {
                    console.log(e)
                }, a
            }

            return Object(s.a)(t, e), Object(i.a)(t, [{
                key: "componentDidMount", value: function () {
                    this.fetch()
                }
            }, {
                key: "render", value: function () {
                    var e = this.props.form.getFieldDecorator, t = this.state, a = t.previewVisible, nn = t.previewImage, th = this,
                        o = (t.fileList, d.a.createElement("div", null, d.a.createElement(f.a, {type: this.state.loading ? "loading" : "plus"}), d.a.createElement("div", {className: "ant-upload-text"}, "Upload"))),
                        i = this.state.imageUrl;
                    var ss = t.uploading, cc = t.fileZip, ff = {
                        onRemove: function (t) {
                            th.setState((function (e) {
                                var n = e.fileZip.indexOf(t), r = e.fileZip.slice();
                                return r.splice(n, 1), {fileZip: r}
                            }))
                        }, beforeUpload: function (t) {
                            return th.setState((function (e) {
                                return {fileZip: [].concat(Object(n.a)(e.fileZip), [t])}
                            })), !1
                        }, fileZip: cc
                    };

                    return d.a.createElement(w.a, Object.assign({}, {
                        labelCol: {span: 6},
                        wrapperCol: {span: 14}
                    }, {onSubmit: this.handleSubmit}),

                        d.a.createElement(w.a.Item, {label: "\u6570\u636e\u96c6\u540d\u79f0"}, e("name", {
                        rules: [{
                            required: !0,
                            message: "\u8bf7\u8f93\u5165\u6570\u636e\u96c6\u540d\u79f0!"
                        }]
                    })(d.a.createElement(m.a, {
                        placeholder: "\u8bf7\u9009\u62e9\u6240\u5c5e\u6570\u636e\u96c6",
                        showSearch: !0,
                        onChange: this.showModal,
                        filterOption: function (e, t) {
                            return t.props.children.toLowerCase().indexOf(e.toLowerCase()) >= 0
                        }
                    }, this.state.datapath))), d.a.createElement(w.a.Item, {label: "\u9879\u76ee"}, e("project_id", {
                        rules: [{
                            required: !0,
                            message: "\u8bf7\u9009\u62e9\u6240\u5c5e\u9879\u76ee!"
                        }]
                    })(d.a.createElement(m.a, {
                        placeholder: "\u8bf7\u9009\u62e9\u6240\u5c5e\u9879\u76ee",
                        showSearch: !0,
                        filterOption: function (e, t) {
                            return t.props.children.toLowerCase().indexOf(e.toLowerCase()) >= 0
                        }
                    }, this.state.Options))), d.a.createElement(h.a, {title: "图片预览", width: 650,
                    visible: this.state.visible, onCancel: this.handleCancel, onOk: this.handleOk, okText:"确认", cancelText:"刷新"}, d.a.createElement("img", {src: this.state.img}))
                        ,d.a.createElement(w.a.Item, {label: "\u6570\u636e\u96c6\u63cf\u8ff0"}, e("describe", {})(d.a.createElement(g.a, {placeholder: "\u8bf7\u8f93\u5165\u6570\u636e\u96c6\u63cf\u8ff0"}))), d.a.createElement(w.a.Item, {label: "\u6570\u91cf\u8be6\u60c5"}, e("quantity_detials", {})(d.a.createElement(g.a, {placeholder: "\u8bf7\u8f93\u5165\u6570\u91cf\u8be6\u60c5"}))), d.a.createElement(w.a.Item, {label: "\u5b58\u50a8\u8def\u5f84"}, e("path", {})(d.a.createElement(g.a, {placeholder: "\u8bf7\u8f93\u5165\u5b58\u50a8\u8def\u5f84"}))), d.a.createElement(w.a.Item, {label: "\u7565\u7f29\u56fe"}, e("xx", {})(d.a.createElement(b.a, {
                        name: "avatar",
                        listType: "picture-card",
                        showUploadList: !1,
                        onChange: this.handleChange
                    }, i ? d.a.createElement("img", {
                        src: i,
                        alt: "avatar",
                        style: {width: "100%"}
                    }) : o)), d.a.createElement(h.a, {
                        visible: a,
                        footer: null,
                        onCancel: this.handleCancel
                    }, d.a.createElement("img", {
                        alt: "example",
                        style: {width: "100%"},
                        src: nn
                    }))), d.a.createElement(w.a.Item, {
                        wrapperCol: {
                            span: 12,
                            offset: 6
                        }
                    }, d.a.createElement(v.a, {type: "primary", htmlType: "submit"}, "\u63d0\u4ea4")),
                        d.a.createElement("div", null, d.a.createElement(b.a, ff, d.a.createElement(v.a, null, d.a.createElement(f.a, {type: "upload"}), " 上传zip")), d.a.createElement(v.a, {
                    type: "primary",
                    onClick: this.handleUpload,
                    disabled: 0 === cc.length,
                    loading: ss,
                    style: {marginTop: 16}
                }, ss ? "Uploading" : "Start Upload")),
                )
                }
            }]), t
        }(d.a.Component), C = w.a.create({name: "validate_other"})(_);
        u.a.render(d.a.createElement(C, null), document.getElementById("container"))
    }, 178: function (e, t, a) {
    }, 179: function (e, t) {
    }
}, [[171, 1, 2]]]);
//# sourceMappingURL=main.9f4ce275.chunk.js.map