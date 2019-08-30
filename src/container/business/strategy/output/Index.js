/* eslint-disable react/no-string-refs */
/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:21:15
 * @Description: 
 */
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/output/Index';
import PageHeader from '@/components/PageHeader';
import { Table, Icon, Spin, message, Modal, Form } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import SaveForm from '@/components/business/strategy/output/SaveForm';
import UseTimes from '@/components/business/UseTimes';
import MultiControl from "@/components/common/MultiControl";
import commonService from "@/api/business/commonService";

@Form.create()
@withRouter
@observer
class OutPut extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.modalOk = this.modalOk.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.state = {
            visibleForAdd: false
        }
    }
    componentDidMount() {
        store.initParams();
        store.getDataSourceForApi();
        commonService.getCategoryListByType('parameter').then(res => {
            if (!publicUtils.isOk(res)) return ;
            const result = res.data.result;
            let temp = {};
            result.forEach(({ dataValue, dataName }) => {
                temp[dataValue] = dataName;
            });
            store.setCategoryList(temp);
        });
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
            code: keyword
        }
        store.setPageNum(1);
        store.setQuery(query);
        store.getDataSourceForApi();
    }

    multiDelete(ids) {
        common.loading.show();
        variableService.changeParameterVarStatus(ids, 'delete').then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return ;
            store.getDataSourceForApi();
            message.success("删除成功");
        }).catch(() => {
            common.loading.hide();
        })

    }

    modalOk() {
        this.refs.getFormValue.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
                const type = Number(values.type_and_typeLabel.split('·-·')[0]);
                store.saveData.setName(values.name);
                store.saveData.setCode(values.code);
                store.saveData.setDefaultValue(type === 93 ? values.defaultValue.format('YYYY-MM-DD HH:mm:ss'): values.defaultValue);
                store.saveData.setType(type);
                store.saveData.setTypeLabel(values.type_and_typeLabel.split('·-·')[1]);
                store.saveData.setCategory(values.category.split('·-·')[0]);
                store.saveResult();
            } else {
                console.log(err);
                return err;
            }
        });
    }

    multiControl = option => {
        if (common.isEmpty(store.getSelectedRowKeys)) {
            message.warn("暂无符合条件的数据");
            return
        }
        let rowsData = store.getSelectedRowKeys.map(selectedIndex => store.responseData[selectedIndex].id);
        // console.log(rowsData);
        if (rowsData.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        if (option === '删除') {
            this.multiDelete(rowsData);
        }

    };

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
            title: '数据类型',
            dataIndex: 'typeLabel',
            key: 'typeLabel'
        }, {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue'
        }, {
            title: '类别',
            dataIndex: 'category',
            key: 'category'
        }, {
            title: '使用次数',
            dataIndex: 'quoteSum',
            key: 'quoteSum'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 50
        }];
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };

        const menuItems = [
            { label: '删除', callback: () => this.multiControl('删除'), confirmIcon: <Icon type="close-circle" style={{color: '#f00'}} /> },
        ];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} />
                    <div className="pageContent">
                        <PageToolBar
                            changeToolBar={this.changeToolBar}
                            searchPlaceholder="输入名称或标识查询"
                            btnStr={publicUtils.isAuth("business:strategy:output:edit") ? "新增参数" : ''}
                            btnCallBack={() => {
                                store.saveData.init();
                                store.setIsShowModal(true)
                            }}>
                            <MultiControl
                                style={ { float: 'right', margin: '4px 20px 0 0' } }
                                items={ menuItems }
                                selectedKeys={ store.getSelectedRowKeys }
                                showConfirm={ true }
                            />
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                scroll={{ x: store.getDataSource.length > 0 ? 1100 : 'auto' }}
                                columns={columns}
                                dataSource={store.getDataSource}
                                pagination={false}
                                rowSelection={rowSelection}
                            />
                        </Spin>
                        <Paging
                            pageNum={store.getPageNum}
                            total={store.getTotal}
                            showPageSize={store.getPageSize}
                            changePage={this.changePage} />
                    </div>


                    {
                        publicUtils.isAuth("business:strategy:output:edit") ?
                            <Modal
                                title="新建参数"
                                name="保存参数"
                                visible={store.getIsShowModal}
                                onOk={this.modalOk}
                                onCancel={() => store.setIsShowModal(false)}
                                width='400px'
                                keyboard
                                destroyOnClose={true}
                                maskClosable={false}
                            >
                                <SaveForm ref="getFormValue" />
                            </Modal>
                            :
                            <Modal
                                title="新建参数"
                                name="保存参数"
                                visible={store.getIsShowModal}
                                onOk={this.modalOk}
                                onCancel={() => store.setIsShowModal(false)}
                                width='400px'
                                keyboard
                                destroyOnClose={true}
                                footer={null}
                                maskClosable={false}
                            >
                                <SaveForm ref="getFormValue" />
                            </Modal>
                    }

                    <UseTimes />
                </div>
            </Provider>
        );
    }
}

export default OutPut