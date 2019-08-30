import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Icon, Select, Table, Button, message } from 'antd';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';

const columns2 = [{
    title: '映射变量',
    dataIndex: 'c1',
    key: 'c1',
}, {
    title: '数据来源',
    dataIndex: 'c2',
    key: 'c2',
}, {
    title: '来源值',
    dataIndex: 'c3',
    key: 'c3',
}, {
    title: '',
    dataIndex: 'c4',
    key: 'c4',
}];

@withRouter
@inject('store')
@inject('processTreeStore')
@observer
class Assign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappings: [],
            index: 0,

            parentNodeList: [],
            tempVarList: [],
        }
        this.saveData = {
            "name": "",
            "parentId": "",
            "secondType": 3,
            "type": 1,
            "results": [
                // {
                //     "resultKey": "string",
                //     "resultName": "string",
                //     "resultValue": "string",
                //     "sourceType": 0,
                //     "typeLabel": "string",
                //     "resultType": "string"
                // }
            ],
            "outPutType": 1, //0：规则输出。 1：临时变量赋值，2：实时查询变量赋值
        }
        this.addMappings = this.addMappings.bind(this);
        this.subMappings = this.subMappings.bind(this);
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.getAllVarList = this.getAllVarList.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.renderTable = this.renderTable.bind(this);
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
        this.getAllVarList();
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps  =  ", nextProps);
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {

            this.getNodeDetailById(nextProps.nodeId);
        }
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
    }

    getAllVarList() {
        if (common.isEmpty(this.props.match.params.id)) return
        variableService.getAllVarList(this.props.match.params.id, this.props.type).then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result.length > 0) {
                res.data.result.forEach(element => {
                    if (element.type === 5) {
                        element.list.forEach(element2 => {
                            tempArray.push({
                                code: element2.code,
                                value: element2.name,
                                resultName: element2.name,
                                resultType: element2.type
                            });
                        })
                        this.setState({
                            tempVarList: tempArray
                        })
                    }
                })

            }
            if (this.props.nodeId) {
                this.getNodeDetailById(this.props.nodeId);
            }
        })
    }

    addMappings = () => {
        let tempArray = this.state.mappings;
        const key = tempArray.length;
        let uuid = common.getGuid();
        tempArray.push({
            key: uuid,
            c1: <Select showSearch={true} optionFilterProp="search" style={{ width: '109px' }} onChange={(value, option) => { console.log(value, option); this.tableDataChange(key, 'resultKey', value); this.tableDataChange(key, 'resultName', option.props.resultName); this.tableDataChange(key, 'resultType', option.props.resultType); }}>
                {
                    this.state.tempVarList.map((item, i) =>
                        <Select.Option search={`${item.code}${item.value}${item.resultName}`} key={i} value={item.code} resultName={item.resultName} resultType={item.resultType}>{item.value}</Select.Option>
                    )
                }
            </Select>,
            c2: <Select style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(key, 'sourceType', value) }} value={1}><Select.Option value={1}>值</Select.Option></Select>,
            c3: <FixedValue type="defaultValueForList" changeData={this.tableDataChange} index={key} />,
            c4: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
        });
        this.saveData.results.push({
            "resultKey": "",
            "resultName": "",
            "sourceType": 1,
            "resultValue": ""
        })
        this.setState({
            mappings: tempArray
        })
    }

    save() {
        if (common.isEmpty(this.saveData.parentId))
            this.saveData.parentId = null;
        common.loading.show();
        strategyService.saveOutPutNode(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            if (!this.props.store.approvalSubmitParams.approvalStatus == 0) {
                this.props.store.setIsCanCommit(true);
            }
            message.success('保存成功');
            this.props.processTreeStore.setIsFinishNode(true);
            this.getNodeDetailById(this.props.nodeId);
            this.getRootData();
        })
    }

    verify() {
        console.log("this.saveData.results", this.saveData.results);
        if (!this.saveData.name) {
            message.warning('节点定义 - 名称 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.results)) {
            message.warning('请添加变量映射');
            return
        }
        for (let i = 0; i < this.saveData.results.length; i++) {
            const element = this.saveData.results[i];
            if (common.isEmpty(element.resultKey)) {
                message.warning('变量映射 - 选择变量 不能为空');
                return
            }
            if (common.isEmpty(element.resultName)) {
                message.warning('变量映射 - 选择变量 不能为空');
                return
            }
            if (common.isEmpty(element.sourceType)) {
                message.warning('变量映射 - 数据来源 不能为空');
                return
            }
            if (common.isEmpty(element.resultValue)) {
                message.warning('变量映射 - 来源值 不能为空');
                return
            }
        }


        this.save();

    }

    tableDataChange = (i, name, value) => {
        console.log(`${i} ${name} ${value}`);
        if (name === 'defaultValue') {
            name = "resultValue";
        }
        this.saveData.results[i][name] = value;
        if (name === 'resultType') {
            this.saveData.results[i].resultValue = '';
            this.setState({
                mappings: this.renderTable(this.saveData.results)
            })
        }

        this.setState({
            index: this.state.index++
        })
    }

    subMappings = (key) => {
        var tempArray = [];
        var indexKey;
        for (let i = 0; i < this.state.mappings.length; i++) {
            const element = this.state.mappings[i];
            if (element.key === key) {
                indexKey = i;
                continue;
            }
            tempArray.push(element);
        }
        this.saveData.results.splice(indexKey, 1);
        var tempArray2 = this.renderTable(this.saveData.results);

        this.setState({
            mappings: tempArray2
        })
        console.log(tempArray2);
    }

    updateSaveData = (key, value) => {
        if (key === 'name') {
            value = common.stripscript(value);
        }
        this.saveData[key] = value;
        if (key === 'outPutType') {
            let tempArray = [];
            if (value === 2) {//实时查询变量赋值
                this.saveData.results = [{
                    "resultKey": sessionStorage.rootProcessTreeCode,
                    "resultName": sessionStorage.rootProcessTreeName,
                    "resultType": Number(sessionStorage.rtqType),
                    "sourceType": 1,
                    "resultValue": ""
                }];
                tempArray = this.renderTable(this.saveData.results);
            } else {
                this.saveData.results = [];
                tempArray = [];
            }
            this.setState({
                mappings: tempArray
            })
        }
        this.setState({
            index: this.state.index++
        })
    }

    getNodeDetailById(id) {
        this.saveData.outPutType = 1;
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
            if (data.mold) {
                this.saveData.mold = data.mold;
            }
            if (data.outPutType) {
                this.saveData.outPutType = data.outPutType;
            }
            if (data.outPutId) {
                this.saveData.outPutId = data.outPutId;
            } else {
                this.saveData.outPutId = null;
            }
            if (data.eventSourceId) {
                this.saveData.eventSourceId = data.eventSourceId;
            } else {
                this.saveData.eventSourceId = sessionStorage.eventSourceId;
            }
            if (data.eventSourceName) {
                this.saveData.eventSourceName = data.eventSourceName;
            } else {
                this.saveData.eventSourceName = sessionStorage.eventSourceName;
            }
            if (data.ruleCode) {
                this.saveData.ruleCode = data.ruleCode;
            }

            if (data.results) {
                this.saveData.results = data.results;
            } else {
                this.saveData.results = [];
            }
            let tempResultsArray = this.renderTable(this.saveData.results);
            this.setState({
                index: this.state.index++,
                mappings: tempResultsArray
            })
        })
    }

    renderTable(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: this.saveData.outPutType === 2 ? sessionStorage.rootProcessTreeName
                    :
                    <Select showSearch={true} optionFilterProp="children" disabled={common.isEmpty(this.saveData.results[i].id) ? false : true} style={{ width: '109px' }} defaultValue={element.resultName} onChange={(value, option) => { this.tableDataChange(i, 'resultKey', value); this.tableDataChange(i, 'resultName', option.props.resultName); this.tableDataChange(i, 'resultType', option.props.resultType); }}>
                        {
                            this.state.tempVarList.map((item, i) =>
                                <Select.Option key={i} value={item.code} resultName={item.resultName} resultType={item.resultType}>{item.value}</Select.Option>
                            )
                        }
                    </Select>,
                c2: <Select style={{ width: '109px' }} defaultValue={element.sourceType} onChange={(value) => { this.tableDataChange(i, 'sourceType', value) }}><Select.Option value={1}>值</Select.Option></Select>,
                c3: <FixedValue type="defaultValueForList" value={element.resultValue} changeData={this.tableDataChange} dataType={element.resultType} index={i} />,
                c4: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
            })
        }

        return tempArray
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
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }} />
                <div style={{ marginTop: '20px' }}>
                    <FormBlock header="节点定义">
                        <Form>
                            <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name} />
                            <FormItem name="父节点" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="parentId" defaultValue={this.saveData.parentId ? this.saveData.parentId : sessionStorage.rootProcessTreeName} selectData={this.state.parentNodeList} />
                            {
                                this.props.type === 'rtq' ?
                                    <FormItem name="变量映射" type="select" isNotNull={true} changeCallBack={this.updateSaveData}
                                        code="outPutType"
                                        defaultValue={this.saveData.outPutType} selectData={[{ code: 1, value: '临时变量映射' }, { code: 2, value: '实时变量映射' }]} />
                                    :
                                    ''
                            }

                        </Form>
                    </FormBlock>
                    {
                        this.saveData.outPutType === 2 ?
                            <FormBlock header="添加实时变量映射">
                                <Table dataSource={this.state.mappings} columns={columns2} pagination={false} />
                            </FormBlock>
                            :
                            <FormBlock header="添加临时变量映射">
                                <Table dataSource={this.state.mappings} columns={columns2} pagination={false} />
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addMappings}><Icon type="plus" theme="outlined" />添加映射</Button>
                            </FormBlock>
                    }

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

Assign.propTypes = {
    type: PropTypes.oneOf(['rtq', 'rule', 'ruleSet', 'strategy']),
    auth: PropTypes.shape({
        save: PropTypes.bool
    })
}
Assign.defaultProps = {
    auth: { save: false }
}
export default Assign;