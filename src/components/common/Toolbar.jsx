import React from 'react';
import PropTypes from 'prop-types';
import '@/styles/toolbar.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.saveAsImg = this.saveAsImg.bind(this);
  }
  componentDidMount() {
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
    return (
      <div className="toolbar" ref={el => { this.toolbarContainer = el; }}>


        <i className="command  icon-undo" title="撤销" onClick={() => this.props.callBack("undo")}></i>
        {/* <i className="command  icon-redo" title="重做" onClick={() => this.props.callBack("redo")}></i> */}
        <span className="separator"></span>
        <i className="command  icon-copy" title="复制" onClick={() => this.props.callBack("copy")}></i>
        <i className="command  icon-paste" title="粘贴" onClick={() => this.props.callBack("paste")}></i>
        <i className="command  icon-cut" title="剪切" onClick={() => this.props.callBack("cut")}></i>


        <i className="command  icon-delete" title="删除" onClick={() => this.props.callBack("delete")}></i>
        <span className="separator"></span>
        <i className="command  icon-select-all" title="全选" onClick={() => this.props.callBack("selectAll")}></i>


        <i className="command  icon-duplicate" title="副本" onClick={() => this.props.callBack("duplicate")}></i>

        
        <span className="separator"></span>
        <i className="command  icon-zoom-in" title="放大" onClick={() => this.props.callBack("zoomIn")}></i>
        <i className="command  icon-zoom-out" title="缩小" onClick={() => this.props.callBack("zoomOut")}></i>
        <span className="separator"></span>
      </div>
    );
  }
}
Toolbar.propTypes = {
  callBack: PropTypes.func,
};
Toolbar.defaultProps = {
  callBack: () => { },
}
export default Toolbar;
