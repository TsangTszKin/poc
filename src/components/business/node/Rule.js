import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Input, Select, Table, Button, message } from 'antd';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom';
import CascadeWithTitle from '@/components/CascadeWithTitle';
import common from '@/utils/common';
import commonService from '@/api/business/commonService';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

const Panel = Collapse.Panel;

@withRouter
@inject('store')
@inject('processTreeStore')
@observer
class Assign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentNodeList: [],
            index: 0,
            secondSelectData: [],
            ruleList: [],
            categoryList: []
        }
        this.saveData = {
            "strategyId": this.props.match.params.id,
            "name": "",
            "parentId": "",
            "ruleId": "",
            "secondType": 0,
            "type": 1,
            "sqlCode": "",
            "description": "",
            "category": "",
            "ruleExeId": "",
            "strategyCode": sessionStorage.rootProcessTreeCode
        }
        this.ruleList = [];
        this.originCategory = '';
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.getRuleListByDimensionForRuleNode = this.getRuleListByDimensionForRuleNode.bind(this);
        this.getCategoryList = this.getCategoryList.bind(this);
        this.getRootData = this.getRootData.bind(this);

    }


    componentDidMount() {
        this.getCategoryList();
        this.setState({
            parentNodeList: [],
            index: 0,
            secondSelectData: [],
            ruleList: [],
            categoryList: []
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {
            this.getCategoryList();
        }

    }

    getCategoryList() {
        commonService.getCategoryListByType("rule").then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: Number(element.dataValue),
                        value: element.dataName
                    });
                })
                this.setState({
                    categoryList: tempArray
                })
                if (this.props.nodeId) {
                    this.getNodeDetailById(this.props.nodeId);
                }
            }
        })
    }

    getRuleListByDimensionForRuleNode(category) {
        this.saveData.ruleExeId = '';
        this.ruleList = [];
        strategyService.getRuleListByDimensionForRuleNode(sessionStorage.dimensionId, sessionStorage.eventSourceId, category).then(res => {
            if (!publicUtils.isOk(res)) return
            if (!common.isEmpty(res.data.result)) {
                this.ruleList = res.data.result;
                this.setState({
                    ruleList: res.data.result
                })
                let tempArray = [];
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    tempArray.push({
                        code: element.code,
                        value: element.name,
                        id: element.id,
                    })
                    if (element.id === this.saveData.ruleExeId) {
                        this.saveData.sqlCode = element.sqlCode;
                    }
                }
                this.setState({
                    secondSelectData: tempArray
                })
            }
            if (!common.isEmpty(this.props.nodeId)) {
                this.getNodeDetailById(this.props.nodeId, true);
            }
        })
    }

    save() {
        if (common.isEmpty(this.saveData.parentId))
            this.saveData.parentId = null;
        common.loading.show();
        variableService.saveRuleNode(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            if (!this.props.store.approvalSubmitParams.approvalStatus == 0) {
                this.props.store.setIsCanCommit(true);
            }
            message.success('保存成功');
            this.props.processTreeStore.setIsFinishNode(true);
            this.getNodeDetailById(this.props.nodeId);
            this.getRootData();
        }).catch(res => {
            common.loading.hide();
        })
    }

    verify() {
        if (common.isEmpty(this.saveData.name)) {
            message.warning("节点定义 - 名称 不能为空");
            return
        }
        if (common.isEmpty(this.saveData.ruleExeId)) {
            message.warning("请选择需要添加的规则");
            return
        }

        this.save();
    }

    getNodeDetailById(id, isEnd) {
        variableService.getNodeDetailById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
            this.saveData.id = data.id;
            this.saveData.name = data.name;
            this.saveData.parentId = data.parentId;
            if (!common.isEmpty(data.sort)) {
                this.saveData.sort = data.sort;
            }
            if (!common.isEmpty(data.ruleCode)) {
                this.saveData.ruleCode = data.ruleCode;
            }

            if (!common.isEmpty(data.parentNodeMap)) {
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
            // this.saveData.secondType = data.secondType;
            this.saveData.strategyId = data.strategyId;
            // this.saveData.sqlCode = data.sqlCode;
            this.saveData.description = data.description;

            if (!common.isEmpty(data.category)) {

                if (!isEnd) {
                    this.saveData.category = data.category;
                    this.originCategory = data.category;
                    this.getRuleListByDimensionForRuleNode(data.category)
                }

            } else {
                if (common.isEmpty(this.saveData.category)) {
                    this.saveData.category = "";
                }
            }
            console.log("this.saveData.category this.originCategory", this.saveData.category, this.originCategory);
            if (!common.isEmpty(this.saveData.category) && !common.isEmpty(this.originCategory)) {
                if (this.saveData.category !== this.originCategory) {
                    this.saveData.ruleExeId = "";
                } else {
                    this.saveData.ruleExeId = data.ruleExeId;
                }
            } else {
                this.saveData.ruleExeId = data.ruleExeId;
            }

            this.setState({
                index: this.state.index++
            })
        })
    }



    updateSaveData = (key, value, ignore_script_for_ruleSet, i) => {
        if (key === 'name') {
            value = common.stripscript(value);
        }
        console.log("updateSaveData  =", key, value, i);
        console.log("this.ruleList", this.ruleList)
        this.saveData[key] = value;
        if (key === 'ruleExeId') {
            this.state.ruleList.forEach(element => {
                if (element.id === value) {
                    this.saveData.sqlCode = element.sqlCode;
                    this.saveData.ruleCode = element.code;
                }
            })
            console.log("this.saveData", this.saveData)
            this.saveData.description = this.ruleList[i].description;
        }
        switch (key) {
            case 'name':
                this.saveData.name = this.saveData.name.substr(0, 30);
                break;
            case 'description':
                this.saveData.description = this.saveData.description.substr(0, 255);
                break;
            case 'category':
                this.saveData.ruleExeId = "";
                this.getRuleListByDimensionForRuleNode(value);
                break;
            default:
                break;
        }
        this.setState({
            index: this.state.index++
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
        function callback(key) {
            console.log(key);
        }

        return (
            <div className="pageContent" style={{ marginLeft: '10px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }} ></FormHeader>
                <div style={{ marginTop: '20px' }}>
                    <FormBlock header="节点定义">
                        <Form>
                            <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                            <FormItem name="父节点" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="parentId" defaultValue={this.saveData.parentId ? this.saveData.parentId : sessionStorage.rootProcessTreeName} selectData={this.state.parentNodeList}></FormItem>
                        </Form>
                    </FormBlock>
                    <FormBlock header="选择需要添加的规则">
                        <div style={{ height: '32px' }}>
                            <CascadeWithTitle changeCallBack={this.updateSaveData} firstCode="category" secondCode="ruleExeId" firstValue={this.saveData.category} secondValue={this.saveData.ruleExeId} firstSelectData={this.state.categoryList} secondSelectData={this.state.secondSelectData} />
                        </div>
                    </FormBlock>
                    <FormBlock header="SQL">
                        <Code sqlCode={this.saveData.sqlCode} />
                    </FormBlock>
                    <FormBlock header="规则描述">
                        <Input.TextArea disabled={true} style={{ height: '100px', width: '100%' }} value={this.saveData.description} onChange={(e) => { this.updateSaveData('description', e.target.value) }} />
                    </FormBlock>

                </div>
                {
                    this.props.auth.save ?
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
Assign.propTypes = {
    auth: PropTypes.shape({
        save: PropTypes.bool
    })
}
Assign.defaultProps = {
    auth: { save: false }
}
export default Assign;