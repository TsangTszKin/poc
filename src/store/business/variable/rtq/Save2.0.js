/* eslint-disable no-inner-declarations */
/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-23 16:47:33
 * @Description: 
 */

import { observable, action, computed, toJS, autorun } from 'mobx';
import variableService from '@/api/business/variableService';
import commonService from '@/api/business/commonService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Input, InputNumber, Select } from 'antd';
import React from 'react';
import FixedValue from '@/components/condition-tree/FixedValue';
import AddSub from '@/components/process-tree/AddSub';
import ExtTableAction from '@/components/business/variable/real-time-query/2.0/widgets/ExtTableAction.jsx';

class store extends React.Component {
    constructor(props) {
        super(props)
        this.getSqlPreviewForAPI = this.getSqlPreviewForAPI.bind(this);
        this.getTestInput = this.getTestInput.bind(this);
        this.inputValueChange = this.inputValueChange.bind(this);
        this.getTestOutputForApi = this.getTestOutputForApi.bind(this);
        this.allVersionForApi = this.allVersionForApi.bind(this);
        this.formatDateValueForFixedValue = this.formatDateValueForFixedValue.bind(this);
        this.renderExtTable = this.renderExtTable.bind(this);
        this.tableDataChangeForExt = this.tableDataChangeForExt.bind(this);
        this.addOneRowForExt = this.addOneRowForExt.bind(this);
        this.subOneRowForExt = this.subOneRowForExt.bind(this);
        this.renderJuheTable = this.renderJuheTable.bind(this);
        this.renderFenzuTable = this.renderFenzuTable.bind(this);
        this.tableDataChangeForFenzu = this.tableDataChangeForFenzu.bind(this);
        this.tableDataChangeForJuhe = this.tableDataChangeForJuhe.bind(this);
        this.addOneRowForFenzu = this.addOneRowForFenzu.bind(this);
        this.addOneRowForJuhe = this.addOneRowForJuhe.bind(this);
        this.subOneRowForFenzu = this.subOneRowForFenzu.bind(this);
        this.subOneRowForJuhe = this.subOneRowForJuhe.bind(this);
        this.getRtqInfo_2_0_forApi = this.getRtqInfo_2_0_forApi.bind(this);
        this.getRtqByTemplateId = this.getRtqByTemplateId.bind(this);
        this.getRtqConfig_2_0_forApi = this.getRtqConfig_2_0_forApi.bind(this);
        this.saveRtq_config_2_0_forApi = this.saveRtq_config_2_0_forApi.bind(this);
        this.toConfig = this.toConfig.bind(this);
        this.packConfig = this.packConfig.bind(this);
        this.init = this.init.bind(this);
        this.verifyBaseInfo = this.verifyBaseInfo.bind(this);
        this.verifyInputInfo = this.verifyInputInfo.bind(this);
        this.verifyExtInfo = this.verifyExtInfo.bind(this);
        this.verifyFilterInfo = this.verifyFilterInfo.bind(this);
        this.verifyJuheInfo = this.verifyJuheInfo.bind(this);
        this.verifyOutputInfo = this.verifyOutputInfo.bind(this);
        this.packInFields = this.packInFields.bind(this);
        this.verifyInFields = this.verifyInFields.bind(this);
        this.renderOrderTable = this.renderOrderTable.bind(this);
        this.tableDataChangeForOrder = this.tableDataChangeForOrder.bind(this);
        this.addOneRowForOrder = this.addOneRowForOrder.bind(this);
        this.subOneRowForOrder = this.subOneRowForOrder.bind(this);
        this.getExtendFieldsDataForApi = this.getExtendFieldsDataForApi.bind(this);
        this.saveRtq_config_2_0_newVersion_forApi = this.saveRtq_config_2_0_newVersion_forApi.bind(this);
        this.reset = this.reset.bind(this);
        this.scanning = this.scanning.bind(this);
        this.fixVarSeletion = this.fixVarSeletion.bind(this);
        this.getDataTypeLabel = this.getDataTypeLabel.bind(this);
        this.getTableAliasLabel = this.getTableAliasLabel.bind(this);
        this.verifyExtConfig = this.verifyExtConfig.bind(this);
        autorun(() => {

        });
        // reaction(
        //     () => this.inputInfo.data.isMulti,
        //     isMulti => {
        //         alert(isMulti)
        //         this.inputInfo.table.selectKey = []
        //     }
        // );
    }
    @observable isLoading = true;
    @observable id = '';
    @observable isShowDrawerForSql = false;
    @observable sqlPreview = "";
    @observable isShowDrawerForTest = false;
    @observable inputDataSource = [];
    @observable inputValueList = [];
    @observable outputDataSource = [];
    @observable isCanTest = false;
    @observable storeBus = 0;//store之间的桥梁通讯，解决非new情况下的store之间的通讯问题    0初始化不处理，1流程树获取一次基础信息的接口， 2info组件获取一次基础信息的接口，保证流程树和info组件的数据保持同步
    @observable version = {
        list: [],
        value: '',
        get getList() { return toJS(this.list) },
        get getValue() { return toJS(this.value) },
        setList(value) { this.list = value },
        setValue(value) { this.value = value }
    }
    @observable e_and_d_Ready = false;
    @observable currentStepIndex = 0//0基础信息，1输入，2衍生，3过滤，4聚合，5输出

