import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, message } from 'antd';
import TreeCopy from '@/components/process-tree/Tree';
import AddSub from '@/components/process-tree/AddSub';
import { inject, observer, Provider } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';

@withRouter
@inject('processTreeStore')
@observer
class ProcessTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNodeId: ''
        }

        this.props.node.active ? this.style = { color: 'red' } : this.style = {};
        // if (!common.isEmpty(this.props.match.params.type)) {
        //     if (this.props.match.params.type === 'greedy') {
        //         if (this.props.node.status != 4 && this.props.node.mold === 'ruleSet') {
        //             this.style = { color: '#000', opacity: '0.45' }
        //         }
        //     }
        // }
        this.activeFunc = this.activeFunc.bind(this);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        // console.log("nextProps", nextProps);
        nextProps.node.active ? this.style = { color: 'red' } : this.style = {};
        // if (!common.isEmpty(this.props.match.params.type)) {
        //     if (this.props.match.params.type === 'greedy') {
        //         if (this.props.node.status != 4 && this.props.node.mold === 'ruleSet') {
        //             this.style = { color: '#000', opacity: '0.45' }
        //         }
        //     }
        // }
    }
    activeFunc = (newNodeKey, type, secondType, id) => {
        if (!this.props.auth.view) {
            message.warning("你没有此权限哦~");
            return
        }
        // console.log("newNodeKey", newNodeKey)
        if (!this.props.processTreeStore.getIsFinishNode) {
            Modal.warning({
                title: '未完成提示',
                content: '当前节点还没完善数据，请完善数据并且保存后再切换节点！',
            });

            return
        }
        this.props.processTreeStore.changeActiveNode(newNodeKey);

        let editType = '';
        if (this.props.node.mold && this.props.node.mold === 'ruleSet') {
            if (type == 0){
                editType = 'process-ruleSet';
            }else {
                editType = 'greedy-ruleSet';
            }
        } else if (type == 0) {//控制节点
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
        }
        this.props.processTreeStore.setEditType(editType);
        this.props.processTreeStore.setNodeId(id);
    }
    add = (newNodeKey, id) => {
        if (!this.props.auth.add) {
            message.warning("你没有此权限哦~");
            return
        }
        console.log(`${newNodeKey} ${id}`);
        if (!this.props.processTreeStore.getIsFinishNode) {
            Modal.warning({
                title: '未完成提示',
                content: '当前节点还没完善数据，请完善数据并且保存后再新增节点！',
            });

            return
        }
        this.props.processTreeStore.addNodeParams.setParentId(id);
        this.props.processTreeStore.addNodeParams.setActiveKey(newNodeKey);
        this.props.processTreeStore.modal.add.setIsShow(true);
        // this.props.add(newNodeKey, id);
    }
    sub = (subNodeKey, id) => {
        if (!this.props.auth.sub) {
            message.warning("你没有此权限哦~");
            return
        }
        if (!this.props.processTreeStore.getIsFinishNode) {
            if (subNodeKey != this.props.processTreeStore.getEditType) {
                if (sessionStorage.lastestId != id) {
                    Modal.warning({
                        title: '未完成提示',
                        content: '当前节点还没完善数据，请完善数据并且保存后再操作节点！',
                    });
                    return
                }

            }

        }

        if (this.props.processTreeStore.getSaveType === 'strategy' && this.props.match.params.type === 'greedy') {
            this.props.processTreeStore.deleteNodeParams.setRuleSetId(id);
        } else {
            this.props.processTreeStore.deleteNodeParams.setId(id);
        }

        this.props.processTreeStore.modal.sub.setIsShow(true);
        this.props.processTreeStore.setIsFinishNode(true);

    }
    render() {
        return (
            <li className="node">
                {
                    this.props.nodeKey === 0 ? '' : this.props.nodeKey == '0-0' ? <div style={{ height: '21px', float: 'left', borderLeft: '1px dashed gray', marginTop: '-10px' }}></div> : <div style={{ height: '22px', float: 'left', borderLeft: '1px dashed gray', marginTop: '-11px' }}></div>
                }
                {
                    this.props.nodeKey !== 0 ? <p style={{ width: 'fit-content', float: 'left', marginBottom: 0 }}>--</p> : ''
                }
                <div className="node-bus" style={{ marginLeft: this.props.nodeKey === 0 ? '11px' : 0 }}>

                    <div className="node-body" style={this.style} onClick={() => this.activeFunc(this.props.nodeKey, this.props.node.type, this.props.node.secondType, this.props.node.id)} >
                        {(() => {
                            if (this.props.node.mold && this.props.node.mold === 'ruleSet') {
                                return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                            } else {
                                switch (this.props.node.type) {
                                    case -1:
                                        return <Icon type="folder-open" style={{ marginRight: '5px' }} />;
                                        break;
                                    case 0:
                                        return <Icon type="dashboard" style={{ marginRight: '5px' }} />;
                                        break;
                                    case 1:
                                        if (this.props.node.secondType === 2) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 4) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 3) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 0) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 1) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })()
                        }
                        <span title={this.props.node.name} className="node-name">{this.props.node.name}</span>
                    </div>
                    {(() => {
                        let nodeKey = String(this.props.nodeKey);
                        let keyArray;
                        let maxLength;
                        nodeKey === '0' ? (() => {
                            keyArray = '0';
                            maxLength = 0;
                            if (sessionStorage.processTreeMaxLength) {
                                if (Number(sessionStorage.processTreeMaxLength) < maxLength) {
                                    sessionStorage.processTreeMaxLength = maxLength;
                                }
                            } else {
                                sessionStorage.processTreeMaxLength = maxLength;
                            }
                        })()
                            :
                            (() => {
                                keyArray = nodeKey.split('-');
                                maxLength = keyArray.length;
                                if (sessionStorage.processTreeMaxLength) {
                                    if (Number(sessionStorage.processTreeMaxLength) < maxLength) {
                                        sessionStorage.processTreeMaxLength = maxLength;
                                    }
                                } else {
                                    sessionStorage.processTreeMaxLength = maxLength;
                                }
                            })()
                        if (this.props.node.mold && this.props.node.mold === 'ruleSet') {
                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                        } else {
                            if (this.props.processTreeStore.getIsEdit) {
                                switch (this.props.node.type) {
                                    case -1:
                                        return <AddSub type="add" add={() => this.add(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        break;
                                    case 0:
                                        if (keyArray.length < 8)
                                            return <AddSub type="add-sub" add={() => this.add(this.props.nodeKey, this.props.node.id)} sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        else {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        break;
                                    case 1:
                                        if (this.props.node.secondType === 2) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 3) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 0) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 1) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 4) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.mold === 'ruleSet') {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                    })()}

                </div>

                {
                    this.props.node.nodes ?
                        <ul className="node-panel">
                            {this.props.node.nodes.map((item, i) =>
                                <TreeCopy node={item} nodeKey={this.props.nodeKey + '-' + i} auth={this.props.auth} />
                            )}
                        </ul> : ''
                }
            </li>
        )
    }
}

export default ProcessTree;