/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-26 16:29:37
 * @Description: 
 */
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/batch/Batch';
import PageHeader from '@/components/PageHeader';
import { Table, Spin, message, Icon, Button } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/business/variable/batch/PageToolBar2';
import PageToolBar2 from '@/components/business/variable/batch/PageToolBar3';
import dimensionService from '@/api/system/config2/dimensionService';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { withRouter } from "react-router-dom";
import { inject } from "mobx-react/index";
import MultiControl from "@/components/common/MultiControl";

@withRouter
@inject('GlobalStore')
@observer
class Batch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectData: []
        }
        this.changePage = this.changePage.bind(this);
        // this.modalAddOkCallBack = this.modalAddOkCallBack.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.multiOnline = this.multiOnline.bind(this);
        this.multiOffline = this.multiOffline.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.getDimensionList = this.getDimensionList.bind(this);
    }

    componentDidMount() {
        this.getDimensionList();
        store.initParams();
        store.getDataSourceForApi();
    }

    multiDelete() {
        var ids = [];
        for (let i = 0; i < store.resultDataList.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(store.resultDataList[i]);
                    ids.push(row.id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }

        common.loading.show();
        variableService.deleteBatchVar(ids).then(res => {
            common.loading.hide();
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
        }).catch(() => {
            common.loading.hide();
        })
    }

    multiOnline() {
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
        variableService.changeBatchVar(ids, true).then(res => {
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
        variableService.changeBatchVar(ids, false).then(res => {
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

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        var query = {
            name: keyword,
            code: keyword,
            category: selectValue
        }
        store.setPageNum(1);
        store.setQuery(query);
        store.getDataSourceForApi();
    }

    /* modalAddOkCallBack = () => {
         this.props.history.push('/business/variable/batch/save')
     }*/

    getDimensionList() {
        var self = this;
        dimensionService.getDimensionNameList().then(res => {
            if (!publicUtils.isOk(res)) return
            let dataList = [{ code: '', value: '所有' }];
            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                let data = {};
                data.value = element.name;
                data.code = element.rtdDimensionId;
                dataList.push(data);
            }
            self.setState({
                selectData: dataList
            });
        });
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
            }
        }, {
            title: '维度',
            dataIndex: 'dimensionName',
            key: 'dimensionName'
        }, {
            title: '数据类型',
            dataIndex: 'typeLabel',
            key: 'typeLabel'
        }, {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue'
        },
        {
            title: '类别',
            dataIndex: 'categoryLabel',
            key: 'categoryLabel'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 80,
        }];
        if (!publicUtils.isAuth('business:variable:batch:deploy')) {
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
            { label: '删除', callback: () => this.multiDelete(), auth: publicUtils.isAuth("business:variable:batch:delete"), confirmIcon: <Icon type="close-circle" style={{ color: '#f00' }} /> },
        ];

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} />
                    <div className="pageContent">
                        <PageToolBar
                            selectName="选择维度"
                            categoryType="category_batch"
                            selectData={this.state.selectData}
                            searchPlaceholder="输入名称或标识查询"
                        >
                            {
                                publicUtils.isAuth("business:variable:batch:edit") ?
                                    <Button
                                        type="primary"
                                        style={{ float: 'right' }}
                                        onClick={() => this.props.history.push({ pathname: '/business/variable/batch/save' })}
                                    >
                                        新建变量
                                    </Button>
                                    : ''
                            }
                            <MultiControl
                                style={{ float: 'right', margin: '4px 20px 0 0' }}
                                items={menuItems}
                                selectedKeys={store.getSelectedRowKeys}
                                showConfirm={true}
                            />
                        </PageToolBar>
                        <PageToolBar2 type="rule" selectName="选择维度" categoryType="category_batch"
                            selectData={this.state.selectData} selectName2="选择类别"
                            searchPlaceholder="输入名称或标识查询"
                        >
                            {publicUtils.isAuth("business:variable:batch:edit") ?
                                <div style={{ width: '280px' }}>
                                    <Button
                                        type="primary"
                                        style={{ float: 'right' }}
                                        onClick={() => this.props.history.push({ pathname: '/business/variable/batch/save' })}
                                    >
                                        新建变量
                                    </Button>
                                    <MultiControl
                                        style={{ float: 'right', margin: '4px 20px 0 0' }}
                                        items={menuItems}
                                        selectedKeys={store.getSelectedRowKeys}
                                        showConfirm={true}
                                    />
                                </div>

                                : ''
                            }
                        </PageToolBar2>
                        {/*<PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入变量名或标识查询"></PageToolBar>*/}
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                scroll={{ x: store.getDataSource.length > 0 ? 1100 : 'auto' }}
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={store.getDataSource}
                                pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize}
                            changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Batch