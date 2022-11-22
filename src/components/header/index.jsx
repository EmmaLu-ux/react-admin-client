import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import { connect } from "react-redux";

import "./index.less";
import { formateDate } from "../../utils/dateUtils.js";
// import memoryUtils from "../../utils/memoryUtils";
// import storageUtils from '../../utils/storageUtils'
import { reqWeather } from "../../api/index";
import LinkButton from "../link-button";
import { logout } from "../../redux/actions";

const { confirm } = Modal;
class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    weather: "", //天气
    winddirection: "", //西北风
    windpower: "", //风力
    humidity: "", //湿度
  };
  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };
  getWeather = async () => {
    const {weather, winddirection, windpower, humidity} = await reqWeather("330100");
    this.setState({ weather, winddirection, windpower, humidity });
  };
  /* 在没有使用redux管理状态的时候获取标题的方法 */
  // getTitle = () => {
  //   //得到当前请求路径
  //   const path = this.props.location.pathname;
  //   let title;
  //   menuList.forEach((item) => {
  //     if (item.key === path) {
  //       title = item.title;
  //     } else if (item.children) {
  //       const cItem = item.children.find((cItem) => path.indexOf(cItem.key) === 0);
  //       if (cItem) {
  //         title = cItem.title;
  //       }
  //     }
  //   });
  //   return title;
  // };
  logout = () => {
    confirm({
      title: "确定退出登录吗?",
      okText: '确认',
      cencelText: '取消',
      okType: 'danger',
      // content: 'Some descriptions',
      onOk: () => {
        console.log("确认");
        //删除保存的数据
        // storageUtils.deleteUser()
        // memoryUtils.user = {}
        this.props.logout();
        // 跳转到login界面
        // this.props.history.replace('/login')
      },
      onCancel() {
        console.log("取消");
      },
    });
  };
  //第一次render之后执行一次，一般在此执行异步操作：发ajax/启动定时器
  componentDidMount() {
    this.getTime();
    this.getWeather();
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { currentTime, weather, winddirection, windpower, humidity } = this.state;
    // const username = memoryUtils.user.username;
    const username = this.props.user.username;
    // const title = this.getTitle();
    const title = this.props.headTitle; //用redux直接调用状态
    return (
      <div className="header-top">
        <div className="header-top-left">
          <div className="header-top-left-title">{title}</div>
            <div className="header-top-left-curTime">{currentTime}</div>
            <div className="header-top-left-Text">{weather}, {winddirection}风{windpower}, 湿度: {humidity}</div>
        </div>
        <div className="header-top-right">
          <span>欢迎, {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => ({ headTitle: state.headTitle, user: state.user }),
  { logout }
)(withRouter(Header));
