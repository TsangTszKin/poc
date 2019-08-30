/*
 * @Author: zengzijian
 * @Date: 2018-10-25 17:14:19
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:07:37
 * @Description: 
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ProcessTreePanel from '@/components/process-tree/ProcessTreePanel';
import common from '@/utils/common';
import Info from '@/components/analysis/node/Info';
import Rule from '@/components/analysis/node/Rule';
import Control from '@/components/analysis/node/Control';
import Query from '@/components/analysis/node/Query';
import Assign from '@/components/analysis/node/Assign';
import RulesetForProcess from '@/components/analysis/node/RulesetForProcess';
import RulesetForGreedy from '@/components/analysis/node/RulesetForGreedy';
const treeJson = {
    name: '消费满188的笔数',
    type: -1,
    active: true,
    nodes: [{
        name: '控制节点1',
        type: 0,
        secondType: 0,
        active: false,
    }, {
        name: '查询节点',
        type: 1,
        secondType: 2,
        active: false
    }, {
        name: '赋值节点',
        type: 1,
        secondType: 4,
        active: false
    }, {
        name: '规则节点',
        type: 1,
        secondType: 0,
        active: false
    }, {
        name: '规则集节点',
        type: 1,
        secondType: 1,
        active: false
    }]
}
class StrategyDetailsPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sqlMode: false
        }
        this.changeEditType = this.changeEditType.bind(this);
    }

    changeEditType = (type, secondType, nodeId, isGreedy) => {
        console.log("changeEditType  =", type, secondType, nodeId);
        let editType = '';
        if (isGreedy) {
            editType = 'greedy-ruleSet';
        } else {
            if (type === -1) {
                editType = 'info';
            } else if (type === 0) {
                editType = 'control';
            } else if (type === 1) {
                if (secondType === 2) {
                    editType = 'query';
                } else if (secondType === 4) {
                    editType = 'assign';
                } else if (secondType === 0) {
                    editType = 'rule';
                } else if (secondType === 1) {
                    editType = 'ruleSet';
                }
            }
        }

        if (!common.isEmpty(nodeId)) {
            this.setState({
                editType: editType,
                nodeId: nodeId
            })
        } else {
            this.setState({
                editType: editType
            })
        }


    }

    render() {
        return (
            <div style={{ height: '100%' }} id="edit-panel">
                <Row>
                    <Col span={this.state.sqlMode ? 0 : 6} id="panel-left">
                        {/* <div className="pageContent" style={{ height: '100%' }}> */}
                        <ProcessTreePanel isEdit={false} activeNodeKey={this.state.activeNodeKey} processTreeData={treeJson} changeEditType={this.changeEditType}></ProcessTreePanel>
                        {/* </div> */}
                    </Col>
                    <Col span={this.state.sqlMode ? 24 : 18} id="panel-right">
                        {
                            (() => {
                                switch (this.state.editType) {
                                    case 'info':
                                        return <Info />
                                    case 'control':
                                        return <Control />
                                    case 'query':
                                        return <Query />
                                    case 'assign':
                                        return <Assign />
                                    case 'rule':
                                        return <Rule />
                                    case 'ruleSet':
                                        return <RulesetForProcess />
                                    case 'greedy-ruleSet':
                                        return <RulesetForGreedy />
                                    default:
                                        return <Info />
                                }
                            })()
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

StrategyDetailsPanel.propTypes = {

}

StrategyDetailsPanel.defaultProps = {

}

export default StrategyDetailsPanel