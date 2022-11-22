import React, { Component } from "react";
import { Card, List, Icon } from "antd";

import LinkButton from "../../components/link-button";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqACategory } from "../../api/index";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

/* Product的详情页 */
export default class ProductDetail extends Component {
  state = {
    cName1: "", //一级分类名称
    cName2: "", //二级分类名称
  };
  /*memoryUtils文件中的products结构如下： 
  {
    "status": 1,
    "imgs": [
        "华硕.webp"
    ],
    "_id": "6354f6c85853d86c8239581c", // 此商品的id
    "categoryId": "6354f6b65853d86c8239581b", // 二级分类id
    "pCategoryId": "6354f4895853d86c82395808", // 一级分类id
    "name": "联想ThinkPad 翼4809",
    "desc": "年度重量级新品，X390、T490全新登场 更加轻薄机身设计9",
    "price": 65999,
    "detail": "<p>想你所需，超你所想！精致外观，轻薄便携带光驱，内置正版office杜绝盗版死机，全国联保两年！ 222\\n</p>\n<p>联想（Lenovo）扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【E2-9010/4G/128G固态】 2G独显 内置\\n</p>\n<p>99999\\n</p>\n",
    "__v": 0
}
  */
  getCategoryName = async () => {
    //得到当前商品的分类ID
    const { pCategoryId, categoryId } = memoryUtils.product
    if (pCategoryId === "0") {
      //一级分类下的商品
      const result = await reqACategory(categoryId);
      console.log("result", result); 
      const cName1 = result.data.name;
      this.setState({ cName1 });
    } else {
      //二级分类下的产品
      /* 通过多个await方式发送多个请求：后面一个请求是在前面一个请求成功返回之后才发送请求
      const result1 = await reqACategory(pCategoryId);
      const result2 = await reqACategory(categoryId);
      const cName1 = result1.data.name;
      const cName2 = result2.data.name;
      this.setState({
        cName1,
        cName2,
      }); */
      const results = await Promise.all([
        reqACategory(pCategoryId),
        reqACategory(categoryId),
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({
        cName1,
        cName2,
      });
    }
  };
  componentDidMount() {
    this.getCategoryName();
  }
  componentWillUnmount(){
    memoryUtils.product = {}
  }
  render() {
    const { name, desc, price, detail, imgs } = storageUtils.getProduct()
    const { cName1, cName2 } = this.state;
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ marginRight: 15, fontSize: 20 }} />
          {/* <span className="iconfont icon-0-55" style={{ marginBottom: 0, fontSize: 30 }}></span> */}
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className="product-detail">
        <List size="small">
          <List.Item>
            <span className="left">商品名称: </span>
            <span>{name}</span>
          </List.Item>
          <List.Item>
            <span className="left">商品描述: </span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className="left">商品价格: </span>
            <span>{price}</span>
          </List.Item>
          <List.Item>
            <span className="left">所属分类: </span>
            <span>
              {cName1 + (cName2 ? "-->" + cName2 : "")}
            </span>
          </List.Item>
          <List.Item>
            <span className="left">商品图片: </span>
            <span>
              {imgs && imgs.map(img => (
                <img
                  key={img}
                  className="product-img"
                  src={BASE_IMG_URL + img}
                  alt="img"
                />
              ))}
            </span>
          </List.Item>
          <List.Item>
            <span className="left">商品详情: </span>
            <span
              dangerouslySetInnerHTML={{
                __html: detail,
              }}
            ></span>
          </List.Item>
        </List>
      </Card>
    );
  }
}
