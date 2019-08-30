/*
 * @Author: liuzhuolin
 * @Date: 2019-04-26 14:49:52
 * @LastEditors: liuzhuolin
 * @LastEditTime: 2019-04-26 14:49:52
 * @Description: 
 */
import {observable, action, computed, toJS} from 'mobx';
import dimensionService from '@/api/system/config2/dimensionService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import TableAction from '@/components/system/config2/dimensionConfig/TableAction';
import React from 'react';
import {message} from 'antd';
import ReleaseStatus2 from '@/components/system/config2/dimensionConfig/Status';

class store {

    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.getResultDetailForApi = this.getResultDetailForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.init = this.init.bind(this);
        this.multiControl = this.multiControl.bind(this);
    }


    resultDataList = [];
    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = {name: '', code: ''};
    @observable selectedRowKeys = [];

    @observable saveData = {
        id: null,
        name: "",
        code: "",
        status: "",
        description: "",
        createdUser: "",
        modifiedTime: "",
        get getId() {
            return toJS(this.id)
        },
        setId(value) {
            this.id = value
        },
        get getName() {
            return toJS(this.name)
        },
        setName(value) {
            this.name = value
        },
        get getCode() {
            return toJS(this.code)
        },
        setCode(value) {
            this.code = value
        },
        get getStatus() {
            return toJS(this.status)
        },
        setStatus(value) {
            this.status = value
        },
        get getDescription() {
            return toJS(this.description)
        },
        setDescription(value) {
            this.description = value
        },
        get getCreatedUser() {
            return toJS(this.createdUser)
        },
        setCreatedUser(value) {
            this.createdUser = value
        },
        get getModifiedTime() {
            return toJS(this.modifiedTime)
        },
        setModifiedTime(value) {
            this.modifiedTime = value
        },
        init() {
            this.id = null;
            this.name = '';
            this.code = '';
            this.description = '';
            this.createdUser = '';
        }
    }


    @observable isShowModal = false;

    @computed get getIsShowModal() {
        return toJS(this.isShowModal)
    }

    @action.bound setIsShowModal(value) {
        this.isShowModal = value
    }

    @computed get getQuery() {
        return toJS(this.query)
    }

    @action.bound setQuery(value) {
        this.query = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getDataSource() {
        return toJS(this.dataSource)
    }

    @action.bound setDataSource(value) {
        this.dataSource = value;
    }

    @computed get getTotal() {
        return toJS(this.total)
    }

    @action.bound setTotal(value) {
        this.total = value;
    }

    @computed get getPageNum() {
        return toJS(this.pageNum)
    }

    @action.bound setPageNum(value) {
        this.pageNum = value;
    }

    @computed get getPageSize() {
        return toJS(this.pageSize)
    }

    @action.bound setPageSize(value) {
        this.pageSize = value;
    }

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

    initParams() {
        this.setQuery({name: '', code: ''});
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(0);
    }
    init(){
        this.saveData.setStatus('');
    }

    getDataSourceForApi() {
        dimensionService.getDimensionConfigList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }

    @action.bound getDataSourceForApiCallback(res) {
        this.resultDataList = common.deepClone(res.data.pageList.resultList);
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        this.setSelectedRowKeys([]);
        if (!common.isEmpty(res.data.pageList.resultList)) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = element;
                data.index = i + 1;
                data.key = i;
                if (!common.isEmpty(data.name)) {
                    if (data.name.length > 20) {
                        data.name = String(data.name).substr(0, 20) + '...';
                    }
                }
                if (!common.isEmpty(data.defaultValue)) {
                    if (data.defaultValue.length > 20) {
                        data.defaultValue = String(data.defaultValue).substr(0, 20) + '...';
                    }
                }
                data.status = <div style={{width: '170px'}}>
                    <ReleaseStatus2 status={element.status}
                                    style={{float: 'left'}}/>
                </div>,
                    data.action = <TableAction dataId={element.id} deleteOne={this.deleteOne} status={element.status}
                                               editPath={'/business/strategy/output/save/' + element.id}/>;
                dataList.push(data);
            }
        } else {
            this.resultDataList = [];
            /*if (this.page.getNum > 1) {
            }*/
        }

        this.setPageNum(res.data.pageList.sum === 0 ? this.getPageNum : ++res.data.pageList.curPageNO);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);

    }

    multiControl(option) {
        var ids = [];
        for (let i = 0; i < this.resultDataList.length; i++) {
            for (let j = 0; j < this.getSelectedRowKeys.length; j++) {
                const element = this.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(this.resultDataList[i]);
                    ids.push(row.id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        if (option === '删除') {
            // 可通过改接口对批量操作优化
            common.loading.show();
            dimensionService.deleteOneDimensionConfig(ids).then(res => {
                common.loading.hide();
                this.getDataSourceForApi();
                this.setSelectedRowKeys([]);
                if (!publicUtils.isOk(res)) return
                message.success("删除成功");
            }).catch(() => {
                common.loading.hide();
            })
        }
    };

    deleteOne(ids) {
        common.loading.show();
        dimensionService.deleteOneDimensionConfig(ids).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
            this.getDataSourceForApi();
            this.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })
    }

    getResultDetailForApi(id) {
        common.loading.show();
        dimensionService.getDimensionConfigById(id).then(this.getResultDetailForApiCallback)
    }

    @action.bound getResultDetailForApiCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        this.saveData.setId(data.id);
        this.saveData.setName(data.name);
        this.saveData.setStatus(data.status);
        this.saveData.setCode(data.code);
        this.saveData.setDescription(data.description);
        if (data.value) {
            this.saveData.setValue(data.value);
        }
        this.setIsShowModal(true);
    }

    @action.bound saveResult() {
        let params = {
            id: this.saveData.getId,
            code: this.saveData.getCode,
            description: this.saveData.getDescription,
        }
        common.loading.show();
        dimensionService.saveDimensionConfig(params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.getDataSourceForApi();
            this.setIsShowModal(false);
        }).catch(res => {
            common.loading.hide();
        })
    }

}

export default new store