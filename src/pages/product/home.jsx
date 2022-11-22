import React, { Component } from "react";
import { Input, Icon, Button, Select, Card, Table, message } from "antd";

import LinkButton from "../../components/link-button";
import { reqProduct, reqSearchProduct, reqUpdateProduct } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils'

const Option = Select.Option;
/* Product的默认主页面 */
export default class ProductHome extends Component {
  state = {
    loading: false,
    total: 0, //商品的总数量
    product: [], //商品的数组
    searchName: "", //搜索的关键字
    searchType: "productName", //根据哪个字段搜索
  };
  /* 初始化table的列的数组 */
  initColums = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "¥" + price,
      },
      {
        title: "状态",
        width: 200,
        // dataIndex: "status",
        render: (product) => {
          const {status, _id} = product
          return (
            <span>
              <Button type="primary" onClick={() => this.updateStatus(_id,status === 1 ? 2 : 1)}>{status === 1 ? '下架' : '上架'}</Button>
              <span style={{marginLeft: 20}}>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          );
        },
      },
      {
        title: "操作",
        width: 200,
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.showDetails(product)}>详情</LinkButton>
              <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton>
            </span>
          );
        },
      },
    ];
  };
  //获取指定页码的列表数据显示
  getProduct = async (pageNum) => {
    this.pageNum = pageNum // 保存pageNum，让其他方法可以看到
    this.setState({ loading: true });
    const { searchName, searchType } = this.state;
    //如果seachName有值，说明要做搜索分页
    let result;
    if (searchName) { // 搜索分页
      console.log('搜索分页请求开始')
      result = await reqSearchProduct({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
      console.log('搜索分页请求结束')
    } else { // 一般分页
      result = await reqProduct(pageNum, PAGE_SIZE);
    }
    console.log('搜索分页设置')
    console.log('getProduct()', result)
    this.setState({ loading: false });
    if (result.status === 0) {
      //取出分页数据，更新状态，显示分页列表
      const { list, total } = result.data;
      this.setState({
        total,
        product: list
      });
      console.log('设置成功')
    }
  };
  /* 显示商品详情界面 */
  showDetails = (product) => {
    //缓存product，给details组件用
    memoryUtils.product = product
    storageUtils.saveProduct(product)
    this.props.history.push('/product/detail')
  }
  /* 显示修改商品的界面 */
  showUpdate = (product) => {
    memoryUtils.product = product
    this.props.history.push('/product/addupdate')
  }
  //更新指定商品的状态 
  updateStatus = async (productId, status) => {
    const result = await reqUpdateProduct(productId, status)
    if(result.status === 0){
      message.success('更新商品成功')
      this.getProduct(this.pageNum)
    }
  }
  componentWillMount() {
    this.initColums();
  }
  componentDidMount() {
    this.getProduct(1);
  }
  render() {
    //从状态中取出数据动态显示产品名称
    const { product, total, loading, searchName, searchType } = this.state;
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) => this.setState({ searchType: value })} //受控组件
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 250, margin: "0 10px 0 10px" }}
          value={searchName}
          onChange={(e) => {this.setState({ searchName: e.target.value })}}
        />
        <Button type="primary" onClick={() => this.getProduct(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type="plus" />
        添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra} style={{borderRadius: 15, border: "none"}}>
        <Table
          loading={loading}
          rowKey="_id"
          // size="small"
          dataSource={product}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProduct,
          }}
        />
      </Card>
    );
  }
}
