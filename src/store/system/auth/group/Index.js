/*
 * @Author: zengzijian
 * @Date: 2018-12-18 09:13:58
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-24 15:38:57
 * @Description: 
 */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-inner-declarations */
import { observable, action, computed, toJS, autorun } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import groupService from '@/api/system/auth/groupService';
import memberService from '@/api/system/auth/memberService';
import TableAction from '@/components/system/auth/group/TableAction';
import React from 'react';
import { Avatar, message } from 'antd';

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 200
}, {
    title: '账号',
    dataIndex: 'account',
    key: 'account',
}, {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
}, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
}, {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
}];

class Store {
    constructor() {
        this.getListForApi = this.getListForApi.bind(this);
        this.saveForApi = this.saveForApi.bind(this);
        this.getGroupDetail = this.getGroupDetail.bind(this);
        this.deleteForApi = this.deleteForApi.bind(this);
        this.removeMemberForApi = this.removeMemberForApi.bind(this);
        this.renameForApi = this.renameForApi.bind(this);
        this.initMemberListParams = this.initMemberListParams.bind(this);
        this.dissolveTeamForApi = this.dissolveTeamForApi.bind(this);
        this.getPowerByTeamIdForApi = this.getPowerByTeamIdForApi.bind(this);
        this.changeAuthScope = this.changeAuthScope.bind(this);
        this.checkIsAuthForSwitch = this.checkIsAuthForSwitch.bind(this);
        this.changeAuthScopeAction = this.changeAuthScopeAction.bind(this);
        this.getMultiSelectValueForAuthScope = this.getMultiSelectValueForAuthScope.bind(this);
        this.powerAssignForTeamForApi = this.powerAssignForTeamForApi.bind(this);
        this.getNOTUserListByTeamIdForApi = this.getNOTUserListByTeamIdForApi.bind(this);
        this.optionUserFromTeamForApi = this.optionUserFromTeamForApi.bind(this);
        this.getUserListByTeamIdForApi = this.getUserListByTeamIdForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        autorun(() => {
            this.getListForApi();
        });
    }

    responseData = [];

    @observable loading = {
        group: true,
        member: true,
        get getGroup() { return toJS(this.group) },
        get getMember() { return toJS(this.member) },
        setGroup(value) { this.group = value },
        setMember(value) { this.member = value }
    }
    @observable data = {
        id: null,
        name: '',
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        setId(value) { this.id = value },
        setName(value) { this.name = value }
    }
    @observable table = {
        columns: columns,
        dataSource: [],
        get getColumns() { return toJS(this.columns) },
        get getDataSource() { return toJS(this.dataSource) },
        setColumns(value) { this.columns = value },
        setDataSource(value) { this.dataSource = value }
    }

    @observable list = [];// {"id": 1,"name": "默认","userCount": 1}
    @computed get getList() { return toJS(this.list) }
    @action.bound setList(value) { this.list = value }

