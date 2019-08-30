/*
 * @Author: liuzhuolin
 * @Date: 2019-05-16 16:59:52
 * @LastEditors: liuzhuolin
 * @LastEditTime: 2019-05-16 16:59:52
 * @Description: 
 */

import {observable, action, computed, toJS, autorun} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, Modal, Switch, InputNumber, Checkbox, Input, Select, Icon} from 'antd';
import React from 'react';
import eventSourceService from '@/api/system/eventSourceService';
import AddAndSub from '@/components/AddAndSub';
import FixedValue from '@/components/condition-tree/FixedValue';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import dimensionService from '@/api/system/config2/dimensionService';
import tablesService from '@/api/system/config2/tablesService';


const rtdTableColumns = [
    {
        title: '序号',
        dataIndex: 'sortNo',
        key: 'sortNo',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '标识',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '最大长度',
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue',
    },
    {
        title: '主键',
        dataIndex: 'isPk',
        key: 'isPk',
    },
    {
        title: '索引',
        dataIndex: 'isIndex',
        key: 'isIndex',
    },
    {
        title: '可为空',
        dataIndex: 'isNull',
        key: 'isNull',
    },
    {
        title: '分区字段',
        dataIndex: 'flagPartitionKey',
        key: 'flagPartitionKey',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

let dataTypeList = [];

class store {
    constructor() {
        this.getDetailsForApi = this.getDetailsForApi.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.addTempVar = this.addTempVar.bind(this);
        this.subTempVars = this.subTempVars.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.initTable = this.initTable.bind(this);
        this.getIsPartition = this.getIsPartition.bind(this);
        this.getDetailsByUpload = this.getDetailsByUpload.bind(this);


    }

    resultData = '';
    @observable id = '';
    @observable PKData = [];
    @observable sortNo = 0;
    @observable isHaveCommitBtn = false;
    @observable isCanCommit = false;
    @observable table = {
        rtdTable: {
            data: [],
            dataSource: [],
            columns: rtdTableColumns,
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
        type: 'table',
        version: '',
        approvalStatus: '',//此字段只用于判断能否提交，只作为依据，不传到api
    }
    @observable details = {
        data: {
            dateBaseType: 2,
            type: 'table',
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        }
    }
    @observable uploadDetails = {
        data: {
            dateBaseType: 2,
            type: 'table'
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

    @computed get getPKData() {
        return toJS(this.PKData)
    }

    @action setPKData(value) {
        this.PKData = value
    }

    @computed get getSortNo() {
        return toJS(this.sortNo)
    }

    @action setSortNo(value) {
        this.sortNo = value
    }


    getDetailsForApi() {
        // common.loading.show();
        tablesService.getTablesById(this.id).then(this.getDetailsForApiCallBack).catch(() => { /*common.loading.hide()*/
        })
    }

    getDetailsByUpload() {
        let uploadDataCopy = common.deepClone(this.uploadDetails.getData);
        console.log("getDetailsByUploadData",this.uploadDetails.getData);
        /* for (const key in this.details.getData) {
            let value =  this.details.getData[key];
            if(!common.isEmpty(value)){
                    uploadDataCopy.data.result[key] = value;
            }
        }*/
        this.getDetailsForApiCallBack(uploadDataCopy);
    }


    @action.bound getDetailsForApiCallBack(res) {
        let self = this;
        // common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.resultData = res.data.result;
        console.log("库表定义的数据：",this.resultData)
        this.details.setData(res.data.result);
        if (!common.isEmpty(res.data.result.rtdTableColumnEntities)) {
            let rtdTableColumnCopy = common.deepClone(res.data.result.rtdTableColumnEntities);
            this.setSortNo(rtdTableColumnCopy.length)
            if (!common.isEmpty(res.data.result.partitionKey)) {
                for (let i = 0; i < rtdTableColumnCopy.length; i++) {
                    if (rtdTableColumnCopy[i].code == res.data.result.partitionKey) {
                        rtdTableColumnCopy[i].flagPartitionKey = true;
                        self.resultData.isPartition = 1;
                        self.details.setData(self.resultData);
                    } else {
                        rtdTableColumnCopy[i].flagPartitionKey = false;
                    }
                }
            } else {
                rtdTableColumnCopy.forEach(element => {
                    element.key = common.getGuid();
                    element.flagPartitionKey = false;
                });
            }
            this.table.rtdTable.setData(rtdTableColumnCopy);
            this.getIsPartition();
            this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
        } else {
            this.table.rtdTable.setData([]);
            this.table.rtdTable.setDataSource([]);
        }
    }

    initTable() {
        this.table.rtdTable.setData([]);
        this.details.setData({
            dateBaseType: 1,
            type: 'table'
        });
        this.details.getData.partitionKey = '';
        this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
    }

    renderTable(list) {
        console.log("list", list)
        let tempArray = [];
        let flag = false;
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element1 = list[i];
            if (element1.isPk === 1) {
                flag = true;
            }
        }
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.isPk === true) {
                flag = true;
            }
            let uuid = common.getGuid();
            console.log("this.getSortNo",this.getSortNo);
            tempArray.push({
                key: uuid,
                sortNo: i + 1,
                name: <Input defaultValue={element.name} style={{width: '140px'}}
                             onChange={(e) => {
                                 if (isNaN(e.target.value)) {
                                     this.tableDataChange(i, 'name', e.target.value)
                                 } else {
                                     message.warn("字段信息-名称不能是纯数字")
                                     if (this.table.rtdTable.getData[i].name !== "")
                                         this.tableDataChange(i, 'name', e.target.value)
                                     // this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
                                 }
                             }}/>,
                code: <Input defaultValue={element.code} style={{width: '140px'}}
                             onChange={(e) => {
                                 let reg2 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                                 if (escape(e.target.value).indexOf("%u") < 0 && isNaN(e.target.value) && !reg2.test(e.target.value)) {
                                     this.tableDataChange(i, 'code', e.target.value)
                                 } else {
                                     message.warn("字段信息-编号不能是纯数字且不能有中文和特殊符号！")
                                     if (this.table.rtdTable.getData[i].code !== "")
                                         this.tableDataChange(i, 'code', e.target.value)
                                     // this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
                                 }
                                 /* if (isNaN(e.target.value)) {
                                      this.tableDataChange(i, 'code', e.target.value)
                                  } else {
                                      message.warn("字段信息-编号不能是纯数字")
                                      if(this.table.rtdTable.getData[i].code !=="")
                                          this.tableDataChange(i, 'code', '')
                                     this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
                                  }*/
                             }}/>,
                type: <Select defaultValue={element.type} style={{width: '109px'}}
                              onChange={(value) => this.tableDataChange(i, 'type', value)}>
                    {dataTypeList.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>,
                length: <InputNumber defaultValue={element.length} style={{width: '120px'}}
                                     disabled={element.type !== 12 ? true : false}
                                     onChange={(e) => {
                                         this.tableDataChange(i, 'length', e)
                                     }}/>,
                defaultValue: <FixedValue type="defaultValueForList" value={element.defaultValue}
                                          changeData={this.tableDataChange} dataType={element.type} index={i}
                                          style={{width: '170px'}}/>,
                isPk: <Checkbox defaultChecked={element.isPk == 1 ? true : false}
                                onChange={(e) => this.tableDataChange(i, 'isPk', e.target.checked)}/>,
                isIndex: <Checkbox defaultChecked={element.isIndex == 1 ? true : false}
                                   onChange={(e) => this.tableDataChange(i, 'isIndex', e.target.checked)}/>,
                isNull: <Checkbox defaultChecked={element.isNull == 1 ? true : false}
                                  onChange={(e) => this.tableDataChange(i, 'isNull', e.target.checked)}/>,
                flagPartitionKey: <Checkbox
                    defaultChecked={element.flagPartitionKey}
                    disabled={flag === false ? this.details.getData.isPartition === 1 && this.details.getData.dateBaseType === 1 ? false : true : this.details.getData.isPartition === 1 && this.details.getData.dateBaseType === 1 && element.isPk === 1 ? false : true}
                    onChange={(e) => this.tableDataChange(i, 'flagPartitionKey', e.target.checked)}/>,
                action: <a style={{color: '#ff2f05'}}><AddSub type="sub" sub={() => {
                    this.subTempVars(uuid)
                }}/></a>
            })
        }
        /*
                this.table.rtdTable.setData(tempArray);*/
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
                    value: element.label
                });
                dataTypeList = tempArray

            })
            if (this.id)
                this.getDetailsForApi();
        })
    }


    tableDataChange = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
        let tempData = common.deepClone(this.table.rtdTable.getData);
        let self = this;
        /*$("input").blur(function () {
            self.table.rtdTable.setDataSource(self.renderTable(self.table.rtdTable.getData))
        })*/
        if (name == 'isPk' || name == 'isIndex' || name == 'isNull') {
            if (value) {
                tempData[i][name] = 1;
                this.table.rtdTable.setDataSource(this.renderTable(tempData))
            } else {
                tempData[i][name] = 0;
                this.table.rtdTable.setDataSource(this.renderTable(tempData))
            }
        } else {
            tempData[i][name] = value;
            if (name === 'type') {
                tempData[i].defaultValue = "";
                this.table.rtdTable.setDataSource(this.renderTable(tempData))
            }
        }
        if (name === 'code') {
            tempData[i][name] = value.replace(/[^\w_]/g, '');
        }
        if (name === 'code' && tempData[i].flagPartitionKey == true) {
            tempData[i][name] = value.replace(/[^\w_]/g, '');
            this.details.getData.partitionKey = tempData[i].code;
        }
        this.table.rtdTable.setData(tempData);
        if (name == 'flagPartitionKey' && value == true) {
            this.details.getData.partitionKey = tempData[i].code;
            for (let a = 0; a < tempData.length; a++) {
                if (a != i) {
                    tempData[a].flagPartitionKey = false;
                }
            }
            this.table.rtdTable.setData(tempData);
            this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData))
        }
        if (name == 'isPk') {
            for (let i = 0; i < tempData.length; i++) {
                if (tempData[i].isPk == 0) {
                    tempData[i].flagPartitionKey = false;
                }
            }
            this.table.rtdTable.setData(tempData);
            this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData))
        }
        if (name == 'flagPartitionKey' && value == false) {
            this.details.getData.partitionKey = '';
            this.table.rtdTable.setData(tempData);
        }
        console.log("this.table.rtdTable.getData", this.table.rtdTable.getData)
        // this.getIsPartition();
    }

    subTempVars = (key) => {
        console.log("key", key)
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.table.rtdTable.getDataSource.length; i++) {
            const element = this.table.rtdTable.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }
        let a = this.table.rtdTable.getData;
        a.splice(arrayIndex, 1);
        this.table.rtdTable.setData(a)
        this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData))
        this.getIsPartition();

    }

    getIsPartition() {
        let tempData = common.deepClone(this.table.rtdTable.getData);
        let tempArray2 = [];
        let tempArray3 = [];
        tempData.forEach(element => {
            if (element.val == 16) return
            if (element.name !== '' && element.code !== '') {

                tempArray2.push({
                    code: element.code,
                    value: element.name
                });
                console.log("tempArray2", tempArray2)
                if (element.name !== '' && element.code !== '' && element.isPk === 1) {
                    tempArray3.push({
                        code: element.code,
                        value: element.name
                    });
                    console.log("tempArray3", tempArray3)
                }
            }
            if (tempArray3.length > 0) {
                this.setPKData(tempArray3)
            } else {
                this.setPKData(tempArray2)
            }
        })
    }

    addTempVar = () => {
        let tempArray = common.deepClone(this.table.rtdTable.getData);
        this.setSortNo(this.getSortNo + 1)
        tempArray.push({
            "name": "",
            "code": "",
            "sortNo": this.getSortNo,
            "type": "",
            "length": "",
            "defaultValue": "",
            "isPk": 0,
            "isIndex": 0,
            "isNull": 0,
            "flagPartitionKey": false
        })
        this.table.rtdTable.setData(tempArray);
        this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData))
    }
}

export default new store