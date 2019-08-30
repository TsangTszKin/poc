/**
 * @fileOverview
 * @author huangtonger@aliyun.com
 */

import React from 'react';
import Navigator from './Navigator.jsx';
import ToolBar from './Toolbar.jsx';
import Contextmenu from './Contextmenu.jsx';
import Itempanel from './Itempanel.jsx';
import Detailpanel from './Detailpannel.jsx';
import Editor from './Editor.jsx';
import Page from './Page.jsx';
import { Checkbox, Input, InputNumber, Drawer, Button, Divider } from 'antd';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import './baseFlowEditor.css';
import G6 from '@antv/g6';
// import G6Plugins from '@antv/g6/build/plugins';
import startPng from '@/assets/editor/start.png';
import controlPng from '@/assets/editor/control.png';
import queryPng from '@/assets/editor/query.png';
import rulePng from '@/assets/editor/rule.png';
import ruleSetPng from '@/assets/editor/ruleSet.png';
import assignPng from '@/assets/editor/assign.png';
import outputPng from '@/assets/editor/output.png';
import EditorStore from '@/store/EditorStore';
import { inject, observer, Provider } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Info from '@/container/system/testing/Info';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

import Rule from '@/components/business/node/Rule';
import Control from '@/components/business/node/Control';
import Query from '@/components/business/node/Query';
import Assign from '@/components/business/node/Assign';
import RulesetForProcess from '@/components/business/node/RulesetForProcess';
import RulesetForGreedy from '@/components/business/node/RulesetForGreedy';
import RulesetForGreedy2 from '@/components/business/node/RulesetForGreedy2';

import OutPut from '@/components/business/node/OutPut';

