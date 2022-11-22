import React, { Component } from "react";
import { Upload, Icon, Modal, message } from "antd";
import PropTypes from "prop-types";

import { reqDeleteImg } from "../../api";
import {BASE_IMG_URL} from '../../utils/constants.js'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
/* 用于图片上传的组件 */
export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array,
  };
  state = {
    previewVisible: false, //标识是否显示大图预览
    previewImage: "", //大图的url
    fileList: [
        /* {
          uid: "-1", //每个file都有自己唯一的id，建议设置为负数，防止和内部产生的id冲突
          name: "image.png", //图片文件名
          status: "done", //图片状态：done-已上传，uploading-正在上传中，removed-已删除，error-错误
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", //图片地址
        }, */
    ],
  };

  constructor(props) {
    super(props);
    let fileList = []
    //如果传入了imgs
    const {imgs} = this.props
    if(imgs && imgs.length > 0){
        fileList = imgs.map((img, index) => ({
            uid: -index,
            name: img,
            status: 'done',
            url: BASE_IMG_URL + img
        }))
    }
    // 初始化状态
    this.state = {
      previewVisible: false, //标识是否显示大图预览
      previewImage: "", //大图的url
      fileList
    };
  }
  /* 获取所有已上传图片文件名的数组 */
  getImgs = () => {
    return this.state.fileList.map(file => file.name);
  };
  /* 隐藏Modal */
  handleCancel = () => this.setState({ previewVisible: false });
  /* 显示指定file对应的大图 */
  handlePreview = async (file) => {
    console.log('handlePreview()')
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  /* file: 当前操作的图片文件（上传/删除）
  fileList: 所有已上传图片文件对象的数组 */
  handleChange = async ({ file, fileList }) => {
    console.log(
      "handleChange()",
      file.status,
      fileList.length,
      file === fileList[fileList.length - 1]
    );
    //一旦上传成功，将当前上传的file的信息修正(name, url)
    if(file.status === "done") {
      const result = file.response; //{status: 0, data: {name: xxx.webp, url: '图片地址'}}
      console.log('result', result)
      if(result.status === 0) {
        message.success("上传图片成功！");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error("上传图片失败！");
      }
    } else if (file.status === "removed") {
      //删除图片
      const result = await reqDeleteImg(file.name);
      console.log('result-removed', result)
      if (result.status === 0) {
        message.success("删除图片成功！");
      } else {
        message.error("删除图片失败！");
      }
    }
    //在操作（上传/删除）过程中更新fileList的状态
    this.setState({ fileList });
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/api/manage/img/upload" //上传图片的接口地址
          accept="image/*" //只接收图片类型的文件
          name="image" //请求参数名
          listType="picture-card" //卡片样式
          fileList={fileList} //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} /> {/* http://localhost:5000/upload/image-1668909123095.webp */}
        </Modal>
      </div>
    );
  }
}
