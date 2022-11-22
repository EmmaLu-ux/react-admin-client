import React, { Component } from "react";
import { Card, Button } from "antd";
import ReactEcharts from "echarts-for-react";
/*
后台管理的折线图路由组件
*/
export default class Bar extends Component {
  state = {
    sales: [23, 24, 18, 25, 27], //销量
    stores: [12, 54, 18, 45, 9] //数组
  }
  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store - 1)
        return pre
      }, [])
    }))
  }
  //返回柱状图的配置对象
  getOption = (sales, stores) => {
    return {
      title: {
        text: 'ECharts入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'line',
          data: sales
        },
        {
          name: '库存',
          type: 'line',
          data: stores
        }
      ]
    }
  }
  render() {
    const {sales, stores} = this.state
    return (
      <div>
        {" "}
        <Card>
          <Button type="primary" onClick={this.update}>
            更新
          </Button>{" "}
        </Card>
        <Card title="折线图一">
          <ReactEcharts option={this.getOption(sales, stores)} style = {{width: 1150}}/>
        </Card>{" "}
      </div>
    );
  }
}
