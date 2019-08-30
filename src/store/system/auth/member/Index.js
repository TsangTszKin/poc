/*
 * @Author: zengzijian
 * @Date: 2019-08-24 09:40:29
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-24 15:37:15
 * @Description: 
 */
import { observable, action, computed, toJS, autorun } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import memberService from '@/api/system/auth/memberService';
import TableAction from '@/components/system/auth/member/TableAction';
import React from 'react';
import { Avatar, message } from 'antd';
import organizationService from '@/api/system/auth/organizationService';

const columns = [{
    title: '姓名',
    dataIndex: 'nickName',
    key: 'nickName',
}, {
    title: '账号',
    dataIndex: 'userName',
    key: 'userName',
}, {
    title: '手机',
    dataIndex: 'mobile',
    key: 'mobile',
}, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
}, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 80
}];

class Store {
    constructor() {
        this.saveForApi = this.saveForApi.bind(this);
        this.getDetailForApi = this.getDetailForApi.bind(this);
        this.getListForApi = this.getListForApi.bind(this);
        this.deleteMemberForApi = this.deleteMemberForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.resetPasswordForApi = this.resetPasswordForApi.bind(this);
        this.getOrgListForApi = this.getOrgListForApi.bind(this);
        autorun(() => {
            // this.getListForApi();
        });

    }

    @observable isLoading = true;
    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value }

    @observable modal = {
        info: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        save: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        resetPassword: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        }
    }

    @observable data = {
        "email": null,
        "mobile": null,
        "nickName": null,
        "userName": null
    }
    @computed get getData() { return toJS(this.data) }
    @action setData(value) { this.data = value }

    @observable page = {
        num: 1,
        size: 10,
        total: 0,
        get getNum() { return toJS(this.num) },
        get getSize() { return toJS(this.size) },
        get getTotal() { return toJS(this.total) },
        setNum(value) { this.num = value },
        setSize(value) { this.size = value },
        setTotal(value) { this.total = value }
    }

    @observable params = {
        keyword: '',
        get getKeyword() { return toJS(this.keyword) },
        setKeyword(value) { this.keyword = value }
    }

    @observable table = {
        columns: columns,
        dataSource: [],
        get getColumns() { return toJS(this.columns) },
        get getDataSource() { return toJS(this.dataSource) },
        setColumns(value) { this.columns = value },
        setDataSource(value) { this.dataSource = value }
    }

    @observable reset = {
        userId: '',
        password: '',
        get getUserId() { return toJS(this.userId) },
        get getPassword() { return toJS(this.password) },
        setUserId(value) { this.userId = value },
        setPassword(value) { this.password = value }
    }

    @observable orgList = {
        data: [],
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value }
    }

    saveForApi = () => {
        common.loading.show();
        // let params = {
        //     name: this.data.getName,
        //     account: this.data.getAccount,
        //     phone: this.data.getPhone,
        //     email: this.data.getEmail,
        // }
        // if (!common.isEmpty(this.data.getId))
        //     params.id = this.data.getId;
        memberService.save(this.getData).then(this.saveForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound saveForApiCallBack = (res) => {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
        this.modal.save.setIsShow(false);
        this.getListForApi();
    }

    getDetailForApi = (id) => {
        common.loading.show();
        memberService.getDetail(id).then(this.getDetailForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getDetailForApiCallBack = (res) => {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        this.setData(data);
        this.modal.save.setIsShow(true);
    }

    getListForApi = () => {
        this.setIsLoading(true);
        let params = {
            userName: this.params.getKeyword,
            nickName: this.params.getKeyword,
            page: this.page.getNum,
            size: this.page.getSize
        }
        memberService.getList(params).then(this.getListForApiCallBack);
    }
    @action.bound getListForApiCallBack = (res) => {
        if (!publicUtils.isOk(res)) return
        let dataSource = [];
        //todo
        for (let i = 0; i < res.data.pageList.resultList.length; i++) {
            const element = res.data.pageList.resultList[i];
            let temp = common.deepClone(element);
            temp.key = i;
            temp.nickName = <div >
                <p style={{ width: 'fint-content', float: 'left', margin: '0' }}> <Avatar style={{ backgroundColor: '#ec7c31' }}>{common.isEmpty(element.nickName) ? '无' : element.nickName.substr(0, 1)}</Avatar></p>
                <p style={{ width: 'fint-content', float: 'left', margin: '0 10px', height: '32px', lineHeight: '32px' }}>{element.nickName}</p>
            </div>;
            temp.action = <TableAction deleteOne={this.deleteMemberForApi} dataId={element.id} />;
            dataSource.push(temp);
        }
        this.table.setDataSource(dataSource);
        this.page.setNum(res.data.pageList.sum === 0 ? this.page.getNum : ++res.data.pageList.curPageNO);
        this.page.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
    }

    getOrgListForApi() {
        organizationService.getList().then(this.getOrgListForApiCallBack)
    }

    @action.bound getOrgListForApiCallBack(res) {
        if (common.isEmpty(res.data.pageList.resultList)) {
            this.orgList.setData([]);
        } else {
            this.orgList.setData(res.data.pageList.resultList);
        }
    }

    deleteMemberForApi(id) {
        common.loading.show();
        memberService.delete(id).then(this.deleteMemberForApiCallBack).catch(() => {
            common.loading.hide();
        })
    }
    @action.bound deleteMemberForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        //todo
        this.getListForApi();
    }

    resetPasswordForApi() {
        common.loading.show();
        memberService.resetPassword(this.reset.getUserId, this.reset.getPassword).then(this.resetPasswordForApiCallBack).catch(() => {
            common.loading.hide();
        })
    }
    @action.bound resetPasswordForApiCallBack(res) {
        common.loading.hide();
        this.modal.resetPassword.setIsShow(false);
        if (!publicUtils.isOk(res)) return
        this.reset.setPassword('');
    }

    initParams() {
        this.page.setNum(1);
        this.page.setSize(10);
        this.page.setTotal(0);
        this.params.setKeyword('');
    }


}
export default new Store