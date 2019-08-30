import React from 'react';
import G6Editor from '@antv/g6-editor';
import PropTypes from 'prop-types';
import './toolbar.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.saveAsImg = this.saveAsImg.bind(this);
  }
  createToolbar(container) {
    return new G6Editor.Toolbar({
      container
    });
  }
  getCreateToolbar() {
    const { createToolbar } = this.props;
    return createToolbar ? createToolbar : this.createToolbar;
  }
  componentDidMount() {
    const { editor } = this.props;
    const createToolbar = this.getCreateToolbar();
    const toolbar = createToolbar(this.toolbarContainer);
    editor.add(toolbar);
  }
  saveAsImg() {
    html2canvas(window.document.querySelector(".page .graph-container canvas"), {
      onrendered(canvas) {
        const dataURL = canvas.toDataURL('image/png');
        console.log(dataURL);
        // return
        const link = document.createElement('a');
        const saveName = '图片' + ('.png' || 'graph.png');//<====选中模块名称
        link.download = saveName;
        link.href = dataURL.replace('image/png', 'image/octet-stream');
        link.click();
      }
    });
  }
 
  render() {
    return (<div className="toolbar" ref={el => { this.toolbarContainer = el; }}>
      <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css" />
      <i data-command="undo" className="command iconfont icon-undo" title="撤销"></i>
      <i data-command="redo" className="command iconfont icon-redo" title="重做"></i>
      <span className="separator"></span>
      <i data-command="copy" className="command iconfont icon-copy-o" title="复制"></i>
      <i data-command="paste" className="command iconfont icon-paster-o" title="粘贴"></i>
      <i data-command="delete" className="command iconfont icon-delete-o" title="删除"></i>
      <span className="separator"></span>
      <i data-command="zoomIn" className="command iconfont icon-zoom-in-o" title="放大"></i>
      <i data-command="zoomOut" className="command iconfont icon-zoom-out-o" title="缩小"></i>
      <i data-command="autoZoom" className="command iconfont icon-fit" title="适应画布"></i>
      <i data-command="resetZoom" className="command iconfont icon-actual-size-o" title="实际尺寸"></i>
      <span className="separator"></span>
      <i data-command="toBack" className="command iconfont icon-to-back" title="层级后置"></i>
      <i data-command="toFront" className="command iconfont icon-to-front" title="层级前置"></i>
      <span className="separator"></span>
      <i data-command="multiSelect" className="command iconfont icon-select" title="多选"></i>
      <i data-command="addGroup" className="command iconfont icon-group" title="成组"></i>
      <i data-command="unGroup" className="command iconfont icon-ungroup" title="解组"></i>
      <a onClick={this.saveAsImg}> 保存为图片</a>
      <a onClick={this.props.ouputJson}> 输出json</a>
    </div>);
  }
}
Toolbar.propTypes = {
  createToolbar: PropTypes.function,
  editor: PropTypes.object
};
export default Toolbar;
