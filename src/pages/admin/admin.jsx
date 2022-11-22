import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import { connect } from "react-redux";

// import memoryUtils from "../../utils/memoryUtils.js";
import LeftNav from "../../components/left-nav/LeftNav";
import Header from "../../components/header/";
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import User from "../user/user";
import Role from "../role/role";
import Bar from "../charts/bar";
import Pie from "../charts/pie";
import Line from "../charts/line";
import NotFound from "../not-found/not-found";

const { Footer, Sider, Content } = Layout;
class Admin extends Component {
  render() {
    // const user = memoryUtils.user;
    const user = this.props.user;
    //如果内存中没有存储user， 说明当前没有登录
    if (!user || !user._id) {
      //自动跳转到login.jsx
      return <Redirect to="/login" />;
    }
    return (
      // <div style={{height: 1080}}>
        <Layout style={{ minHeight: "100%" }}>
          {/* 左侧导航栏 */}
        <Sider style={{backgroundColor: "white"}}>
          <LeftNav />
        </Sider>
        <Layout>
          <Header /> {/* 右侧头部部分 */}
          <Content style={{ backgroundColor: "#fff", margin: 20, borderRadius: 15}}>  {/* 右侧主体部分 */}
            <Switch>
              <Redirect exact from='/' to="/home" />
              <Route path="/home" component={Home}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/product" component={Product}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/role" component={Role}></Route>
              <Route path="/bar" component={Bar}></Route>
              <Route path="/pie" component={Pie}></Route>
              <Route path="/line" component={Line}></Route>
              <Route component={NotFound} />
            </Switch>
          </Content>
          {/* 右侧底部文字 */}
          <Footer style={{ textAlign: "center", color: "#ccc" }}>
            推荐使用谷歌浏览器, 可以获得更加页面操作体验
          </Footer>
        </Layout>
        </Layout>
      // </div>
    );
  }
}
export default connect((state) => ({ user: state.user }), {})(Admin);
