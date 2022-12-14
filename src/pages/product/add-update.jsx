import React, { PureComponent } from "react"
import { Input, Card, Form, Cascader, Button, Icon, message } from "antd"

import LinkButton from "../../components/link-button"
import { reqGetCategorys, reqAddOrUpdateProduct } from "../../api"
import PicturesWall from "./pictures-wall"
import RichTextEditor from "./rich-text-editor"
import memoryUtils from "../../utils/memoryUtils"

const { Item } = Form
const { TextArea } = Input

/* Product的添加和更新的子路由组件 */
class ProductAddUpdate extends PureComponent {
  state = {
    options: [],
  }
  constructor(props) {
    super(props)
    //创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }
  /* 根据categorys生成options数组 */
  initOptions = async (categorys) => {
    const options = categorys.map((c) => ({ //options数组的结构如下
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))
    /* 如果是一个二级分类商品的更新 */
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== "0") {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      let childOptions
      if (subCategorys && subCategorys.length > 0) {
        //生成二级下拉列表的options
        childOptions = subCategorys.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: true,
        }))
      }
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      )
      //关联对应的一级option上
      targetOption.children = childOptions
    }
    this.setState({ options })
  }
  /* 异步获取一级/二级分类列表，并显示
  async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
  */
  getCategorys = async (parentId) => {
    const result = await reqGetCategorys(parentId)

    if (result.status === 0) {
      const categorys = result.data
      //如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys)
      } else {
        //如果是二级列表
        return categorys //返回二级列表 => 当前async函数返回的promise就会成功且value为categorys
      }
    }
    // return 1
  }
  /* 用于加载下一级列表的回调函数 */
  loadData = async (selectedOptions) => {
    //得到选择的option对象
    const targetOption = selectedOptions[0]
    //显示loading
    targetOption.loading = true
    //根据选中的分类，请求获取二级分类列表
    /* async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定 */
    console.log('targetOption.value', targetOption.value)
    const subCategorys = await this.getCategorys(targetOption.value)
    console.log('subCategorys', subCategorys)
    //隐藏loading
    targetOption.loading = false
    //如果二级分类数组有数据
    if (subCategorys && subCategorys.length > 0) {
      //生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //关联到当前options上
      targetOption.children = childOptions
    } else {
      //当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    //更新options状态
    this.setState({
      options: [...this.state.options],
    })
    console.log('options', this.state.options)
  }
  submit = () => {
    //进行表单验证，如果都通过了，才发送请求
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //表单验证通过，可以发起ajax请求了
        console.log("表单验证通过!", values)
        /* 收集数据，并封装成product对象 */
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = "0"
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        console.log(pCategoryId, categoryId, categoryIds)
        //获取图片
        const imgs = this.pw.current.getImgs()
        // console.log('imgs', imgs)
        //获取富文本输入内容
        const detail = this.editor.current.getDetail()
        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId,
        }
        //如果是更新，需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id
        }

        /* 调用接口请求函数去添加/更新 */
        const result = await reqAddOrUpdateProduct(product)
        // console.log('result', result.status)
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功！`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败！`)
        }
      } else {
        message.error("表单验证不通过！")
      }
    })
  }
  /* 验证价格的自定义验证函数 */
  validatePrice = (rules, value, callback) => {
    if (value * 1 > 0) {
      callback() //验证通过
    } else {
      callback("价格必须大于0") //验证没通过
    }
  }

  componentDidMount() {
    this.getCategorys("0")
  }
  componentWillMount() {
    const product = memoryUtils.product
    //保存一个是否是更新的标识
    //如果是添加，就没有值，否则就有值（修改商品）
    this.isUpdate = !!product._id //变量前加两个感叹号：强制转换为布尔类型
    this.product = product || {} //保存商品（如果没有，保存的是{}）
  }
  //在组件卸载之前清除保存的数据
  componentWillUnmount(){
    memoryUtils.product = {}
  }
  render() {
    const { isUpdate, product } = this
    const { pCategoryId, categoryId, imgs, detail } = product
    const categoryIds = [] //用来接收级联分类的id
    if (isUpdate) {
      if (pCategoryId === "0") {
        //商品是一个一级分类的商品
        categoryIds.push(categoryId)
      } else {
        //商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
        </LinkButton>
        <span>{isUpdate ? "更新商品" : "添加商品"}</span>
      </span>
    )
    const { getFieldDecorator } = this.props.form
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "必须输入商品名称" }],
            })(<Input placeholder="请输入商品名称" style={{border: "none", backgroundColor: "rgb(247, 248, 252)"}}/>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "必须输入商品描述" }],
            })(
              <TextArea
                placeholder="请输入商品描述"
                autoSize={{ minRows: 2, maxRows: 6 }}
                style={{border: "none", backgroundColor: "rgb(247, 248, 252)"}}
              />
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                { validator: this.validatePrice },
              ],
            })(<Input type="number" placeholder="请输入商品价格" addonAfter="元" style={{border: "none", backgroundColor: "rgb(247, 248, 252)"}}/>)}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "必须指定商品分类" }],
            })(
              <Cascader
                placeholder="请指定商品分类"
                options={this.state.options} /* 需要显示的列表数据数组 */
                loadData={
                  this.loadData
                } /* 当选择某个列表项，加载下一级列表的监听回调 */
                className="cascader-input"
              />
            )}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          {/* <Item> */}
            <Button type="primary" onClick={this.submit} style={{marginLeft: "94.5%"}}>
              提交
            </Button>
          {/* </Item> */}
        </Form>
      </Card>
    )
  }
}
export default Form.create()(ProductAddUpdate)
