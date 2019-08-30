import {action, computed, flow, observable, toJS} from "mobx";
import common from "@/utils/common";
import React from "react";
import {Tree} from "antd";
import moment from 'moment';

const { TreeNode } = Tree;

const data1 = [{
    time: '10:00',
    count: 2200
}, {
    time: '11:00',
    count: 3200
}, {
    time: '12:00',
    count: 3300
}, {
    time: '13:00',
    count: 2500
}, {
    time: '14:00',
    count: 2200
}, {
    time: '15:00',
    count: 3300
}, {
    time: '16:00',
    count: 3400
}];

const menuLayout = [
    {
        title: '事件源',
        children: [
            {
                title: '规则',
                children: [
                    {
                        title: '规则1'
                    },
                    {
                        title: '规则2'
                    },
                    {
                        title: '规则3'
                    },
                    {
                        title: '规则4'
                    },
                ]
            },
            {
                title: '决策流',
                children: [
                    {
                        title: '决策流1'
                    },
                    {
                        title: '决策流2'
                    },
                    {
                        title: '决策流3'
                    },
                    {
                        title: '决策流4'
                    },
                ]
            },
        ],
    },
];

const loop = data =>
    data.map(item => {
        if (item.children) {
            return (
                // 父节点不可选
                <TreeNode title={item.title} selectable={false}>
                    {loop(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.title} isLeaf />;
    });

class Store {
    @observable menu = {
        _list: [],
        _selectedKeys: [],
        _expandedKeys: [],
        _isLoading: true,
        _selectedItem: {},
        get selectedItem() { return toJS(this._selectedItem) },
        setSelectedItem(value) { this._selectedItem = value; },
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value; },
        get expandedKeys() { return toJS(this._expandedKeys) },
        setExpandedKeys(value) { this._expandedKeys = value; },
        get selectedKeys() { return toJS(this._selectedKeys) },
        setSelectedKeys(value) { this._selectedKeys = value; },
        get list() { return toJS(this._list) },
        setList(value) { this._list = value; },
    }

    @observable _strategyInfo = {};
    @computed get strategyInfo() { return toJS(this._strategyInfo) }
    @action.bound setStrategyInfo(value) { this._strategyInfo = value; }

    @observable _isInfoLoading = false;
    @computed get isInfoLoading() { return toJS(this._isInfoLoading) }
    @action.bound setIsInfoLoading(value) { this._isInfoLoading = value; }

    @observable chart = {
        _type: '',
        _timeStart: moment(new Date()),
        _timeEnd: moment(new Date()),
        _dataType: 0,
        _data: [],
        get data() { return toJS(this._data) },
        setData(value) { this._data = value; },
        get dataType() { return toJS(this._dataType) },
        setDataType(value) { this._dataType = value; },
        get timeEnd() { return toJS(this._timeEnd) },
        setTimeEnd(value) { this._timeEnd = value; },
        get timeStart() { return toJS(this._timeStart) },
        setTimeStart(value) { this._timeStart = value; },
        get type() { return toJS(this._type) },
        setType(value) { this._type = value; },
    }

    getMenuLayout = () => {
        this.menu.setList(menuLayout);

        if(!common.isEmpty(menuLayout)) {
            // 默认选中
            const selectedKeys = '0-0-0-0';
            this.menu.setSelectedKeys([selectedKeys]);
            let selectedKeysArr = selectedKeys.split('-');
            // 设置你要展开的
            let expendKeys = [];
            for(let i=2;i<selectedKeysArr.length;i++) {
                expendKeys.push(selectedKeysArr.slice(0, i).join('-'));
            }
            // console.log(expendKeys);
            this.menu.setExpandedKeys(expendKeys);
            const title = this.getSelectedTitle(this.menu.list, selectedKeys);
            this.menu.setSelectedTitle(title);
        }
    }

    getSelectedTitle = (data, selectedKeys) => {
        if(common.isEmpty(data)) return ;
        let title;
        let keyArr = selectedKeys.split('-').slice(1);
        let temp = data[keyArr[0]];
        for(let i=1;i<keyArr.length;i++) {
            // 假设有selectedKeys就是有children
            temp = temp.children[keyArr[i]];
        }
        title = temp.title;
        return title;
    }
}

export default new Store;