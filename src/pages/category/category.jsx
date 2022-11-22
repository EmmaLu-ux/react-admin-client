import React, { Component } from "react";
import { Card, Icon, Button, Table, message, Modal } from "antd";

import LinkButton from "../../components/link-button";
import { reqAddCategory, reqGetCategorys, reqUpdateCategory } from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

/* 商品分类路由 */
export default class Category extends Component {
  state = {
    loading: false, //是否正在获取列表中
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: "0", //当前需要显示的分类列表的父分类ID
    parentName: "", //当前需要显示的分类列表的父分类名称
    showStatus: 0, //0：不显示Modal框，1: 显示添加分类Modal框，2:显示修改分类Modal框
  };
  /* 初始化Table所有列的数组 */
  initColums = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={this.showSubCategory(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };
  //获取一级/二级分类列表
  //parentId: 没有指定的话就根据状态中的值请求，指定的话就用指定的值
  getCategorys = async (parentId) => {
    console.log("getCategorys");
    //发送请求前，显示loading
    this.setState({ loading: true });
    // const { parentId } = this.state;
    parentId = parentId || this.state.parentId;
    const result = await reqGetCategorys(parentId);
    //请求结束后，隐藏loading
    this.setState({ loading: false });
    if (result.status === 0) {
      //取出分类数组（可能是一级，也可能是二级）
      const categorys = result.data;
      //更新二级分类
      if (parentId !== "0") {
        this.setState({ subCategorys: categorys });
      } else {
        //更新一级分类
        this.setState({ categorys });
      }
    } else {
      message.error("获取分类列表失败！");
    }
  };
  // 显示指定一级分类对象的二级子分类
  showSubCategory = (category) => {
    return () => {
      //更新状态
      this.setState(
        {
          parentId: category._id,
          parentName: category.name,
        },
        () => {
          //在状态更新且重新render()后执行
          //setState()不能立即获取最新状态，因为setState是异步更新的
          console.log("parentId", this.state.parentId);
          //获取二级分类列表显示
          this.getCategorys();
        }
      );
    };
  };
  // 显示指定一级分类列表
  showCategory = () => {
    // 更新为显示一级列表的状态
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };
  //点击“修改分类”LinkButton后，显示修改/更新的确认框
  showUpdate = (category) => {
    //保存分类对象，供render函数用
    this.category = category;
    this.setState({
      showStatus: 2,
    });
  };
  //修改分类
  updateCategory = async () => {
    console.log("updateCategory()");
    // 先进行表单验证，验证通过后才能往下走
    this.form.validateFields(async (err, values) => {  //values: 所有表单数据的对象
      if (!err) {
        // 1. 隐藏确认框
        this.setState({
          showStatus: 0,
        });
        // 准备数据
        const categoryId = this.category._id;
        // const { categoryName } = this.form.getFieldsValue();
        const { categoryName } = values;
        this.form.resetFields();
        // 2. 发送请求更新分类
        const result = await reqUpdateCategory(categoryId, categoryName);
        if (result.status === 0) {
          // 3. 重新显示列表
          this.getCategorys();
        }
      } else {
        message.error("表单验证不通过！" + err.message);
      }
    });
  };
  //点击“添加”按钮后，显示添加分类的确认框
  showAdd = () => {
    this.setState({
      showStatus: 1,
    });
  };
  //添加分类
  addCategory = () => {
    console.log("addCategory()");
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏显示框
        this.setState({
          showStatus: 0,
        });
        // const { parentId, categoryName } = this.form.getFieldsValue();
        const { parentId, categoryName } = values
        this.form.resetFields();
        //添加分类请求
        const result = await reqAddCategory(parentId, categoryName);
        if (result.status === 0) {
          // 添加的分类就是当前分类列表下的分类
          if (parentId === this.state.parentId) {
            //重新获取当前分类列表显示
            this.getCategorys();
          } else if (parentId === "0") {
            this.getCategorys("0");
          }
        }
      } else {
        message.error("表单验证不通过！" + err.message);
      }
    });
  };
  //响应点击取消：隐藏确定框
  handleCancel = () => {
    this.form.resetFields();
    this.setState({
      showStatus: 0,
    });
  };
  //为第一次render准备数据
  componentWillMount() {
    this.initColums();
  }
  //发送异步ajax请求，生成列表数据内容
  componentDidMount() {
    this.getCategorys();
  }
  render() {
    const {
      categorys,
      subCategorys,
      parentId,
      parentName,
      loading,
      showStatus,
    } = this.state;
    const category = this.category || {}; //如果还没有，指定一个空对象
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: 5 }} />
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus" />
        添加
      </Button>
    );
    return (
      <Card
        title={title}
        extra={extra}
        style={{ borderRadius: 15, border: "none" }}
      >
        <Table
          rowKey="_id"
          // size="small"
          loading={loading}
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          pagination={{ defaultPageSize: 8, showQuickJumper: true }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          okText="确认"
          cancelText="取消"
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => (this.form = form)}
          />
        </Modal>
        <Modal
          title="修改分类"
          visible={showStatus === 2}
          okText="确认"
          cancelText="取消"
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => (this.form = form)}
          />
        </Modal>
      </Card>
    );
  }
}
