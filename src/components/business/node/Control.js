import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, message } from 'antd';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import Code from '@/components/Code';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';

const selectData = [
    { code: 'A', value: 'A' },
    { code: 'B', value: 'B' },
    { code: 'C', value: 'C' }
]
const conditionVODemo = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": ""
        },
        "nodeType": 1
    }
    ]
}
@withRouter
@inject('store')
@inject('processTreeStore')
@observer
class Control extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldSelector: [],
            index: 0,
            noParentIdShow: '',
            parentNodeList: []
        }
        this.saveData = {
            "name": '',
            "parentId": "",
            "sqlCode": '',
            "conditionVO": common.deepClone(conditionVODemo)
        }
        this.sub = this.sub.bind(this);
        this.add = this.add.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.verify = this.verify.bind(this);
        this.save = this.save.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.controlNodeTranslateToSql = this.controlNodeTranslateToSql.bind(this);
        this.getRootData = this.getRootData.bind(this);
    }

    componentDidMount() {

        switch (this.props.type) {
            case 'rtq':
                this.saveData.rtqId = this.props.match.params.id;
                break;
            case 'rule':
                this.saveData.ruleId = this.props.match.params.id;
                break;
            case 'strategy':
                this.saveData.strategyId = this.props.match.params.id;
                break;

            default:
                break;
        }

        if (this.props.nodeId) {
            this.getNodeDetailById(this.props.nodeId);
        }
    }
    componentWillReceiveProps(nextProps) {
        // console.log("control componentWillReceiveProps", nextProps);
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {
            this.getNodeDetailById(nextProps.nodeId);
        }

    }

    controlNodeTranslateToSql(conditionAll) {
        if (this.saveData.conditionVO.id) {
            conditionAll.id = this.saveData.conditionVO.id;
        }
        // variableService.controlNodeTranslateToSql(conditionAll).then(res => {
        //     if (!publicUtils.isOk(res)) return
        //     this.saveData.sqlCode = res.data.result;
        //     this.saveData.conditionVO = conditionAll;
        //     console.log("this.saveData.conditionVO", this.saveData.conditionVO)
        //     /*  this.setState({
        //           index: this.state.index++
        //       })*/
        //     this.code.changeCode(this.saveData.sqlCode);

        // });
    }

    getNodeDetailById(id) {
        variableService.getNodeDetailById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
            this.saveData.id = data.id;
            this.saveData.name = data.name;
            this.saveData.parentId = data.parentId;
            if (data.sort) {
                this.saveData.sort = data.sort;
            }

            if (data.parentNodeMap) {
                let tempParentNodeList = [];
                for (const key in data.parentNodeMap) {
                    if (data.parentNodeMap.hasOwnProperty(key)) {
                        const element = data.parentNodeMap[key];
                        tempParentNodeList.push({
                            code: key,
                            value: element
                        })
                    }
                }
                this.setState({
                    parentNodeList: tempParentNodeList
                })
            } else {
                this.setState({
                    parentNodeList: []
                })
            }

            this.saveData.type = data.type;
            this.saveData.secondType = data.secondType;
            this.saveData.name = data.name;
            if (data.mold) {
                this.saveData.mold = data.mold;
            }
            this.saveData.sqlCode = data.sqlCode;
            if (data.conditionVO) {
                this.saveData.conditionVO = data.conditionVO;
            } else {
                this.saveData.conditionVO = common.deepClone(conditionVODemo);
            }


            this.setState({
                index: this.state.index++
            })

            // console.log(this.saveData.conditionVO);
        })
    }

    /**
     * 删除操作回调
     */
    sub = () => {
        let tempArray = this.state.fieldSelector;
        tempArray.pop();
        this.setState({
            fieldSelector: tempArray
        })
    }

    /**
     * 增加操作回调
     */
    add = () => {
        let tempArray = this.state.fieldSelector;
        tempArray.push({
            name: '和',
            selectData: selectData
        });
        this.setState({
            fieldSelector: tempArray
        })
    }
    updateSaveData = (key, value) => {
        if (key === 'name') {
            value = common.stripscript(value);
        }
        this.saveData[key] = value;
        switch (key) {
            case 'name':
                this.saveData.name = this.saveData.name.substr(0, 30);
                break;
            default:
                break;
        }
        this.setState({
            index: this.state.index++
        })
    }

    verify() {
        for (const key in this.saveData) {
            if (this.saveData.hasOwnProperty(key)) {
                const element = this.saveData[key];
                if (element === 0) continue;
                if (!element) {
                    switch (key) {
                        case 'name':
                            message.warning('节点定义 - 名称 不能为空');
                            return
                            break;

                        default:
                            break;
                    }
                }
            }
        }
        if (publicUtils.verifyConditionTree(this.saveData.conditionVO, true)) {
            // alert("数据完整");
            this.save();
        }

    }

    updateConditionTree = (conditions) => {
        this.saveData.conditionVO.conditions = conditions;
    }

    save() {
        if (common.isEmpty(this.saveData.parentId))
            this.saveData.parentId = null;
        common.loading.show();
        variableService.saveControlNode(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            if (!this.props.store.approvalSubmitParams.approvalStatus == 0) {
                this.props.store.setIsCanCommit(true);
            }
            message.success("保存成功");
            this.props.processTreeStore.setIsFinishNode(true);
            this.getNodeDetailById(this.props.nodeId);
            this.getRootData();
        })
    }

    /**
     * 获取根部信息，刷新基础信息维护部分的数据，以判断是会否可以提交
     *
     */
    getRootData() {
        this.props.processTreeStore.getDataForApi2(this.props.match.params.id)
    }

    render() {

        return (
            <div className="pageContent" style={{ marginLeft: '10px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                <div style={{ marginTop: '20px' }}>
                    <FormBlock header="节点定义">
                        <Form>
                            <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                            <FormItem name="父节点" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="parentId" defaultValue={this.saveData.parentId ? this.saveData.parentId : sessionStorage.rootProcessTreeName} selectData={this.state.parentNodeList}></FormItem>
                        </Form>
                    </FormBlock>
                    <FormBlock header="图文" style={{ minWidth: '260px', overflowX: 'auto' }}>
                        <TreePanel allVarListTypeForm={this.props.type} id={this.props.id} translateToSql={this.controlNodeTranslateToSql} type="control" updateConditionTree={this.updateConditionTree} treeData={this.saveData.conditionVO} />
                    </FormBlock>
                    <FormBlock header="SQL">
                        <Code ref={el => this.code = el} sqlCode={this.saveData.sqlCode} type={1} />
                    </FormBlock>
                </div>
                {
                    this.props.auth.save && !this.props.isResource ?
                        <FormButtonGroupForProcessTree
                            cancelCallBack={() => this.props.history.goBack()}
                            saveCallBack={this.verify}
                            isFixed={true}
                        />
                        : ''
                }

            </div>
        )
    }
}

Control.propTypes = {
    selectData: PropTypes.array,
    id: PropTypes.string,
    type: PropTypes.oneOf(['rtq', 'rule', 'ruleSet', 'strategy']),
    auth: PropTypes.shape({
        save: PropTypes.bool
    })
}
Control.defaultProps = {
    selectData: [{ code: 'all', value: '所有' }],
    id: '',
    auth: { save: false }
}

export default Control