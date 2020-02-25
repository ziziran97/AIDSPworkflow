(this["webpackJsonpjkfruy.run"] = this["webpackJsonpjkfruy.run"] || []).push([[0], {
    178 : function(e, a, t) {
        e.exports = t(179)
    },
    179 : function(e, a, t) {
        "use strict";
        t.r(a);
        for (var l = t(156), n = t(157), r = t(173), o = t(158), c = t(174), m = t(1), s = t.n(m), i = t(7), u = t.n(i), p = (t(184), t(185), t(120)), d = t(21), E = t(73), h = t(119), b = t(176), f = t(57), g = t(10), v = t(373), y = t(159), j = t.n(y), I = p.a.Option, w = [], k = 10; k < 36; k++) w.push(s.a.createElement(I, {
            key: k.toString(36) + k
        },
        k.toString(36) + k));
        function _(e) {
            console.log("selected ".concat(e))
        }
        var F = function(e) {
            function a() {
                var e, t;
                Object(l.a)(this, a);
                for (var n = arguments.length,
                c = new Array(n), m = 0; m < n; m++) c[m] = arguments[m];
                return (t = Object(r.a)(this, (e = Object(o.a)(a)).call.apply(e, [this].concat(c)))).state = {
                    data: []
                },
                t.handleSubmit = function(e) {
                    e.preventDefault(),
                    t.props.form.validateFields((function(e, a) {
                        e || console.log("Received values of form: ", a)
                    }))
                },
                t.normFile = function(e) {
                    return console.log("Upload event:", e),
                    Array.isArray(e) ? e: e && e.fileList
                },
                t.fetch = function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    console.log("params:", e);
                    var a = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2];
                    j()({
                        url: window.location.protocol + "//" + window.location.host + "/aidsp/api/project/" + a + "/?format=json",
                        method: "get"
                    }).then((function(e) {
                        t.setState({
                            data: e
                        }),
                        t.props.form.setFieldsValue(t.state.data)
                    }))
                },
                t
            }
            return Object(c.a)(a, e),
            Object(n.a)(a, [{
                key: "componentDidMount",
                value: function() {
                    this.fetch()
                }
            },
            {
                key: "render",
                value: function() {
                    var e = this.props.form.getFieldDecorator,
                    a = {
                        labelCol: {
                            span: 6
                        },
                        wrapperCol: {
                            span: 14
                        },
                        data: this.state.data
                    };
                    return s.a.createElement(d.a, Object.assign({},
                    a, {
                        onSubmit: this.handleSubmit
                    }), s.a.createElement(d.a.Item, {
                        label: "\u9879\u76ee\u540d\u79f0"
                    },
                    e("project_name", {
                        rules: [{
                            required: !0,
                            message: "\u8bf7\u8f93\u5165\u9879\u76ee\u540d\u79f0!"
                        }]
                    })(s.a.createElement(E.a, {
                        placeholder: "\u8bf7\u8f93\u5165\u9879\u76ee\u540d\u79f0",
                        key: "sddsd"
                    }))), s.a.createElement(d.a.Item, {
                        label: "\u72b6\u6001"
                    },
                    e("status", {
                        rules: [{
                            required: !0,
                            message: "\u8bf7\u9009\u62e9\u72b6\u6001!"
                        }]
                    })(s.a.createElement(p.a, {
                        placeholder: "\u8bf7\u9009\u62e9\u72b6\u6001"
                    },
                    s.a.createElement(I, {
                        value: "\u672a\u5f00\u59cb"
                    },
                    "\u672a\u5f00\u59cb"), s.a.createElement(I, {
                        value: "\u51c6\u5907\u4e2d"
                    },
                    "\u51c6\u5907\u4e2d"), s.a.createElement(I, {
                        value: "\u6570\u636e\u91c7\u96c6"
                    },
                    "\u6570\u636e\u91c7\u96c6"), s.a.createElement(I, {
                        value: "\u6570\u636e\u6807\u6ce8"
                    },
                    "\u6570\u636e\u6807\u6ce8"), s.a.createElement(I, {
                        value: "\u6682\u505c"
                    },
                    "\u6682\u505c"), s.a.createElement(I, {
                        value: "\u5b8c\u7ed3"
                    },
                    "\u5b8c\u7ed3")))), s.a.createElement(d.a.Item, {
                        label: "\u521b\u5efa\u65f6\u95f4"
                    },
                    e("create_time", {
                        rules: [{
                            type: "object",
                            required: !0,
                            message: "Please select time!"
                        }]
                    })(s.a.createElement(h.a, null))), s.a.createElement(d.a.Item, {
                        label: "\u7ed3\u675f\u65f6\u95f4"
                    },
                    e("end_time", {
                        rules: [{
                            type: "object",
                            required: !0,
                            message: "Please select time!"
                        }]
                    })(s.a.createElement(h.a, null))), s.a.createElement(d.a.Item, {
                        label: "\u9879\u76ee\u80cc\u666f"
                    },
                    e("background", {
                        valuePropName: "fileList",
                        getValueFromEvent: this.normFile
                    })(s.a.createElement(b.a, {
                        name: "logo",
                        action: "/upload.do",
                        listType: "picture"
                    },
                    s.a.createElement(f.a, null, s.a.createElement(g.a, {
                        type: "upload"
                    }), " Click to upload")))), s.a.createElement(d.a.Item, {
                        label: "\u9700\u6c42\u603b\u91cf"
                    },
                    e("total_demand", {
                        rules: [{
                            required: !0,
                            message: "\u8bf7\u8f93\u5165\u9700\u6c42\u603b\u91cf!"
                        }]
                    })(s.a.createElement(v.a, null))), s.a.createElement(d.a.Item, {
                        label: "\u9700\u6c42\u6570\u91cf\u63cf\u8ff0"
                    },
                    e("total_describe", {})(s.a.createElement(E.a, {
                        placeholder: "\u8bf7\u8f93\u5165\u9700\u6c42\u6570\u91cf\u63cf\u8ff0"
                    }))), s.a.createElement(d.a.Item, {
                        label: "\u622a\u6b62\u65f6\u95f4"
                    },
                    e("deadline", {
                        rules: [{
                            type: "object",
                            required: !0,
                            message: "Please select time!"
                        }]
                    })(s.a.createElement(h.a, null))), s.a.createElement(d.a.Item, {
                        label: "\u6587\u6863"
                    },
                    e("documents", {
                        valuePropName: "fileList",
                        getValueFromEvent: this.normFile
                    })(s.a.createElement(b.a, {
                        name: "logo",
                        action: "/upload.do",
                        listType: "picture"
                    },
                    s.a.createElement(f.a, null, s.a.createElement(g.a, {
                        type: "upload"
                    }), " Click to upload")))), s.a.createElement(d.a.Item, {
                        label: "\u6807\u7b7e"
                    },
                    e("labels", {})(s.a.createElement(p.a, {
                        mode: "tags",
                        style: {
                            width: "100%"
                        },
                        placeholder: "\u8bf7\u8f93\u5165\u6807\u7b7e",
                        onChange: _
                    },
                    w))), s.a.createElement(d.a.Item, {
                        label: "\u521b\u5efa\u4eba"
                    },
                    e("users_found", {
                        rules: [{
                            required: !0,
                            message: "\u8bf7\u8f93\u5165\u521b\u5efa\u4eba!"
                        }]
                    })(s.a.createElement(E.a, {
                        placeholder: "\u8bf7\u8f93\u5165\u521b\u5efa\u4eba"
                    }))), s.a.createElement(d.a.Item, {
                        label: "\u7ba1\u7406\u4eba"
                    },
                    e("users_manager", {})(s.a.createElement(E.a, {
                        placeholder: "\u8bf7\u8f93\u5165\u7ba1\u7406\u4eba"
                    }))), s.a.createElement(d.a.Item, {
                        label: "\u53c2\u4e0e\u4eba"
                    },
                    e("users_attend", {})(s.a.createElement(E.a, {
                        placeholder: "\u8bf7\u8f93\u5165\u53c2\u4e0e\u4eba"
                    }))), s.a.createElement(d.a.Item, {
                        wrapperCol: {
                            span: 12,
                            offset: 6
                        }
                    },
                    s.a.createElement(f.a, {
                        type: "primary",
                        htmlType: "submit"
                    },
                    "Submit")))
                }
            }]),
            a
        } (s.a.Component),
        q = d.a.create({
            project_name: "validate_other"
        })(F);
        u.a.render(s.a.createElement(q, null), document.getElementById("container"))
    },
    185 : function(e, a, t) {},
    186 : function(e, a) {}
},
[[178, 1, 2]]]);
//# sourceMappingURL=main.249289d4.chunk.js.map
