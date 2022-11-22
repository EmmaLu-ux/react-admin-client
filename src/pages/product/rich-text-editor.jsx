import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import PropTypes from "prop-types";

/* 富文本编辑器---用来指定商品详情组件 */
export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string,
  };
  state = {
    editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
  };
  constructor(props) {
    super(props);
    const html = this.props.detail;
    // const contentBlock = htmlToDraft(html);
    if (html) {  //如果有值，根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  }
  /* 输入过程中实时的回调 */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      //发起上传图片的ajax请求
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/manage/img/upload");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        const url = response.data.url //得到图片的url
        // resolve(url);
        resolve({data: {link: url}})
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };
  getDetail = () => {
    //返回输入数据对应的html格式的文本
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  };
  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{
          border: "none",
          backgroundColor: "rgb(247, 248, 252)",
          height: 200,
          paddingLeft: 10,
        }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />
    );
  }
}
