import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProcessTree from '@/components/process-tree/Tree';
import '@/styles/processTree.less';
import { inject, observer } from 'mobx-react';
import { Modal, Form, message } from 'antd';
import AddNodeFormForRtq from '@/components/process-tree/AddNodeFormForRtq';
import AddNodeFormForRule from '@/components/process-tree/AddNodeFormForRule';
import AddNodeFormForDefinition from '@/components/process-tree/AddNodeFormForDefinition';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';

//暂时没用
const treeJson = {
    name: '消费满188的笔数',
    type: 'root',
    active: true,
    nodes: [{
        name: '实时触发进度提醒短信',
        type: 'control',
        active: false,
        nodes: [{
            name: '必须为活动卡且交易金额的..',
            type: 'query',
            active: false
        }, {
            name: '距发卡日日期小于30天',
            type: 'control',
            active: false,
            nodes: [{ name: '触发进度短信B1', type: 'assign', active: false },
            { name: '触发进度短信B2', type: 'assign', active: false },
            { name: '触发进度短信B3', type: 'assign', active: false }]
        }, {
            name: '距发卡日日期在30到50间',
            type: 'control',
            active: false,
            nodes: [{ name: '触发进度短信C1', type: 'assign', active: false },
            { name: '触发进度短信C2', type: 'assign', active: false },
            { name: '触发进度短信C3', type: 'assign', active: false }]
        }],
    }, {
        name: '实时触发进度提醒短信',
        type: 'control',
        active: false,
        nodes: [{ name: '必须为活动卡且交易金额必须为活动卡且交易金额必须为活动卡且交易金额必须为活动卡且交易金额...', type: 'assign', active: false }],
    }, {
        name: '批量自动发送催激活短信',
        type: 'control',
        active: false,
        nodes: [{ name: '黑名单过滤', type: 'assign', active: false }, { name: '触发待激活短信', type: 'assign', active: false }],
    }]
}
const FormItem = Form.Item;



@Form.create()
@withRouter
@inject('processTreeStore')
@observer
class ProcessTreePanel extends Component {
    constructor(props) {
        super(props);
        this.modalOkForAdd = this.modalOkForAdd.bind(this);
        this.modalOkForSub = this.modalOkForSub.bind(this);
    }

    componentDidMount() {
        this.props.form.validateFields();
        this.props.processTreeStore.setIsFinishNode(true);
    }

    componentWillReceiveProps(nextProps) {

    }

    modalOkForAdd = (e) => {
        let self = this;
        this.refs.getFormValue.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
                if (!common.isEmpty(values.form1)) {
                    if (values.form1.length > 30) {
                        message.warning("请输入30个字符以内节点名称");
                        return
                    }
                }
                values.form1 = common.stripscript(values.form1);

                //todo greedy-ruleSet还没写判断
                let editType = '';
                let type = values.form2;
                let secondType = common.isEmpty(values.form3) ? 0 : values.form3;

                if (values.form1 === 'greedy') {
                    editType = 'greedy-ruleSet';

                    self.props.processTreeStore.modal.add.setIsShow(false);
                    //nodeType, parentId, id, nodeName, firstType, secondType, activeKey
                    self.props.processTreeStore.addNodeForApi(editType, values.form3, self.props.match.params.id);
                } else {

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
                    }

                    self.props.processTreeStore.modal.add.setIsShow(false);
                    //nodeType, parentId, id, nodeName, firstType, secondType, activeKey
                    self.props.processTreeStore.addNodeForApi(editType, self.props.processTreeStore.addNodeParams.getParentId, self.props.match.params.id, values.form1, type, secondType, self.props.processTreeStore.addNodeParams.getActiveKey);
                }



            } else {
                console.log(err);
                return err;
            }
        });

    }

    modalOkForSub = () => {
        if (this.props.processTreeStore.getSaveType === 'strategy' && this.props.match.params.type === 'greedy') {
            this.props.processTreeStore.deleteNodeForApi(this.props.processTreeStore.deleteNodeParams.getRuleSetId, this.props.match.params.id);
        } else {
            this.props.processTreeStore.deleteNodeForApi(this.props.processTreeStore.deleteNodeParams.getId);
        }
        this.props.processTreeStore.modal.sub.setIsShow(false);
    }

    render() {
        return (
            <div style={{ marginLeft: '-23px', overflowX: 'auto', paddingBottom: '100px' }}>
                <ul className="node-panel">
                    <ProcessTree node={this.props.processTreeStore.getData} nodeKey={0} auth={this.props.auth}></ProcessTree>
                </ul>
                <Modal
                    name="新建节点"
                    visible={this.props.processTreeStore.modal.add.getIsShow}
                    onOk={this.modalOkForAdd}
                    onCancel={() => this.props.processTreeStore.modal.add.setIsShow(false)}
                    width={this.props.processTreeStore.getSaveType === 'strategy' ? '500px' : '400px'}
                    keyboard
                    destroyOnClose={true}
                >
                    {
                        (() => {
                            switch (this.props.processTreeStore.getSaveType) {
                                case 'rtq':
                                    return <AddNodeFormForRtq ref="getFormValue"></AddNodeFormForRtq>
                                case 'rule':
                                    return <AddNodeFormForRule ref="getFormValue"></AddNodeFormForRule>
                                case 'strategy':
                                    return <AddNodeFormForDefinition category={this.props.category} type={this.props.type} ref="getFormValue"></AddNodeFormForDefinition>
                                default: return ''
                            }
                        })()
                    }


                </Modal>

                <Modal
                    name="删除"
                    visible={this.props.processTreeStore.modal.sub.getIsShow}
                    onOk={this.modalOkForSub}
                    onCancel={() => this.props.processTreeStore.modal.sub.setIsShow(false)}
                    width="400px"
                    keyboard
                    destroyOnClose={true}
                >
                    <p>是否删除节点及子节点全部内容？</p>

                </Modal>

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
ProcessTreePanel.propTypes = {
    isEdit: PropTypes.bool,
    auth: PropTypes.shape({
        view: PropTypes.bool,
        add: PropTypes.bool,
        sub: PropTypes.bool,
    })
}
ProcessTreePanel.defaultProps = {
    isEdit: true,
    auth: {
        view: false,
        add: false,
        sub: false,
    }
}
export default ProcessTreePanel;