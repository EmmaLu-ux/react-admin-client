import React, { Component } from "react"
import { Card, Table, Button, message, Modal } from "antd"
import { connect } from "react-redux"

import { PAGE_SIZE } from "../../utils/constants.js"
import { reqAddRole, reqRoles, reqUpdateRole } from "../../api"
import AddForm2 from "./add-form"
import AuthForm from "./auth-form.jsx"
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils.js'
import { formateDate } from "../../utils/dateUtils.js"
import { logout } from "../../redux/actions"
import './role.less'

/* 角色管理路由 */
class Role extends Component {
  state = {
    roles: [], //所有角色的列表
    role: {}, //选中的role
    isShowAdd: false, //是否显示添加界面
    isShowAuth: false, //是否显示设置权限界面
  }
  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }
  initColums = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ]
  }
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    } else {
      message.error("获取角色失败！")
    }
  }
  onRow = (role) => {
    return {
      onClick: e => {
        //点击行
        console.log("row onClick()", role)
        this.setState({ role })
      },
    }
  }
  /* 添加角色 */
  addRole = () => {
    //进行表单验证，只有通过了才可以发起请求
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //1. 收集输入数据
        const { roleName } = values
        //重置输入的数据
        this.form.resetFields()
        //2. 请求添加
        const result = await reqAddRole(roleName)
        //3. 根据结果显示
        if (result.status === 0) {
          message.success("添加角色成功")
          // this.getRoles()
          //更新roles的状态
          const role = result.data
          // console.log(roles)
          //更新roles状态：基于原本状态数据更新，适合用函数的方式。
          this.setState((state) => ({
            roles: [...state.roles, role],
            isShowAdd: false,
          }))
        } else {
          message.error("添加角色失败！")
        }
        //更新列表显示
      } else {
        message.error("数据校验失败！" + err.message)
      }
    })
  }
  /* 更新角色 */
  updateRole = async () => {
    this.setState({
      isShowAuth: false,
    })
    const role = this.state.role
    const menus = this.auth.current.getMenus()
    role.menus = menus
    // role.auth_name = memoryUtils.user.username
    role.auth_name = this.props.user.username
    role.auth_time = formateDate(Date.now())
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      //如果当前用户更新的是自己的权限，强制退出
      // if(role._id === memoryUtils.user.role_id){
      if (role._id === this.props.user.role_id) {
        // memoryUtils.user={}
        // storageUtils.deleteUser()
        // this.props.history.replace('/login')
        this.props.logout()
        message.success("当前用户角色权限修改了，重新登录！")
      } else {
        message.success("设置角色权限成功！")
        this.setState({
          roles: [...this.state.roles],
        })
      }
    } else {
      message.err("设置角色权限失败！")
    }
  }
  componentWillMount() {
    this.initColums()
    this.getRoles()
  }
  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        &nbsp; &nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    )
    return (
      <Card title={title} style={{border: "none", borderRadius: 15}}>
        <Table
          // rowSelection={{ type: "radio", selectedRowKeys: [role._id] }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({ role })
            },
          }}
          onRow={this.onRow}
          rowKey="_id"
          // size="small"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title="添加角色"
          okText="确认"
          cancelText="取消"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
          }}
        >
          <AddForm2 setForm={(form) => (this.form = form)} />
        </Modal>
        <Modal
          title="设置角色权限"
          okText="确认"
          cancelText="取消"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    )
  }
}

export default connect((state) => ({ user: state.user }), { logout })(Role)
