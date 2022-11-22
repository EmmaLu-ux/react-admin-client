import React, { PureComponent } from "react";
import { Form, Input, Tree } from "antd";
import PropTypes from "prop-types";
import menuList from "../../config/menuConfig";

const Item = Form.Item;
const { TreeNode } = Tree;

/* 添加分类的form组件 */
export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object,
  };
  /* 根据传入角色的menu生成初始状态 */
  constructor(props) {
    super(props);
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus,
    };
  }
  /* 选中某个node时的回调 */
  onCheck = (checkedKeys) => {
    console.log("onCheck", checkedKeys);
    this.setState({ checkedKeys });
  };
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };
  /* 为父组件提供获取最新menus数据的方法 */
  getMenus = () => this.state.checkedKeys;
  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);
  }
  /* 根据新传入的role来更新checkedKeys状态
  当组件接收到新的属性时自动调用 */
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps()", nextProps);
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus,
    });
    // this.state.checkedKeys = menus
  }
  render() {
    console.log("AuthForm render()");
    const { role } = this.props;
    const { checkedKeys } = this.state;
    // const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          onCheck={this.onCheck}
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    );
  }
}
