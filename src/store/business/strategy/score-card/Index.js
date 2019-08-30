import {action, computed, flow, observable, toJS} from "mobx";
import React from "react";
import strategyService from '@/api/business/strategyService';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import commonService from '@/api/business/commonService';
import {message} from "antd";

class Store {
    constructor() {
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.getTemplateListForApi = this.getTemplateListForApi.bind(this);
        this.saveTemplateForApi = this.saveTemplateForApi.bind(this);
        this.downloadTemplate = this.downloadTemplate.bind(this);

    }

    @observable _dataSource = [];
    @observable versionList = [];
    @observable templateList = [];

    //下面的暂时没有用，code和更新时间的排序暂时还是按照当页排序
    @observable sort = '';//ascend升，descend降
    @observable sortType = '';//code ,modifiedTime
    @observable filteredInfo = [];
    @observable filteredInfo2 =  [];

    @computed get getSort() {
        return toJS(this.sort)
    }

    @action.bound setSort(value) {
        this.sort = value;
    }

    @computed get getSortType() {
        return toJS(this.sortType)
    }

    @action.bound setSortType(value) {
        this.sortType = value;
    }

    @computed get getFilteredInfo() {
        return toJS(this.filteredInfo)
    }

    @action.bound setFilteredInfo(value) {
        this.filteredInfo = value;
    }

    @computed get getFilteredInfo2() {
        return toJS(this.filteredInfo2)
    }

    @action.bound setFilteredInfo2(value) {
        this.filteredInfo2 = value;
    }

    @computed get dataSource() {
        return toJS(this._dataSource)
    }

    @action.bound setDataSource(value) {
        this._dataSource = value;
    }

    @computed get getVersionList() {
        return toJS(this.versionList)
    }

    @action.bound setVersionList(value) {
        this.versionList = value
    }

    @computed get getTemplateList() {
        return toJS(this.templateList)
    }

    @action setTemplateList(value) {
        this.templateList = value
    }

    @observable templateVO = {
        data: {
            "authorizationType": 0,//模板所有权 0:私有 1:公有 2:导出为文件
            "description": "",
            "id": "",
            "name": "",
            "type": 7//模板类型 0:实时查询变量 1:衍生变量 2:规则 3:规则集 4:策略
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

    @observable useTimesTree = {
        times: '',
        data: {},
        show: false,
        get getTimes() {
            return toJS(this.times)
        },
        setTimes(value) {
            this.times = value
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value;
        },
        get getShow() {
            return toJS(this.show)
        },
        setShow(value) {
            this.show = value;
        }
    }

    @observable modal = {
        version: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false
            },
        },
        shareTemplate: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false
            },
        },
        useTemplate: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false;
            },
        },
        importZIP: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false;
            },
        }
    }
    @observable pagination = {
        _page: 1,
        _pageSize: 10,
        _total: 0,
        get total() {
            return toJS(this._total)
        },
        setTotal(value) {
            this._total = value;
        },
        get pageSize() {
            return toJS(this._pageSize)
        },
        setPageSize(value) {
            this._pageSize = value;
        },
        get page() {
            return toJS(this._page)
        },
        setPage(value) {
            this._page = value;
        },
        init() {
            this.setPage(1);
            this.setPageSize(10);
            this.setTotal(0);
        }
    };

    getUseTimesTreeForApi(type, id, quoteSum) {
        this.useTimesTree.setData({});
        this.useTimesTree.setTimes(quoteSum);
        common.loading.show();
        switch (type) {
            case 'rtq':
                variableService.getRtqUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'rule':
                strategyService.getRuleUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'strategy':
                strategyService.getStrategyUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'scoreCard':
                strategyService.getScoreCardUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            default:
                break;
        }
    }

    @action.bound getUseTimesTreeForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let data = res.data.result;
        this.formatUseTimesTree(data);
        this.useTimesTree.setData(data);
        this.useTimesTree.setShow(true);
    }

    formatUseTimesTree(obj) {
        obj.collapsed = false;
        delete obj.id;
        obj.name = obj.name + this.getType(obj.type);
        delete obj.type;
        if (!common.isEmpty(obj.nodes)) {
            obj.children = obj.nodes;
            delete obj.nodes;
            obj.children.forEach(element => {
                this.formatUseTimesTree(element);
            })
        }
    }

    downloadTemplate() {
        // console.log(666);
        let transplantVO = {
            id: this.templateVO.getData.id,
            type: 6
        }
        commonService.getExportZIP(transplantVO).then(this.exportCallBack)
    };

    @action.bound exportCallBack(res) {
        common.loading.hide();
        const type = 'application/zip'
        const blob = new Blob([res.data], {type: type})
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', this.templateVO.getData.name);
        document.body.appendChild(link);
        link.click();
        message.success('下载成功');
    }

    saveTemplateForApi() {
        common.loading.show();
        console.log("authorizationType", this.templateVO.getData.authorizationType)
        if (this.templateVO.getData.authorizationType == "2") {
            this.downloadTemplate();
        } else {
            commonService.saveTemplate(this.templateVO.getData).then(this.saveTemplateForApiCallBack)
        }
    }

    @action.bound saveTemplateForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('保存成功');
        this.modal.shareTemplate.hide();
    }

    getTemplateListForApi(type) {
        common.loading.show();
        commonService.getTemplateList('', '', {code: '', name: '', type: type})
            .then(this.getTemplateListForApiCallBack).catch(() => {
            common.loading.hide();
        })
    }

    @action.bound getTemplateListForApiCallBack(res) {
        common.loading.hide();
        this.modal.useTemplate.show();
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        res.data.pageList.resultList.forEach(element => {
            tempArray.push({
                name: element.name,
                id: element.id,
            })
        })
        this.setTemplateList(tempArray);
        console.log("this.getTemplateList", tempArray)
    }

    /* getImportZIP() {
         console.log("基于文件创建")
         common.loading.show();
         commonService.getImportZIP().then(this.getImportZIPCallBack).catch(() => {
             common.loading.hide();
         })
     }

     @action.bound getImportZIPCallBack(res) {
         common.loading.hide();
         if (!publicUtils.isOk(res)) return
     }*/

    getType(type) {
        let typeStr = '';
        switch (type) {
            case 'rtqVar':
                typeStr = '（实时查询变量）';
                break;
            case 'rtqVarV2':
                typeStr = '（实时查询变量）';
                break;
            case 'extVar':
                typeStr = '（衍生变量）';
                break;
            case 'rule':
                typeStr = '（规则）';
                break;
            case 'ruleSet':
                typeStr = '（规则集）';
                break;
            case 'strategy':
                typeStr = '（决策流）';
                break;
            case 'scoreCard':
                typeStr = '（评分卡）';
                break;
            case 'strategyPackage':
                typeStr = '（策略包）';
                break;
            default:
                break;
        }
        return typeStr
    }

}

export default new Store;