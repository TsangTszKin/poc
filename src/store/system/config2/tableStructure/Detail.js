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
import {message, Modal, Switch, Checkbox, Input, Select, Icon} from 'antd';
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
    }
    ,
    {
        title: '分区字段',
        dataIndex: 'flagPartitionKey',
        key: 'flagPartitionKey',
    }
]

class store {
    constructor() {
        this.getDetailsForApi = this.getDetailsForApi.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
    }

    resultData = '';
    @observable id = '';
    @observable myType = '';
    @observable PKData = [];
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

    @computed get getMyType() {
        return toJS(this.myType)
    }

    @action setMyType(value) {
        this.myType = value
    }

    @computed get getPKData() {
        return toJS(this.PKData)
    }

    @action setPKData(value) {
        this.PKData = value
    }


    getDetailsForApi() {
        // common.loading.show();
        tablesService.getTablesById(this.id).then(this.getDetailsForApiCallBack).catch(() => { /*common.loading.hide()*/
        })
    }

    @action.bound getDetailsForApiCallBack(res) {
        // common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.resultData = res.data.result;
        this.details.setData(res.data.result);
        if (!common.isEmpty(res.data.result.rtdTableColumnEntities)) {
            let rtdTableColumnCopy = common.deepClone(res.data.result.rtdTableColumnEntities);
            if (!common.isEmpty(res.data.result.partitionKey)) {
                for (let i = 0; i < rtdTableColumnCopy.length; i++) {
                    if (rtdTableColumnCopy[i].code == res.data.result.partitionKey) {
                        rtdTableColumnCopy[i].flagPartitionKey = true;
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
            console.log("res.data.result.rtdTableColumnEntities", rtdTableColumnCopy)
            this.table.rtdTable.setData(rtdTableColumnCopy);
            // this.getIsPartition();
            console.log("this.table.rtdTable.getData", this.table.rtdTable.getData)
            this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
        } else {
            this.table.rtdTable.setData([]);
            this.table.rtdTable.setDataSource([]);
        }
    }


    renderTable(list) {
        console.log("list", list)
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                sortNo: i + 1,
                name: element.name,
                code: element.code,
                /* type: <div>
                     {dataTypeList.map((item, i) => {
                         console.log("item",element.type,item.value)
                         element.type === item.code ? 5:0;
                         }
                     )}
                 </div>
                 ,*/
                /* type: <Select defaultValue={element.type} style={{width: '109px'}}
                               onChange={(value) => this.tableDataChange(i, 'type', value)}>
                     {dataTypeList.map((item, i) =>
                         <div value={item.code}>{item.value}</div>
                     )}
                 </Select>,*/
                type: this.getDataTypeList(element.type),
                length: element.length,
                defaultValue: element.defaultValue
                ,
                isPk: <Checkbox defaultChecked={element.isPk == 1 ? true : false}
                                disabled={true}
                                onChange={(e) => this.tableDataChange(i, 'isPk', e.target.checked)}/>,
                isIndex: <Checkbox defaultChecked={element.isIndex == 1 ? true : false}
                                   disabled={true}
                                   onChange={(e) => this.tableDataChange(i, 'isIndex', e.target.checked)}/>,
                isNull: <Checkbox defaultChecked={element.isNull == 1 ? true : false}
                                  disabled={true}
                                  onChange={(e) => this.tableDataChange(i, 'isNull', e.target.checked)}/>,
                flagPartitionKey: <Checkbox
                    defaultChecked={element.flagPartitionKey}
                    disabled={true}
                    onChange={(e) => this.tableDataChange(i, 'flagPartitionKey', e.target.checked)}/>
            })
        }
        /*
                this.table.rtdTable.setData(tempArray);*/
        return tempArray
    }

    getDataTypeList(type) {
        let dataList = [{code: 12, value: 'string'}, {code: -5, value: 'long'}, {code: 4, value: 'int'}, {
            code: 3,
            value: 'double'
        }, {code: 93, value: 'datetime'}];
        let myType = '';
        for (let i = 0; i < dataList.length; i++) {
            if (type == dataList[i].code) {
                myType = dataList[i].value;
            }
        }
        return <div>{myType}</div>
    }
}

export default new store