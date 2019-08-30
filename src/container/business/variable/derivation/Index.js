/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:08:32
 * @Description: 
 */
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/ext/Index';
import PageHeader from '@/components/PageHeader';
import { Table, Select, message, Spin, Icon } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar2';
import PageToolBar2 from '@/components/PageToolBar3';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import UseTimes from '@/components/business/UseTimes';
import '@/styles/business/rule-set/index.less'
import MultiControl from "@/components/common/MultiControl";

@withRouter
@observer
class Derivation extends Component {
    constructor(props) {
        super(props);
        this.state = { selectData: [] }
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.modalAddOkCallBack = this.modalAddOkCallBack.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.getEventSourceSelectList = this.getEventSourceSelectList.bind(this);
    }
    componentDidMount() {
        this.getEventSourceSelectList();
        store.initParams();
        store.getDataSourceForApi();
    }


    multiDelete() {
        var rowsData = [];
        for (let i = 0; i < store.responseData.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(store.responseData[i]);
                    row.extVarId = row.id;
                    row.extVarCode = row.code;
                    row.extVarName = row.name;
                    row.actionType = 3;
                    row.type = 1;
                    // delete row.id;
                    rowsData.push(row.id);
                }
            }
        }
        console.log(rowsData)
        if (rowsData.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        // return
        common.loading.show();
        variableService.changeExtVarStatus(rowsData, 'delete').then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            message.success(res.data.resultMessage);
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

    modalAddOkCallBack = () => {
        this.props.history.push('/business/variable/real-time-query/save')
    }

    modalCancelCallBack = () => {

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
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '维度',
            dataIndex: 'dimensionName',
            key: 'dimensionName'
        }, {
            title: '数据类型',
            dataIndex: 'dataTypeLabel',
            key: 'dataTypeLabel'
        },
        {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue'
        },
        {
            title: '类型',
            dataIndex: 'typeLabel',
            key: 'typeLabel'
        }, {
            title: '类别',
            dataIndex: 'categoryName',
            key: 'categoryName'
        }, {
            title: '使用次数',
            dataIndex: 'quoteSum',
            key: 'quoteSum'
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 50,
        }];

        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            { label: '删除', callback: () => this.multiDelete(), auth: publicUtils.isAuth("business:variable:ext:delete"), confirmIcon: <Icon type="close-circle" style={{color: '#f00'}} /> },
        ];
        let multiActionComponent = (
            <MultiControl
                style={{ float: 'right', margin: '4px 20px 0 0' }}
                items={menuItems}
                selectedKeys={store.getSelectedRowKeys}
                showConfirm={true}
            />);
        let addTypeComponent = <Select
            style={{ width: '109px', float: 'right', margin: '4px 20px 0 0' }}
            className="primary-select"
            value="新建变量"
        >

            <Select.Option value="2" onClick={() => this.props.history.push('/business/variable/derivation/save-count')}>计算变量</Select.Option>
            <Select.Option value="3" onClick={() => this.props.history.push('/business/variable/derivation/save-regular')}>正则变量</Select.Option>
            <Select.Option value="1" onClick={() => this.props.history.push('/business/variable/derivation/save-func')}>函数变量</Select.Option>
        </Select>
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择事件源" categoryType="category_ext" selectData={this.state.selectData} searchPlaceholder="输入名称或标识查询" >
                            {publicUtils.isAuth("business:variable:ext:edit") ?
                                addTypeComponent
                                : ''
                            }
                            {publicUtils.isAuth("business:variable:ext:edit") ?
                                multiActionComponent
                                : ''
                            }
                        </PageToolBar>
                        <PageToolBar2 type="ext" selectName="选择事件源" categoryType="category_ext" selectData={this.state.selectData} selectName2="选择类别" searchPlaceholder="输入名称或标识查询">
                            {publicUtils.isAuth("business:variable:ext:edit") ?
                                addTypeComponent
                                : ''
                            }
                            {publicUtils.isAuth("business:variable:ext:edit") ?
                                multiActionComponent
                                : ''
                            }
                        </PageToolBar2>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table scroll={{ x: store.getDataSource.length > 0 ? 1100 : 'auto' }} rowSelection={rowSelection} columns={columns} dataSource={store.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>
                    </div>
                    <UseTimes />
                </div>
            </Provider>
        )
    }
}

export default Derivation;