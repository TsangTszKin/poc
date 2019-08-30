/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:11:37
 * @Description: 
 */
import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/Event'
import PageHeader from '@/components/PageHeader';
import {Table, message, Spin} from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { Modal } from "antd/lib/index";
import MultiControl from "@/components/common/MultiControl";

@observer
class Event extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.multiOnline = this.multiOnline.bind(this);
        this.multiOffline = this.multiOffline.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.getEventSourceSelectList = this.getEventSourceSelectList.bind(this);
        this.state = {
            selectData: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.getEventSourceSelectList();
        store.initParams();
        store.getDataSourceForApi();
    }

    getEventSourceSelectList() {
        var self = this;
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) return
            let dataList = [{ code: '', value: '所有' }];
            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                let data = {};
                data.value = element.eventSourceName;
                data.code = element.eventSourceId;
                dataList.push(data);
            }
            self.setState({
                selectData: dataList
            });
        });
    }

    multiOnline() {
        var ids = [];
        for (let i = 0; i < store.getDataSource.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i) {
                    ids.push(store.getDataSource[i].id);
                }
                //console.log("store.getDataSource[i]====",store.getDataSource[i])
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        } else {
            for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < store.getDataSource.length; j++) {
                    if (ids[i] == store.getDataSource[j].id) {
                        if (store.getDataSource[j].statusNumber == 4) {
                            message.warn("不能勾选已上线的变量");
                            return;
                        }
                    }
                }
            }
        }
        common.loading.show();
        variableService.changeEventVarStatus(ids, "online").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })

    }

    multiOffline() {
        var ids = [];
        for (let i = 0; i < store.getDataSource.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i) {
                    ids.push(store.getDataSource[i].id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        variableService.changeEventVarStatus(ids, "offline").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })
    }

    /**
     * 表格排序变化回调
     */
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);

        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
    }

    showConfirm(type) {
        let title;
        let self = this;
        switch (type) {
            case '1':
                title = "上线";
                break;
            case '2':
                title = "下线";
                break;

            default:
                break;
        }
        Modal.confirm({
            title: '确定批量' + title + '?',
            content: '',
            onOk() {
                console.log('OK');
                switch (type) {
                    case '1':
                        self.multiOnline();
                        break;
                    case '2':
                        self.multiOffline();
                        break;
                    default:
                        break;
                }
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        var query = {
            name: keyword,
            code: keyword,
            eventSourceId: selectValue
        }
        store.setPageNum(1);
        store.setQuery(query);
        store.getDataSourceForApi();
    }

    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => {
                return a.code.localeCompare(b.code)
            },
            // sorter: (a, b) => a.code - b.code,
        }, {
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '数据类型',
            dataIndex: 'typeLabel',
            key: 'typeLabel'
        }, {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        }, {
            title: '状态',
            dataIndex: 'statusLabel',
            key: 'statusLabel'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        }];
        if (!publicUtils.isAuth('business:variable:event:deploy')) {
            columns.splice(columns.length - 1, 1);
        }
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        let menuItems = [
            { label: '上线', callback: () => this.multiOnline(), auth: publicUtils.isAuth("business:variable:batch:deploy") },
            { label: '下线', callback: () => this.multiOffline(), auth: publicUtils.isAuth("business:variable:batch:deploy") },
             ];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择事件源" categoryType="eventSource" changeToolBar={this.changeToolBar} selectData={this.state.selectData} searchPlaceholder="输入名称或标识查询">
                            {/*{publicUtils.isAuth("business:variable:event:edit") ?
                                multiActionComponent
                                : ''
                            }*/}
                            {publicUtils.isAuth("business:variable:batch:edit") ?
                                <MultiControl
                                    style={{float: 'right', margin: '4px 20px 0 0'}}
                                    items={ menuItems }
                                    selectedKeys={ store.getSelectedRowKeys }
                                    showConfirm={ true }
                                />
                                : ''
                            }
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table scroll={{ x: store.getDataSource.length > 0 ? 1100 : 'auto' }} rowSelection={rowSelection} columns={columns} dataSource={store.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Event