import React, { PureComponent } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;
/* 添加用户/修改用户的form组件 */
class UserForm extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  };
  componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {roles} = this.props
    const user = this.props.user || {}
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {getFieldDecorator("username", {
            initialValue: user.username,
            rules: [{ required: true, message: "角色名称必须输入！" }],
          })(<Input type="text" placeholder="请输入用户名"></Input>)}
        </Item>
        {
          user._id ? null : (<Item label="密码">
          {getFieldDecorator("password", {
            initialValue: user.password,
            rules: [{ required: true, message: "密码必须输入！" }],
          })(<Input type="password" placeholder="请输入密码"></Input>)}
        </Item>)
        }
        <Item label="手机号">
          {getFieldDecorator("phone", {
            initialValue: user.phone,
            rules: [{ required: true, message: "手机号必须输入！" }],
          })(<Input type="text" placeholder="请输入手机号"></Input>)}
        </Item>
        <Item label="邮箱">
          {getFieldDecorator("email", {
            initialValue: user.email,
            rules: [{ required: true, message: "角色名称必须输入！" }],
          })(<Input type="text" placeholder="请输入邮箱"></Input>)}
        </Item>
        <Item label="角色">
          {getFieldDecorator("role_id", {
            initialValue: user.role_id,
            rules: [{ required: true, message: "角色名称必须输入！" }],
          })(
          <Select placeholder='请选择角色'>
            {
              roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
            }
          </Select>
          )}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(UserForm);
