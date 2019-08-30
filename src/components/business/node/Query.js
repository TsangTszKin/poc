import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Icon, Select, Table, Button, message, Switch, InputNumber } from 'antd';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import Code from '@/components/Code';
import SelectGroup from '@/components/SelectGroup';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';
import FieldLeftJoin from '@/components/business/FieldLeftJoin';
import SelectTables from '@/components/business/SelectTables';

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
            "valueName": "",
            "table": {
                "aliasName": "",
                "name": "",
                "joinType": 0,
            },
        },
        "nodeType": 1
    }
    ]
}

const optTypeConstList = [
    {
        "code": 0,
        "value": "等于"
    },
    {
        "code": 1,
        "value": "大于"
    },
    {
        "code": 2,
        "value": "小于"
    },
    {
        "code": 3,
        "value": "不等于"
    },
    {
        "code": 4,
        "value": "大于等于"
    },
    {
        "code": 5,
        "value": "小于等于"
    },
    {
        "code": 8,
        "value": "is null"
    },
    {
        "code": 9,
        "value": "is not null"
    }];

const functionListForString = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    }];
const functionListForBoolean = [
    { "val": '', "label": '无' }];
const functionListForDate = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    }, {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },]
const functionListForNumber = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    },
    {
        "val": 1,
        "label": "SUM"
    },
    {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },
    {
        "val": 4,
        "label": "AVG"
    }]
const functionListForNull = [
    { "val": '', "label": '无' }];
const functionListForAll = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    },
    {
        "val": 1,
        "label": "SUM"
    },
    {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },
    {
        "val": 4,
        "label": "AVG"
    }]