    /**
     *页面初始化要用的下拉选择数据
     *
     * @memberof store
     */
    @observable helper = {
        data: {
            // info
            eventSourceList: [],
            dimensionList: [],
            rtqVarTypeList: [],
            dataTypeList: [],
            categoryList: [],

            //config
            batchVarList: [],
            functionTypeList: [],
            rtqExtendTypeList: [],
            joinTypeList: [],
            rtqCollectionList: [],
            tableList: [],
            eventVarList: [],
            // dataTypeList: [],
            rtqVarConfig: [],
            functionComputeTypeList: [],

            VAR_SELECTION_ALL: [],//字符串
            VAR_SELECTION_DECIMAL: [],//单双精度
            VAR_SELECTION_INTEGER: [],//整型，长整型
            VAR_SELECTION_NUMBER: [],//浮点型
            VAR_SELECTION_TIMESTAMP: [],//时间类型
            VAR_SELECTION_VARCHAR: [],//变量

            linkFieldList: []//被引用的字段集合
        },
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value },
        updateData(key, value) { this.data[key] = value }
    }

    @observable _isResource = false;
    @computed get isResource() { return toJS(this._isResource) }
    @action.bound setIsResource(value) { this._isResource = value; }

    onConditionVO = conditionVODemo;
    havingConditionVO = conditionVODemo;
    isLoaded = false;

    /**
     *基础信息
     *
     * @memberof store
     */
    @observable baseInfo = {
        data: {
            "category": '',
            "categoryName": "",
            "code": "",
            "dataType": '',
            "dataTypeName": "",
            "defaultValue": "",
            "description": "",
            "dimensionId": "",
            "dimensionName": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "name": "",
            "script": "",
            "type": '',
            "typeName": "",
            "rtqVarType": ''
        },
        modify: false,
        get getData() { return toJS(this.data) },
        get get_modify() { return toJS(this.modify) },
        setData(value) { this.data = value },
        set_modify(value) { this.modify = value },
        updateData(key, value) { this.data[key] = value; this.modify = true; }
    }

    // 第一步（输入）信息的集合 start
    /**
     * 信息的集合
     *
     * @memberof store
     */
    @observable inputInfo = {
        data: {
            isMulti: 0,
            inFields: [
                // {
                //     "code": "",
                //     "dataType": 0,
                //     "defaultValue": "",
                //     "len": 0,
                //     "name": "",
                //     "tableAlias": ""
                // }
            ],
            leftTable: {//单表也是放在leftTable
                code: '',
                id: '',
                name: '',
                type: 0,//类型，1表2集合
            },
            rightTable: {
                code: '',
                id: '',
                name: '',
                type: 0,//类型，1表2集合
            },
            joinType: '',
            onConditionVO: conditionVODemo
        },
        radioFortable: '0',
        tableFields: [],
        LTableFields: [],
        RTableFields: [],
        table: {
            dataSource: [
                // {
                //     key: 0,
                //     name: '1',
                //     code: '1',
                //     dataType: '1',
                //     len: '1',
                //     precision: '1'
                // }
            ],
            columns: fieldColumns,
            selectKey: [],
            l_selectKey: [],
            r_selectKey: [],
            get getDataSource() { return toJS(this.dataSource) },
            get getColumns() { return toJS(this.columns) },
            get getSelectkey() { return toJS(this.selectKey) },
            get get_l_selectKey() { return toJS(this.l_selectKey) },
            get get_r_selectKey() { return toJS(this.r_selectKey) },
            setDataSource(value) { this.dataSource = value },
            setColumns(value) { this.columns = value },
            setSelectkey(value) { this.selectKey = value }
        },
        modify: false,
        get getData() { return toJS(this.data) },
        get get_modify() { return toJS(this.modify) },
        setData(value) { this.data = value },
        set_modify(value) { this.modify = value },
        updateData(key, value) {
            this.data[key] = value;
            this.modify = true;
        },
        get getRadioFortable() { return toJS(this.radioFortable) },
        setRadioFortable(value) { this.radioFortable = value },
    }
    packInFields() {
        console.log("packFields this.inputInfo.getData", this.inputInfo.getData)
        let inFields = [];
        if (this.inputInfo.getData.isMulti) {
            if (!common.isEmpty(this.inputInfo.table.get_l_selectKey)) {//左表
                this.helper.getData.tableList.forEach(table => {
                    if (table.id === this.inputInfo.getData.leftTable.id) {
                        this.inputInfo.table.get_l_selectKey.forEach((index) => {
                            inFields.push({
                                "code": `L_${table.columnList[index].code}`,
                                "dataType": table.columnList[index].dataType,
                                "defaultValue": table.columnList[index].defaultValue,
                                "len": table.columnList[index].len,
                                "name": table.columnList[index].name,
                                "selectCode": table.columnList[index].selectCode,
                                "tableAlias": 'L'
                            })
                        })
                    }
                })
            }
            if (!common.isEmpty(this.inputInfo.table.get_r_selectKey)) {//右表
                this.helper.getData.tableList.forEach(table => {
                    if (table.id === this.inputInfo.getData.rightTable.id) {
                        this.inputInfo.table.get_r_selectKey.forEach((index) => {
                            inFields.push({
                                "code": `R_${table.columnList[index].code}`,
                                "dataType": table.columnList[index].dataType,
                                "defaultValue": table.columnList[index].defaultValue,
                                "len": table.columnList[index].len,
                                "name": table.columnList[index].name,
                                "selectCode": table.columnList[index].selectCode,
                                "tableAlias": 'R'
                            })
                        })
                    }
                })
            }
        } else {
            if (!common.isEmpty(this.inputInfo.table.get_l_selectKey)) {//左表
                this.helper.getData.tableList.forEach(table => {
                    if (table.id === this.inputInfo.getData.leftTable.id) {
                        this.inputInfo.table.get_l_selectKey.forEach((index) => {
                            inFields.push({
                                "code": `L_${table.columnList[index].code}`,
                                "dataType": table.columnList[index].dataType,
                                "defaultValue": table.columnList[index].defaultValue,
                                "len": table.columnList[index].len,
                                "name": table.columnList[index].name,
                                "selectCode": table.columnList[index].selectCode,
                                "tableAlias": 'L'
                            })
                        })
                    }
                })
            }
        }
        this.inputInfo.data.inFields = common.deepClone(inFields);
    }
    // 第一步（输入）信息的集合 end
    // 第二步（衍生）信息的集合 start
    /**
     * 信息的集合
     *
     * @memberof store
     */
    @observable extInfo = {
        data: {
            extendFields: [
                // {
                //     "code": "string",
                //     "dataType": 0,
                //     "defaultValue": "string",
                //     "expression": "string",
                //     "expressionDesc": "string",
                //     "extendType": "string",
                //     "func": {
                //         "column": "string",
                //         "descript": "string",
                //         "format": "string",
                //         "fun": "string",
                //         "paraList": [
                //             {
                //                 "code": "string",
                //                 "dataSources": [
                //                     {
                //                         "additionalProp1": {},
                //                         "additionalProp2": {},
                //                         "additionalProp3": {}
                //                     }
                //                 ],
                //                 "dataType": "string",
                //                 "descript": "string",
                //                 "formType": 0,
                //                 "isDynamic": true,
                //                 "name": "string",
                //                 "value": {}
                //             }
                //         ]
                //     },
                //     "len": 0,
                //     "mappingList": [
                //         {
                //             "condition": {
                //                 "conditions": [
                //                     null
                //                 ],
                //                 "expression": "string",
                //                 "expressionVO": {
                //                     "id": "string",
                //                     "optType": '',
                //                     "table": {
                //                         "aliasName": "string",
                //                         "joinType": 0,
                //                         "name": "string"
                //                     },
                //                     "value": "string",
                //                     "valueCategoryType": 0,
                //                     "valueCode": "string",
                //                     "valueDataType": 0,
                //                     "valueDefaultValue": "string",
                //                     "valueName": "string",
                //                     "valueTableAlias": "string",
                //                     "valueType": 0,
                //                     "varCategoryType": 0,
                //                     "varCode": "string",
                //                     "varDataType": 0,
                //                     "varDefaultValue": "string",
                //                     "varName": "string",
                //                     "varTableAlias": "string",
                //                     "varType": 0
                //                 },
                //                 "id": "string",
                //                 "nodeType": 0,
                //                 "parentId": "string",
                //                 "relType": 0,
                //                 "sort": 0
                //             },
                //             "value": "string"
                //         }
                //     ],
                //     "name": "string",
                //     "precision": "string",
                //     "tableAlias": "string"
                // }
            ]
        },
        modify: false,
        editIndex: null,
        rowFuncBackup: null,
        editData: {
            "computeExpressionVO": computeExpressionVODemo,
            "func": {
                "column": "",
                "descript": "",
                "format": "",
                "fun": "",
                "paraList": []
            },
            "base": {
                "dataType": ''
            }
        },
        modal: {
            count: {
                value: false,
                show() { this.value = true },
                hide() { this.value = false }
            },
            mapping: {
                value: false,
                show() { this.value = true },
                hide() { this.value = false }
            },
            func: {
                value: false,
                show() { this.value = true },
                hide() { this.value = false }
            }
        },
        get getData() { return toJS(this.data) },
        get get_modify() { return toJS(this.modify) },
        get get_editIndex() { return toJS(this.editIndex) },
        get get_rowFuncBackup() { return toJS(this.rowFuncBackup) },
        get get_editData() { return toJS(this.editData) },
        setData(value) { this.data = value },
        set_modify(value) { this.modify = value },
        set_editIndex(value) { this.editIndex = value },
        set_rowFuncBackup(value) { this.rowFuncBackup = value },
        set_editData(value) { this.editData = value },
        updateData(key, value) {
            this.data[key] = value;
            this.modify = true;
        },
        updateEditData(name, value) {
            this.editData[name] = value
        },
        table: {
            dataSource: [],
            columns: extColumns,
            get getDataSource() { return toJS(this.dataSource) },
            get getColumns() { return toJS(this.columns) },
            setDataSource(value) { this.dataSource = value },
            setColumns(value) { this.columns = value }
        }
    }
    renderExtTable(list) {
        const disableEdit = this.isResource;
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                name: <Input placeholder="请输入名称" style={{ width: '200px' }} defaultValue={element.name}
                    disabled={disableEdit}
                    onChange={(e) => {
                        if (!this.scanning({ code: `${element.code}`, name: element.name }, 2)) {
                            this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
                            return
                        }
                        this.tableDataChangeForExt(i, 'name', e.target.value);
                    }}
                />,
                dataType: <Select placeholder="请选择数据类型" style={{ width: '150px' }} defaultValue={common.isEmpty(element.dataType) ? undefined : element.dataType}
                    disabled={disableEdit}
                    onChange={(value) => {
                        if (!this.scanning({ code: `${element.code}`, name: element.name }, 2)) {
                            this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
                            return
                        }
                        this.tableDataChangeForExt(i, 'dataType', value);
                    }}>
                    {
                        this.helper.getData.dataTypeList.map((item, i) =>
                            <Select.Option value={item.val} key={i}>{item.label}</Select.Option>
                        )
                    }
                </Select>,
                extendType:
                    <Select placeholder="请选择衍生方式" style={{ width: '150px' }} defaultValue={common.isEmpty(element.extendType) ? undefined : element.extendType}
                        disabled={disableEdit}
                        onChange={(value) => {
                            if (!this.scanning({ code: `${element.code}`, name: element.name }, 2)) {
                                this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
                                return
                            }
                            this.tableDataChangeForExt(i, 'extendType', value);
                        }}>
                        {
                            this.helper.getData.rtqExtendTypeList.map((item, i) =>
                                <Select.Option value={item.val} key={i}>{item.label}</Select.Option>
                            )
                        }
                    </Select>,
                defaultValue: <FixedValue
                    style={{ width: '100%' }}
                    disabled={disableEdit}
                    type="defaultValueForList" value={element.defaultValue}
                    index={i}
                    changeData={(j, name, value) => {
                        if (!this.scanning({ code: `${element.code}`, name: element.name }, 2)) {
                            this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
                            return
                        }
                        console.log("j, name, value", j, name, value)
                        this.extInfo.data.extendFields[j].defaultValue = value;
                        // this.tableDataChangeForExt(i, 'defaultValue', value);
                    }}
                    dataType={element.dataType} />,
                action: disableEdit ? '' :
                    <ExtTableAction
                        index={i} datakey={uuid}
                        deleteOne={() => {
                            if (!this.scanning({ code: `${element.code}`, name: element.name }, 2)) {
                                this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
                                return
                            }
                            this.extInfo.set_editIndex(null);
                            this.subOneRowForExt(uuid)
                        }}
                        toConfig={() => {
                            // if (!this.scanning({ code: `${element.code}`, name: element.name }, 2)) {
                            //     this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
                            //     return
                            // }
                            this.toConfig(i, element.extendType)
                        }} />
            })
        }

        return tempArray
    }
    tableDataChangeForExt = (i, name, value) => {
        // this.outputInfo.init();
        console.log(`${i} ${name} ${value}`);
        this.extInfo.data.extendFields[i][name] = value;
        if (name === 'dataType') {
            this.extInfo.data.extendFields[i].defaultValue = '';
            this.extInfo.data.extendFields[i].func = {
                "column": "",
                "descript": "",
                "format": "",
                "fun": "",
                "paraList": []
            }
            this.extInfo.data.extendFields[i].mappingList = [];
            this.extInfo.data.extendFields[i].expression = '';
            this.extInfo.data.extendFields[i].expressionDesc = '';
        }
        this.extInfo.updateData('extendFields', this.extInfo.getData.extendFields);
        if (name === 'extendType' || name === 'dataType') {
            this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
        }
    }
    addOneRowForExt() {
        let tempArray = common.deepClone(this.extInfo.getData.extendFields);
        tempArray.push({
            "code": `E_${(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)}`,
            "dataType": '',
            "defaultValue": "",
            "expression": "",
            "expressionDesc": "",
            "computeExpressionVO": computeExpressionVODemo,
            "extendType": "",
            "func": {
                "column": "",
                "descript": "",
                "format": "",
                "fun": "",
                "paraList": []
            },
            "len": '',
            "mappingList": [
            ],
            "name": "",
            "tableAlias": "E"
        })
        this.extInfo.updateData('extendFields', tempArray);
        this.extInfo.table.setDataSource(this.renderExtTable((this.extInfo.getData.extendFields)))
    }
    subOneRowForExt(key) {
        let arrayIndex;
        for (let i = 0; i < this.extInfo.table.getDataSource.length; i++) {
            const element = this.extInfo.table.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
        }
        let data = this.extInfo.getData.extendFields;
        data.splice(arrayIndex, 1);
        this.extInfo.updateData('extendFields', data);
        if (data.length === 0) {
            this.extInfo.set_editIndex(null);
        }
        this.extInfo.table.setDataSource(this.renderExtTable(this.extInfo.getData.extendFields));
    }
    toConfig(i, extendType) {
        //当前行信息
        console.log("i, extendType", i, extendType)
        console.log('this.extInfo.getData.extendFields[i]', this.extInfo.getData.extendFields[i])
        for (const key in this.extInfo.getData.extendFields[i]) {
            if (this.extInfo.getData.extendFields[i].hasOwnProperty(key)) {
                const element = this.extInfo.getData.extendFields[i][key];
                switch (key) {
                    case 'name':
                        if (common.isEmpty(element)) {
                            message.warning("名称不能为空");
                            return false
                        }
                        break;
                    case 'dataType':
                        if (common.isEmpty(element)) {
                            message.warning("数据类型不能为空");
                            return false
                        }
                        break;
                    case 'extendType':
                        if (common.isEmpty(element)) {
                            message.warning("衍生方式不能为空");
                            return false
                        }
                        break;
                    case 'defaultValue':
                        if (common.isEmpty(element) && this.extInfo.getData.extendFields[i].dataType !== 12) {
                            message.warning("为空取值不能为空");
                            return false
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        //验证通过操作
        this.getExtendFieldsDataForApi();
        this.extInfo.getData.extendFields[i].func.column = this.extInfo.getData.extendFields[i].code;


        this.extInfo.set_editIndex(i);
        this.extInfo.updateEditData('base', this.extInfo.getData.extendFields[i]);
        switch (extendType) {
            case 1:
                this.extInfo.modal.func.show();
                this.extInfo.updateEditData('func', this.extInfo.getData.extendFields[i].func);
                break;
            case '1':
                this.extInfo.modal.func.show();
                this.extInfo.updateEditData('func', this.extInfo.getData.extendFields[i].func);
                break;
            case 0:
                this.extInfo.modal.count.show();
                this.extInfo.updateEditData('computeExpressionVO', this.extInfo.getData.extendFields[i].computeExpressionVO);
                break;
            case '0':
                this.extInfo.modal.count.show();
                this.extInfo.updateEditData('computeExpressionVO', this.extInfo.getData.extendFields[i].computeExpressionVO);
                break;
            default:
                message.warning("暂不支持映射类型");
                break;
        }
        console.log("this.extInfo.get_editData", this.extInfo.get_editData)
    }
    verifyExtConfig(type, extendField) {
        console.log("type, extendField", type, extendField)
        switch (type) {
            case 0://计算

                if (common.isEmpty(extendField.computeExpressionVO.fieldList)) {
                    if (!result) {
                        message.warning(`请配置完整衍生字段"${extendField.name}"的计算公式`);
                        return false
                    }
                }

                let result = true;
                let correct = true;

                function verifycomputeExpressionVO(computeExpressionVO) {
                    if (computeExpressionVO.type === 2) {
                        computeExpressionVO.fieldList.forEach(element => {
                            verifycomputeExpressionVO(element)
                        })
                    } else {
                        const { categoryType, code, selectCode, type, value } = computeExpressionVO.computeVarVO
                        const { computeOperator } = computeExpressionVO
                        console.log('categoryType, code, selectCode, type, value, computeOperator', categoryType, code, selectCode, type, value, computeOperator)
                        if (categoryType === 1) {//变量
                            if (common.isEmpty(code) || common.isEmpty(selectCode) || common.isEmpty(type)) {
                                result = false
                            }
                        } else {//固定值
                            if (common.isEmpty(value)) {
                                result = false
                            }
                            if (computeOperator === 'DIVIDE' && value == 0) {
                                result = false
                                correct = false
                            }
                        }
                    }
                }
                verifycomputeExpressionVO(extendField.computeExpressionVO);
                if (!correct) {
                    message.warning(`0不能做除数`);
                    return correct
                }
                if (!result) {
                    message.warning(`请配置完整衍生字段"${extendField.name}"的计算公式`);
                }
                return result
            case 1://函数
                let func = extendField.func;
                if (common.isEmpty(func.fun)) {
                    message.warning("请配置函数");
                    return false
                }
                let paraList = func.paraList
                if (!common.isEmpty(paraList)) {
                    for (let i = 0; i < paraList.length; i++) {
                        const element = paraList[i];
                        if (element.dataType !== 'STRING') {
                            //不是字符串需要校验不能为空
                            if (common.isEmpty(element.value)) {
                                message.warning("函数配置的非字符串类型参数不能为空");
                                return false
                            }
                        }
                    }
                }
                break;
            case 2://映射

                break;
            default:
                break;
        }
        return true
    }
    // 第二步（衍生）信息的集合 end

    // 第三步（过滤）信息的集合 start
    @observable filterInfo = {
        data: {
            whereConditionVO: conditionVODemo
        },
        modify: false,
        get getData() { return toJS(this.data) },
        get get_modify() { return toJS(this.modify) },
        setData(value) { this.data = value },
        set_modify(value) { this.modify = value },
        updateData(key, value) {
            this.data[key] = value;
            this.modify = true;
        }
    }
    // 第三步（过滤）信息的集合 end

    // 第四步（聚合）信息的集合 start
    /**
     * 信息的集合
     *
     * @memberof store
     */
    @observable juheInfo = {
        data: {
            aggFields: [
                // {
                //     name: '',
                //     code: '',
                //     dataType: '',
                //     len:'' ,
                //     fun: '',
                //      "wholeCode": ""
                // }
            ],
            groupFields: [],
            havingConditionVO: conditionVODemo,
        },
        modify: false,
        verifyConditionVO: false,
        shouldCommit: false,
        origin: {
            aggFields: [],
            groupFields: []
        },
        get getData() { return toJS(this.data) },
        get get_modify() { return toJS(this.modify) },
        get get_verifyConditionVO() { return toJS(this.verifyConditionVO) },
        get get_shouldCommit() { return toJS(this.shouldCommit) },
        get get_origin() { return toJS(this.origin) },
        setData(value) { this.data = value },
        set_modify(value) { this.modify = value },
        set_verifyConditionVO(value) { this.verifyConditionVO = value },
        set_shouldCommit(value) { this.shouldCommit = value },
        set_origin(value) { this.origin = value },
        updateData(key, value) {
            this.data[key] = value;
            this.modify = true;
        },
        table: {
            fenzu_dataSource: [],
            juhe_dataSource: [],
            fenzu_columns: fenzuColumns,
            juhe_columns: juheColumns,
            get get_fenzu_dataSource() { return toJS(this.fenzu_dataSource) },
            get get_juhe_dataSource() { return toJS(this.juhe_dataSource) },
            get get_fenzu_columns() { return toJS(this.fenzu_columns) },
            get get_juhe_columns() { return toJS(this.juhe_columns) },
            set_fenzu_dataSource(value) { this.fenzu_dataSource = value },
            set_juhe_dataSource(value) { this.juhe_dataSource = value },
            set_fenzu_columns(value) { this.fenzu_columns = value },
            set_juhe_columns(value) { this.juhe_columns = value }
        }
    }
    renderFenzuTable(list) {
        const disableEdit = this.isResource;
        console.log("list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                name: <Select disabled={disableEdit} placeholder="请选择字段" style={{ width: '200px' }} defaultValue={element.tableAlias && element.name ? (() => {
                    switch (element.code.split('_')[1]) {
                        case 'L':
                            return `左表.${element.name}`
                        case 'R':
                            return `右表.${element.name}`
                        default:
                            break;
                    }
                })() : undefined}
                    onChange={(value, option) => {
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `G.${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_fenzu_dataSource(this.renderFenzuTable(this.juheInfo.getData.groupFields));
                            return
                        }
                        this.tableDataChangeForFenzu(i, 'name_code_dataType_len_tableAlias', option);
                    }}>
                    {
                        this.inputInfo.getData.inFields.map((item, i) =>
                            <Select.Option key={i} value={i} code={item.code} item={item} selectCode={item.selectCode} dataType={item.dataType} defaultValue={item.defaultValue} len={item.len} name={item.name} tableAlias={item.tableAlias}>{`${(() => {
                                switch (item.tableAlias) {
                                    case 'L':
                                        return '左表'
                                    case 'R':
                                        return '右表'
                                    default:
                                        break;
                                }
                            })()}.${item.name}`}</Select.Option>

                        )
                    }
                </Select>,
                selectCode: element.selectCode,
                dataType: (() => {
                    for (let j = 0; j < this.helper.getData.dataTypeList.length; j++) {
                        const element2 = this.helper.getData.dataTypeList[j];
                        if (element2.val === element.dataType) {
                            return element2.label
                        }
                    }
                    return ''
                })(),
                len: element.len,
                action: <a style={{ color: '#D9D9D9' }}><AddSub type="sub"
                    sub={() => {
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_fenzu_dataSource(this.renderFenzuTable(this.juheInfo.getData.groupFields));
                            return
                        }
                        this.subOneRowForFenzu(uuid);
                    }} /></a>
            })
        }

        return tempArray
    }
    renderJuheTable(list) {
        const disableEdit = this.isResource;
        console.log("list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                field: <Select disabled={disableEdit} placeholder="请选择字段" style={{ width: '200px' }} defaultValue={element.selectCode ? `${element.selectCode}` : undefined}
                    onChange={(value, option) => {
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));
                            return
                        }
                        this.tableDataChangeForJuhe(i, 'name_code_dataType_len_tableAlias', option);
                    }}>
                    {
                        this.inputInfo.getData.inFields.map((item, i) => {
                            return <Select.Option key={i} value={`${item.tableAlias}.${item.selectCode}`} item={item} code={item.code} selectCode={item.selectCode} dataType={item.dataType} defaultValue={item.defaultValue} len={item.len} name={item.name} tableAlias={item.tableAlias}>{`${(() => {
                                switch (item.tableAlias) {
                                    case 'L':
                                        return '左表'
                                    case 'R':
                                        return '右表'
                                    default:
                                        break;
                                }
                            })()}.${item.name}`}</Select.Option>
                        }

                        )
                    }
                </Select>,
                name: <Input disabled={disableEdit} style={{ width: '200px' }} defaultValue={element.name}
                    onChange={(e) => {
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));
                            return
                        }
                        this.tableDataChangeForJuhe(i, 'name', e.target.value)
                    }} />,
                dataType: <Select disabled={disableEdit} placeholder="请选择数据类型" style={{ width: '150px' }} defaultValue={common.isEmpty(element.dataType) ? undefined : element.dataType}
                    onChange={(value) => {
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));
                            return
                        }
                        this.tableDataChangeForJuhe(i, 'dataType', value)
                    }}>
                    {
                        this.helper.getData.dataTypeList.map((item, i) =>
                            <Select.Option value={item.val} key={i}>{item.label}</Select.Option>
                        )
                    }
                </Select>,
                len: <InputNumber disabled={disableEdit} defaultValue={element.len} min={1}
                    onChange={(value) => {
                        console.log("value", value)
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));
                            return
                        }
                        let eventPercentage = String(value);
                        if (eventPercentage.indexOf('.') >= 0) {
                            value = Number(eventPercentage.split('.')[0]);
                        }
                        this.tableDataChangeForJuhe(i, 'len', value)
                    }} />,
                fun: <Select disabled={disableEdit} placeholder="请选择统计方式" style={{ width: '150px' }} defaultValue={element.fun}
                    onChange={(value) => {
                        if (!common.isEmpty(element.code) && !this.scanning({ code: `${element.code}`, name: element.name }, 4)) {
                            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));
                            return
                        }
                        this.tableDataChangeForJuhe(i, 'fun', value)
                    }}>
                    {
                        this.helper.getData.functionTypeList.map((item, i) =>
                            <Select.Option key={i} value={item.val} val={item.val}>{item.label}</Select.Option>

                        )
                    }
                </Select>,
                action: disableEdit ? '' :
                    <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => {
                        if (!common.isEmpty(element.code) && !this.scanning({
                            code: `${element.code}`,
                            name: element.name
                        }, 4)) {
                            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));
                            return
                        }
                        this.subOneRowForJuhe(uuid);
                    }} /></a>
            })
        }

        return tempArray
    }
    tableDataChangeForFenzu = (i, name, value) => {
        // this.outputInfo.init();
        console.log(`${i} ${name} ${value}`);
        console.log("value", value)
        if (name === 'name_code_dataType_len_tableAlias') {
            this.juheInfo.data.groupFields[i].name = value.props.name;
            this.juheInfo.data.groupFields[i].code = `G_${value.props.code}`;
            this.juheInfo.data.groupFields[i].selectCode = value.props.selectCode;
            this.juheInfo.data.groupFields[i].dataType = value.props.dataType;
            this.juheInfo.data.groupFields[i].len = value.props.len;
            this.juheInfo.data.groupFields[i].tableAlias = 'G';
            this.juheInfo.data.groupFields[i].selectFieldVO = value.props.item;
        }
        this.juheInfo.set_modify(true);
        this.juheInfo.table.set_fenzu_dataSource(this.renderFenzuTable(this.juheInfo.getData.groupFields))
    }
    tableDataChangeForJuhe = (i, name, value) => {
        // this.outputInfo.init();
        console.log(`${i} ${name} ${value}`);
        console.log("value", value)
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        if (name === 'name_code_dataType_len_tableAlias') {
            this.juheInfo.data.aggFields[i].name = value.props.name;
            this.juheInfo.data.aggFields[i].code = `A_${value.props.code}_${S4()}`;
            this.juheInfo.data.aggFields[i].selectCode = `${value.props.tableAlias}.${value.props.selectCode}`;
            this.juheInfo.data.aggFields[i].dataType = value.props.dataType;
            this.juheInfo.data.aggFields[i].len = value.props.len;
            this.juheInfo.data.aggFields[i].tableAlias = 'A';
            this.juheInfo.data.aggFields[i].selectFieldVO = value.props.item;
            this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields))
        } else {
            this.juheInfo.data.aggFields[i][name] = value;
        }
        this.juheInfo.set_modify(true);

    }
    addOneRowForFenzu() {
        let tempArray = common.deepClone(this.juheInfo.getData.groupFields);

        // 校验分组字段
        if (tempArray.length === 0) {
            this.outputInfo.updateData('orderFields', [])
        }

        tempArray.push({
            name: '',
            tableAlias: 'G',
            code: '',
            selectCode: '',
            dataType: '',
            len: '',
            wholeCode: '',
            selectFieldVO: {}
        })
        this.juheInfo.updateData('groupFields', tempArray);
        this.juheInfo.table.set_fenzu_dataSource(this.renderFenzuTable(this.juheInfo.getData.groupFields));

        console.log("this.juheInfo.get_shouldCommit", this.juheInfo.get_shouldCommit)
        console.log("this.juheInfo.get_origin", this.juheInfo.get_origin)
        //已经有聚合字段或者分组字段
        // if (!common.isEmpty(this.juheInfo.get_origin.aggFields) || !common.isEmpty(this.juheInfo.get_origin.groupFields)) this.juheInfo.set_shouldCommit(true);
    }
    addOneRowForJuhe() {
        let tempArray = common.deepClone(this.juheInfo.getData.aggFields);

        // 校验分组字段
        if (tempArray.length === 0) {
            this.outputInfo.updateData('orderFields', [])
        }

        tempArray.push({
            name: '',
            tableAlias: 'A',
            code: '',
            selectCode: '',
            dataType: '',
            len: '',
            fun: '',
            wholeCode: '',
            selectFieldVO: {}
        })
        this.juheInfo.updateData('aggFields', tempArray);
        this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable((this.juheInfo.getData.aggFields)));

        //已经有聚合字段或者分组字段
        // if (!common.isEmpty(this.juheInfo.get_origin.aggFields) || !common.isEmpty(this.juheInfo.get_origin.groupFields)) this.juheInfo.set_shouldCommit(true);
    }
    subOneRowForFenzu(key) {
        let arrayIndex;
        for (let i = 0; i < this.juheInfo.table.get_fenzu_dataSource.length; i++) {
            const element = this.juheInfo.table.get_fenzu_dataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
        }
        let data = this.juheInfo.getData.groupFields;
        data.splice(arrayIndex, 1);
        this.juheInfo.updateData('groupFields', data);
        this.juheInfo.table.set_fenzu_dataSource(this.renderFenzuTable(this.juheInfo.getData.groupFields));

        // 校验分组字段
        if (this.juheInfo.table.get_fenzu_dataSource.length === 0 && this.juheInfo.table.get_juhe_dataSource.length) {
            this.outputInfo.updateData('orderFields', [])
        }
    }
    subOneRowForJuhe(key) {
        let arrayIndex;
        for (let i = 0; i < this.juheInfo.table.get_juhe_dataSource.length; i++) {
            const element = this.juheInfo.table.get_juhe_dataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
        }
        let data = this.juheInfo.getData.aggFields;
        data.splice(arrayIndex, 1);
        this.juheInfo.updateData('aggFields', data);
        this.juheInfo.table.set_juhe_dataSource(this.renderJuheTable(this.juheInfo.getData.aggFields));

        // 校验分组字段
        if (this.juheInfo.table.get_fenzu_dataSource.length === 0 && this.juheInfo.table.get_juhe_dataSource.length) {
            this.outputInfo.updateData('orderFields', [])
        }
    }
    // 第四步（聚合）信息的集合 end

    // 第五步（输出）信息的集合 start
    @observable outputInfo = {
        data: {
            outFields: [
                // {
                //     "code": "",
                //     "dataType": '',
                //     "defaultValue": "",
                //     "len": '',
                //     "name": "",
                //     "tableAlias": "",
                //      "wholeCode": ""
                // }
            ],
            orderFields: [
                // {
                //     "code": "1",
                //     "dataType": '',
                //     "defaultValue": "",
                //     "len": '',
                //     "name": "",
                //     "order": "",
                //     "tableAlias": "",
                //      "wholeCode": ""
                // },
                // {
                //     "code": "2",
                //     "dataType": '',
                //     "defaultValue": "",
                //     "len": '',
                //     "name": "",
                //     "order": "",
                //     "tableAlias": "",
                //      "wholeCode": ""
                // },
            ],
        },
        modify: false,
        table: {
            dataSource: [],
            columns: orderColumns,
            get getDataSource() { return toJS(this.dataSource) },
            get getColumns() { return toJS(this.columns) },
            setDataSource(value) { this.dataSource = value },
            setColumns(value) { this.columns = value }
        },
        isOrder: false,
        get getData() { return toJS(this.data) },
        get get_modify() { return toJS(this.modify) },
        get get_isOrder() { return toJS(this.isOrder) },
        setData(value) { this.data = value },
        set_modify(value) { this.modify = value },
        set_isOrder(value) { this.isOrder = value },
        updateData(key, value) { this.data[key] = value; this.modify = true; },
        init() {
            this.data.outFields = [];
        }
    }
    renderOrderTable(list) {
        console.log("list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        let inFields = (() => {
            let inFields = common.deepClone(this.inputInfo.getData.inFields);
            inFields.forEach(element => {
                element.from = '输入字段';
            })
            return inFields
        })()
        let extendFields = (() => {
            let extendFields = common.deepClone(this.extInfo.getData.extendFields);
            extendFields.forEach(element => {
                element.from = '衍生字段';
            })
            return extendFields
        })()
        let aggFields = (() => {
            let aggFields = common.deepClone(this.juheInfo.getData.aggFields);
            aggFields.forEach(element => {
                element.from = '聚合字段';
            })
            return aggFields
        })()
        let groupFields = (() => {
            let groupFields = common.deepClone(this.juheInfo.getData.groupFields);
            groupFields.forEach(element => {
                element.from = '分组字段';
            })
            return groupFields
        })()
        console.log("inFields", inFields)
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                index: (i + 1),
                name:
                    (() => {
                        if (!common.isEmpty(groupFields) || !common.isEmpty(aggFields)) {//有分组或者聚合
                            return <Select placeholder="请选择字段名称" style={{ width: '180px' }} defaultValue={common.isEmpty(element.name) && common.isEmpty(element.tableAlias) ? undefined : `${this.getTableAliasLabel(element.tableAlias)}.${element.name}`} onChange={(value, option) => { this.tableDataChangeForOrder(i, 'name_code_dataType_len_type', option) }}>
                                {
                                    [...groupFields, ...aggFields].map((item, i) =>
                                        <Select.Option value={i} key={i} name={item.name} code={item.code} selectCode={item.selectCode} dataType={item.dataType} len={item.len} from={item.from} tableAlias={item.tableAlias} item={item}>
                                            {this.getTableAliasLabel(item.tableAlias)}.
                                            {
                                                (() => {
                                                    let fun = this.helper.getData.functionTypeList.find(el => el.val === item.fun)
                                                    let funName = '未知函数'
                                                    if (fun) {
                                                        funName = fun.label
                                                    }
                                                    return funName
                                                })()
                                            }
                                            {item.name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        } else {
                            return <Select placeholder="请选择字段名称" style={{ width: '180px' }} defaultValue={common.isEmpty(element.name) && common.isEmpty(element.tableAlias) ? undefined : `${this.getTableAliasLabel(element.tableAlias)}.${element.name}`} onChange={(value, option) => { this.tableDataChangeForOrder(i, 'name_code_dataType_len_type', option) }}>
                                {
                                    [...inFields, ...extendFields].map((item, i) =>
                                        <Select.Option value={i} key={i} name={item.name} code={item.code} selectCode={item.selectCode} dataType={item.dataType} len={item.len} from={item.from} tableAlias={item.tableAlias} item={item}>{this.getTableAliasLabel(item.tableAlias)}.{item.name}</Select.Option>
                                    )
                                }
                            </Select>
                        }
                    })(),
                code: element.code,
                dataType: this.getDataTypeLabel(element.dataType),
                len: element.len,
                from: element.from,
                order: <Select placeholder="请选择排序方式" style={{ width: '150px' }} defaultValue={common.isEmpty(element.order) ? undefined : element.order} onChange={(value) => { this.tableDataChangeForOrder(i, 'order', value) }}>
                    <Select.Option value='desc' >降序</Select.Option>
                    <Select.Option value='asc' >升序</Select.Option>
                </Select>,
                action: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subOneRowForOrder(uuid) }} /></a>
            })
        }

        return tempArray
    }
    tableDataChangeForOrder = (i, name, value) => {
        console.log(`${i} ${name} ${value}`);
        console.log(value)
        if (name === 'name_code_dataType_len_type') {
            this.outputInfo.data.orderFields[i].name = value.props.name;
            this.outputInfo.data.orderFields[i].code = value.props.code;
            this.outputInfo.data.orderFields[i].selectCode = value.props.selectCode;
            this.outputInfo.data.orderFields[i].dataType = value.props.dataType;
            this.outputInfo.data.orderFields[i].len = value.props.len;
            this.outputInfo.data.orderFields[i].tableAlias = value.props.tableAlias;
            this.outputInfo.data.orderFields[i].from = value.props.from;
            //清理挂载的VO
            this.outputInfo.data.orderFields[i].extendFieldVO = null;
            this.outputInfo.data.orderFields[i].groupFieldVO = null;
            this.outputInfo.data.orderFields[i].aggFieldVO = null;
            switch (value.props.tableAlias) {
                case 'L':
                    break;
                case 'R':
                    break;
                case 'E':
                    this.outputInfo.data.orderFields[i].extendFieldVO = value.props.item;
                    break;
                case 'G':
                    this.outputInfo.data.orderFields[i].groupFieldVO = value.props.item;
                    break;
                case 'A':
                    this.outputInfo.data.orderFields[i].aggFieldVO = value.props.item;
                    break;
                default:
                    break;
            }
        } else {
            this.outputInfo.data.orderFields[i][name] = value;
        }
        this.outputInfo.table.setDataSource(this.renderOrderTable(this.outputInfo.getData.orderFields))
    }
    addOneRowForOrder() {
        let tempArray = common.deepClone(this.outputInfo.getData.orderFields);
        tempArray.push({
            "code": "",
            "dataType": '',
            "defaultValue": "",
            "len": '',
            "name": "",
            "order": "",
            "from": "",
            "tableAlias": ""
        })
        this.outputInfo.updateData('orderFields', tempArray);
        this.outputInfo.table.setDataSource(this.renderOrderTable(this.outputInfo.getData.orderFields))
        console.log("this.outputInfo.table.getDataSource", this.outputInfo.table.getDataSource)

    }
    subOneRowForOrder(key) {
        let arrayIndex;
        for (let i = 0; i < this.outputInfo.table.getDataSource.length; i++) {
            const element = this.outputInfo.table.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
        }
        let data = this.outputInfo.getData.orderFields;
        data.splice(arrayIndex, 1);
        this.outputInfo.updateData('orderFields', data);
        this.outputInfo.table.setDataSource(this.renderOrderTable(this.outputInfo.getData.orderFields));
    }
    // 第五步（输出）信息的集合 end


    inputResponseData = [];

    //测试
    @computed get getCurrentStepIndex() { return toJS(this.currentStepIndex) }
    @action.bound setCurrentStepIndex(value) { this.currentStepIndex = value; }
    @computed get getE_and_d_Ready() { return toJS(this.e_and_d_Ready) }
    @action.bound setE_and_d_Ready(value) { this.e_and_d_Ready = value }
    @computed get getStoreBus() { return toJS(this.storeBus) }
    @action setStoreBus(value) { this.storeBus = value }
    @computed get getIsShowDrawerForTest() { return toJS(this.isShowDrawerForTest); }
    @action setIsShowDrawerForTest(value) { this.isShowDrawerForTest = value; }
    @computed get getInputDataSource() { return toJS(this.inputDataSource) }
    @action setInputDataSource(value) { this.inputDataSource = value }
    @computed get getInputValueList() { return toJS(this.inputValueList) }
    @action setInputValueList(value) { this.inputValueList = value }
    @computed get getOutputDataSource() { return toJS(this.outputDataSource) }
    @action setOutputDataSource(value) { this.outputDataSource = value }
    @computed get getIsCanTest() { return toJS(this.isCanTest) }
    @action setIsCanTest(value) { this.isCanTest = value }

    @computed get getId() { return toJS(this.id) }
    @action setId(value) { this.id = value }

    //sql预览
    @computed get getIsShowDrawerForSql() { return toJS(this.isShowDrawerForSql); }
    @action setIsShowDrawerForSql(value) { this.isShowDrawerForSql = value; }
    @computed get getSqlPreview() { return toJS(this.sqlPreview); }
    @action setSqlPreview(value) { this.sqlPreview = value; }

    @computed get getIsLoading() { return toJS(this.isLoading); }
    @action setIsLoading(value) { this.isLoading = value; }

    getSqlPreviewForAPI(id) {
        variableService.getRtqV2SqlPreview(id).then(this.getSqlPreviewCallback);
    }
    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
    }

    getTestInput(id) {
        common.loading.show();
        this.setInputValueList([]);
        commonService.getTestInput('rtqVarV2', id).then(this.getTestInputCallBack)
    }
    @action.bound getTestInputCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let tempArray = [];
        let tempArray2 = [];
        this.inputResponseData = res.data.result;
        for (let i = 0; i < res.data.result.length; i++) {
            const element = res.data.result[i];
            tempArray.push({
                key: i,
                name: element.name,
                code: element.code,
                // value: <Input placeholder="请输入值" onChange={(e) => this.inputValueChange(i, e.target.value)} />
                value: <FixedValue type="defaultValue" style={{ width: '200px' }} value={this.formatDateValueForFixedValue(this.getInputValueList[i], element.dataType)} dataType={element.dataType} changeData={(name, value) => this.inputValueChange(i, value, element.dataType)} index={i} />

            })
            tempArray2.push("");
        }
        this.setInputDataSource(tempArray);
        this.setInputValueList(tempArray2);
        this.setIsShowDrawerForTest(true);
        this.setOutputDataSource([]);
    }
    inputValueChange(index, value, dataType) {
        console.log(index, value, dataType)
        let inputValueList = this.getInputValueList;
        inputValueList[index] = value;
        this.setInputValueList(inputValueList);
        this.setIsCanTest(true);
        for (let i = 0; i < this.inputValueList.length; i++) {
            const element = this.inputValueList[i];
            if (common.isEmpty(element)) {
                this.setIsCanTest(false);
                // return;
            }
        }
        let tempArray = [];
        for (let i = 0; i < this.inputResponseData.length; i++) {
            const element = this.inputResponseData[i];
            tempArray.push({
                key: i,
                name: element.name,
                code: element.code,
                // value: <Input placeholder="请输入值" onChange={(e) => this.inputValueChange(i, e.target.value)} />
                value: <FixedValue type="defaultValue" style={{ width: '200px' }} value={this.formatDateValueForFixedValue(this.getInputValueList[i], element.dataType)} dataType={element.dataType} changeData={(name, value) => {
                    console.log("name, value", name, value)
                    this.inputValueChange(i, value, element.dataType)
                }} index={i} />

            })
        }
        this.setInputDataSource(tempArray);


    }
    formatDateValueForFixedValue(value, dataType) {
        if (!common.isEmpty(value)) {
            if (dataType == 93) {
                value = value.split(' 00:00:00')[0];
            }
            return value
        } else {
            return value
        }

    }
    getTestOutputForApi() {
        let params = {
            rtqVarId: this.getId,
            inspectCodeMap: {}
        }
        for (let i = 0; i < this.getInputDataSource.length; i++) {
            const element = this.getInputDataSource[i];
            params.inspectCodeMap[element.code] = this.getInputValueList[i];
        }
        common.loading.show();
        commonService.getTestOutput(params).then(this.getTestOutputForApiCallBack);
    }
    @action.bound getTestOutputForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;

        res.data.result.forEach(element => {
            element.key = element.id;
        })
        this.setOutputDataSource(res.data.result);

    }

    allVersionForApi(id) {
        variableService.rtqV2AllVersion(id).then(this.allVersionForApiCallBack);
    }
    @action.bound allVersionForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [
        ];
        res.data.result.forEach(element => {
            element.type = 2;
            tempArray.push(element)
            if (element.id === this.getId) {
                this.version.setValue(element.version);
            }
        })
        this.version.setList(tempArray);
    }

    getRtqInfo_2_0_forApi(id, isResource) {
        console.log(id, isResource);
        this.setIsLoading(true);
        id = id || '';
        let getDataById = isResource ? strategyService.getResourceDetail : variableService.getRtqInfo_2_0;
        getDataById(id).then(res => this.getRtqInfo_2_0_forApiCallBack(res, isResource)).catch(() => this.setIsLoading(false))
    }

    getRtqByTemplateId(id, isResource) {
        console.log("进入模板", id, isResource);
        this.setIsLoading(true);
        commonService.getTemplateDetails(id).then(res => this.getRtqInfo_2_0_forApiCallBack2(res, isResource)).catch(() => this.setIsLoading(false))
    }

    @action.bound getRtqInfo_2_0_forApiCallBack2(res, isResource) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        if (res.data.result) {
            if (!res.data.result.hasOwnProperty('name')) {
                res.data.result.name = '';
            }
            if (!res.data.result.hasOwnProperty('code')) {
                res.data.result.code = '';
            }
            console.log('res.data.result', res.data.result)
            if (!this.baseInfo.getData.hasOwnProperty('rtqVarConfigVO')) {
                this.baseInfo.setData(res.data.result);
            }
            sessionStorage.tempEventSourceId = res.data.result.eventSourceId;
            sessionStorage.tempDimensionId = res.data.result.dimensionId;
        }
        if (isResource) {
            console.log('查看资源', res.data.result);
            this.baseInfo.updateData('rtqVarType', res.data.result.rtqVarType);
            this.getRtqConfig_2_0_forApi(res.data.result.rtqVarConfigVO.rtqVarId);
        }
        //todo
    }

    @action.bound getRtqInfo_2_0_forApiCallBack(res, isResource) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        if (res.data.result.eventSourceList && res.data.result.eventSourceList instanceof Array) this.helper.updateData('eventSourceList', res.data.result.eventSourceList);
        if (res.data.result.rtqVarTypeList && res.data.result.rtqVarTypeList instanceof Array) this.helper.updateData('rtqVarTypeList', res.data.result.rtqVarTypeList)
        if (res.data.result.categoryList && res.data.result.categoryList instanceof Array) this.helper.updateData('categoryList', res.data.result.categoryList)
        if (res.data.result.dataTypeList && res.data.result.dataTypeList instanceof Array) this.helper.updateData('dataTypeList', res.data.result.dataTypeList.filter((element) => element.val !== 16))
        if (res.data.result.rtqVar) {
            if (!this.baseInfo.getData.hasOwnProperty('rtqVarConfigVO')) {
                this.baseInfo.setData(res.data.result.rtqVar);
            }
            sessionStorage.tempEventSourceId = res.data.result.rtqVar.eventSourceId;
            sessionStorage.tempDimensionId = res.data.result.rtqVar.dimensionId;
        }
        if (isResource) {
            console.log('查看资源', res.data.result);
            this.baseInfo.updateData('rtqVarType', res.data.result.rtqVarType);
            this.getRtqConfig_2_0_forApi(res.data.result.rtqVarConfigVO.rtqVarId);
        }

    }

    getRtqConfig_2_0_forApi(rtqVarId) {
        this.setIsLoading(true);
        variableService.getRtqConfig_2_0(rtqVarId).then(this.getRtqConfig_2_0_forApiCallBack).catch(() => this.setIsLoading(false))
    }
    @action.bound getRtqConfig_2_0_forApiCallBack(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        this.init();
        if (res.data.result.joinTypeList && res.data.result.joinTypeList instanceof Array) this.helper.updateData('joinTypeList', res.data.result.joinTypeList);
        if (res.data.result.rtqExtendTypeList && res.data.result.rtqExtendTypeList instanceof Array) this.helper.updateData('rtqExtendTypeList', res.data.result.rtqExtendTypeList);
        if (res.data.result.functionTypeList && res.data.result.functionTypeList instanceof Array) this.helper.updateData('functionTypeList', res.data.result.functionTypeList)
        if (res.data.result.linkFieldList && res.data.result.linkFieldList instanceof Array) this.helper.updateData('linkFieldList', res.data.result.linkFieldList)
        if (res.data.result.functionComputeTypeList && res.data.result.functionComputeTypeList instanceof Array) {
            this.helper.updateData('functionComputeTypeList', res.data.result.functionComputeTypeList);
            sessionStorage.functionComputeTypeList = JSON.stringify(res.data.result.functionComputeTypeList)
        }
        if (res.data.result.tableList && res.data.result.tableList instanceof Array) {
            res.data.result.tableList.forEach(element => {
                if (!element.columnList) element.columnList = [];
            })
            this.helper.updateData('tableList', res.data.result.tableList);
        }
        if (res.data.result.rtqVarV2VO) {
            let rtqVarV2VO = res.data.result.rtqVarV2VO
            this.baseInfo.setData(rtqVarV2VO);
            console.log("this.baseInfo.getData", this.baseInfo.getData)
            if (!rtqVarV2VO.rtqVarConfigVO) return
            let rtqVarConfigVO = rtqVarV2VO.rtqVarConfigVO;
            console.log("rtqVarConfigVO", rtqVarConfigVO)
            if (rtqVarConfigVO.hasOwnProperty('isMulti')
                && rtqVarConfigVO.hasOwnProperty('inFields')
                && rtqVarConfigVO.hasOwnProperty('leftTable')
                && rtqVarConfigVO.hasOwnProperty('rightTable')
                // && rtqVarConfigVO.hasOwnProperty('joinType')
                // && rtqVarConfigVO.hasOwnProperty('onConditionVO')
            ) {
                let inputInfo = {
                    isMulti: rtqVarConfigVO.isMulti,
                    inFields: rtqVarConfigVO.inFields,
                    leftTable: rtqVarConfigVO.leftTable,
                    rightTable: rtqVarConfigVO.rightTable,
                    joinType: rtqVarConfigVO.joinType ? rtqVarConfigVO.joinType : '',
                    onConditionVO: rtqVarConfigVO.onConditionVO ? rtqVarConfigVO.onConditionVO : conditionVODemo
                }
                this.inputInfo.setData(inputInfo);
                this.onConditionVO = inputInfo.onConditionVO;
                console.log("this.inputInfo.getData.onConditionVO", this.inputInfo.getData.onConditionVO)
            } else {
                this.onConditionVO = conditionVODemo;
            }

            if (rtqVarConfigVO.hasOwnProperty('extendFields')
            ) {
                let extInfo = {
                    extendFields: rtqVarConfigVO.extendFields
                }
                this.extInfo.setData(extInfo);
            }

            if (rtqVarConfigVO.hasOwnProperty('whereConditionVO')
            ) {
                let filterInfo = {
                    whereConditionVO: rtqVarConfigVO.whereConditionVO
                }
                this.filterInfo.setData(filterInfo);
            }

            if (rtqVarConfigVO.hasOwnProperty('aggFields') || rtqVarConfigVO.hasOwnProperty('groupFields')) {
                let juheInfo = {
                    aggFields: rtqVarConfigVO.aggFields,
                    groupFields: rtqVarConfigVO.groupFields,
                    havingConditionVO: rtqVarConfigVO.havingConditionVO ? rtqVarConfigVO.havingConditionVO : null
                }
                if (juheInfo.havingConditionVO && publicUtils.verifyConditionTree(juheInfo.havingConditionVO)) {
                    this.juheInfo.set_verifyConditionVO(true);
                } else {
                    this.juheInfo.set_verifyConditionVO(false);
                }
                this.juheInfo.setData(juheInfo);
                this.havingConditionVO = juheInfo.havingConditionVO;


            } else {
                this.juheInfo.set_verifyConditionVO(false);
                this.havingConditionVO = null;
            }

            let origin = { aggFields: [], groupFields: [] }
            if (!common.isEmpty(rtqVarConfigVO.aggFields)) origin.aggFields = rtqVarConfigVO.aggFields
            if (!common.isEmpty(rtqVarConfigVO.groupFields)) origin.groupFields = rtqVarConfigVO.groupFields
            this.juheInfo.set_origin(origin);

            if (rtqVarConfigVO.hasOwnProperty('outFields')) {
                let outputInfo = {
                    outFields: rtqVarConfigVO.outFields,
                    orderFields: rtqVarConfigVO.orderFields ? rtqVarConfigVO.orderFields : []
                }
                this.outputInfo.setData(outputInfo);
                if (common.isEmpty(rtqVarConfigVO.orderFields)) {
                    this.outputInfo.set_isOrder(false);
                } else {
                    this.outputInfo.set_isOrder(true);
                }
            }

            // 前端辅助数据设置
            // 第一步
            if (rtqVarConfigVO.hasOwnProperty('isMulti') && rtqVarConfigVO.isMulti) {//多表
                this.inputInfo.setRadioFortable('0');
                res.data.result.tableList.forEach(element => {
                    if (element.id === rtqVarConfigVO.leftTable.id) {
                        let columns = common.deepClone(element.columnList);
                        let l_selectKey = [];
                        columns.forEach((element2, i) => {
                            element2.key = i;
                            element2.code = `L_${element2.code}`;
                            rtqVarConfigVO.inFields.forEach(element3 => {
                                if (element3.tableAlias === 'L' && element2.code === element3.code) {
                                    l_selectKey.push(i)
                                }
                            })
                        })
                        console.log("columns columns", columns)
                        this.inputInfo.table.setDataSource(columns);
                        this.inputInfo.table.l_selectKey = l_selectKey;
                    }
                    if (element.id === rtqVarConfigVO.rightTable.id) {
                        let columns = common.deepClone(element.columnList);
                        let r_selectKey = [];
                        columns.forEach((element2, i) => {
                            element2.key = i;
                            element2.code = `R_${element2.code}`;
                            rtqVarConfigVO.inFields.forEach(element3 => {
                                if (element3.tableAlias === 'R' && element2.code === element3.code) {
                                    r_selectKey.push(i)
                                }
                            })
                        })
                        this.inputInfo.table.r_selectKey = r_selectKey;
                    }
                })
            } else {//单表
                if (rtqVarConfigVO.leftTable) {
                    res.data.result.tableList.forEach(element => {
                        if (element.id === rtqVarConfigVO.leftTable.id) {
                            let columns = common.deepClone(element.columnList);
                            let l_selectKey = [];
                            columns.forEach((element2, i) => {
                                element2.key = i;
                                element2.code = `L_${element2.code}`;
                                rtqVarConfigVO.inFields.forEach(element3 => {
                                    if (element3.tableAlias === 'L' && element2.code === element3.code) {
                                        l_selectKey.push(i)
                                    }
                                })
                            })
                            this.inputInfo.table.setDataSource(columns);
                            this.inputInfo.table.l_selectKey = l_selectKey;
                        }
                    })
                }
            }

        }
        this.isLoaded = true
    }

    saveRtq_config_2_0_forApi(params, step) {
        common.loading.show();
        variableService.saveRtq_config_2_0(params, step).then(res => this.saveRtq_config_2_0_forApiCallBack(res, step)).catch(() => {
            common.loading.hide();
        })
    }
    @action.bound saveRtq_config_2_0_forApiCallBack(res, step) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.init();
        if (step === 5) {
            message.success("保存成功");
            this.setCurrentStepIndex(0);
        } else {
            step++;
            this.setCurrentStepIndex(step)
        }
        console.log(`保存成功`);
    }

    saveRtq_config_2_0_newVersion_forApi(params, step) {
        common.loading.show();
        variableService.saveRtq_config_2_0_newVersion(params, step).then(res => this.saveRtq_config_2_0_newVersion_forApiCallBack(res)).catch(() => {
            common.loading.hide();
        })
    }
    @action.bound saveRtq_config_2_0_newVersion_forApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
    }



    packConfig() {
        console.log("common.deepClone(this.baseInfo.getData)", common.deepClone(this.baseInfo.getData))
        try {
            this.packInFields();
            let baseInfo = common.deepClone(this.baseInfo.getData);
            let inputInfo = this.inputInfo.getData;

            console.log("inputInfo", inputInfo)
            for (const key in inputInfo) {
                if (inputInfo.hasOwnProperty(key)) {
                    const element = inputInfo[key];
                    baseInfo.rtqVarConfigVO[key] = element;
                }
            }
            const onConditionVOId = baseInfo.rtqVarConfigVO.onConditionVO.id
            baseInfo.rtqVarConfigVO.onConditionVO = this.onConditionVO ? this.onConditionVO : conditionVODemo;
            if (onConditionVOId) baseInfo.rtqVarConfigVO.onConditionVO.id = onConditionVOId;
            if (!publicUtils.verifyConditionTree(baseInfo.rtqVarConfigVO.onConditionVO, false)) {
                baseInfo.rtqVarConfigVO.onConditionVO = conditionVODemo;
            }

            let extInfo = this.extInfo.getData;
            for (const key in extInfo) {
                if (extInfo.hasOwnProperty(key)) {
                    const element = extInfo[key];
                    baseInfo.rtqVarConfigVO[key] = element;
                }
            }

            let filterInfo = this.filterInfo.getData;
            for (const key in filterInfo) {
                if (filterInfo.hasOwnProperty(key)) {
                    const element = filterInfo[key];
                    baseInfo.rtqVarConfigVO[key] = element;
                }
            }
            console.log("baseInfo.rtqVarConfigVO.whereConditionVO", baseInfo.rtqVarConfigVO.whereConditionVO)
            if (!publicUtils.verifyConditionTree(baseInfo.rtqVarConfigVO.whereConditionVO, false)) {
                baseInfo.rtqVarConfigVO.whereConditionVO = conditionVODemo;
                console.log("baseInfo.rtqVarConfigVO.whereConditionVO2", baseInfo.rtqVarConfigVO.whereConditionVO)
            }

            let juheInfo = this.juheInfo.getData;
            for (const key in juheInfo) {
                if (juheInfo.hasOwnProperty(key)) {
                    const element = juheInfo[key];
                    baseInfo.rtqVarConfigVO[key] = element;
                }
            }
            baseInfo.rtqVarConfigVO.havingConditionVO = this.havingConditionVO;
            if (baseInfo.rtqVarConfigVO.havingConditionVO) {
                if (!publicUtils.verifyConditionTree(baseInfo.rtqVarConfigVO.havingConditionVO, false)) {
                    baseInfo.rtqVarConfigVO.havingConditionVO = null;
                }
            }

            let outputInfo = this.outputInfo.getData;
            for (const key in outputInfo) {
                if (outputInfo.hasOwnProperty(key)) {
                    const element = outputInfo[key];
                    baseInfo.rtqVarConfigVO[key] = element;
                }
            }
            // this.saveRtq_config_2_0_forApi(baseInfo, step);
            console.log("packData baseInfo", baseInfo)
            return baseInfo
        } catch (error) {
            window.throwError(error);
        }

    }

    init() {
        this.baseInfo.set_modify(false);
        this.inputInfo.set_modify(false);
        this.extInfo.set_modify(false);
        this.filterInfo.set_modify(false);
        this.juheInfo.set_modify(false);
        this.outputInfo.set_modify(false);
    }

    reset() {
        this.setCurrentStepIndex(0);
        this.baseInfo.data = {
            "category": '',
            "categoryName": "",
            "code": "",
            "dataType": '',
            "dataTypeName": "",
            "defaultValue": "",
            "description": "",
            "dimensionId": "",
            "dimensionName": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "name": "",
            "script": "",
            "type": '',
            "typeName": "",
            "rtqVarType": ''
        }

        this.inputInfo.data = {
            isMulti: 0,
            inFields: [
            ],
            leftTable: {//单表也是放在leftTable
                code: '',
                id: '',
                name: '',
                type: 0,//类型，1表2集合
            },
            rightTable: {
                code: '',
                id: '',
                name: '',
                type: 0,//类型，1表2集合
            },
            joinType: '',
            onConditionVO: conditionVODemo
        }
        this.inputInfo.radioFortable = '0';
        this.inputInfo.tableFields = [];
        this.inputInfo.LTableFields = [];
        this.inputInfo.RTableFields = [];
        this.inputInfo.table.dataSource = [];
        this.inputInfo.table.selectKey = [];
        this.inputInfo.table.l_selectKey = [];
        this.inputInfo.table.r_selectKey = [];

        this.extInfo.data = { extendFields: [] }
        this.extInfo.editIndex = null
        this.extInfo.table.dataSource = [];

        this.filterInfo.data = { whereConditionVO: conditionVODemo }

        this.juheInfo.data = {
            aggFields: [],
            groupFields: [],
            havingConditionVO: conditionVODemo,
        }
        this.juheInfo.verifyConditionVO = false;
        this.juheInfo.table.fenzu_dataSource = [];
        this.juheInfo.table.juhe_dataSource = [];

        this.outputInfo.data = {
            outFields: [],
            orderFields: []
        }
        this.outputInfo.isOrder = false;
        this.extInfo.table.dataSource = [];
        this.isLoaded = false;
    }

    verifyBaseInfo() {
        let data = this.baseInfo.getData;
        if (common.isEmpty(data.name)) {
            message.warning("名称不能为空");
            return false
        }
        if (!common.testString(data.name)) {
            message.warning("名称只能输入英文，数字，下划线");
            return false
        }
        if (common.isEmpty(data.code)) {
            message.warning("标识不能为空");
            return false
        }
        if (!common.testCode(data.code)) {
            message.warning("标识只能输入由英文字母开头，且由英文和数字下划线组成");
            return false
        }
        if (common.isEmpty(data.eventSourceId)) {
            message.warning("事件源不能为空");
            return false
        }
        if (common.isEmpty(data.dimensionId)) {
            message.warning("维度不能为空");
            return false
        }
        if (data.rtqVarType !== 'RTQQUERY') {
            if (common.isEmpty(data.dataType)) {
                message.warning("数据类型不能为空");
                return false
            }
            if (common.isEmpty(data.defaultValue)) {
                message.warning("默认值不能为空");
                return false
            }
        }
        if (common.isEmpty(data.category)) {
            message.warning("类别不能为空");
            return false
        }
        if (data.rtqVarType === 'SCRIPTVAR') {
            if (common.isEmpty(data.script)) {
                message.warning("SQL不能为空");
                return false
            }
        }
        return true
    }

    verifyInFields() {
        let inFields = [];
        if (this.inputInfo.getData.isMulti) {
            if (!common.isEmpty(this.inputInfo.table.get_l_selectKey)) {//左表
                this.helper.getData.tableList.forEach(table => {
                    if (table.id === this.inputInfo.getData.leftTable.id) {
                        this.inputInfo.table.get_l_selectKey.forEach((index) => {
                            inFields.push({
                                "code": table.columnList[index].code,
                                "dataType": table.columnList[index].dataType,
                                "defaultValue": table.columnList[index].defaultValue,
                                "len": table.columnList[index].len,
                                "name": table.columnList[index].name,
                                "tableAlias": 'L'
                            })
                        })
                    }
                })
            }
            if (!common.isEmpty(this.inputInfo.table.get_r_selectKey)) {//右表
                this.helper.getData.tableList.forEach(table => {
                    if (table.id === this.inputInfo.getData.rightTable.id) {
                        this.inputInfo.table.get_r_selectKey.forEach((index) => {
                            inFields.push({
                                "code": table.columnList[index].code,
                                "dataType": table.columnList[index].dataType,
                                "defaultValue": table.columnList[index].defaultValue,
                                "len": table.columnList[index].len,
                                "name": table.columnList[index].name,
                                "tableAlias": 'R'
                            })
                        })
                    }
                })
            }
        } else {
            if (!common.isEmpty(this.inputInfo.table.get_l_selectKey)) {//左表
                this.helper.getData.tableList.forEach(table => {
                    if (table.id === this.inputInfo.getData.leftTable.id) {
                        this.inputInfo.table.get_l_selectKey.forEach((index) => {
                            inFields.push({
                                "code": table.columnList[index].code,
                                "dataType": table.columnList[index].dataType,
                                "defaultValue": table.columnList[index].defaultValue,
                                "len": table.columnList[index].len,
                                "name": table.columnList[index].name,
                                "tableAlias": 'L'
                            })
                        })
                    }
                })
            }
        }

        if (this.inputInfo.getData.isMulti) {
            let haveLeftFields = false;
            let haveRightFields = false;
            inFields.forEach(element => {
                if (element.tableAlias === 'L') haveLeftFields = true
                if (element.tableAlias === 'R') haveRightFields = true
            })
            if (common.isEmpty(this.inputInfo.getData.leftTable.code)) {
                message.warning("请选择左表");
                return false
            }
            if (!haveLeftFields) {
                message.warning("请选择左表字段");
                return false
            }
            if (common.isEmpty(this.inputInfo.getData.rightTable.code)) {
                message.warning("请选择右表");
                return false
            }
            if (!haveRightFields) {
                message.warning("请选择右表字段");
                return false
            }
        } else {
            if (common.isEmpty(this.inputInfo.getData.leftTable.code)) {
                message.warning("请选择表");
                return false
            }
            if (common.isEmpty(inFields)) {
                message.warning("请选择字段");
                return false
            }
        }
        return true
    }

    verifyInputInfo() {
        if (!this.verifyInFields()) return false
        let data = this.inputInfo.getData;
        if (data.isMulti) {
            if (common.isEmpty(data.joinType)) {
                message.warning("请选择多表连接方式");
                return false
            }
            if (data.joinType !== 7 && data.joinType !== 5 && data.joinType !== 6) {//不等于差集，交集，并集
                if (!publicUtils.verifyConditionTree(this.onConditionVO, true)) return false
            }
        }
        return true
    }

    verifyExtInfo() {
        let data = this.extInfo.getData;

        let extFieldsNameList = []

        for (let i = 0; i < data.extendFields.length; i++) {
            let element = data.extendFields[i];
            if (common.isEmpty(element.name)) {
                message.warning("名字不能为空");
                return false
            }
            if (element.name.length > 30) {
                message.warning("名字长度不能大于30个字符");
                return false
            }
            if (!common.testString(element.name)) {
                message.warning("名字只能输入中英文数字和下划线");
                return false
            }
            if (common.isEmpty(element.dataType)) {
                message.warning("数据类型不能为空");
                return false
            }
            if (common.isEmpty(element.extendType)) {
                message.warning("请选择衍生方式");
                return false
            }
            if (element.dataType === 12) {
                if (!common.isEmpty(element.defaultValue)) {
                    if (element.defaultValue.length > 30) {
                        message.warning("为空时取值 长度不能大于30个字符");
                        return false
                    }
                }
            } else {
                if (common.isEmpty(element.defaultValue)) {
                    message.warning("默认值不能为空");
                    return false
                }

            }

            if (!this.verifyExtConfig(element.extendType, element)) return false

            // 去重
            if (extFieldsNameList.includes(element.name)) {
                message.warning("字段名称不能重复");
                return false
            } else {
                extFieldsNameList.push(element.name)
            }
        }
        return true
    }

    verifyFilterInfo() {
        let has_dimensionCode = false;
        this.helper.getData.tableList.forEach(element => {
            if (element.id === this.inputInfo.getData.leftTable.id && !common.isEmpty(element.dimensionCode)) has_dimensionCode = true
            if (element.id === this.inputInfo.getData.rightTable.id && !common.isEmpty(element.dimensionCode)) has_dimensionCode = true
        })
        if (has_dimensionCode) {
            let data = this.filterInfo.getData;
            if (publicUtils.verifyConditionTree(data.whereConditionVO, true)) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }

    verifyJuheInfo() {
        let data = this.juheInfo.getData;
        // 分组 
        let groupFieldsCodeList = []
        for (let i = 0; i < data.groupFields.length; i++) {
            const element = data.groupFields[i];
            if (common.isEmpty(element.name)) {
                message.warning("分组字段名称不能为空");
                return false
            }
            if (common.isEmpty(element.code)) {
                message.warning("分组字段标识不能为空");
                return false
            }
            if (common.isEmpty(element.dataType)) {
                message.warning("分组字段数据类型不能为空");
                return false
            }
            // if (common.isEmpty(element.len)) {
            //     message.warning("分组字段长度不能为空");
            //     return false
            // }
            // 去重
            if (groupFieldsCodeList.includes(element.code)) {
                message.warning("分组字段不能重复");
                return false
            } else {
                groupFieldsCodeList.push(element.code)
            }
        }


        let aggFields_code_and_Fun_obj = {}
        for (let i = 0; i < data.aggFields.length; i++) {
            const element = data.aggFields[i];
            if (common.isEmpty(element.name)) {
                message.warning("聚合字段名称不能为空");
                return false
            }
            if (!common.testString(element.name)) {
                message.warning("聚合字段名称只能输入中英文数字和下划线");
                return false
            }
            if (common.isEmpty(element.tableAlias)) {
                message.warning("聚合字段别名不能为空");
                return false
            }
            if (common.isEmpty(element.dataType)) {
                message.warning("聚合字段数据类型不能为空");
                return false
            }
            if (common.isEmpty(element.len)) {
                message.warning("聚合字段长度不能为空");
                return false
            }
            if (common.isEmpty(element.fun)) {
                message.warning("聚合字段统计方式不能为空");
                return false
            }
            // 去重
            // if (aggFieldsNameList.includes(element.name)) {
            //     message.warning("分组字段别名不能重复");
            //     return
            // } else {
            //     aggFieldsNameList.push(element.name)
            // }
            let code = element.code.substr(0, element.code.length - 5);
            console.log("code", code)
            if (aggFields_code_and_Fun_obj.hasOwnProperty(code)) {
                if (element.fun === aggFields_code_and_Fun_obj[code]) {
                    message.warning("同个聚合字段的统计方式不能重复");
                    return false
                }
            } else {
                aggFields_code_and_Fun_obj[code] = element.fun
            }
        }
        if (this.havingConditionVO) {
            if (!publicUtils.verifyConditionTree(this.havingConditionVO, true)) return false
        }
        return true
    }

    verifyOutputInfo() {
        let data = this.outputInfo.getData;
        if (common.isEmpty(data.outFields)) {
            message.warning("请选择输出字段");
            return false
        }
        if (this.baseInfo.getData.rtqVarType === 'RTQVAR') {//实时变量
            if (data.outFields.length > 1) {
                message.warning("实时变量类型的输出字段只能选择一个");
                return false
            }
        } else {//实时集合

        }

        if (this.outputInfo.get_isOrder) {
            for (let i = 0; i < this.outputInfo.getData.orderFields.length; i++) {
                const element = this.outputInfo.getData.orderFields[i];
                if (common.isEmpty(element.name)) {
                    message.warning("请选择排序字段");
                    return false
                }
                if (common.isEmpty(element.order)) {
                    message.warning("请选择排序方式");
                    return false
                }
            }
        }

        return true
    }

    getExtendFieldsDataForApi() {
        common.loading.show();
        commonService.getConditionData(this.baseInfo.getData.dimensionId, this.baseInfo.getData.eventSourceId, 1, (() => {
            let fieldList = [];
            this.inputInfo.getData.inFields.forEach(element => {
                fieldList.push({
                    "code": element.selectCode,
                    "defaultValue": element.defaultValue,
                    "id": "",
                    "name": element.name,
                    "type": element.dataType,
                    "tableAlias": element.tableAlias
                })
            })
            //暂时去除衍生字段
            // this.extInfo.getData.extendFields.forEach(element => {
            //     fieldList.push({
            //         "code": element.code,
            //         "defaultValue": element.defaultValue,
            //         "id": "",
            //         "name": element.name,
            //         "type": element.dataType,
            //         "tableAlias": 'E'
            //     })
            // })
            return fieldList
        })()).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            let VAR_SELECTION_ALL = [],//字符串
                VAR_SELECTION_DECIMAL = [],//单双精度
                VAR_SELECTION_INTEGER = [],//整型，长整型
                VAR_SELECTION_NUMBER = [],//浮点型
                VAR_SELECTION_TIMESTAMP = [],//时间类型
                VAR_SELECTION_VARCHAR = []//变量

            if (res.data.result.VAR_SELECTION_ALL) VAR_SELECTION_ALL = this.fixVarSeletion(res.data.result.VAR_SELECTION_ALL);
            if (res.data.result.VAR_SELECTION_DECIMAL) VAR_SELECTION_DECIMAL = this.fixVarSeletion(res.data.result.VAR_SELECTION_DECIMAL);
            if (res.data.result.VAR_SELECTION_INTEGER) VAR_SELECTION_INTEGER = this.fixVarSeletion(res.data.result.VAR_SELECTION_INTEGER);
            if (res.data.result.VAR_SELECTION_NUMBER) VAR_SELECTION_NUMBER = this.fixVarSeletion(res.data.result.VAR_SELECTION_NUMBER);
            if (res.data.result.VAR_SELECTION_TIMESTAMP) VAR_SELECTION_TIMESTAMP = this.fixVarSeletion(res.data.result.VAR_SELECTION_TIMESTAMP);
            if (res.data.result.VAR_SELECTION_VARCHAR) VAR_SELECTION_VARCHAR = this.fixVarSeletion(res.data.result.VAR_SELECTION_VARCHAR);

            this.helper.updateData('VAR_SELECTION_ALL', VAR_SELECTION_ALL);
            this.helper.updateData('VAR_SELECTION_DECIMAL', VAR_SELECTION_DECIMAL);
            this.helper.updateData('VAR_SELECTION_INTEGER', VAR_SELECTION_INTEGER);
            this.helper.updateData('VAR_SELECTION_NUMBER', VAR_SELECTION_NUMBER);
            this.helper.updateData('VAR_SELECTION_TIMESTAMP', VAR_SELECTION_TIMESTAMP);
            this.helper.updateData('VAR_SELECTION_VARCHAR', VAR_SELECTION_VARCHAR);
        }).catch(() => { common.loading.hide(); })
    }

    fixVarSeletion(data) {
        data.forEach(element => {
            element.value = element.type;
            element.list.forEach(element2 => {
                element2.value = element2.code;
                if (element.type === 0) {//数据库字段
                    element2.value = `${element2.tableAlias}_${element2.code}`;
                    element2.code = `${element2.tableAlias}_${element2.code}`;
                    element2.name = `${(() => {
                        switch (element2.tableAlias) {
                            case 'L':
                                return '左表'
                            case 'R':
                                return '右表'
                            case 'E':
                                return '衍生'
                            case 'G':
                                return '分组'
                            case 'A':
                                return '聚合'
                            default:
                                break;
                        }
                    })()}.${element2.name}`;
                }
            })
        })
        return data
    }
    /**
     *
     *扫描字段是否被引用
     * @param {*} field {code:'', name: ''}
     * @param {*} step 步骤
     * @param {*} bridge_var 中间变量
     * @returns
     * @memberof store
     */
    scanning(field, step, bridge_var) {
        let rtqVarConfigVO = common.deepClone(this.packConfig()).rtqVarConfigVO;
        if (bridge_var) rtqVarConfigVO.bridge_var = bridge_var
        console.log('scanning field=', field);
        console.log('scanning rtqVarConfigVO=', rtqVarConfigVO);
        console.log('scanning JSON.stringify(rtqVarConfigVO)=', JSON.stringify(rtqVarConfigVO));

        switch (step) {
            case 1:
                delete rtqVarConfigVO.inFields
                break;
            case 2:
                delete rtqVarConfigVO.extendFields
                break;
            case 3:
                // delete rtqVarConfigVO.whereConditionVO
                break;
            case 4:
                delete rtqVarConfigVO.groupFields
                delete rtqVarConfigVO.aggFields
                break;
            default:
                break;
        }

        if (JSON.stringify(rtqVarConfigVO).indexOf(field.code) !== -1) {
            message.warning(`${field.name}该字段已被其他步骤引用，请先取消引用`);
            return false
        } else {
            return true
        }
    }

    getDataTypeLabel(val) {
        for (let index = 0; index < this.helper.getData.dataTypeList.length; index++) {
            const element = this.helper.getData.dataTypeList[index];
            if (element.val === val) {
                return element.label
            }
        }
    }

    getTableAliasLabel(tableAlias) {
        let resultLabel = '';
        switch (tableAlias) {
            case 'L':
                resultLabel = '左表'
                break;
            case 'R':
                resultLabel = '右表'
                break;
            case 'E':
                resultLabel = '衍生'
                break;
            case 'G':
                resultLabel = '分组'
                break;
            case 'A':
                resultLabel = '聚合'
                break;
            default:
                break;
        }
        return resultLabel
    }
}
export default new store

const conditionVODemo = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "varCategoryType": 1,
            "varTableAlias": "",
            "varType": '',
            "varDataType": "",
            "varCode": "",
            "varName": "",
            "varDefaultValue": "",
            "varValue": "",
            "varParas": [
                // {
                //   "code": "string",
                //   "dataType": "string",
                //   "descript": "string",
                //   "formType": 0,
                //   "isDynamic": true,
                //   "name": "string",
                //   "value": {},
                //   "varType": 0
                // }
            ],

            "optType": '',

            "valueCategoryType": 0,//固定值
            "valueTableAlias": "",
            "valueType": '',
            "valueDataType": "",
            "valueCode": "",
            "valueName": "",
            "valueDefaultValue": "",
            "value": "",
            "valueParas": [
                // {
                //   "code": "string",
                //   "dataType": "string",
                //   "descript": "string",
                //   "formType": 0,
                //   "isDynamic": true,
                //   "name": "string",
                //   "value": {},
                //   "varType": 0
                // }
            ],
        },
        "nodeType": 1
    }
    ]
}
const fieldColumns = [
    {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '标识',
        dataIndex: 'selectCode',
        key: 'selectCode',
    },
    {
        title: '类型',
        dataIndex: 'dataType',
        key: 'dataType',
    },
    {
        title: '长度',
        dataIndex: 'len',
        key: 'len',
    },
    // {
    //     title: '精度',
    //     dataIndex: 'precision',
    //     key: 'precision',
    // }
]
const extColumns = [
    {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
    },
    // {
    //     title: '标识',
    //     dataIndex: 'code',
    //     key: 'code',
    // },
    {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
    },
    {
        title: '衍生方式',
        dataIndex: 'extendType',
        key: 'extendType',
    },
    {
        title: '为空时取值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: '100px',
        fixed: 'right',
        key: 'action',
    }
]
const juheColumns = [
    {
        title: '统计字段名',
        dataIndex: 'field',
        key: 'field',
    },
    {
        title: '统计方式',
        dataIndex: 'fun',
        key: 'fun',
    },
    {
        title: '输出字段名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '输出字段类型',
        dataIndex: 'dataType',
        key: 'dataType',
    },
    {
        title: '输出长度',
        dataIndex: 'len',
        key: 'len',
    },
    {
        title: '',
        dataIndex: 'action',
        width: '50px',
        fixed: 'right',
        key: 'action',
    }
]
const fenzuColumns = [
    {
        title: '字段名称',
        dataIndex: 'name',
        width: '300px',
        key: 'name',
    },
    {
        title: '标识',
        dataIndex: 'selectCode',
        key: 'selectCode',
    },
    {
        title: '类型',
        dataIndex: 'dataType',
        key: 'dataType',
    },
    {
        title: '长度',
        dataIndex: 'len',
        key: 'len',
    },
    {
        title: '',
        dataIndex: 'action',
        width: '50px',
        fixed: 'right',
        key: 'action',
    }
]
const orderColumns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '50px'
    },
    {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
        width: '200px'
    },
    {
        title: '标识',
        dataIndex: 'code',
        key: 'code',
        width: '100px'
    },
    {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        width: '100px'
    },
    {
        title: '长度',
        dataIndex: 'len',
        key: 'len',
        width: '80px'
    },
    {
        title: '类型',
        dataIndex: 'from',
        key: 'from',
        width: '100px'
    },
    {
        title: '排序方式',
        dataIndex: 'order',
        key: 'order',
        width: '150px'
    },
    {
        title: '',
        dataIndex: 'action',
        width: '50px',
        fixed: 'right',
        key: 'action',
    }
]

const computeExpressionVODemo = {
    "key": "0",
    "computeOperator": "PLUS",
    "computeVarVO": {
        "categoryType": 1,//0固定值，1变量
        "code": "",
        "tableAlias": "",
        "type": 0,
        "value": "",
        "name": "",
        "dataType": ""
    },
    "fieldList": [{
        "key": "0-0",
        "computeOperator": "PLUS",
        "computeVarVO": {
            "categoryType": 1,//0固定值，1变量
            "code": "",
            "tableAlias": "",
            "type": 0,
            "value": "",
            "name": "",
            "dataType": ""
        },
        "fieldList": [],
        "type": 1 //类型，1是计算变量， 2是计算表达式（或有括号）
    }],
    "type": 2 //类型，1是计算变量， 2是计算表达式（或有括号）
}


