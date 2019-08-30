import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProcessTreeStatic from '@/components/process-tree/TreeStatic';
import '@/styles/processTree.less';
import { Provider } from 'mobx-react';
import { Modal, Form, message } from 'antd';
import AddNodeFormForRtq from '@/components/process-tree/AddNodeFormForRtq';
import AddNodeFormForRule from '@/components/process-tree/AddNodeFormForRule';
import AddNodeFormForDefinition from '@/components/process-tree/AddNodeFormForDefinition';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';

// const treeJson = {
//     name: '消费满188的笔数',
//     type: 'root',
//     active: true,
//     nodes: [{
//         name: '实时触发进度提醒短信',
//         type: 'control',
//         active: false,
//         nodes: [{
//             name: '必须为活动卡且交易金额的..',
//             type: 'query',
//             active: false
//         }, {
//             name: '距发卡日日期小于30天',
//             type: 'control',
//             active: false,
//             nodes: [{ name: '触发进度短信B1', type: 'assign', active: false },
//             { name: '触发进度短信B2', type: 'assign', active: false },
//             { name: '触发进度短信B3', type: 'assign', active: false }]
//         }, {
//             name: '距发卡日日期在30到50间',
//             type: 'control',
//             active: false,
//             nodes: [{ name: '触发进度短信C1', type: 'assign', active: false },
//             { name: '触发进度短信C2', type: 'assign', active: false },
//             { name: '触发进度短信C3', type: 'assign', active: false }]
//         }],
//     }, {
//         name: '实时触发进度提醒短信',
//         type: 'control',
//         active: false,
//         nodes: [{ name: '必须为活动卡且交易金额必须为活动卡且交易金额必须为活动卡且交易金额必须为活动卡且交易金额...', type: 'assign', active: false }],
//     }, {
//         name: '批量自动发送催激活短信',
//         type: 'control',
//         active: false,
//         nodes: [{ name: '黑名单过滤', type: 'assign', active: false }, { name: '触发待激活短信', type: 'assign', active: false }],
//     }]
// }

@withRouter
class ProcessTreePanelStatic extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
       
    }

    

    render() {
        return (
                <div style={{ marginLeft: '-23px', overflowX: 'auto', paddingBottom: '100px' }}>
                    <ul className="node-panel">
                        <ProcessTreeStatic  node={this.props.processTreeData} ></ProcessTreeStatic>
                    </ul>

                </div>
        )
    }
}
const style = {
    formItem: {
        height: '32px'
    },
    formName: {
        width: 'fit-content',
        float: 'left',
        height: '32px',
        lineHeight: '32px',
    },
    formEntity: {
        float: 'left',
        width: '300px'
    }
}
// const ProcessTreePanel2 = Form.create()(ProcessTreePanelStatic);
ProcessTreePanelStatic.propTypes = {
    isEdit: PropTypes.bool
}
ProcessTreePanelStatic.defaultProps = {
    isEdit: true
}
export default ProcessTreePanelStatic;