@withRouter
@inject('store')
@inject('processTreeStore')
@observer
class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappings: [],
            tableList: [],
            fieldList: [],
            orderFieldList: [],
            allField: {},
            tempVarList: [],
            parentNodeList: [],
            orderFieldsValue: [],
            groupFieldsValue: [],
            index: 0,
            functionList: [],
            havingFuncList: [],
            joinFields: []
        }
        this.saveData = {
            "varType": 0,
            "name": "",
            "parentId": "",
            'sqlCode': "",
            "mappingType": 1,//0实时查询变量映射，1临时变量映射
            "tables": [
                // {
                //     "aliasName": "",
                //     "name": "",
                //     "joinType": 0
                // }
            ],
            "orderFields": [
                // {
                //     "field": "",
                //     "order": "asc",
                //     "table": {
                //         "aliasName": "",
                //         "name": ""
                //     }
                // }
            ],
            "queryFields": [
                //     {
                //     "field": "money",
                //     "fieldName": "交易金额",
                //     "table": {
                //         "aliasName": "c",
                //         "name": "customer"
                //     },
                //     "varCode": "v_code",
                //     "varName": "映射变量中文名",
                //     "functionType": 1,
                //     "functionCode": "SUM",
                //     "secondFunctionType": 1,
                //     "secondFunctionCode": "1"
                // }
            ],
            "joinFields": [
                // {
                //     "field": "string",
                //     "joinField": "string",
                //     "joinTable": {
                //         "aliasName": "string",
                //         "name": "string",
                //     },
                //     "table": {
                //         "aliasName": "string",
                //         "name": "string"
                //     }
                // }
            ],
            "secondType": 2,
            "type": 1,
            "groupFields": [],
            "conditionVO": common.deepClone(conditionVODemo),
            "havingConditionVO": {}
        }
        this.queryFieldsDataType = [];
        this.addMappings = this.addMappings.bind(this);
        this.subMappings = this.subMappings.bind(this);
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.getTableList = this.getTableList.bind(this);
        this.initTempVarListCallBack = this.initTempVarListCallBack.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.treeDataCallBack = this.treeDataCallBack.bind(this);
        this.functionTypeList = this.functionTypeList.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.controlNodeTranslateToSql = this.controlNodeTranslateToSql.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.isQueryFieldsFinish = this.isQueryFieldsFinish.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.checkQueryFieldsFinish = this.checkQueryFieldsFinish.bind(this);
        this.formatTables = this.formatTables.bind(this);
        this.changeFieldLeftJoinCallBack = this.changeFieldLeftJoinCallBack.bind(this);
        this.reFormatFieldListAndOrderList = this.reFormatFieldListAndOrderList.bind(this);
        this.addTable = this.addTable.bind(this);
        this.subTable = this.subTable.bind(this);
        this.getRootData = this.getRootData.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
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
        this.functionTypeList();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {
            this.setState({ joinFields: [] })
            this.getNodeDetailById(nextProps.nodeId);
        }

    }
    functionTypeList() {
        variableService.functionTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [{ code: '', value: '无' }];
            let tempArray2 = [];
            res.data.result.forEach(element => {

                if (element.label !== 'FIRST' && element.label !== 'LAST' && element.label !== 'DISTINCT') {
                    tempArray2.push(element);
                    tempArray.push({
                        code: element.val + '·-·' + element.label,
                        value: element.label
                    });
                }
            })
            this.setState({
                functionList: tempArray,
                havingFuncList: tempArray2
            })



            this.getTableList();
        });
    }
    updateConditionTree = (conditionsAll) => {
        this.saveData.conditionVO = conditionsAll;
    }
    treeDataCallBack(conditionTreeList) {
        console.log("conditionTreeList", conditionTreeList);
        this.saveData.conditionVO.conditions = conditionTreeList;
    }
    getTableList = () => {
        variableService.getTableList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempTableArray = [];
            let tempFieldArray = [];
            let tempAllField = [];
            res.data.result.forEach(element => {
                let tempObj = {
                    code: element.code,
                    value: element.name
                }
                tempTableArray.push(tempObj);
                element.columns = element.columns.sort(function (a, b) { return a.name.localeCompare(b.name) })
                let fieldsList = { name: element.code, cnName: element.name, fieldsList: [] }
                element.columns.forEach(element2 => {
                    fieldsList.fieldsList.push({
                        code: element2.code,
                        value: `${element2.name}`,
                        varDataType: element2.type
                    })
                })

                tempAllField.push(fieldsList)
            })
            if (res.data.result && res.data.result.length > 0) {
                // this.saveData.tables[0].name = res.data.result[0].code;
                res.data.result[0].columns.forEach(element => {
                    let tempObj = {
                        code: element.code + '·-·' + element.name,
                        value: element.name,

                    }
                    tempFieldArray.push(tempObj);
                })
            }
            // console.log(tempFieldArray);
            tempTableArray = tempTableArray.sort(function (a, b) { return a.value.localeCompare(b.value) });
            this.setState({
                tableList: tempTableArray,
                fieldList: [],
                allField: tempAllField
            })
            // console.log("tempAllField = ", tempAllField)
            if (!common.isEmpty(this.props.nodeId))
                this.getNodeDetailById(this.props.nodeId);
        })
    }
    addMappings = () => {
        let tempArray = this.state.mappings;
        this.saveData.queryFields.push({
            "field": "",
            "fieldName": "",
            "table": {
                "aliasName": "",
                "name": ""
            },
            "varCode": "",
            "varName": "",
            "functionType": "",
            "functionCode": "",
            "fieldDistinct": 0,
            "mappingType": 1
        })
        let mappings = this.renderTable(this.saveData.queryFields);
        this.setState({
            mappings
        })
    }

    save() {
        if (common.isEmpty(this.saveData.parentId))
            this.saveData.parentId = null;
        common.loading.show();
        variableService.saveQueryNode(this.saveData).then(res => {
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

    verify = () => {
        // console.log(this.saveData);
        // return
        if (common.isEmpty(this.saveData.name)) {
            message.warning('节点定义 - 名称 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.tables)) {
            message.warning('选择表 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.queryFields)) {
            message.warning('映射变量 不能为空');
            return
        }
        for (let i = 0; i < this.saveData.queryFields.length; i++) {
            const element = this.saveData.queryFields[i];
            // console.log(element);
            if (!element.varCode || !element.varName) {
                message.warning('映射变量 - 选择变量名 不能为空');
                return
            }
            if (!element.field || !element.fieldName) {
                message.warning('映射变量 - 来源表字段 不能为空');
                return
            }
            for (let j = 0; j < this.saveData.queryFields.length; j++) {
                const element2 = this.saveData.queryFields[j];
                if (i === j) continue;
                if (element.varCode == element2.varCode) {
                    message.warning('映射变量 - 选择变量名 不能重复');
                    return
                }
            }
            if (element.functionType) {
                Number(element.functionType);
            }


        }
        if (this.saveData.groupFields.length > 0) {
            for (let i = 0; i < this.saveData.groupFields.length; i++) {
                const element = this.saveData.groupFields[i];
                if (!element) {
                    message.warning('分组字段 - 不能有空');
                    return
                }
                for (let j = 0; j < this.saveData.groupFields.length; j++) {
                    const element2 = this.saveData.groupFields[j];
                    if (i === j) continue;
                    if (element === element2) {
                        message.warning("分组字段 - 不能重复");
                        return
                    }
                }
            }
        }
        if (this.saveData.orderFields.length > 0) {
            for (let i = 0; i < this.saveData.orderFields.length; i++) {
                const element = this.saveData.orderFields[i];
                if (!element.field) {
                    message.warning('排序字段 - 不能有空');
                    return
                }
                // for (let j = 0; j < this.saveData.orderFields.length; j++) {
                //     const element2 = this.saveData.orderFields[j];
                //     if (i === j) continue;
                //     if (element.field === element2.field) {
                //         message.warning("排序字段 - 不能重复");
                //         return
                //     }
                // }
            }

        }
        // console.log(this.saveData);
        if (publicUtils.verifyConditionTree(this.saveData.conditionVO, true)) {
            this.save();
        }
    }

    subMappings = (key) => {
        let arrayIndex;
        let field;
        for (let i = 0; i < this.state.mappings.length; i++) {
            const element = this.state.mappings[i];
            if (element.key === key) {
                arrayIndex = i;
                field = this.saveData.queryFields[i].field;
                continue
            }
        }
        this.saveData.queryFields.splice(arrayIndex, 1);
        let mappings = this.renderTable(this.saveData.queryFields);
        // this.fillGroupFields();

        let tempArray1 = [];
        let tempArray2 = [];
        this.state.orderFieldsValue.forEach(element => {
            if (element.field !== field) tempArray1.push(element)
        })
        this.saveData.orderFields.forEach(element => {
            if (element.field !== field) tempArray2.push(element)
        })
        this.saveData.orderFields = tempArray2;
        this.setState({
            mappings,
            orderFieldsValue: tempArray1
        })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }
    }

    updateSaveData = (key, value) => {
        if (key === 'name') {
            value = common.stripscript(value);
        }
        // console.log("updateSaveData = ", key, value);
        this.saveData[key] = value;
        if (key === 'mappingType') {
            this.saveData.groupFields = [];
            this.saveData.orderFields = [];
            this.saveData.queryFields = [];
            this.setState({
                orderFieldsValue: []
            })
            // this.fillGroupFields();

            if (value === 0) {
                this.saveData.queryFields =
                    [{
                        "field": "",
                        "fieldName": "",
                        "table": {
                            "aliasName": "",
                            "name": ""
                        },
                        "varCode": sessionStorage.rootProcessTreeCode,
                        "varName": sessionStorage.rootProcessTreeName,
                        "functionType": "",
                        "functionCode": "",
                        "fieldDistinct": 0,
                    }]

            }
        }
        switch (key) {
            case 'name':
                this.saveData.name = this.saveData.name.substr(0, 30);
                break;
            default:
                break;
        }
        this.setState({ index: this.state.index++ })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }

    }

    isQueryFieldsFinish() {
        let rs = true;
        for (let i = 0; i < this.saveData.queryFields.length; i++) {
            const element = this.saveData.queryFields[i];
            if (common.isEmpty(element.field)) {
                rs = false;
            }
            if (common.isEmpty(element.fieldName)) {
                rs = false;
            }
            if (common.isEmpty(element.varCode)) {
                rs = false;
            }
            if (common.isEmpty(element.varName)) {
                rs = false;
            }
        }
        return rs
    }

    tableDataChange = (i, name, value) => {
        console.log(` i, name, value = ${i} ${name} ${value}`);
        // console.log(this.saveData.queryFields);
        this.saveData.queryFields[i][name] = value;
        if (name === 'field' || name === 'fieldName' || name === 'varDataType') {
            if (this.saveData.tables && this.saveData.tables.length > 0) {
                // this.saveData.queryFields[i].table = {
                //     "aliasName": "",
                //     "name": ""
                // };
            } else {
                message.warning("请先选择表");
                return
            }
            if (name === 'varDataType') {
                this.saveData.queryFields[i].functionType = '';
                this.saveData.queryFields[i].functionCode = '';
                let mappings = this.renderTable(this.saveData.queryFields);
                this.setState({
                    mappings
                })
            }

        }
        if (name === 'functionType') {
            this.saveData.orderFields = [];
            this.setState({
                orderFieldsValue: []
            })
        }
        if (name === 'functionCode') {
            this.saveData.queryFields[i].fieldDistinct = 0;
            let mappings = this.renderTable(this.saveData.queryFields);
            this.setState({
                mappings
            })
        }
        if (name === 'table') {
            let mappings = this.renderTable(this.saveData.queryFields);
            this.setState({
                mappings
            })
        }
        if (this.checkQueryFieldsFinish()) {
        }
        this.setState({ index: this.state.index++ })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }

    }

    controlNodeTranslateToSql() {
        variableService.sqlQueryNode(this.saveData).then(res => {
            if (res.data) {
                this.saveData.sqlCode = res.data.result;
               /* this.setState({ index: this.state.index++ })*/
                this.code.changeCode(this.saveData.sqlCode);
            }
        })
    }


    initTempVarListCallBack = (tempVarList) => {
        this.setState({
            tempVarList: tempVarList
        })
    }

    getNodeDetailById(id) {
        this.saveData.mappingType = 1;
        this.setState({
            mappings: [],
            groupFieldsValue: [],
            orderFieldsValue: []
        })
        variableService.getNodeDetailById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
            this.saveData.id = data.id;
            if (!common.isEmpty(data.mold)) {
                this.saveData.mold = data.mold;
            }
            this.saveData.parentId = data.parentId;
            if (!common.isEmpty(data.sort)) {
                this.saveData.sort = data.sort;
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

            this.saveData.rtqId = data.rtqId;
            this.saveData.secondType = data.secondType;
            this.saveData.type = data.type;
            this.saveData.selectId = data.selectId;
            this.saveData.name = data.name;
            if (!common.isEmpty(data.mappingType)) {
                this.saveData.mappingType = data.mappingType;
            }
            if (!common.isEmpty(data.tables)) {
                //初始化，1，分组字段：值和下拉；2，排序字段：值和下拉；
                this.saveData.tables = data.tables;
                let fieldList = [];
                let orderFieldList = [];


            } else {
                this.saveData.tables = [{
                    "aliasName": "",
                    "joinType": '',
                    "name": ""
                }];
            }

            this.reFormatFieldListAndOrderList();

            if (!common.isEmpty(data.conditionVO)) {
                this.saveData.conditionVO = data.conditionVO;
            } else {
                this.saveData.conditionVO = common.deepClone(conditionVODemo);
            }

            if (!common.isEmpty(data.queryFields)) {
                data.queryFields.forEach(element => {
                    if (common.isEmpty(element.table)) {
                        element.table = {
                            "aliasName": "",
                            "name": ""
                        }
                    }
                })
                if (common.isEmpty(data.queryFields.table)) {

                }
                this.saveData.queryFields = data.queryFields;
            } else {
                this.saveData.queryFields = [];
            }

            let joinFields = [];
            if (!common.isEmpty(data.joinFields)) {
                this.saveData.joinFields = data.joinFields;
                joinFields = data.joinFields;
            } else {
                this.saveData.joinFields = [];
            }

            if (!common.isEmpty(data.havingConditionVO)) {
                this.saveData.havingConditionVO = data.havingConditionVO;
            }

            let groupFieldsValue = [];
            if (!common.isEmpty(data.groupFields)) {
                this.saveData.groupFields = data.groupFields;
                data.groupFields.forEach(element => {
                    groupFieldsValue.push(`${element.table.name}·-·${element.field}`);
                })
            } else {
                this.saveData.groupFields = [];
            }

            let orderFieldsValue = [];
            if (!common.isEmpty(data.orderFields)) {
                this.saveData.orderFields = data.orderFields;
                data.orderFields.forEach(element => {
                    orderFieldsValue.push(`${element.table.name}·-·${element.field}·-·${element.order}`);
                })
            } else {
                this.saveData.orderFields = [];
            }

            this.saveData.sqlCode = data.sqlCode;
            let tempMappingArray = [];
            if (!common.isEmpty(data.queryFields)) {
                if (data.mappingType === 1) {
                    tempMappingArray = this.renderTable(data.queryFields);
                } else {

                }
            }

            this.setState({
                mappings: tempMappingArray,
                groupFieldsValue,
                orderFieldsValue,
                joinFields
            })

        })
    }

    checkQueryFieldsFinish() {
        let rs = true
        if (!common.isEmpty(this.saveData.queryFields)) {
            for (let i = 0; i < this.saveData.queryFields.length; i++) {
                const element = this.saveData.queryFields[i];
                if (common.isEmpty(element.field)) rs = false;
                if (common.isEmpty(element.fieldName)) rs = false;
                if (common.isEmpty(element.varCode)) rs = false;
                if (common.isEmpty(element.varName)) rs = false;
                if (common.isEmpty(element.varDataType)) rs = false;
            }
        }
        return rs
    }

    renderTable(list) {
        console.log("renderTable list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: this.saveData.mappingType == 1 ? <Select showSearch={true} optionFilterProp="search" defaultValue={element.varName} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'varCode', value.split('·-·')[0]); this.tableDataChange(i, 'varName', option.props.children) }}>
                    {this.state.tempVarList.map((item, j) =>
                        <Select.Option search={`${item.code}${item.value}`} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select> : sessionStorage.rootProcessTreeName,
                c2: <Select showSearch={true} optionFilterProp="search" defaultValue={element.field ? `${element.table.name}·-·${element.field}` : ''} style={{ width: '300px' }} onChange={(value, option) => { this.tableDataChange(i, 'field', option.props.field); this.tableDataChange(i, 'fieldName', option.props.fieldName); this.tableDataChange(i, 'varDataType', option.props.varDataType); this.tableDataChange(i, 'table', { "aliasName": "", name: option.props.table }); }}>
                    {this.state.fieldList.map((item, j) =>
                        item.fieldsList.map((item2, i) =>
                            // <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} key={Math.random()} field={item2.code} fieldName={item2.value} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                            <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} key={Math.random()} field={item2.code} fieldName={item2.value} table={item.name} varDataType={item2.varDataType} index={i}>{item2.value}</Select.Option>
                        )
                        // < Select.Option varDataType = { item.varDataType } value = {`${item.name}·-·${item2.code}`}>{item.value}</Select.Option>
                    )
                    }
                </Select >,
                c3: (() => {
                    switch (this.getVarDataType(element.varDataType)) {
                        case 'string':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForString.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'int':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'float':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'boolean':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForBoolean.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'time':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForDate.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        default:
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNull.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                    }
                })(),
                c4: <Switch checkedChildren="开" disabled={common.isEmpty(element.functionCode) ? true : false} defaultChecked={this.saveData.queryFields[i].fieldDistinct == 1 ? true : false} unCheckedChildren="关" onChange={(checked) => { this.tableDataChange(i, 'fieldDistinct', checked ? 1 : 0); }} />,
                c5: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
            })
        }

        return tempArray
    }

    getVarDataType = (dataType) => {
        let rs = null;
        if (typeof dataType === 'string')
            dataType = Number(dataType)

        switch (dataType) {
            case 12:
                rs = 'string';
                break;
            case -3:
                rs = 'string';
                break;
            case -5:
                rs = 'int';
                break;
            case 4:
                rs = 'int';
                break;
            case -6:
                rs = 'int';
                break;
            case 5:
                rs = 'int';
                break;
            case 3:
                rs = 'float';
                break;
            case 2:
                rs = 'float';
                break;
            case 6:
                rs = 'float';
                break;
            case 16:
                rs = 'boolean';
                break;
            case 93:
                rs = 'time';
                break;
            case 1111:
                rs = 'string';
                break;
            default:
                break;
        }
        return rs
    }

    formatTables(tables) {
        let tempArray = [];
        if (common.isEmpty(tables)) return ''
        return tables[0].name

    }

    changeFieldLeftJoinCallBack(key, value, i) {
        console.log('key, value, i', key, value, i)
        if (key === 'joinType') {//给this.saveData.tables的joinType赋值
            this.saveData.tables[i + 1].joinType = value;
        } else if (key === 'tables') {
            this.saveData.tables[i + 1].name = value;
            this.saveData.joinFields[i].joinTable.name = value;
            this.saveData.joinFields[i].field = '';
            this.saveData.joinFields[i].joinField = '';
            this.reFormatFieldListAndOrderList();
        } else {
            this.saveData.joinFields[i][key] = value;
        }
        this.setState({ joinFields: this.saveData.joinFields })
        this.controlNodeTranslateToSql();
    }

    reFormatFieldListAndOrderList() {
        this.saveData.orderFields = [];
        let fieldList = [];
        let orderFieldList = [];
        this.saveData.tables.forEach(element => {

            //分组字段：值和下拉
            let fieldsList2 = { name: element.name, cnName: '', fieldsList: [] };
            this.state.allField.forEach(element2 => {
                if (element.name === element2.name) {
                    fieldsList2.cnName = element2.cnName;
                    fieldsList2.fieldsList = element2.fieldsList;
                }
            })
            fieldList.push(fieldsList2);

            //排序字段：值和下拉
            let orderFieldList2 = { name: element.name, cnName: '', orderFieldList: [] };
            this.state.allField.forEach(element2 => {
                if (element.name === element2.name) {
                    orderFieldList2.cnName = element2.cnName;
                    element2.fieldsList.forEach(element3 => {
                        orderFieldList2.orderFieldList.push({
                            value: 'asc',
                            label: ' ↑升序',
                            code: element3.code,
                            name: element3.value
                        })
                        orderFieldList2.orderFieldList.push({
                            value: 'desc',
                            label: ' ↓降序',
                            code: element3.code,
                            name: element3.value
                        })
                    })

                }
            })
            orderFieldList.push(orderFieldList2)
        })
        this.saveData.orderFields = [];
        if (this.saveData.mappingType == 1) {
            this.saveData.queryFields = [];
        } else {
            this.saveData.queryFields = [{
                "field": "",
                "fieldName": "",
                // "table": this.saveData.tables[0],
                "table": {
                    "aliasName": "",
                    "name": ""
                },
                "varCode": sessionStorage.rootProcessTreeCode,
                "varName": sessionStorage.rootProcessTreeName,
                "functionType": "",
                "functionCode": "",
                "fieldDistinct": 0
            }];
        }
        // console.log("this.saveData.queryFields =", this.saveData.queryFields);
        this.saveData.groupFields = [];
        this.saveData.conditionVO.conditions = [{
            "relType": 0,
            "expressionVO": {
                "varCode": "",
                "varName": "",
                "varType": "",
                "optType": "",
                "value": "",
                "valueType": 0,
                "valueCode": "",
                "valueName": "",
                "table": {
                    "aliasName": "",
                    "name": ""
                }
            },
            "nodeType": 1
        }];
        this.setState({
            fieldList,
            orderFieldList,
            orderFieldsValue: [],
            groupFieldsValue: [],
            mappings: []
        })
    }

    addTable() {
        this.saveData.tables.push({
            "aliasName": "",
            "joinType": '',
            "name": ""
        })
        //回调复位joinFields数组
        let joinFields = this.state.joinFields;
        joinFields.push({
            "field": "",
            "joinField": "",
            "joinTable": {
                "aliasName": "",
                "name": "",
            },
            "table": {
                "aliasName": "",
                "name": ""
            }
        })
        this.saveData.joinFields = joinFields;
        this.setState({ joinFields })
    }

    subTable(index) {
        this.saveData.tables.splice(index + 1, 1);
        this.saveData.joinFields.splice(index, 1);
        this.setState({ joinFields: this.saveData.joinFields });
        this.reFormatFieldListAndOrderList();
    }

    /**
     * 获取根部信息，刷新基础信息维护部分的数据，以判断是会否可以提交
     *
     */
    getRootData() {
        this.props.processTreeStore.getDataForApi2(this.props.match.params.id)
    }

    updateConditionTree(){
        
    }


    render() {
        function callback(key) {
            // console.log(key);
        }
        // console.log("this.saveData", this.saveData);
        const Panel = Collapse.Panel;
        let dataSource = common.isEmpty(this.saveData.queryFields) ? [] : this.renderTable(this.saveData.queryFields);

        const columns = [{
            title: '映射变量',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '来源表字段',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '计算函数',
            dataIndex: 'c3',
            key: 'c3',
        }, {
            title: '是否去重',
            dataIndex: 'c4',
            key: 'c4',
        }];

        const columns2 = [{
            title: '映射变量',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '来源表字段',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '计算函数',
            dataIndex: 'c3',
            key: 'c3',
        }, {
            title: '是否去重',
            dataIndex: 'c4',
            key: 'c4',
        }, {
            title: '',
            dataIndex: 'c5',
            key: 'c5',
        }];

        return (
            <div className="pageContent" style={{ marginLeft: '10px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }} ></FormHeader>
                <div style={{ marginTop: '20px' }}>
                    <FormBlock header="节点定义">
                        <Form>
                            <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                            <FormItem name="父节点" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="parentId" defaultValue={this.saveData.parentId ? this.saveData.parentId : sessionStorage.rootProcessTreeName} selectData={this.state.parentNodeList}></FormItem>

                            {
                                this.props.type === 'rtq' ?
                                    <FormItem name="变量映射" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="mappingType" defaultValue={this.saveData.mappingType} selectData={[{ code: 0, value: '实时变量映射' }, { code: 1, value: '临时变量映射' }]}></FormItem>
                                    : ''
                            }
                        </Form>
                    </FormBlock>
                    <FormBlock header="选择表/字段">
                        <div style={{ width: '100%', float: 'left', marginLeft: '13px', marginBottom: '25px' }}>
                            <p style={{ float: 'left', margin: '0 10px 0 0', height: '32px', lineHeight: '32px' }}>
                                选择表：</p>
                            <Select
                                style={{ float: 'left', width: '160px' }}
                                // mode="multiple"
                                value={this.formatTables(this.saveData.tables)}
                                onChange={(value, option) => {
                                    // console.log(option);
                                    this.saveData.tables[0] = {
                                        "aliasName": "",
                                        "name": option.props.value,
                                        'joinType': 2
                                    };

                                    this.reFormatFieldListAndOrderList();
                                    // this.controlNodeTranslateToSql();
                                }}
                            >
                                {
                                    this.state.tableList.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                            {/* 暂时屏蔽多表功能 */}
                            {/* <AddAndSub type='add' add={this.addTable} style={{ float: 'left', position: 'relative', top: '-3px' }} /> */}
                        </div>
                        {/* 暂时屏蔽多表功能 */}
                        {/* <div style={{ width: '100%', marginBottom: '10px', float: 'left', overflowX: 'auto', marginLeft: '13px' }}>

                            {
                                this.state.joinFields.map((item, i) =>
                                    <SelectTables joinType={this.saveData.tables[(i + 1)].joinType} joinFields={item} tableList={this.state.tableList} fieldList={this.state.fieldList} callBack={this.changeFieldLeftJoinCallBack} subCallBack={this.subTable} key={Math.random()} index={i} style={{ float: 'right' }} />
                                )
                            }
                            <div style={{ clear: 'both' }}></div>
                        </div> */}
                        {/* 废弃的 */}
                        {/* <div style={{ width: '100%', marginBottom: '10px', float: 'left' }}>
                            {
                                this.state.joinFields.map((item, i) =>
                                    <FieldLeftJoin joinType={this.saveData.tables[(i + 1)].joinType} joinFields={item} selectData={this.state.fieldList} callBack={this.changeFieldLeftJoinCallBack} key={Math.random()} index={i} style={{ float: 'right' }} />
                                )
                            }

                        </div> */}
                        <div style={{ width: '100%', marginBottom: '24px', float: 'left' }}>
                            <p style={{ float: 'left', margin: '0 10px 0 0', height: '32px', lineHeight: '32px' }}>
                                分组字段：
                            </p>
                            <Select
                                style={{ float: 'left', width: '440px' }}
                                mode="multiple"
                                showSearch
                                value={this.state.groupFieldsValue}
                                onChange={(value, option) => {
                                    // console.log(option);
                                    let tempArray = [];
                                    option.forEach(element => {
                                        tempArray.push({
                                            field: element.props.code,
                                            table: {
                                                "aliasName": "",
                                                "name": element.props.table
                                            },
                                        });
                                    })
                                    this.saveData.groupFields = tempArray;
                                    this.setState({ groupFieldsValue: value });
                                    this.controlNodeTranslateToSql();
                                }}
                            >
                                {
                                    this.state.fieldList.map((item, i) =>
                                        item.fieldsList.map((item2, i) =>
                                            <Select.Option value={`${item.name}·-·${item2.code}`} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{this.saveData.tables.length > 1 ? `${item.cnName}.${item2.value}` : item2.value}</Select.Option>
                                        )

                                    )
                                }
                            </Select>
                        </div>
                        <div style={{ width: '100%', marginBottom: '24px', float: 'left' }}>
                            <p style={{ float: 'left', margin: '0 10px 0 0', height: '32px', lineHeight: '32px' }}>
                                排序字段：</p>
                            <Select
                                style={{ float: 'left', width: '440px' }}
                                mode="multiple"
                                showSearch
                                value={this.state.orderFieldsValue}
                                onChange={(value, option) => {
                                    let tempArray1 = [];
                                    option.forEach(element => {
                                        tempArray1.push({
                                            table: {
                                                "aliasName": "",
                                                "name": element.props.table
                                            },
                                            field: element.props.field,
                                            order: element.props.order
                                        })
                                    })
                                    this.saveData.orderFields = tempArray1;
                                    this.setState({
                                        orderFieldsValue: value
                                    })
                                    this.controlNodeTranslateToSql();
                                }}
                            >
                                {
                                    this.state.orderFieldList.map((item, i) =>
                                        item.orderFieldList.map((item2, i) =>
                                            <Select.Option value={`${item.name}·-·${item2.code}·-·${item2.value}`} order={item2.value} field={item2.code} table={item.name} key={Math.random()} index={i}>{this.saveData.tables.length > 1 ? `${item.cnName}.${item2.name}${item2.label}` : `${item2.name}${item2.label}`}</Select.Option>
                                        )

                                    )
                                }
                            </Select>
                        </div>
                        <div style={{ clear: 'both' }}></div>

                    </FormBlock>

                    {
                        this.saveData.mappingType == 0 ?
                            <FormBlock header="添加实时变量映射">
                                <Table dataSource={dataSource} columns={columns} pagination={false} />
                            </FormBlock>
                            :
                            <FormBlock header="添加临时变量映射">
                                <Table dataSource={this.state.mappings} columns={columns2} pagination={false} />
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addMappings}><Icon type="plus" theme="outlined" />添加映射</Button>
                            </FormBlock>
                    }

                    <FormBlock header="过滤" style={{ minWidth: '260px', overflowX: 'auto' }}>
                        <TreePanel e_and_d_Ready={this.props.store.getE_and_d_Ready} translateToSql={this.controlNodeTranslateToSql} allVarListTypeForm={this.props.type} id={this.props.id} type="query" fieldList={this.state.fieldList} initTempVarListCallBack={this.initTempVarListCallBack} updateConditionTree={this.updateConditionTree} conditionComplete={this.conditionComplete} treeData={this.saveData.conditionVO} treeDataCallBack={this.treeDataCallBack} />
                    </FormBlock>
                    <FormBlock header="SQL">
                        <Code ref={el => this.code = el} sqlCode={this.saveData.sqlCode} type={1}  />
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
Query.propTypes = {
    type: PropTypes.oneOf(['rtq', 'rule', 'strategy']),
    auth: PropTypes.shape({
        save: PropTypes.bool
    })
}
Query.defaultProps = {
    auth: { save: false }
}
export default Query;