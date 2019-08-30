import React from 'react';
import G6Editor from '@antv/g6-editor';
import PropTypes from 'prop-types';
import './page.css';
import G6 from '@antv/g6';

const nodes = [
  {
      "type": "node",
      "shape": "flow-circle",
      "size": "72*72",
      "color": "#e44b4e",
      "label": "近30天线上交易笔数\t",
      "x": 237,
      "y": 206,
      "id": "121c120a",
      "index": 7,
      "nodeType": "start"
  },
  {
      "type": "node",
      "shape": "flow-rhombus",
      "size": "80*72",
      "color": "#13C2C2",
      "label": "控制节点",
      "x": 80,
      "y": 323,
      "id": "330a075f",
      "index": 8,
"nodeType": "control"
  },
  {
      "type": "node",
      "shape": "flow-rhombus",
      "size": "80*72",
      "color": "#13C2C2",
      "label": "控制节点",
      "x": 386.5,
      "y": 322,
      "id": "b4d0c780",
      "index": 9,
"nodeType": "control"
  },
  {
      "type": "node",
      "shape": "flow-rect",
      "size": "60*60",
      "color": "#f8be02",
      "label": "规则",
      "x": 18,
      "y": 433,
      "id": "f582c391",
      "index": 10,
"nodeType": "rule"
  },
  {
      "type": "node",
      "shape": "flow-rect",
      "size": "60*60",
      "color": "#ff6f00",
      "label": "规则集",
      "x": 136.5,
      "y": 434.5,
      "id": "8b9a23e8",
      "index": 11,
"nodeType": "ruleSet"
  },
  {
      "type": "node",
      "shape": "flow-capsule",
      "size": "80*48",
      "color": "#722ED1",
      "label": "查询节点",
      "x": 289.50000000000006,
      "y": 433,
      "id": "329066fd",
      "index": 12,
"nodeType": "query"
  },
  {
      "type": "node",
      "shape": "flow-rect",
      "size": "80*48",
      "color": "#1890FF",
      "label": "赋值节点",
      "x": 387,
      "y": 434.5,
      "id": "c71f6a08",
      "index": 13,
"nodeType": "assign"
  },
  {
      "type": "node",
      "shape": "flow-rect",
      "size": "80*48",
      "color": "#fa0202",
      "label": "输出节点",
      "x": 488,
      "y": 434.5,
      "id": "82a54e47",
      "index": 14,
"nodeType": "output"
  }
]
const edges = [{"shape":"flow-polyline-round","source":"330a075f","sourceAnchor":3,"target":"f582c391","targetAnchor":0,"id":"f391ce28","index":0},{"shape":"flow-polyline-round","source":"330a075f","sourceAnchor":1,"target":"8b9a23e8","targetAnchor":0,"id":"05e6e7e1","index":1},{"shape":"flow-polyline-round","source":"121c120a","sourceAnchor":2,"target":"330a075f","targetAnchor":0,"id":"e978713a","index":2},{"shape":"flow-polyline-round","source":"121c120a","sourceAnchor":2,"target":"b4d0c780","targetAnchor":0,"id":"e016c47c","index":3},{"shape":"flow-polyline-round","source":"b4d0c780","sourceAnchor":3,"target":"329066fd","targetAnchor":0,"id":"6bb27e38","index":4},{"shape":"flow-polyline-round","source":"b4d0c780","sourceAnchor":2,"target":"c71f6a08","targetAnchor":0,"id":"e4b4be32","index":5},{"shape":"flow-polyline-round","source":"b4d0c780","sourceAnchor":1,"target":"82a54e47","targetAnchor":0,"id":"59e17853","index":6}]
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.init = this.init.bind(this);
    console.log("G6Editor", G6Editor)
  }
  init() {
    G6.registerNode('startNode', {
      draw(item) {
        const group = item.getGraphicGroup();
        const html = G6.Util.createDOM('<img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2848318008,551944810&fm=58" />');
        return group.addShape('dom', {
          attrs: {
            x: 0,
            y: 0,
            width: 100,
            height: 24,
            html
          }
        });
      }
    });
    // console.log("new G6Editor", new G6Editor)
    new G6Editor.Flow.registerNode('k-means', {
      label: 'k 均值聚类',
      color_type: '#1890FF',
      type_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
      state_icon_url: 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg',
      // 设置锚点
      anchor: [
        [0.5, 0, {
          type: 'input'
        }], // 上面边的中点
        [0.5, 1, {
          type: 'output'
        }] // 下边边的中点
      ]
    }, 'model-card');
  }
  createPage(container) {
    const height = window.innerHeight - 38;
    return new G6Editor.Flow({
      graph: {
        container,
        height,
      },
      align: {
        grid: true
      }
    });
  }
  getCreatePage() {
    const { createPage } = this.props;
    return createPage ? createPage : this.createPage;
  }
  componentDidMount() {
    // G6.track(false)
    this.init();
    const { editor } = this.props;
    const createPage = this.getCreatePage();
    const page = createPage(this.pageContainer);
    editor.add(page);

    const curPage = editor.getCurrentPage();
    curPage.read({
      nodes: nodes,
      edges: edges
    });
  }
  render() {
    return (<div className="page" ref={el => { this.pageContainer = el; }}></div>);
  }
}
Page.propTypes = {
  createPage: PropTypes.function,
  editor: PropTypes.object
};
export default Page;
