/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:03:59
 * @Description: 
 */

import {observable, action, toJS} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, Input, Select, Icon} from 'antd';
import React from 'react';
import eventSourceService from '@/api/system/eventSourceService';

const dimensionMappingColumns = [
    {
        title: '维度名称',
        dataIndex: 'dimensionName',
        key: 'dimensionName',
    },
    /* {
         title: '父维度',
         dataIndex: 'parentDimensionName',
         key: 'parentDimensionName',
     },*/
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
        dataIndex: 'tableName',
        key: 'tableName',
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

class store {
    constructor() {
        this.getDetailsForApi = this.getDetailsForApi.bind(this);
        this.getDimensionListForApi = this.getDimensionListForApi.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.addOneRow = this.addOneRow.bind(this);
        this.subTempVars = this.subTempVars.bind(this);
        this.renderTableForModal = this.renderTableForModal.bind(this);
        this.mappingTablesCols = this.mappingTablesCols.bind(this);
        this.tableDataChangeForModal = this.tableDataChangeForModal.bind(this);
        this.mappingTablesColsBackUp = this.mappingTablesColsBackUp.bind(this);
        this.vosRepeatVerify = this.vosRepeatVerify.bind(this);
        this.mappingRepeatVerify = this.mappingRepeatVerify.bind(this);
    }

    id = '';
    resultData = '';
    dimensionList = [];
    dimensionKeySelect = [];
    dimensionTimeSelect = [];
    eventPartitionKeySelect = [];
    mappingTablesIndex = null;//桥梁变量
    @observable table = {
        dimensionMapping: {
            data: [
                // {
                //     "batchVarsTable": "string",
                //     "dimensionId": "string",
                //     "dimensionName": "string",
                //     "eventDbMapping":
                //         // {//保存的手序列化
                //         //     "dbTableName": "",
                //         //     "eventFieldMappings": [
                //         //         // {
                //         //         //     "eventFieldName": "报文字段code",
                //         //         //     "column": "数据库列名code"
                //         //         // }
                //         //     ]
                //         // }
                //         '',
                //     "eventPartitionKey": "string",
                //     "eventSourceId": "string",
                //     "eventSourceMappingId": "string",
                //     "eventTimeKey": "string",
                //     "id": "string",
                //     "mode": 0,
                //     "offlineTime": "2019-05-17T07:06:56.793Z",
                //     "offlineUser": "string",
                //     "onlineTime": "2019-05-17T07:06:56.793Z",
                //     "onlineUser": "string",
                //     "parentDimensionId": "string",
                //     "parentDimensionName": "string",
                //     "status": 0
                // }
            ],
            dataBackUp: [],
            dataBackIndex: '',
            dataSource: [],
            columns: dimensionMappingColumns,
            init() {
                this.data = [];
                this.dataSource = [];
            },
            get getData() {
                return toJS(this.data)
            },
            get getDataBackUp() {
                return toJS(this.dataBackUp)
            },
            get getDataBackIndex() {
                return toJS(this.dataBackIndex)
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
            setDataBackUp(value) {
                this.dataBackUp = value
            },
            setDataBackIndex(value) {
                this.dataBackIndex = value
            },
            setDataSource(value) {
                this.dataSource = value
            },
            setColumns(value) {
                this.columns = value
            },
        },
        modal: {
            data: [],
            dataSource: [],
            columns: modalColumns,
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
        }
    }

    @observable modal = {
        isShow: false,
        show() {
            this.isShow = true
        },
        hide() {
            this.isShow = false
        }
    }

    getDimensionListForApi(id) {
        eventSourceService.getDimensionList().then((res) => {
            this.getDimensionListForApiCallBack(res, id);
        });
    }

    @action.bound getDimensionListForApiCallBack(res, id) {
        if (!publicUtils.isOk(res)) return
        this.dimensionList = res.data.result;
        if (!common.isEmpty(id)) {
            this.getDetailsForApi(id);
        }
    }

    getDetailsForApi(id) {
        eventSourceService.getDetails(id).then(this.getDetailsForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound getDetailsForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        this.resultData = res.data.result;
        let eventDbMapping_old = [];//旧的报文字段名称数据(改变数据)
        let eventDbMapping_BK = [];//旧的报文字段名称数据(操作数据)
        let eventFieldVOs_new = this.resultData.eventFieldVOs;//最新报文字段名称数据
        let eventSourceMappingVOs = common.deepClone(res.data.result.eventSourceMappingVOs);

        for (let k = 0; k < eventSourceMappingVOs.length; k++) {
            if (common.isEmpty(eventSourceMappingVOs[k].eventDbMapping)) continue

            eventDbMapping_old = JSON.parse(eventSourceMappingVOs[k].eventDbMapping);
            eventDbMapping_BK = JSON.parse(eventSourceMappingVOs[k].eventDbMapping);
            let new_eventFieldMappings = [];//更新后的报文字段名称数据
            for (let i = 0; i < eventFieldVOs_new.length; i++) {
                let obj = {eventFieldName: eventFieldVOs_new[i].name, column: ""}
                for (let j = 0; j < eventDbMapping_BK.eventFieldMappings.length; j++) {
                    if (eventDbMapping_BK.eventFieldMappings[j].eventFieldName == eventFieldVOs_new[i].name) {
                        obj.column = eventDbMapping_BK.eventFieldMappings[j].column;
                    }
                }
                new_eventFieldMappings.push(obj)
                eventDbMapping_old.eventFieldMappings = new_eventFieldMappings;
                eventSourceMappingVOs[k].eventDbMapping = JSON.stringify(eventDbMapping_old);
            }
        }

        this.table.dimensionMapping.setData(eventSourceMappingVOs);
        let eventFieldVOs = res.data.result.eventFieldVOs;
        let dimensionTimeSelect = [];
        let dimensionKeySelect = [];
        let eventPartitionKeySelect = [];
        eventFieldVOs.forEach(element => {
            if (element.type == 93) {
                dimensionTimeSelect.push(element);
            }
            dimensionKeySelect.push(element);
            if (element.type == 12) {
                eventPartitionKeySelect.push(element);
            }
        })
        this.dimensionTimeSelect = dimensionTimeSelect;
        this.dimensionKeySelect = dimensionKeySelect;
        this.eventPartitionKeySelect = eventPartitionKeySelect;
        // 设置partitionKey start
        let tempData = common.deepClone(this.table.dimensionMapping.getData);
        for (let i = 0; i < this.table.dimensionMapping.getData.length; i++) {
            const rowData = this.table.dimensionMapping.getData[i];
            this.dimensionList.forEach(element => {
                if (rowData.dimensionId === element.rtdDimensionId) {
                    tempData[i].tables = element.tables;
                    element.tables.forEach(table => {
                        if (table.code === rowData.tableName) {
                            tempData[i].partitionKey = table.partitionKey;
                        }
                    })

                }
            })

        }
        console.log("tempData", tempData)
        this.table.dimensionMapping.setData(tempData);
        // 设置partitionKey end


        this.table.dimensionMapping.setDataSource(this.renderTable(this.table.dimensionMapping.getData));
    }

    tableDataChange = (i, name, value) => {
        console.log(`tableDataChange${i}  ${name}  ${value}`);
        let tempData = common.deepClone(this.table.dimensionMapping.getData);
        tempData[i][name] = value;
        if (name == 'mode' && value == 1) {
            tempData[i].eventTimeKey = '';
            tempData[i].tableName = '';
        }
        if (name !== 'parentDimensionName') {//避免输入框失去焦点
            switch (name) {
                case 'tableName':
                    // eslint-disable-next-line no-case-declarations
                    let eventDbMapping = common.deepClone(tempData[i].eventDbMapping);
                    if (common.isEmpty(eventDbMapping)) {//空则新建一个空的模板
                        eventDbMapping = {
                            "dbTableName": tempData[i].tableName,
                            "eventFieldMappings": []
                        }
                        this.dimensionKeySelect.forEach(element => {
                            eventDbMapping.eventFieldMappings.push({
                                eventFieldName: element.name,
                                column: ''
                            });
                        })
                    } else {
                        eventDbMapping = JSON.parse(eventDbMapping);
                        eventDbMapping.dbTableName = tempData[i].tableName;
                    }
                    tempData[i].eventDbMapping = JSON.stringify(eventDbMapping);
                    break;
                case 'dimensionId':
                    this.dimensionList.forEach(element => {
                        /* console.log("elementelementelement",element)
                         console.log("value",value)
                         console.log("element.id",element.rtdDimensionId)*/
                        if (value === element.rtdDimensionId) {
                            let tables = element.tables;
                            tempData[i].tables = tables;
                        }
                    })
                    tempData[i].tableName = '';
                    break;
                default:
                    break;
            }
            this.table.dimensionMapping.setData(tempData);
            this.table.dimensionMapping.setDataSource(this.renderTable(tempData));
        }
        this.table.dimensionMapping.setData(tempData);
        //组装eventDbMapping


    }

    tableDataChangeForModal(dimensionMappingRowIndex, dimensionMappingModalRowIndex, key, value) {
        console.log("dimensionMappingRowIndex, dimensionMappingModalRowIndex, key, value", dimensionMappingRowIndex, dimensionMappingModalRowIndex, key, value)
        let dimensionMapping = this.table.dimensionMapping.getData;
        let eventDbMapping = JSON.parse(dimensionMapping[dimensionMappingRowIndex].eventDbMapping);
        eventDbMapping.eventFieldMappings[dimensionMappingModalRowIndex][key] = value;
        console.log("dimensionMapping======", dimensionMapping);
        console.log("eventDbMapping======", eventDbMapping);
        dimensionMapping[dimensionMappingRowIndex].eventDbMapping = JSON.stringify(eventDbMapping);
        this.table.dimensionMapping.setData(dimensionMapping);
        this.table.modal.setData(dimensionMapping.eventDbMapping);

        // let ModalData = this.table.dimensionMapping.getData[dimensionMappingRowIndex].tables;
        // if (!common.isEmpty(ModalData)) {
        //     ModalData.forEach(element => {
        //         console.log("1111111")
        //         if (element.code == this.table.dimensionMapping.getData[dimensionMappingRowIndex].tableName) {
        //             console.log("element.rtdTableColumnEntities", element.rtdTableColumnEntities);
        //             this.table.modal.setDataSource(this.renderTableForModal(dimensionMappingRowIndex, tempEventFieldMappings, this.table.dimensionMapping.getData[dimensionMappingRowIndex].columns));
        //         }
        //     });
        // }
        // this.table.modal.setDataSource(this.renderTableForModal(dimensionMappingRowIndex, tempEventFieldMappings, this.table.dimensionMapping.getData[dimensionMappingRowIndex].columns));
        // this.table.dimensionMapping.getData[dimensionMappingRowIndex].tables.forEach(element => {
        //     if (element.code == this.table.dimensionMapping.getData[dimensionMappingRowIndex].tableName) {
        //         console.log("333333")
        //         console.log("element.rtdTableColumnEntities", element.rtdTableColumnEntities);
        //         this.table.modal.setDataSource(this.renderTableForModal(dimensionMappingRowIndex, eventDbMapping.eventFieldMappings, element.rtdTableColumnEntities));
        //     }
        // });
        // this.table.modal.setDataSource(this.renderTableForModal(dimensionMappingRowIndex, tempEventFieldMappings, this.table.dimensionMapping.getData[dimensionMappingRowIndex].columns));
    }


    renderTable(list) {
        console.log("list     = ", list)
        let tempArray2 = [];
        if (common.isEmpty(list)) return tempArray2
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray2.push({
                key: uuid,
                dimensionName: <Select defaultValue={element.dimensionName} disabled={element.id != null ? true : false}
                                       style={{width: '109px'}} onChange={(value, option) => {
                    /* console.log("optionoptionoption",option.props)*/
                    this.tableDataChange(i, 'dimensionName', option.props.children);
                    this.tableDataChange(i, 'dimensionId', option.props.id);
                    // this.tableDataChange(i, 'eventPartitionKey', value);
                }}>
                    {this.dimensionList.map((item, i) =>
                        /* console.log("itemitemitemitem",item)*/
                        <Select.Option key={i} value={item.code} code={item.code}
                                       id={item.rtdDimensionId}>{item.name}</Select.Option>
                    )}
                </Select>,
                parentDimensionName: <Input defaultValue={element.parentDimensionName}
                                            disabled={element.id != null ? true : false} style={{width: '120px'}}
                                            onChange={(e) => this.tableDataChange(i, 'parentDimensionName', e.target.value)}/>,
                mode: <Select defaultValue={element.mode === 0 ? "是" : "否"} disabled={element.id != null ? true : false}
                              style={{width: '120px'}} onChange={(value) => this.tableDataChange(i, 'mode', value)}>
                    <Select.Option value={1}>否</Select.Option>
                    <Select.Option value={0}>是</Select.Option>
                </Select>,
                eventPartitionKey: <Select defaultValue={element.eventPartitionKey}
                                           disabled={element.id != null ? true : false}
                                           style={{width: '130px'}}
                                           onChange={(value) => this.tableDataChange(i, 'eventPartitionKey', value)}>
                    {this.eventPartitionKeySelect.map((item,i) =>
                        <Select.Option key={i} value={item.name}>{item.name}</Select.Option>
                    )}
                </Select>,
                eventTimeKey: <Select defaultValue={element.eventTimeKey}
                                      disabled={element.id != null ? true : false || element.mode != 0 ? true : false}
                                      style={{width: '109px'}}
                                      onChange={(value) => this.tableDataChange(i, 'eventTimeKey', value)}>
                    {this.dimensionTimeSelect.map((item, i) =>
                        <Select.Option key={i} value={item.name}>{item.name}</Select.Option>
                    )}
                </Select>,
                tableName: <Select defaultValue={element.tableName}
                                   disabled={element.id != null ? true : false || element.mode != 0 ? true : false}
                                   style={{width: '109px'}} onChange={(value, option) => {
                    this.tableDataChange(i, 'tableName', value);
                    this.tableDataChange(i, 'partitionKey', option.props.partitionKey);
                    this.tableDataChange(i, 'columns', option.props.columns);
                    console.log("option =", option);
                }}>
                    {
                        element.tables ?
                            element.tables.map((item) =>
                                <Select.Option key={Math.random()} value={item.code} partitionKey={item.partitionKey}
                                               columns={item.columns}>{item.name}</Select.Option>
                            ) : ''
                    }
                </Select>,
                action:
                    <div style={{color: '#ff2f05'}}>
                        <Icon type="bar-chart" hidden={element.mode != 0 ? true : false} title="字段映射"
                              style={{marginRight: '15%'}}
                              onClick={() => {
                                  if (common.isEmpty(element.eventDbMapping)) {
                                      message.warn("无字段映射");
                                      return
                                  }
                                  this.mappingTablesCols(i);
                              }}/>
                        {
                            common.isEmpty(element.id) ?
                                <Icon type="minus-circle"
                                      onClick={() => {
                                          this.subTempVars(uuid)
                                      }}/>
                                : ''
                        }
                    </div>
            })
        }
        return tempArray2
    }

    addOneRow = () => {
        let tempArray = common.deepClone(this.table.dimensionMapping.getData);
        tempArray.push({
            "dimensionName": "",
            "parentDimensionName": "",
            "mode": 1,
            "eventPartitionKey": "",
            "eventTimeKey": "",
            "batchVarsTable": "",
            "tableName": "",
            "status": "",
        })
        this.table.dimensionMapping.setData(tempArray);
        this.table.dimensionMapping.setDataSource(this.renderTable(this.table.dimensionMapping.getData))
    }

    subTempVars = (key) => {
        console.log("key", key)
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.table.dimensionMapping.getDataSource.length; i++) {
            const element = this.table.dimensionMapping.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }
        let a = this.table.dimensionMapping.getData;
        a.splice(arrayIndex, 1);
        this.table.dimensionMapping.setData(a)
        this.table.dimensionMapping.setDataSource(this.renderTable(this.table.dimensionMapping.getData))
    }

    renderTableForModal(dimensionMappingRowIndex, list, colsList, partitionKey) {
        console.log("list  colsList partitionKey", list, colsList, partitionKey)

        let eventFieldVOs = this.resultData.eventFieldVOs;

        console.log("eventFieldVOs", eventFieldVOs)

        list.forEach(element => {
            let columns = [];
            eventFieldVOs.forEach(field => {

                if (field.name === element.eventFieldName) {
                    colsList.forEach(col => {
                        if (field.type === col.type) {
                            columns.push(col)
                        }
                    })

                    if (field.type == 93) {
                        element.isDateTime = true
                    } else {
                        element.isDateTime = false
                    }
                }

            })
            columns.unshift({
                code: '',
                name: '无'
            });
            element.columns = columns;
        })

        console.log("筛选后的list", list)

        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                eventFieldName: <p><span style={{
                    color: 'red',
                    marginRight: '5px',
                    display: element.isDateTime ? 'inline' : 'none'
                }}>*</span>{element.eventFieldName}</p>,
                column:
                    <Select showSearch={true} optionFilterProp="search"
                            defaultValue={this.table.dimensionMapping.getData[dimensionMappingRowIndex].eventPartitionKey === element.eventFieldName ? partitionKey : element.column}
                            disabled={this.table.dimensionMapping.getData[dimensionMappingRowIndex].eventPartitionKey === element.eventFieldName}
                            style={{width: '130px'}}
                            onChange={(value) => this.tableDataChangeForModal(dimensionMappingRowIndex, i, 'column', value)}>
                        {
                            element.columns.map((item, i) =>
                                <Select.Option key={i} search={`${item.code}${item.name}`}
                                               value={item.code}>{item.name}</Select.Option>
                            )
                        }
                    </Select>
            })
        }
        // 设置partitionKey start
        let dataAll = this.table.dimensionMapping.getData;
        let data = this.table.dimensionMapping.getData[dimensionMappingRowIndex];
        let list_new = common.deepClone(list);
        list.forEach((element, i) => {
            if (data.eventPartitionKey === element.eventFieldName) {
                list_new[i].column = partitionKey
            }
        })
        let eventDbMapping = JSON.parse(data.eventDbMapping);
        eventDbMapping.eventFieldMappings = list_new;
        data.eventDbMapping = JSON.stringify(eventDbMapping)
        dataAll[dimensionMappingRowIndex] = data;
        this.table.dimensionMapping.setData(dataAll);
        console.log("dataAll", dataAll)
        // end
        return tempArray
    }


    mappingTablesCols(i) {
        if (!this.vosRepeatVerify(true)) return
        this.mappingTablesIndex = i;
        this.table.dimensionMapping.setDataBackUp(this.table.dimensionMapping.getData);
        let eventDbMapping = JSON.parse(this.table.dimensionMapping.getData[i].eventDbMapping);
        console.log("mappingTablesCols", this.table.dimensionMapping.getData)
        this.table.modal.setData(eventDbMapping);
        this.table.dimensionMapping.setDataSource(this.renderTable(this.table.dimensionMapping.getData));
        if (!common.isEmpty(this.table.dimensionMapping.getData[i].id)) {
            console.log("eventDbMapping.eventFieldMappings", eventDbMapping.eventFieldMappings)
            this.table.modal.setData(eventDbMapping.eventFieldMappings);
            this.table.modal.setDataSource(this.renderTableForModal(i, eventDbMapping.eventFieldMappings, this.table.dimensionMapping.getData[i].columns, this.table.dimensionMapping.getData[i].partitionKey));
        } else {
            this.table.dimensionMapping.getData[i].tables.forEach(element => {
                if (element.code == this.table.dimensionMapping.getData[i].tableName) {
                    console.log("eventDbMapping.eventFieldMappings", eventDbMapping.eventFieldMappings)
                    console.log("element.rtdTableColumnEntities", element.rtdTableColumnEntities);
                    this.table.modal.setData(eventDbMapping.eventFieldMappings);
                    this.table.modal.setDataSource(this.renderTableForModal(i, eventDbMapping.eventFieldMappings, element.rtdTableColumnEntities, element.partitionKey));
                }
            });
        }
        this.modal.show();
    }

    mappingTablesColsBackUp() {
        this.table.dimensionMapping.setData(this.table.dimensionMapping.getDataBackUp);
        // console.log("mappingTablesColsBackUp", this.table.dimensionMapping.getData);
    }

    vosRepeatVerify(isTips) {
        let dimensionMapping = this.table.dimensionMapping.getData;
        let dimensionMappingObj = {}
        let tableNameObj = {}
        let dimensionIdObj = {}
        for (let i = 0; i < dimensionMapping.length; i++) {
            const element = dimensionMapping[i];
            if (!dimensionIdObj[element.dimensionId]) {
                dimensionIdObj[element.dimensionId] = element.dimensionId;
            } else {
                if (isTips) message.warn("不能选择重复的维度");
                return false
            }
            if (!dimensionMappingObj[element.eventPartitionKey]) {
                if (element.eventPartitionKey === element.eventTimeKey && !common.isEmpty(element.eventPartitionKey)) {
                    if (isTips) message.warn("同一维度下，主键和时间不能相同");
                    return false
                } else {
                    dimensionMappingObj[element.eventPartitionKey] = element.eventPartitionKey;
                }
            } else {
                if (isTips) message.warn("不能选择重复的维度主键");
                return false
            }

            if (!tableNameObj[element.tableName]) {
                tableNameObj[element.tableName] = element.tableName;
            } else {
                if (isTips) message.warn("不能选择重复的入库表");
                return false
            }
        }
        return true
    }

    mappingRepeatVerify(isTips) {
        try {
            let eventFieldMappings = JSON.parse(this.table.dimensionMapping.getData[this.mappingTablesIndex].eventDbMapping).eventFieldMappings;
            console.log("eventDbMapping  wadasdas", eventFieldMappings)
            let columnObj = {}
            for (let i = 0; i < eventFieldMappings.length; i++) {
                const element = eventFieldMappings[i];
                if (!columnObj[element.column]) {
                    columnObj[element.column] = element.column;
                } else {
                    if (isTips) message.warn("数据库列名不可重复选择");
                    return false
                }
            }
            return true
        } catch (error) {
            return true
        }

    }

}

export default new store