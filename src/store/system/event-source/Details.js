/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:03:02
 * @Description:
 */

import {observable, action, computed, toJS} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, InputNumber, Checkbox, Input, Select, Icon, Popconfirm} from 'antd';
import React from 'react';
import eventSourceService from '@/api/system/eventSourceService';
import AddAndSub from '@/components/AddAndSub';
import FixedValue from '@/components/condition-tree/FixedValue';
import variableService from '@/api/business/variableService';
import dimensionService from '@/api/system/config2/dimensionService';

const reportFieldColumns = [
    {
        title: '是否可为空',
        dataIndex: 'nullable',
        key: 'nullable',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '最大长度',
        dataIndex: 'maxLength',
        key: 'maxLength',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

const dimensionMappingColumns = [
    {
        title: '维度名称',
        dataIndex: 'dimensionName',
        key: 'dimensionName',
    },
    {
        title: '父维度',
        dataIndex: 'parentDimensionName',
        key: 'parentDimensionName',
    },
    {
        title: '是否入库',
        dataIndex: 'mode',
        key: 'mode',
    },
    {
        title: '维度主键',
        dataIndex: 'eventPartitionKey',
        key: 'eventPartitionKey',
    },
    {
        title: '维度时间',
        dataIndex: 'eventTimeKey',
        key: 'eventTimeKey',
    },
    {
        title: '维度入库表',
        dataIndex: 'batchVarsTable',
        key: 'batchVarsTable',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

const modalColumns = [
    {
        title: '报文字段名称',
        dataIndex: 'eventFieldName',
        key: 'eventFieldName',
        width: 150
    }, {
        title: '数据库列名',
        dataIndex: 'column',
        key: 'column',
        width: 150
    }
]

let dataTypeList = [];
let allTable = [];
// let batchVarsTableList = [];
// let dbColumn = [];
class store {
    constructor() {
        this.getDetailsForApi = this.getDetailsForApi.bind(this);
        // this.getTablesMappingForApi2 = this.getTablesMappingForApi2.bind(this);
        this.renderTable1 = this.renderTable1.bind(this);
        this.renderTable3 = this.renderTable3.bind(this);
        this.addTempVar1 = this.addTempVar1.bind(this);
        this.subTempVars1 = this.subTempVars1.bind(this);
        this.tableDataChange1 = this.tableDataChange1.bind(this);
        this.tableDataChange2 = this.tableDataChange2.bind(this);
        this.tableDataChange3 = this.tableDataChange3.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.getEventTimeKeyList = this.getEventTimeKeyList.bind(this);
        this.getDetailsByUpload = this.getDetailsByUpload.bind(this);
        // this.batchVarsTableList = this.batchVarsTableList.bind(this);
        this.initTable = this.initTable.bind(this);
        this.packEventDbMapping = this.packEventDbMapping.bind(this);
    }

    id = '';
    resultData = '';
    @observable id = '';
    @observable timeList = [];//时间下拉集合
    @observable decisionFlowTypeList = [];//模式选择
    @observable dataSourceTypeList = [];//输入选择
    @observable dataSinkTypeList = [];//输出选择
    @observable traceFlagList = [];//调试配置项
    @observable isHaveCommitBtn = false;
    @observable isCanCommit = false;
    @observable table = {
        reportField: {
            data: [],
            dataSource: [],
            columns: reportFieldColumns,
            selectKeys: [],
            get getData() {
                return toJS(this.data)
            },
            get getDataSource() {
                return toJS(this.dataSource)
            },
            get getColumns() {
                return toJS(this.columns)
            },
            get getSelectKeys() {
                return toJS(this.selectKeys)
            },
            setData(value) {
                this.data = value
            },
            setDataSource(value) {
                this.dataSource = value
            },
            setColumns(value) {
                this.columns = value
            },
            setSelectKeys(value) {
                this.selectKeys = value
            }
        },
        dimensionMapping: {
            data: [],
            dataSource: [],
            columns: dimensionMappingColumns,
            get getData() {
                return toJS(this.data)
            },
            get getDataSource() {
                return toJS(this.dataSource)
            },
            get getColumns() {
                return toJS(this.columns)
            },
            setData(value) {
                this.data = value
            },
            setDataSource(value) {
                this.dataSource = value
            },
            setColumns(value) {
                this.columns = value
            },
        },
    }
    @observable min_max = {
        data: {
            zuichangbaoliushijian: {min: 1, max: 24855},//初始时默认为天
            qinglizhouqi: {min: 1, max: 35791394},//默认为分钟
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        }
    }
    @observable modal = {
        submit: {
            isShow: false,
            get getIsShow() {
                return toJS(this.isShow)
            },
            setIsShow(value) {
                this.isShow = value
            }
        },
        fieldMap: {
            columns: modalColumns,
            data: [],
            dataSource: [],
            isShow: false,
            get getData() {
                return toJS(this.data)
            },
            get getIsShow() {
                return toJS(this.isShow)
            },
            get getColumns() {
                return toJS(this.columns)
            },
            get getDataSource() {
                return toJS(this.dataSource)
            },
            setData(value) {
                this.data = value
            },
            setIsShow(value) {
                this.isShow = value
            },
            setColumns(value) {
                this.colums = value
            },
            setDataSource(value) {
                this.dataSource = value
            },
        },
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
    }
    @observable approvalSubmitParams = {
        actionType: 0,
        code: '',
        id: '',
        name: '',
        remark: '',
        type: 0,
        version: '',
        approvalStatus: '',//此字段只用于判断能否提交，只作为依据，不传到api
    }
    @observable details = {
        data: {
            //绑定
            "eventSourceName": "",
            "eventSourceType": "",
            "decisionFlowType": 128,
            "dataSourceType": 0,
            "mqInputAddr": "",
            "mqInputId": "",
            "dataSinkType": 0,
            "mqOutputAddr": "",
            "mqOutputId": "",
            "traceFlag": 127,
            "rtqWindowKeepDataTimeLengthSec": 7,
            "keepType": 0,
            "rtqWindowDeleteTimeIntervalSec": 30,
            "delType": 4,
            "rtqWindowDeleteChunkSize": 1000,
            "voltdbAlias": "",
            /*"description": "",*/
            "eventFieldVOs": [
                {
                    "nullable": false,
                    "name": "",
                    "type": 0,
                    "defaultValue": "",
                    "description": "",
                    "maxLength": 0,
                }
            ],
            //回传
            "eventSourceId": '',
            "fiFarmerCustomExecutorConfigPath": '',
            "fiFarmerCustomExecutorPath": '',
            "fiFarmerCustomExecutorPluginPath": '',
            "flowControl": '',
            "id": '',
            "serviceDisable": '',
            "status": 0,
            "syncStatus": 0,
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        }
    }

    @observable uploadDetails = {
        data: {
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        }
    }


    //提交
    @computed get getIsCanCommit() {
        return toJS(this.isCanCommit);
    }

    @action setIsCanCommit(value) {
        this.isCanCommit = value;
    }

    @computed get getIsHaveCommitBtn() {
        return toJS(this.isHaveCommitBtn);
    }

    @action setIsHaveCommitBtn(value) {
        this.isHaveCommitBtn = value;
    }

    @computed get getId() {
        return toJS(this.id)
    }

    @action setId(value) {
        this.id = value
    }

    @computed get getTimeList() {
        return toJS(this.timeList)
    }

    @action setTimeList(value) {
        this.timeList = value
    }

    @computed get getDecisionFlowTypeList() {
        return toJS(this.decisionFlowTypeList)
    }

    @action setDecisionFlowTypeList(value) {
        this.decisionFlowTypeList = value
    }

    @computed get getDataSourceTypeList() {
        return toJS(this.dataSourceTypeList)
    }

    @action setDataSourceTypeList(value) {
        this.dataSourceTypeList = value
    }

    @computed get getDataSinkTypeList() {
        return toJS(this.dataSinkTypeList)
    }

    @action setDataSinkTypeList(value) {
        this.dataSinkTypeList = value
    }

    @computed get getTraceFlagList() {
        return toJS(this.traceFlagList)
    }

    @action setTraceFlagList(value) {
        this.traceFlagList = value
    }

    getDetailsByUpload() {
        let uploadDataCopy = common.deepClone(this.uploadDetails.getData);
        console.log("getDetailsByUploadData",this.uploadDetails.getData);
        this.getDetailsForApiCallBack(uploadDataCopy);
    }

    getDetailsForApi() {
        // common.loading.show();
        eventSourceService.getDetails(this.id).then(this.getDetailsForApiCallBack).catch(() => { /*common.loading.hide()*/
        })
    }

    @action.bound getDetailsForApiCallBack(res) {
        // common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.resultData = res.data.result;
        console.log("this.resultData",this.resultData)
        this.details.setData(res.data.result);
        if (!common.isEmpty(res.data.result.eventFieldVOs)) {
            let eventFieldVOsCopy = common.deepClone(res.data.result.eventFieldVOs);
            eventFieldVOsCopy.forEach(element => {
                element.key = common.getGuid();
                element.ifDelete = "trueMark";
                //element.nullable = <Switch checkedChildren="是" unCheckedChildren="否" checked={element.nullable} />;
                // element.nullable = <Checkbox checked={element.nullable} />;
            });
            for (let i = 0; i < res.data.result.unDelFields.length; i++) {
                for (let j = 0; j < eventFieldVOsCopy.length; j++) {
                    if (res.data.result.unDelFields[i] == eventFieldVOsCopy[j].name) {
                        eventFieldVOsCopy[j].ifDelete = "falseMark";
                    }
                }
            }
            this.table.reportField.setData(eventFieldVOsCopy);
            this.table.reportField.setDataSource(this.renderTable1(this.table.reportField.getData));
            this.modal.fieldMap.setData(eventFieldVOsCopy);
            // this.modal.fieldMap.setDataSource(this.renderTable3(this.modal.fieldMap.getData));
            this.getEventTimeKeyList();
        } else {
            this.table.reportField.setData([]);
            this.table.reportField.setDataSource([]);
            this.modal.fieldMap.setData([]);
            this.modal.fieldMap.setDataSource([]);
        }

        if (!common.isEmpty(res.data.result.eventSourceMappingVOs)) {
            let eventSourceMappingVOsCopy = common.deepClone(res.data.result.eventSourceMappingVOs);
            eventSourceMappingVOsCopy.forEach(element => {
                element.key = common.getGuid();
                element.action = <AddAndSub type="sub"/>
                //element.mode = <Switch checkedChildren="是" unCheckedChildren="否" checked={element.mode === 0} />;
            });
            // let tempVOS = common.deepClone(res.data.result.eventSourceMappingVOs);
            // tempVOS.forEach(element=>{
            //     // if (element.code )
            // })
            this.table.dimensionMapping.setData(res.data.result.eventSourceMappingVOs);
            this.table.dimensionMapping.setDataSource(this.renderTable1(this.table.dimensionMapping.getData));
        } else {
            this.table.dimensionMapping.setData([]);
            this.table.dimensionMapping.setDataSource([]);
        }
        console.log("this.table.reportField.getData", this.table.reportField.getData)
    }

    initTable() {
        this.details.setData({
            "decisionFlowType": 128,
            "dataSourceType": 0,
            "dataSinkType": 0,
            "traceFlag": 127,
            "rtqWindowKeepDataTimeLengthSec": 7,
            "keepType": 0,
            "rtqWindowDeleteTimeIntervalSec": 30,
            "delType": 4,
            "rtqWindowDeleteChunkSize": 1000,
            "eventFieldVOs": [
                {
                    "nullable": false,
                    "type": 0,
                    "maxLength": 0,
                }
            ],
            "status": 0,
            "syncStatus": 0,
        });
        this.table.reportField.setData([]);
        this.table.dimensionMapping.setData([]);
        this.modal.fieldMap.setData([]);
        this.table.reportField.setDataSource(this.renderTable1(this.table.reportField.getData));
        this.table.dimensionMapping.setDataSource(this.renderTable1(this.table.reportField.getData));
        this.modal.fieldMap.setDataSource(this.renderTable1(this.table.reportField.getData));
    }


    renderTable1(list) {
        console.log("list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let myMaxLength = 0;
            for (let j = 0; j < dataTypeList.length; j++) {
                if (element.type == dataTypeList[j].code) {
                    myMaxLength = dataTypeList[j].max;
                }
            }
            let uuid = common.getGuid();
            if(this.details.getData.status == 0){ //未就绪的数据可以随便修改，不做限制
                element.flag = true;
            }
            tempArray.push({
                key: uuid,
                nullable: <Checkbox defaultChecked={element.nullable}
                                    disabled={!element.flag}
                                    onChange={(e) => this.tableDataChange1(i, 'nullable', e.target.checked)}/>,
                name: <Input defaultValue={element.name} style={{width: '120px'}}
                             disabled={!element.flag}
                             onChange={(e) => {
                                 let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                                 let reg2 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                                 if (isNaN(e.target.value) && !reg.test(e.target.value) && !reg2.test(e.target.value)) {
                                     let nameValue = e.target.value.replace(/[^\w_]/g, '');
                                     this.tableDataChange1(i, 'name', nameValue)
                                 } else {
                                     message.warn("报文字段定义-名称不能有特殊符号和中文，不能是纯数字！")
                                     if (this.table.reportField.getData[i].name !== "")
                                         this.tableDataChange1(i, 'name', '')
                                     this.table.reportField.setDataSource(this.renderTable1(this.table.reportField.getData));
                                 }
                             }}/>,
                type: <Select defaultValue={element.type} style={{width: '109px'}}
                              disabled={!element.flag}
                              onChange={(value) => this.tableDataChange1(i, 'type', value)}>
                    {dataTypeList.map((item, i) =>
                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>,
                defaultValue: <FixedValue type="defaultValueForList" value={element.defaultValue}
                                          disabled={!element.flag} style={{width: '171px'}}
                                          changeData={this.tableDataChange1} dataType={element.type} index={i}/>,
                description: <Input defaultValue={element.description} style={{width: '120px'}}
                                    isNotNull={true}
                                    disabled={!element.flag}
                                    onChange={(e) => this.tableDataChange1(i, 'description', e.target.value)}/>,
                maxLength: <InputNumber defaultValue={element.maxLength} style={{width: '120px'}}
                                        disabled={!element.flag}
                                        min={0}
                                        max={myMaxLength}
                                        onChange={(value) => this.tableDataChange1(i, 'maxLength', value)}/>,
                action:
                    <div>
                        {element.ifDelete == "falseMark" ? <a style={{color: '#5b5b5b', disabled: "true"}}>
                                <Icon type="minus-circle" style={{disabled: "true"}} title="该条报文字段禁止删除"/></a> :
                            !element.flag ?
                                <a style={{color: '#ff2f05'}}>
                                    <Popconfirm title="是否确定删除?" onConfirm={() => {
                                        this.subTempVars1(uuid)
                                    }} onCancel={() => {
                                    }} okText="确定" cancelText="取消">
                                        <Icon type="minus-circle" title="删除"/>
                                    </Popconfirm></a> :
                                <a style={{color: '#ff2f05'}}><Icon type="minus-circle" title="删除" onClick={() => {
                                    this.subTempVars1(uuid)
                                }}/></a>}
                    </div>
            })
        }
        return tempArray
    }

    @action.bound mappingTablesCols(i) {
        //start
        let eventDbMapping = this.table.dimensionMapping.getData[i].eventDbMapping;
        if (common.isEmpty(eventDbMapping)) {
            message.warn("没有数据");
            return;
        } else if (common.isEmpty(eventDbMapping)) {
            message.warn("没有数据");
            return;
        } else {
            eventDbMapping = JSON.parse(eventDbMapping)
        }

        let eventFieldMappings = [];

        let tempData = common.deepClone(this.table.reportField.getData);
        let nameList = [];//名字的list
        let dbTableName;//数据库表名code
        tempData.forEach(element => {
            nameList.push(element.name)
        });
        let tempData2 = common.deepClone(this.table.dimensionMapping.getData);
        tempData2.forEach(element2 => {
            dbTableName = element2.batchVarsTable;
            eventFieldMappings.push(element.eventFieldMappings);
        });
        let eventFieldMappingsNews = [];
        eventFieldMappings.forEach(element3 => {//旧数据
            nameList.forEach(element4 => {
                if (eventFieldMappings.includes(element4)) {
                    eventFieldMappingsNews.push({eventFieldName: element4, column: element3.column})
                } else {
                    eventFieldMappingsNews.push({eventFieldName: element4, column: ''})
                }
            })
            eventDbMapping = {
                "dbTableName": dbTableName,
                "eventFieldMappings": eventFieldMappingsNews
            }
        });
        console.log("eventDbMapping", eventDbMapping)


        for (var i = 0; i < nameList.length; i++) {
            //tempData2.eventDbMapping.eventDatamappings.eventFiledName[i] = nameList[i];
        }

        let code = this.table.dimensionMapping.getData[i].batchVarsTable;
        let list = common.deepClone(this.modal.fieldMap.getData);
        let cols = [];
        allTable.forEach(element => {
            element.tables.forEach(element2 => {
                /*console.log("element2", element2)
                console.log("code", code)
                console.log("element2.code", element2.code)*/
                if (code == element2.code) {
                    element2.rtdTableColumnEntities.forEach(element3 => {
                        // console.log("allTable", allTable)
                        cols.push({
                            code: element3.code,
                            value: element3.name
                        });
                    });
                    // cols = element.tables;
                }
            });
        })
        list.forEach(element => {
            element.cols = cols;
        })
        console.log("list.cols", list.cols)
        this.modal.fieldMap.setData(list);
        this.modal.fieldMap.setDataSource(this.renderTable3(this.modal.fieldMap.getData));
        this.modal.fieldMap.setIsShow(true);
    }

    renderTable3(list) {
        console.log(" renderTable3(list)", list);
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                eventFieldName: <Input defaultValue={element.name} disabled={true} style={{width: '120px'}}
                                       onChange={() => this.tableDataChange3(i, 'eventFieldName', element.name)}/>,
                column: <Select defaultValue={element.column} style={{width: '109px'}}
                                onChange={(value, option) => {
                                    this.tableDataChange3(i, 'column', option.props.children)
                                    this.tableDataChange3(i, 'value', option.props.value)
                                }}>
                    {
                        element.cols ?
                            element.cols.map((item) =>
                                <Select.Option key={Math.random()} value={item.code}>{item.value}</Select.Option>
                            ) : ''}
                </Select>
            })
        }
        return tempArray
    }


    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val,
                    value: element.label,
                    max: element.maxLength
                });
                dataTypeList = tempArray
            })
        })
        eventSourceService.getTimeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray2 = [];
            res.data.result.forEach(element => {
                tempArray2.push({
                    code: element.val,
                    min: element.min,
                    max: element.max,
                    value: element.label
                });
                this.setTimeList(tempArray2);
            })
        })
        eventSourceService.getDecisionFlowTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray3 = [];
            res.data.result.forEach(element => {
                tempArray3.push({
                    code: element.val,
                    value: element.label
                });
                this.setDecisionFlowTypeList(tempArray3);
            })
        })
        eventSourceService.getDataSinkTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray4 = [];
            res.data.result.forEach(element => {
                tempArray4.push({
                    code: element.val,
                    value: element.label
                });
                this.setDataSinkTypeList(tempArray4);
            })
        })
        eventSourceService.getDataSourceTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray5 = [];
            res.data.result.forEach(element => {
                tempArray5.push({
                    code: element.val,
                    value: element.label
                });
                this.setDataSourceTypeList(tempArray5);
            })
        })
        eventSourceService.getTraceFlagList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray6 = [];
            res.data.result.forEach(element => {
                tempArray6.push({
                    code: element.val,
                    value: element.label
                });
                this.setTraceFlagList(tempArray6);
            })
        })
        dimensionService.getDimensionNameList().then(res => {
            console.log("getDimensionNameList.res", res)
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    id: element.id
                });
                allTable = res.data.result;
            })
            if (this.id) {
                this.getDetailsForApi();
            }

            /* tablesService.findByDimensionId().then(res => {
                 console.log("getDimensionNameList",res)
                 if (!publicUtils.isOk(res)) return
                 let tempArray = [];
                 res.data.result.forEach(element => {
                     if (element.val == 16) return
                     tempArray.push({
                         code: element.code,
                         value: element.name
                     });
                     batchVarsTableList = tempArray
                 })
             })*/
        })
    }

    getEventTimeKeyList() {
        console.log("this.table.reportField.getData？", this.table.reportField.getData)
        let tempData = common.deepClone(this.table.reportField.getData);
        let tempArray = [];
        let tempArray2 = [];
        tempData.forEach(element => {
            if (element.val == 16) return
            if (element.name != '' && element.type != '') {
                tempArray.push({
                    code: element.name,
                    value: element.name
                });
                if (element.type == 93) {
                    tempArray2.push({
                        code: element.name,
                        value: element.name
                    });
                }
            }
        })
        // this.table.dimensionMapping.setDataSource(this.renderTable2(this.table.dimensionMapping.getData));
    }

    tableDataChange1 = (i, name, value) => {
        /*$("input").blur(function () {
            self.table.reportField.setDataSource(self.renderTable1(self.table.reportField.getData));
        })*/
        console.log(`${i}  ${name}  ${value}`);
        let tempData = common.deepClone(this.table.reportField.getData);
        // 日期组件只能选日期，修改值的时候加上时分秒
        tempData[i][name] = tempData[i].type === 93 && name === 'defaultValue' ? `${value.split(' ')[0]} 00:00:00` : value;
        switch (name) {
            case 'code':
                tempData[i][name] = value.replace(/[^\w_]/g, '');
                break;
            case 'type':
                for (let j = 0; j < dataTypeList.length; j++) {
                    if (tempData[i].type == dataTypeList[j].code) {
                        if (tempData[i].maxLength > dataTypeList[j].max) {
                            tempData[i].maxLength = dataTypeList[j].max
                        }
                    }
                }
                tempData[i].defaultValue = "";
                this.table.reportField.setDataSource(this.renderTable1(tempData))
                if (value == 93) {
                    this.getEventTimeKeyList();
                }
                break;
            case 'name':
                // eslint-disable-next-line no-case-declarations
                let nameList = [];
                tempData.forEach(element => {
                    nameList.push(element.name)
                });
                this.table.reportField.setData(tempData);
                this.getEventTimeKeyList();
                this.packEventDbMapping();
                break;

            default:
                break;
        }
        this.table.reportField.setData(tempData);
        console.log("this.table.reportField.getData", this.table.reportField.getData);
    }

    tableDataChange2 = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
        let tempData = common.deepClone(this.table.dimensionMapping.getData);
        tempData[i][name] = value;
        this.table.dimensionMapping.setData(tempData);
        if (name == 'eventPartitionKey') {
            for (let i = 0; i < tempData.length; i++) {
                allTable.forEach(element2 => {
                    if (element2.code === value) {
                        tempData[i].tables = element2.tables;
                    }
                })
            }
            this.table.dimensionMapping.setData(tempData);
            let dataSource = this.renderTable2(tempData);
            this.table.dimensionMapping.setDataSource(dataSource)
            //console.log("dataSource = ", this.table.dimensionMapping.getDataSource)
        }
        if (name != 'parentDimensionName') {
            this.table.dimensionMapping.setDataSource(this.renderTable2(tempData))
        }
        if (name === 'dimensionId') {
            allTable.forEach(element => {
                if (value === element.id) {
                    let tables = element.tables;
                    let table2Data = common.deepClone(this.table.dimensionMapping.getData);
                    table2Data[i].tables = tables;
                    this.table.dimensionMapping.setData(table2Data);
                    this.table.dimensionMapping.setDataSource(this.renderTable2(this.table.dimensionMapping.getData));
                }
            })
        }
    }

    tableDataChange3 = (i, name, value) => {
        // let dbTableName = '';
        // let eventFieldMappings =[];
        console.log(`${i}  ${name}  ${value}`);
        let tempData = common.deepClone(this.modal.fieldMap.getData);
        tempData[i][name] = value;
        this.modal.fieldMap.setData(tempData);
        // dbTableName = this.table.dimensionMapping.getData.batchVarsTable;
        // eventFieldMappings.eventFieldName =
        //this.modal.fieldMap.setDataSource(this.renderTable3(this.modal.fieldMap.getData));
        console.log("this.modal.fieldMap.getData", this.modal.fieldMap.getData)
    }

    /*    batchVarsTableList(i, tempData, id){
            if(!common.isEmpty(id)){
                tablesService.findByDimensionId(id).then(res => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    let tempArray2 = [];
                    res.data.result.forEach(element => {//遍历维度入库表列
                        if (element.val == 16) return
                        tempArray.push({
                            code: element.code,
                            value: element.name
                        });
                        batchVarsTableList = tempArray
                        this.table.dimensionMapping.setDataSource(this.renderTable2(tempData))
                        if(element.code == tempData[i].batchVarsTable){
                            element.rtdTableColumnEntities.forEach(element2 => {//遍历维度入库表列里的rtdTableColumnEntities(即字段映射的数据库列名列表)
                                tempArray2.push({
                                    code: element2.code,
                                    value: element2.name
                                });
                                dbColumn = tempArray2
                                this.modal.fieldMap.setDataSource(this.renderTable3(this.modal.fieldMap.getData));
                            })
                        }
                    })
                })
            }
        }*/

    /*    dbColumnList(){
            tablesService.findByDimensionId("ff80808167ce84f10167cfa533ca00f0").then(res => {
                console.log("喵喵喵??",res)
                if (!publicUtils.isOk(res)) return
                let tempArray = [];
                let tempArray2 = [];
                res.data.result.forEach(element => {
                    if (element.val == 16) return
                    tempArray.push({
                        code: element.code,
                        value: element.name
                    });
                    console.log("喵喵喵tempArraytempArray??",tempArray)
                    batchVarsTableList = tempArray
                    this.table.dimensionMapping.setDataSource(this.renderTable2(tempData))
                    element.rtdTableColumnEntities.forEach(element2 => {
                        tempArray2.push({
                            code: element2.code,
                            value: element2.name
                        });
                        dbColumn = tempArray2
                        this.modal.fieldMap.setDataSource(this.renderTable3(this.modal.fieldMap.getData));
                    })
                })
            })
        }*/

    /*    tableDataChange3 = (i, name, value) => {
            console.log(`${i}  ${name}  ${value}`);
            let  tempData = common.deepClone(this.table.dimensionMapping.getData);
            tempData[i][name]= value;

            if(!common.isEmpty(tempData[0].dimensionName)){
                tablesService.findByDimensionId("ff80808167ce84f10167cfa533cc00f1").then(res => {
                    if (!publicUtils.isOk(res)) return
                    let tempArray = [];
                    res.data.result.forEach(element => {
                        if (element.val == 16) return
                        tempArray.push({
                            code: element.code,
                            value: element.name
                        });
                        dbColumn = tempArray
                    })
                })
            }
            this.table.dimensionMapping.setData(tempData);
            console.log("this.table.dimensionMapping.getData", this.table.dimensionMapping.getData)
        }*/

    subTempVars1 = (key) => {
        console.log("key", key)
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.table.reportField.getDataSource.length; i++) {
            const element = this.table.reportField.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }
        console.log(" arrayIndex ", arrayIndex)
        let a = this.table.reportField.getData;
        a.splice(arrayIndex, 1);
        this.table.reportField.setData(a)
        this.table.reportField.setDataSource(this.renderTable1(this.table.reportField.getData))
    }


    addTempVar1 = () => {
        let tempArray = common.deepClone(this.table.reportField.getData);
        tempArray.push({
            "nullable": "",
            "name": "",
            "type": "",
            "description": "",
            "maxLength": "",
            "flag": true
        })
        this.table.reportField.setData(tempArray);
        this.table.reportField.setDataSource(this.renderTable1(this.table.reportField.getData))
        this.modal.fieldMap.setData(tempArray);
        this.modal.fieldMap.setDataSource(this.renderTable3(this.modal.fieldMap.getData));



    }

    packEventDbMapping() {

    }

}

export default new store