import React from 'react';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/common';
import { inject, observer } from 'mobx-react';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
const echarts = require('echarts');


@inject('store')
@observer
class UseTimes extends React.Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }
    componentDidMount() {

    }
    init() {

        let data = this.props.store.useTimesTree.getData;
        formatUseTimesTree(data);

        function formatUseTimesTree(obj) {
            obj.collapsed = false;
            // delete obj.id;
            // obj.name = `${obj.name}${obj.hit ? '（命中）' : ''}`;
            // obj.type = getType(obj.type, obj.secondType);
            // delete obj.type;
            // delete obj.secondType;
            // delete obj.hit;
            // delete obj.mold;
            // delete obj.parentId;
            // delete obj.sort;
            if (!common.isEmpty(obj.nodes)) {
                obj.children = obj.nodes;
                delete obj.nodes;
                obj.children.forEach(element => {
                    formatUseTimesTree(element);
                })
            }
        }
        function getType(type, secondType) {
            let editType = null;
            if (type == 0) {//控制节点
                editType = 'control';
            } else if (type === 1) {//执行节点
                if (secondType == 0) {
                    editType = 'rule';
                } else if (secondType == 1) {
                    editType = 'ruleSet';
                } else if (secondType == 2) {
                    editType = 'query';
                } else if (secondType == 3) {
                    editType = 'output';
                } else if (secondType == 4) {
                    editType = 'assign';
                }
            } else {
                editType = 'strategy';
            }
            return editType
        }

        console.log("data", data);
        var Util = G6.Util;
        // 准备布局配置
        var layoutCfg = {
            "direction": "LR",
            "nodeSep": 20,
            "nodeSize": 50,
            "rankSep": 200
        };
        // 自定义树节点
        var DEFAULT_NODE_SIZE = 5;
        G6.registNode('treeNode', {
            draw(cfg, group) {
                var model = cfg.model;
                console.log("model", model)
                var r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
                var shapeCfg = {
                    attrs: {
                        x: cfg.x,
                        y: cfg.y,
                        r: r,
                        stroke: '#003380',
                        fill: 'white',
                        fillOpacity: 1,
                    },
                };
                // if (model.children && model.children.length) {
                //   shapeCfg.class = model.isCollapsed ? 'spreadoutButton' : 'collapseButton';
                //   shapeCfg.attrs.fill = '#044A9A';
                //   shapeCfg.attrs.stroke = '#003380';
                //   shapeCfg.attrs.fillOpacity = 0.4;
                // }
                switch (model.type) {
                    case 'control':
                        shapeCfg.attrs.fill = '#B3B3B3';
                        break;
                    case 'rule':
                        shapeCfg.attrs.fill = '#8DB6CD';
                        break;
                    case 'ruleSet':
                        shapeCfg.attrs.fill = '#696969';
                        break;
                    case 'query':
                        shapeCfg.attrs.fill = '#EEEE00';
                        break;
                    case 'output':
                        shapeCfg.attrs.fill = '#66CD00';
                        break;
                    case 'assign':
                        shapeCfg.attrs.fill = '#551A8B';
                        break;
                    case 'strategy':
                        shapeCfg.attrs.fill = '#EE0000';
                        break;


                    default:
                        break;
                }
                // if (model.root) {
                //   shapeCfg.attrs.fill = '#044A9A';
                //   shapeCfg.attrs.stroke = '#003380';
                //   shapeCfg.attrs.fillOpacity = 0.7;
                // }
                if (model.hit) {
                    shapeCfg.attrs.fill = '#e44b4e';
                    shapeCfg.attrs.stroke = '#003380';
                    // shapeCfg.attrs.fillOpacity = 0.7;
                }
                shapeCfg.attrStash = Util.mix({}, shapeCfg.attrs);
                return group.addShape('circle', shapeCfg);
            },
            afterDraw(cfg, group) {
                var model = cfg.model;
                var r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
                var align = model.align;
                var labelAttrs = {
                    text: model.name,
                    fill: '#666',
                    textBaseline: 'middle',
                    fontSize: 30,
                    x: cfg.x + r + DEFAULT_NODE_SIZE,
                    y: cfg.y,
                    textAlign: 'left',
                };
                if (align === 'R') {
                    Util.mix(labelAttrs, {
                        x: cfg.x - r - DEFAULT_NODE_SIZE,
                        y: cfg.y,
                        textAlign: 'right',
                    });
                } else if (align === 'T' || align === 'CH') {
                    Util.mix(labelAttrs, {
                        x: cfg.x,
                        y: cfg.y + r + DEFAULT_NODE_SIZE,
                        textAlign: 'right',
                        rotate: -Math.PI / 2,
                    });
                } else if (align === 'B') {
                    Util.mix(labelAttrs, {
                        x: cfg.x,
                        y: cfg.y - r - DEFAULT_NODE_SIZE,
                        textAlign: 'left',
                        rotate: -Math.PI / 2,
                    });
                }
                var label = group.addShape('text', {
                    attrs: labelAttrs,
                });
                return label;
            }
        });
        // 生成树图实例
        var tree = new G6.Tree({
            id: 'usetime-main',                            // 容器ID
            height: 450,                         // 画布高
            fitView: 'autoZoom',                 // 自动缩放
            layoutFn: G6.Layout.LayeredTidyTree, // 布局类型
            layoutCfg: layoutCfg,                // 布局配置
            showButton: false,
        });
        // 加载数据
        tree.source(data);
        tree.node().shape('treeNode');
        tree.edge()
            .shape('smooth')
            .style({
                stroke: '#A9BCD3'
            });
        // 渲染树图
        tree.render();
        // 添加事件
        tree.on('mouseenter', function (ev) {
            var shape = ev.shape;
            if (shape && shape.hasClass('Button')) {
                shape.attr('fillOpacity', 0.2);
                shape.attr('strokeOpacity', 0.8);
                tree.refresh();
            }
        });
        tree.on('mouseleave', function (ev) {
            var shape = ev.shape;
            var attrStash;
            if (shape && shape.hasClass('Button')) {
                attrStash = shape.get('attrStash');
                shape.attr(attrStash);
                tree.refresh();
            }
        });
    }
    render() {
        if (this.props.store.useTimesTree.getShow) {
            let self = this;
            setTimeout(() => {
                self.init();
            }, 1000);
        }
        return (
            <div>
                <Modal
                    title={this.props.store.useTimesTree.getData.name}
                    visible={this.props.store.useTimesTree.getShow}
                    footer={null}
                    width="850px"
                    destroyOnClose={true}
                    height="auto"
                    onCancel={() => { this.props.store.useTimesTree.setShow(false) }}
                >
                    <p>使用次数：<span style={{ color: '#E44B4E' }}>{this.props.store.useTimesTree.getTimes}</span>次</p>
                    <div id="usetime-main" style={{ minHeight: '300px', display: this.props.store.useTimesTree.getShow ? 'block' : 'none' }}></div>
                </Modal>
            </div>
        )
    }
}
export default UseTimes