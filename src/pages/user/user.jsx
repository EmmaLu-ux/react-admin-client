import React, { Component } from "react";
import { Card, Modal, Table, Button, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import { PAGE_SIZE } from "../../utils/constants";
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api";
import LinkButton from "../../components/link-button/index";
import UserForm from "./user-form";

/* 用户管理路由 */
export default class User extends Component {
  state = {
    users: [], //需要展示的用户信息
    roles: [], //所有角色列表
    isShow: false, //是否显示添加/更新用户列表
  };
  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        ),
      },
    ];
  };
  /* 根据roles数组，生成包含所有角色名的对象（属性名用角色id值） */
  initRoleName = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    this.roleNames = roleNames;
  };
  /* 获取用户 */
  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleName(roles);
      this.setState({ users, roles });
    } else {
      message.error("请求获取用户列表失败!");
    }
  };
  /* 删除指定用户 */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      okType: 'danger',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功！");
          this.getUsers();
        } else {
          message.error("删除用户失败！");
        }
      },
    });
  };
  /* 显示创建用户界面 */
  showAdd = () => {
    this.user = null //删除修改用户时用到的this.user，否则直接点击“创建用户”按钮后会显示修改用户时候的用户信息
    this.setState({isShow: true})
  }
  /* 显示修改界面 */
  showUpdate = (user) => {
    this.user = user; //保存用户
    this.setState({ isShow: true });
  };
  /* 添加/更新用户 */
  addOrUpdateUser = async () => {
    //收集输入数据
    const user = this.form.getFieldsValue();
    this.form.resetFields();
    if(this.user){
      user._id = this.user._id
    }
    //提交添加用户的请求
    const result = await reqAddOrUpdateUser(user);
    if (result.status === 0) {
      message.success(`请求${this.user ? '修改' : '添加'}用户成功！`);
      this.setState({ isShow: false });
      this.getUsers();
    } else {
      message.error("请求添加用户失败！");
    }
    //更新状态
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers();
  }
  render() {
    const { users, roles, isShow } = this.state;
    const user = this.user || {};
    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );

    return (
      <Card title={title}>
        <Table
          rowKey="_id"
          // size="small"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={user._id ? "修改用户" : "创建用户"}
          okText="确认"
          cancelText="取消"
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({ isShow: false })
            //重置输入内容
            this.form.resetFields()
          }}
        >
          <UserForm setForm={(form) => (this.form = form)} roles={roles} user={user}/>
        </Modal>
      </Card>
    );
  }
}
