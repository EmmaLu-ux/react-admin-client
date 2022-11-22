import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import { connect } from "react-redux";

import "./LeftNav.less";
import logo from "../../assets/images/logo.jpeg";
import menuList from "../../config/menuConfig.js";
// import memoryUtils from "../../utils/memoryUtils";
import { setHeadTitle } from "../../redux/actions";

const { SubMenu } = Menu;

class LeftNav extends Component {
  /* 判断当前登录用户对item是否有访问权限 */
  hasAuth = (item) => {
    const { key, isPublic } = item;
    // const menus = memoryUtils.user.role.menus;
    const menus = this.props.user.role.menus;
    // const username = memoryUtils.user.username;
    const username = this.props.user.username;
    
    //1. 如果当前用户是admin
    //3. 如果当前item是公开的
    //2. 当前用户有此item的权限：key有没有在menus中
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      //如果当前用户有此item的某个子item的权限
      return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };
  /* 根据menu的数据数组生成对应的标签数组 */
  getMenuNodes = (menuList) => {
    //得到当前请求的路径
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {
      //如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        if (!item.children) { // 如果只有一级路由
          if (item.key === path || path.indexOf(item.key) === 0) {
            //更新redux中headTitle的状态
            this.props.setHeadTitle(item.title);
          }
          pre.push((
            <Menu.Item
              key={item.key}
              onClick={() => this.props.setHeadTitle(item.title)}
            >
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ));
        } else { // 如果有不止一级路由
          //查找一个与当前请求路径相匹配的子item
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.key) === 0
          );
          if (cItem) {
            //如果存在，说明当前item的子列表需要打开
            this.openKey = item.key;
          }
          
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ));
        }
      }
      return pre;
    }, []);
  };
  // 在第一次render()之前执行一次
  // 为第一个render准备数据（同步）
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    //得到当前请求的路径，使得默认选中菜单项的某一个
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {   //说明当前请求的是商品或商品的子路由
      path = "/product";
    }

    //得到需要打开菜单项的key
    const openKey = this.openKey;
    return (
      <div to="/" className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>XXX后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]} /* 动态显示选中的菜单项，defaultSelectedKeys不能做到，它只能匹配第一次请求的路径，后面不会再改变 */
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="light"
        >
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}
export default connect((state) => ({ user: state.user }), { setHeadTitle })(
  withRouter(LeftNav)
);
