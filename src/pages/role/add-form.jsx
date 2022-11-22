import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
/* 添加分类的form组件 */
class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
  };
  componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          {getFieldDecorator("roleName", {
            initialValue: "",
            rules: [{ required: true, message: "角色名称必须输入！" }],
          })(<Input type="text" placeholder="请输入角色名称"></Input>)}
        </Item>
      </Form>
    );
  }
}
const AddForm2 = Form.create()(AddForm);
export default AddForm2;