    @observable modal = {
        groupAdd: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        groupSave: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        member: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        side: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        add: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        }
    }
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
        teamId: '',
        get getKeyword() { return toJS(this.keyword) },
        get getTeamId() { return toJS(this.teamId) },
        setKeyword(value) { this.keyword = value },
        setTeamId(value) { this.teamId = value }
    }
    @observable memberAdmin = {
        all: [],//all的元素和select的元素无重复
        select: [],
        selectBackup: [],
        get getAll() { return toJS(this.all) },
        get getSelect() { return toJS(this.select) },
        get getSelectBackup() { return toJS(this.selectBackup) },
        setAll(value) { this.all = value },
        setSelect(value) { this.select = value },
        setSelectBackup(value) { this.selectBackup = value }
    }
    @observable activeGroup = {
        id: null,
        name: '',
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        setId(value) { this.id = value },
        setName(value) { this.name = value }
    }
    @observable powerForTeam = {
        resourceTree: [],
        teamAuthVO: null,
        teamAuthVOBack: null,
        get getResourceTree() { return toJS(this.resourceTree) },
        get getTeamAuthVO() { return toJS(this.teamAuthVO) },
        get getTeamAuthVOBack() { return toJS(this.teamAuthVOBack) },
        setResourceTree(value) { this.resourceTree = value },
        setTeamAuthVO(value) { this.teamAuthVO = value },
        setTeamAuthVOBack(value) { this.teamAuthVOBack = value }
    }

    initMemberListParams() {
        this.page.setNum(1);
        this.page.setTotal(0);
        this.params.setKeyword('');
        this.params.setTeamId('');
    }

    getListForApi() {
        this.loading.setGroup(true);
        groupService.getList().then(this.getListForApiCallBack).catch(() => this.loading.setGroup(false))
    }
    @action.bound getListForApiCallBack(res) {
        this.loading.setGroup(false)
        if (!publicUtils.isOk(res)) return
        let list = res.data.result;
        //todo
        this.initParams();
        this.setList(list);
        this.initMemberListParams();
        if (!common.isEmpty(list)) {
            this.getUserListByTeamIdForApi(list[0].id, 1);
            this.activeGroup.setId(list[0].id);
            this.activeGroup.setName(list[0].name);
        } else {
            this.loading.setMember(false);
            this.table.setDataSource([]);
            this.activeGroup.setId('');
            this.activeGroup.setName('');
        }

    }

    saveForApi() {
        common.loading.show();
        let params = {
            name: this.data.getName,
            id: this.data.getId
        };
        if (common.isEmpty(this.data.getId))
            delete params.id
        groupService.save(params).then(this.saveForApiCallBack).catch(() => {
            common.loading.hide();
        });
    }
    @action.bound saveForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        //todo
        this.getListForApi();
    }

    getGroupDetail(id, name) {
        // common.loading.show();
        console.log(id, name);
        this.data.setId(id);
        this.data.setName(name);
        this.modal.groupSave.setIsShow(true);
    }

    deleteForApi(id) {
        common.loading.show();
        groupService.delete(id).then(this.deleteForApiCallBack).catch(() => {
            common.loading.hide();
        });
    }
    @action.bound deleteForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        //todo
    }

    removeMemberForApi(id) {
        common.loading.show();
        groupService.optionUserFromTeam([], [id], this.activeGroup.getId).then(this.removeMemberForApiCallBack).catch(() => { common.loading.hide() })
    }
    @action.bound removeMemberForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        //todo
        this.getUserListByTeamIdForApi(this.activeGroup.getId, 1);
    }

    renameForApi() {
        if (common.isEmpty(this.data.getId) || common.isEmpty(this.data.getName)) {
            message.warn("请输入正确的信息");
            return
        }
        common.loading.show();
        groupService.rename(this.data.getId, this.data.getName).then(this.renameForApiCallBack).catch(() => common.loading.hide());
    }
    @action.bound renameForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("修改成功");
        this.getListForApi();
    }

    getUserListByTeamIdForApi(teamId, type) {
        let params = {
            teamId: teamId,
            nickName: this.params.getKeyword,
            page: this.page.getNum,
            size: this.page.getSize,
            type: type
        }
        this.loading.setMember(true);
        memberService.getUserListByTeamId(params).then(this.getUserListByTeamIdForApiCallBack).catch(() => { this.loading.setMember(false) })
    }
    @action.bound getUserListByTeamIdForApiCallBack(res) {
        this.loading.setMember(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.pageList.resultList)) {
            this.responseData = common.deepClone(res.data.pageList.resultList);
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];


                dataList.push({
                    id: element.id,//组装数据要用到id
                    key: element.id,
                    name: <div >
                        <p style={{ width: 'fint-content', float: 'left' }}> <Avatar style={{ backgroundColor: '#ec7c31' }}>{common.isEmpty(element.nickName) ? '无' : element.nickName.substr(0, 1)}</Avatar></p>
                        <p style={{ width: 'fint-content', float: 'left', margin: '0 10px', height: '32px', lineHeight: '32px' }}>{element.nickName}</p>
                    </div>,
                    account: element.userName,
                    phone: element.mobile,
                    email: element.email,
                    action: <TableAction deleteOne={this.removeMemberForApi} dataId={element.id} />,
                });

            }
        } else {
            this.responseData = [];
        }

        this.page.setNum(res.data.pageList.sum === 0 ? this.page.getNum : ++res.data.pageList.curPageNO);
        this.page.setTotal(res.data.pageList.sum);
        this.table.setDataSource(dataList);
        this.memberAdmin.setSelect(dataList);
        this.memberAdmin.setSelectBackup(dataList);
        console.log("dataList", dataList)
    }

    getNOTUserListByTeamIdForApi() {
        let params = {
            userName: '',
            nickName: '',
            page: 1,
            size: 100
        }
        common.loading.show();
        memberService.getList(params).then(this.getNOTUserListByTeamIdForApiCallBack).catch(() => { common.loading.hide() })
    }
    @action.bound getNOTUserListByTeamIdForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.pageList.resultList)) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                element.key = element.id;
            }
            this.memberAdmin.setAll(res.data.pageList.resultList);
        } else {
            this.memberAdmin.setAll([]);
        }
    }

    dissolveTeamForApi(teamId) {
        common.loading.show();
        groupService.dissolveTeam(teamId).then(this.dissolveTeamForApiCallBack).catch(() => { common.loading.hide() })
    }
    @action.bound dissolveTeamForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("解散成功");
        this.getListForApi();
    }

    getPowerByTeamIdForApi(teamId) {
        common.loading.show();
        groupService.getPowerByTeamId(teamId).then(this.getPowerByTeamIdForApiCallBack).catch(() => { common.loading.hide() })
    }
    @action.bound getPowerByTeamIdForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        //todo
        this.modal.side.setIsShow(true);
        this.powerForTeam.setResourceTree(res.data.result.resourceTree);
        if (!common.isEmpty(res.data.result.teamAuthVO)) {
            this.powerForTeam.setTeamAuthVO(res.data.result.teamAuthVO);
            this.powerForTeam.setTeamAuthVOBack(res.data.result.teamAuthVO);
        } else {
            this.powerForTeam.setTeamAuthVO(null);
            this.powerForTeam.setTeamAuthVOBack(null);
        }
    }

    powerAssignForTeamForApi() {
        let params;
        if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {
            params = this.powerForTeam.getTeamAuthVO
        } else {
            message.warn("没有找到授权选项");
            return
        }
        common.loading.show();
        groupService.powerAssignForTeam(params).then(this.powerAssignForTeamForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound powerAssignForTeamForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
        this.getPowerByTeamIdForApi(this.activeGroup.getId);
    }

    /**
     * 改变菜单开关
     *
     * @param {string} menuId
     * @param {boolean} isChecked
     * @memberof Store
     */
    changeAuthScope(menuId, isChecked) {
        let params2 = common.deepClone(this.powerForTeam.getTeamAuthVO);//备份最新数据出来
        var self = this;
        if (isChecked) {//开
            if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {//有过授权记录
                console.log("开---有过授权记录");

                let params = params2;
                params.authScope[menuId] = {
                    "operates": [],
                    "resourceId": menuId,
                }
                this.powerForTeam.setTeamAuthVO(params);

            } else {//没有授权记录
                console.log("开---没有授权记录");
                let params = {
                    "name": this.activeGroup.getName,
                    "teamId": this.activeGroup.getId
                }
                let authScope = {}
                authScope[menuId] = {
                    "operates": [],
                    "resourceId": menuId,
                }
                params.authScope = authScope;
                this.powerForTeam.setTeamAuthVO(params);
                params2 = params;
            }

            //递归开启其所有父选项  --------   start
            if (!common.isEmpty(params2)) {
                for (let i = 0; i < this.powerForTeam.getResourceTree.length; i++) {
                    const element = this.powerForTeam.getResourceTree[i];

                    if (element.id == menuId) {
                        let parentId = element.parentId;
                        if (parentId != 0) {
                            onForParent(parentId);
                        }

                    } else {
                        if (!common.isEmpty(element.child))
                            findChildForParentId(element.child);
                    }
                }
                this.powerForTeam.setTeamAuthVO(params2);
            }
            function findChildForParentId(child) {
                child.forEach(element => {
                    if (element.id == menuId) {
                        let parentId = element.parentId;
                        if (parentId != 0) {
                            onForParent(parentId);
                        }

                    } else {
                        if (!common.isEmpty(element.child))
                            findChildForParentId(element.child);
                    }
                })
            }
            //递归开启其所有父选项  --------   end

            //递归开启其所有子选项  --------   start
            if (!common.isEmpty(params2)) {
                for (let i = 0; i < this.powerForTeam.getResourceTree.length; i++) {
                    const element = this.powerForTeam.getResourceTree[i];

                    if (element.id == menuId) {
                        params2.authScope[element.id] = {
                            "operates": [],
                            "resourceId": menuId,
                        }
                        if (!common.isEmpty(element.child)) {
                            element.child.forEach(element2 => {
                                onForChild(element2);
                            })
                        }
                    } else {
                        if (!common.isEmpty(element.child))
                            findChildForChild(element.child);
                    }
                }
                this.powerForTeam.setTeamAuthVO(params2);
            }
            function findChildForChild(child) {
                child.forEach(element => {
                    if (element.id == menuId) {
                        params2.authScope[element.id] = {
                            "operates": [],
                            "resourceId": menuId,
                        }
                        if (!common.isEmpty(element.child)) {
                            element.child.forEach(element2 => {
                                onForChild(element2);
                            })
                        }
                    } else {
                        if (!common.isEmpty(element.child))
                            findChildForChild(element.child);
                    }
                })
            }
            //递归开启其所有子选项  --------   end


        } else {//关

            if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {//有过授权记录
                console.log("关---有过授权记录");
                //递归关闭其所有子选项  --------   start
                if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {

                    for (let i = 0; i < this.powerForTeam.getResourceTree.length; i++) {
                        const element = this.powerForTeam.getResourceTree[i];
                        if (element.id == menuId) {
                            delete params2.authScope[element.id];
                            if (!common.isEmpty(element.child)) {
                                element.child.forEach(element => {
                                    offForChild(element);
                                });
                            }
                        } else {
                            if (!common.isEmpty(element.child))
                                findChildForChild2(element.child);
                        }
                    }
                    this.powerForTeam.setTeamAuthVO(params2);
                }
                function findChildForChild2(child) {
                    child.forEach(element => {
                        if (element.id == menuId) {
                            delete params2.authScope[element.id];
                            if (!common.isEmpty(element.child)) {
                                element.child.forEach(element => {
                                    offForChild(element);
                                });
                            }
                        } else {
                            if (!common.isEmpty(element.child))
                                findChildForChild2(element.child);
                        }
                    })
                }

                //递归关闭其所有子选项  --------   end



                let length = 0;
                let params = common.deepClone(this.powerForTeam.getTeamAuthVO);
                for (const key in this.powerForTeam.getTeamAuthVO.authScope) {
                    if (this.powerForTeam.getTeamAuthVO.authScope.hasOwnProperty(key)) {
                        length++;
                        if (key == menuId) {
                            delete params.authScope[key];
                        }
                    }
                }
                if (length <= 1) {
                    this.powerForTeam.setTeamAuthVO(null);//只有一条授权记录，直接清空授权vo
                } else {
                    this.powerForTeam.setTeamAuthVO(params);
                }



            } else {//没有授权记录(逻辑上暂且不存在此条件)
                console.log("关---没有授权记录");
                this.powerForTeam.setTeamAuthVO(null);
            }
        }



        function offForChild(oneChild) {
            for (const key in self.powerForTeam.getTeamAuthVO.authScope) {
                if (self.powerForTeam.getTeamAuthVO.authScope.hasOwnProperty(key)) {
                    if (key == oneChild.id) {
                        delete params2.authScope[key];

                        if (!common.isEmpty(oneChild.child)) {
                            oneChild.child.forEach(element => {
                                offForChild(element);
                            });
                        }
                    }
                }
            }
        }

        function onForParent(parentId) {

            // self.powerForTeam.getResourceTree.forEach(element => {
            //     if (element.id == parentId) {
            //         if (element.parentId != 0) {
            //             onForParent(element.parentId);
            //         }
            //     }
            // })

            self.powerForTeam.getResourceTree.forEach(element => {
                if (element.id == parentId) {
                    params2.authScope[parentId] = {
                        "operates": [],
                        "resourceId": parentId,
                    }
                    onForParent(element.parentId);
                } else {
                    element.child.forEach(element2 => {
                        if (element2.id == parentId) {
                            params2.authScope[element2.id] = {
                                "operates": [],
                                "resourceId": element2.id,
                            }
                            onForParent(element2.parentId);
                        }
                    })
                }
            })
        }


        function onForChild(oneChild) {
            params2.authScope[oneChild.id] = {
                "operates": [],
                "resourceId": oneChild.id,
            }
            if (!common.isEmpty(oneChild.child)) {
                oneChild.child.forEach(element => {
                    onForChild(element)
                })
            }
        }

        console.log("this.powerForTeam.getTeamAuthVO", this.powerForTeam.getTeamAuthVO);

    }

    /**
     * 判断单签菜单有否授权
     *
     * @param {*} menuId
     * @returns
     * @memberof Store
     */
    checkIsAuthForSwitch(menuId) {
        if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {//有过授权记录
            for (const key in this.powerForTeam.getTeamAuthVO.authScope) {
                if (this.powerForTeam.getTeamAuthVO.authScope.hasOwnProperty(key)) {
                    if (key == menuId) {
                        return true
                    }
                }
            }
            return false
        } else {
            return false
        }
    }

    /**
     * 选择授权可用功能的改变触发回调
     *
     * @param {string} menuId
     * @param {array} values
     * @memberof Store
     */
    changeAuthScopeAction(menuId, values) {
        if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {//有过授权记录
            let params = common.deepClone(this.powerForTeam.getTeamAuthVO);
            for (const key in this.powerForTeam.getTeamAuthVO.authScope) {
                if (this.powerForTeam.getTeamAuthVO.authScope.hasOwnProperty(key)) {
                    if (key == menuId) {
                        params.authScope[menuId].operates = values;
                        this.powerForTeam.setTeamAuthVO(params);
                        console.log("changeAuthScopeAction success", params);
                    }
                }
            }
        }
    }

    /**
     * 根据菜单获取当前授权域的可用功能下拉值
     *
     * @param {*} menuId
     * @returns
     * @memberof Store
     */
    getMultiSelectValueForAuthScope(menuId) {
        if (!common.isEmpty(this.powerForTeam.getTeamAuthVO)) {//有过授权记录
            for (const key in this.powerForTeam.getTeamAuthVO.authScope) {
                if (this.powerForTeam.getTeamAuthVO.authScope.hasOwnProperty(key)) {
                    if (key == menuId) {
                        return this.powerForTeam.getTeamAuthVO.authScope[menuId].operates;
                    }
                }
            }
        } else {
            return [];
        }
    }

    optionUserFromTeamForApi() {

        console.log(this.memberAdmin.getSelect, this.memberAdmin.getSelectBackup);

        let addUserIds = [];
        let removeUserIds = [];

        let selectBackupUserIds = [];
        this.memberAdmin.getSelectBackup.forEach(element => {
            selectBackupUserIds.push(element.id);
        })

        let selectUserIds = [];
        this.memberAdmin.getSelect.forEach(element => {
            selectUserIds.push(element.id);
        })

        //找出新增的数据
        selectUserIds.forEach(element => {
            if (selectBackupUserIds.indexOf(element) == -1) {
                addUserIds.push(element);
            }
        })

        //找出移除的数据
        selectBackupUserIds.forEach(element => {
            if (selectUserIds.indexOf(element) == -1) {
                removeUserIds.push(element);
            }
        })

        console.log(addUserIds, removeUserIds);
        // return

        common.loading.show();
        groupService.optionUserFromTeam(addUserIds, removeUserIds, this.activeGroup.getId).then(this.optionUserFromTeamForApiCallBack).catch(() => { common.loading.hide() })
    }
    @action.bound optionUserFromTeamForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("操作成功");
        this.getUserListByTeamIdForApi(this.activeGroup.getId, 1);
    }

    initParams() {
        this.page.setNum(1);
        this.page.setSize(10);
        this.page.setTotal(0);
        this.params.setKeyword('');
    }

}
export default new Store
