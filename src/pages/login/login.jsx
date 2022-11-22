import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import { connect } from "react-redux";

import "./login.less";
import "./login-1.less"
/* import { reqLogin } from "../../api";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from "../../utils/storageUtils"; */
import { Redirect } from "react-router-dom";
import { login } from "../../redux/actions";

class Login extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    /* const form = this.props.form;
    const values = form.getFieldsValue();
    console.log('@@', values) */
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /* console.log("提交登录的ajax请求: ", values);
        请求登录 */
        const { username, password } = values;
        /* const result = await reqLogin(username, password); //{status: 0, data: user}  {status: 1, data: msg}
        // const result = response.data;
        console.log("请求成功了", result);
        if (result.status === 0) {
          //提示登录成功
          console.log("登录成功！");
          message.success('登录成功！')

          //获取到user，并存储到内存中
          const user = result.data
          memoryUtils.user = user //保存在内存中
          storageUtils.saveUser(user) //保存到local中去
          //跳转到管理界面
          this.props.history.push("/home");
        } else {
          message.error(result.msg);
        } */
        //调用分发异步action的函数 => 发登录的异步请求，有了结果后更新状态
        this.props.login(username, password);
      } else {
        console.log("校验不通过！");
      }
    });
  };
  render() {
    //如果用户已经登陆, 自动跳转到管理界面
    // const user = memoryUtils.user
    const user = this.props.user;
    if (user && user._id) {
      return <Redirect to="/home" />;
    }
    // const errorMsg = this.props.user.errorMsg;
    const form = this.props.form;
    const { getFieldDecorator } = form;
    return (
      <div className="login">
        <section className="login-content">
          <div className="login-Image"></div>
          <div className="login-Info">
            <h2>欢迎登录</h2>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                { getFieldDecorator("username", {
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: "请输入您的用户名!",
                    },
                    { min: 4, message: "用户名至少4位!" },
                    { max: 12, message: "用户名最多12位!" },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: "用户名必须是字母、数字或下划线!",
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.5)" }} />
                    }
                    size="large"
                    allowClear={true}
                    placeholder="请输入用户名"
                    className="login-form-input"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: "请输入您的用户名!",
                    },
                    { min: 4, message: "用户名至少4位!" },
                    { max: 12, message: "用户名最多12位!" },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: "用户名必须是字母、数字或下划线!",
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.5)" }} />
                    }
                    size="large"
                    allowClear={true}
                    type="password"
                    placeholder="请输入密码"
                    className="login-form-input"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    );
  }
}

const WrapLogin = Form.create()(Login);
export default connect((state) => ({ user: state.user }), { login })(WrapLogin);