@withRouter
@observer
export default class BaseFlowEditor extends Editor {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      curZoom: {}, minZoom: {}, maxZoom: {}, selectedModel: {}, inputingLabel: {}
    }
    this.ouputJson = this.ouputJson.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.nodes = [{ "type": "node", "shape": "circle", "size": "72*72", "color": "#FA8C16", "label": "开始", "x": 267, "y": 101, "id": "01ce9b4e", "index": 0, "nodeType": '' }, { "type": "node", "shape": "flow-rhombus", "size": "80*72", "color": "#13C2C2", "label": "条件判断", "x": 275, "y": 263, "id": "e35878d5", "index": 1 }, { "type": "node", "shape": "flow-rect", "size": "80*48", "color": "#1890FF", "label": "输出1", "x": 95, "y": 336, "id": "e1408f30", "index": 3 }, { "type": "node", "shape": "flow-rect", "size": "80*48", "color": "#1890FF", "label": "输出2", "x": 444.5, "y": 349, "id": "740d9190", "index": 6 }]
    this.edges = [{ "shape": "flow-polyline-round", "source": "01ce9b4e", "sourceAnchor": 2, "target": "e35878d5", "targetAnchor": 0, "id": "71a9d1f5", "index": 2 }, { "shape": "flow-polyline-round", "source": "e35878d5", "sourceAnchor": 3, "target": "e1408f30", "targetAnchor": 0, "id": "07097a7b", "index": 4 }, { "shape": "flow-polyline-round", "source": "e35878d5", "sourceAnchor": 1, "target": "740d9190", "targetAnchor": 0, "id": "af3a8234", "index": 5 }]
  }

  componentDidMount() {
    console.log("this.editor", this.editor)
    super.componentDidMount();
    // const editor = this.editor;
    const page = this.editor.getCurrentPage();
    page.changeAddEdgeModel({
      shape: 'flow-polyline-round'
    });
    this.init();
  }
  ouputJson() {
    const curPage = this.editor.getCurrentPage();
    const graphData = curPage.save();
    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];
    console.log("nodes", nodes);
    console.log("edges", edges);
    console.log("nodes", JSON.stringify(nodes));
    console.log("edges", JSON.stringify(edges));
  }
  init() {
    // console.log("G6", G6)
    // const data = {
    //   nodes:this.nodes,
    //   edges:this.edges
    // };
    // const graph = new G6.Graph({
    //   container: 'mountNode1',
    //   width: 500,
    //   height: 500
    // });
    // graph.read(data);
  }


  showDrawer() {
    this.setState({
      visible: true
    })
  }
  onClose() {
    this.setState({
      visible: false
    })
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedModel.id !== this.state.selectedModel.id) {//节点聚焦发生改变
      EditorStore.currentNode.setName(nextState.selectedModel.label);
      EditorStore.currentNode.setType(nextState.selectedModel.nodeType);
    }
  }
  render() {
    const { curZoom, minZoom, maxZoom, selectedModel, inputingLabel } = this.state;
    console.warn("selectedModel", selectedModel);
    const splitSize = selectedModel.size ? selectedModel.size.split('*') : '';
    const width = splitSize[0];
    const height = splitSize[1];
    const labelInput = (
      <div className="p">
        名称：
        <Input
          size="small"
          className="input name-input"
          value={inputingLabel ? inputingLabel : selectedModel.label}
          onChange={ev => {
            this.setState({
              inputingLabel: ev.target.value
            });
          }}
          onBlur={ev => {
            this.updateGraph('label', ev.target.value);
            this.setState({
              inputingLabel: null
            });
          }}
        />
      </div>
    );
    const colorInput = (
      <div className="p">
        颜色：
        <ColorPicker
          animation="slide-up"
          className="color-picker"
          color={selectedModel.color}
          onClose={ev => {
            this.updateGraph('color', ev.color);
          }} />
      </div>);
    return (
      <Provider g6EditorStore={EditorStore}>
        <div className="editor">

          <ToolBar editor={this.editor} ouputJson={this.ouputJson} />
          {/* <div style={{ height: '42px' }}></div> */}
          <div className="bottom-container clearfix">
            <Contextmenu editor={this.editor} />
            <Itempanel editor={this.editor} content={
              <div>
                <img draggable="false" src={startPng} data-type="node" data-shape="flow-circle" data-size="72*72" data-color="#e44b4e" data-label="开始" data-nodeType="start" className="getItem" />
                <img draggable="false" src={controlPng} data-type="node" data-shape="flow-rhombus" data-size="80*72" data-color="#13C2C2" data-label="控制节点" data-nodeType="control" className="getItem" />
                <img draggable="false" src={queryPng} data-type="node" data-shape="flow-capsule" data-size="80*48" data-color="#722ED1" data-label="查询节点" data-nodeType="query" className="getItem" />
                <img draggable="false" src={rulePng} data-type="node" data-shape="flow-rect" data-size="60*60" data-color="#f8be02" data-label="规则节点" data-nodeType="rule" className="getItem" />
                <img draggable="false" src={ruleSetPng} data-type="node" data-shape="flow-rect" data-size="60*60" data-color="#ff6f00" data-label="规则集节点" data-nodeType="ruleset" className="getItem" />
                <img draggable="false" src={assignPng} data-type="node" data-shape="flow-rect" data-size="80*48" data-color="#1890FF" data-label="赋值节点" data-nodeType="assign" className="getItem" />
                <img draggable="false" src={outputPng} data-type="node" data-shape="flow-rect" data-size="80*48" data-color="#fa0202" data-label="输出节点" data-nodeType="output" className="getItem" />

                <img draggable="false" src={outputPng} data-type="node" data-shape="flow-rect" data-size="80*48" data-color="#fa0202" data-label="输出节点" data-nodeType="output" className="getItem" />
              </div>
            } />
            <Detailpanel editor={this.editor} content={
              <div>
                <div data-status="node-selected" className="panel" style={{ display: 'none' }}>
                  <div className="panel-title">节点</div>
                  <div className="block-container">
                    {labelInput}
                    <div className="p">
                      尺寸：
                    <InputNumber
                        size="small"
                        value={width} className="input width-input"
                        onChange={value => {
                          const newSize = value + '*' + height;
                          selectedModel.size = newSize;
                          this.setState({
                            selectedModel
                          });
                          this.updateGraph('size', newSize);
                        }}
                      />
                      <InputNumber
                        size="small"
                        value={height} className="input height-input"
                        onChange={value => {
                          const newSize = width + '*' + value;
                          selectedModel.size = newSize;
                          this.setState({
                            selectedModel
                          });
                          this.updateGraph('size', newSize);
                        }}
                      />
                    </div>
                    {colorInput}
                  </div>
                </div>

                <div data-status="node-selected" className="panel" id="canvas_detailpanel">
                  <div className="panel-title">当前节点：{common.isEmpty(EditorStore.currentNode.getName) ? '无' : EditorStore.currentNode.getName}</div>
                  <div className="block-container" style={{ textAlign: 'center' }}>
                    <Checkbox onChange={this.toggleGrid.bind(this)} >网格对齐</Checkbox> <Button type="primary" style={{ display: common.isEmpty(EditorStore.currentNode.getName) || EditorStore.currentNode.getType === 'start' ? 'none' : 'inline-block', marginLeft: '20px' }} onClick={this.showDrawer}>编辑业务</Button>
                  </div>
                </div>

                <Divider style={{ marginTop: '0' }} />
                <Info auth={true} />

              </div>
            } />
            <Page editor={this.editor} />
          </div>
          <Drawer
            title="Basic Drawer"
            placement="right"
            onClose={this.onClose.bind(this)}
            visible={this.state.visible}
            width={1000}
            maskClosable={true}
            mask={true}
            closable={true}
            destroyOnClose={true}
          >
            {
              (() => {
                switch (EditorStore.currentNode.getType) {
                  case 'control':
                    return <Control isCanCommit={false} type="strategy" id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  case 'query':
                    return <Query isCanCommit={false} type="strategy" id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  case 'assign':
                    return <Assign isCanCommit={false} type="strategy" id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  case 'rule':
                    return <Rule isCanCommit={false} id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  case 'ruleSet':
                    return <RulesetForProcess isCanCommit={false} id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  case 'greedy-ruleSet':
                    return <RulesetForGreedy2 isCanCommit={false} id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  case 'process-ruleSet':
                    return <RulesetForGreedy isCanCommit={false} id={""} nodeId={""} currentName={""} auth={{ save: publicUtils.isAuth("business:strategy:strategy:edit") }} />

                  default:
                    break;

                }
              })()
            }
          </Drawer>


        </div>
      </Provider>
    );
  }
}
