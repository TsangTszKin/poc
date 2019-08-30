import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Input, Select, Table, Button, message, Icon } from 'antd';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import { withRouter } from 'react-router-dom';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

const Panel = Collapse.Panel;

const columns2 = [{
    title: '输出结果',
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
class OutPut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappings: [],
            index: 0,
            parentNodeList: [],
            resultsSelection: []
        }
        this.saveData = {
            "name": "",
            "parentId": "",
            "secondType": 2,
            "type": 1,
            "outPutType": 0,
            "results": [
                // {
                //     "resultId": "string",
                //     "resultKey": "string",
                //     "resultName": "string",
                //     "resultValue": "string",
                //     "sourceType": 0,
                //     "typeLabel": "string"
                // }
            ],
            "ruleType": "",
            "values": null
        }
        this.addMappings = this.addMappings.bind(this);
        this.subMappings = this.subMappings.bind(this);
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.getOutPutSelectList = this.getOutPutSelectList.bind(this);
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

        this.getOutPutSelectList();
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

    getOutPutSelectList() {
        strategyService.getOutPutSelectList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result.length > 0) {
                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.id,
                        resultKey: element.resultKey,
                        resultName: element.name,
                        resultType: element.type,
                        value: element.name
                    });
                })
                this.setState({
                    resultsSelection: tempArray
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
            c1: <Select style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(key, 'resultId', value); this.tableDataChange(key, 'resultKey', option.props.resultKey); this.tableDataChange(key, 'resultName', option.props.resultName); this.tableDataChange(key, 'resultType', option.props.resultType); }}>
                {
                    this.state.resultsSelection.map((item, i) =>
                        <Select.Option key={i} value={item.code} resultKey={item.resultKey} resultName={item.resultName} resultType={item.resultType}>{item.value}</Select.Option>
                    )
                }
            </Select>,
            c2: <Select style={{ width: '109px' }} onChange={(value) => { this.tableDataChange(key, 'sourceType', value) }} value={1}><Select.Option value={1}>值</Select.Option></Select>,
            c3: <FixedValue type="defaultValueForList" changeData={this.tableDataChange} index={key} />,
            c4: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
        });
        this.saveData.results.push({
            "resultId": "",
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
        this.saveData.ruleType = Number(sessionStorage.ruleType);
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
        if (common.isEmpty(this.saveData.name)) {
            message.warning('节点定义 - 名称 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.results)) {
            message.warning("输出信息 列表不能为空");
            return
        }
        for (let i = 0; i < this.saveData.results.length; i++) {
            const element = this.saveData.results[i];
            if (common.isEmpty(element.resultId)) {
                message.warning('输出信息 - 输出结果 不能为空');
                return
            }
            if (common.isEmpty(element.resultKey)) {
                message.warning('输出信息 - 输出结果 不能为空');
                return
            }
            if (common.isEmpty(element.resultName)) {
                message.warning('输出信息 - 输出结果 不能为空');
                return
            }
            if (common.isEmpty(element.sourceType)) {
                message.warning('输出信息 - 数据来源 不能为空');
                return
            }
            if (common.isEmpty(element.resultValue)) {
                message.warning('输出信息 - 来源值 不能为空');
                return
            }
            for (let j = 0; j < this.saveData.results.length; j++) {
                const element2 = this.saveData.results[j];
                if (i === j) continue;
                if (element.resultId === element2.resultId || element.resultKey === element2.resultKey || element.resultName === element2.resultName) {
                    message.warning('输出信息 - 输出结果 不能重复');
                    return
                }
            }
        }


        this.save();

    }

    tableDataChange = (i, name, value) => {
        console.log(`${i} ${name} ${value}`);
        console.log(this.saveData.results);
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
        this.setState({
            index: this.state.index++
        })
    }

    getNodeDetailById(id) {
        this.setState({
            mappings: []
        })
        this.saveData.results = [];
        variableService.getNodeDetailById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
            this.saveData.id = data.id;
            this.saveData.name = data.name;
            this.saveData.parentId = data.parentId;
            if (data.sort) {
                this.saveData.sort = data.sort;
            }
            if (data.values) {
                this.saveData.values = data.values;
            } else {
                this.saveData.values = null;
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
            if (!common.isEmpty(data.mold)) {
                this.saveData.mold = data.mold;
            }
            if (!common.isEmpty(data.value)) {
                this.saveData.value = data.value;
            } else {
                this.saveData.value = 0;
            }
            if (!common.isEmpty(data.outPutType)) {
                this.saveData.outPutType = data.outPutType;
            }
            if (!common.isEmpty(data.outPutId)) {
                this.saveData.outPutId = data.outPutId;
            } else {
                this.saveData.outPutId = null;
            }
            if (!common.isEmpty(data.ruleId)) {
                this.saveData.ruleId = data.ruleId;
            }
            if (!common.isEmpty(data.eventSourceId)) {
                this.saveData.eventSourceId = data.eventSourceId;
            } else {
                this.saveData.eventSourceId = sessionStorage.eventSourceId;
            }
            if (!common.isEmpty(data.eventSourceName)) {
                this.saveData.eventSourceName = data.eventSourceName;
            } else {
                this.saveData.eventSourceName = sessionStorage.eventSourceName;
            }
            if (!common.isEmpty(data.ruleCode)) {
                this.saveData.ruleCode = data.ruleCode;
            }
            if (!common.isEmpty(data.results)) {
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
                c1: <Select disabled={common.isEmpty(this.saveData.results[i].id) ? false : true} style={{ width: '109px' }} defaultValue={element.resultName} onChange={(value, option) => { this.tableDataChange(i, 'resultId', value); this.tableDataChange(i, 'resultKey', option.props.resultKey); this.tableDataChange(i, 'resultName', option.props.resultName); this.tableDataChange(i, 'resultType', option.props.resultType); }}>
                    {
                        this.state.resultsSelection.map((item, i) =>
                            <Select.Option key={i} value={item.code} resultKey={item.resultKey} resultName={item.resultName} resultType={item.resultType}>{item.value}</Select.Option>
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
                    <FormBlock header="输出信息">
                        <Table dataSource={this.state.mappings} columns={columns2} pagination={false} />
                        <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addMappings}><Icon type="plus" theme="outlined" />添加映射</Button>
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
OutPut.propTypes = {
    auth: PropTypes.shape({
        save: PropTypes.bool
    })
}
OutPut.defaultProps = {
    auth: { save: false }
}
export default OutPut;