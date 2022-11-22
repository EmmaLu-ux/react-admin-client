import React, { Component } from "react";
import { Card, Statistic, Icon, DatePicker, Steps } from "antd";
import moment from 'moment'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Interval,
} from "bizcharts";
import "./home.less";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD'
const { Step } = Steps;
/* 首页路由 */
export default class Home extends Component {
  state = {
    key: "tab1",
    noTitleKey: "article",
  };

  render() {
    const tabListNoTitle = [
      {
        key: "article",
        tab: "访问量",
      },
      {
        key: "app",
        tab: "销售量",
      },
    ];
    const data = [
      {
        month: "Jan",
        city: "a",
        temperature: 7,
      },
      {
        month: "Jan",
        city: "b",
        temperature: 3.9,
      },
      {
        month: "Jan",
        city: "c",
        temperature: 13.9,
      },
      {
        month: "Feb",
        city: "a",
        temperature: 6.9,
      },
      {
        month: "Feb",
        city: "b",
        temperature: 4.2,
      },
      {
        month: "Feb",
        city: "c",
        temperature: 14.2,
      },
      {
        month: "Mar",
        city: "a",
        temperature: 9.5,
      },
      {
        month: "Mar",
        city: "b",
        temperature: 5.7,
      },
      {
        month: "Mar",
        city: "c",
        temperature: 15.7,
      },
      {
        month: "Apr",
        city: "a",
        temperature: 14.5,
      },
      {
        month: "Apr",
        city: "b",
        temperature: 8.5,
      },
      {
        month: "Apr",
        city: "c",
        temperature: 18.5,
      },
      {
        month: "May",
        city: "a",
        temperature: 18.4,
      },
      {
        month: "May",
        city: "b",
        temperature: 11.9,
      },
      {
        month: "May",
        city: "c",
        temperature: 21.1,
      },
      {
        month: "Jun",
        city: "b",
        temperature: 21.5,
      },
      {
        month: "Jun",
        city: "a",
        temperature: 15.2,
      },
      {
        month: "Jun",
        city: "c",
        temperature: 25.4,
      },
      {
        month: "Jul",
        city: "b",
        temperature: 27.2,
      },
      {
        month: "Jul",
        city: "a",
        temperature: 17,
      },
      {
        month: "Jul",
        city: "c",
        temperature: 9.2,
      },
      {
        month: "Aug",
        city: "b",
        temperature: 26.5,
      },
      {
        month: "Aug",
        city: "a",
        temperature: 16.6,
      },
      {
        month: "Aug",
        city: "c",
        temperature: 18.2,
      },
      {
        month: "Sep",
        city: "b",
        temperature: 23.3,
      },
      {
        month: "Sep",
        city: "a",
        temperature: 14.2,
      },
      {
        month: "Sep",
        city: "c",
        temperature: 28.3,
      },
      {
        month: "Oct",
        city: "b",
        temperature: 18.3,
      },
      {
        month: "Oct",
        city: "a",
        temperature: 10.3,
      },
      {
        month: "Oct",
        city: "c",
        temperature: 20.3,
      },
      {
        month: "Nov",
        city: "b",
        temperature: 13.9,
      },
      {
        month: "Nov",
        city: "a",
        temperature: 6.6,
      },
      {
        month: "Nov",
        city: "c",
        temperature: 16.6,
      },
      {
        month: "Dec",
        city: "b",
        temperature: 9.6,
      },
      {
        month: "Dec",
        city: "c",
        temperature: 4.8,
      },
      {
        month: "Dec",
        city: "c",
        temperature: 14.8,
      },
    ];
    const data1 = [
      { month: "1月", sales: 120 },
      { month: "2月", sales: 99 },
      { month: "3月", sales: 90 },
      { month: "4月", sales: 97 },
      { month: "5月", sales: 170 },
      { month: "6月", sales: 278 },
      { month: "7月", sales: 330 },
      { month: "8月", sales: 324 },
      { month: "9月", sales: 88 },
      { month: "10月", sales: 68 },
      { month: "11月", sales: 98 },
      { month: "12月", sales: 78 },
    ];
    const cols = {
      month: {
        range: [0, 1],
      },
    };
    const tabBarExtraContent = (
      <RangePicker
        defaultValue={[
          moment("2022/11/20", dateFormat),
          moment("2022/11/21", dateFormat),
        ]}
        format={dateFormat}
      />
    );
    return (
      <div>
        <div className="div-card-chart">
          <Card title="商品总量" className="card-product">
            <Statistic
              title="周同比"
              value={21.65}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<Icon type="arrow-up" />}
              suffix="%"
            />
            <Statistic
              title="日同比"
              value={9.31}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<Icon type="arrow-down" />}
              suffix="%"
            />
          </Card>
          <Chart
            height={250}
            width={800}
            className="chart-line"
            data={data}
            scale={cols}
            autoFit
          >
            <Legend
              marker={{
                symbol: (x, y, radius) => {
                  const r = radius / 2;
                  return [
                    ["M", x - radius, y],
                    ["A", r, r, 0, 0, 1, x, y],
                    ["A", r, r, 0, 0, 0, x + radius, y],
                  ];
                },
                style: {
                  fill: "",
                },
              }}
            />
            <Axis name="month" />
            <Axis
              name="temperature"
              label={{
                formatter: (val) => `${val}万个`,
              }}
            />
            <Tooltip
              domStyles={{
                "g2-tooltip": {
                  boxShadow: "none",
                  color: "#fff",
                  backgroundColor: "#222",
                },
              }}
              crosshairs={{
                type: "y",
              }}
              style={{
                color: "red",
              }}
            />
            <Geom
              type="line"
              position="month*temperature"
              size={2}
              color={"city"}
            />
            <Geom
              type="point"
              position="month*temperature"
              size={4}
              shape={"circle"}
              color={"city"}
              style={{
                stroke: "#fff",
                lineWidth: 1,
              }}
            />
          </Chart>
        </div>
        <Card
          tabBarExtraContent={tabBarExtraContent}
          className="div-card2"
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={(key) => {
            this.onTabChange(key, "noTitleKey");
          }}
        >
          <Card title="访问趋势" style={{ width: 700 }} className="fangwenqushi">
            <Chart height={300} data={data1} autoFit>
              <Interval position="month*sales" />
            </Chart>
          </Card>
          <Card title="任务" style={{width: 250}} className="renwu">
            <Steps progressDot current={1} direction="vertical" size="small">
              <Step title="新版本迭代会" />
              <Step title="完成网站设计初版" />
              <Step title="联调接口" description="功能验收" />
              <Step title="登录功能设计" description="权限验证" />
            </Steps>
          </Card>
        </Card>
      </div>
    );
  }
}
