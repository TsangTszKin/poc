import React, {Component} from 'react';
import {Provider, observer} from 'mobx-react';
import common from '@/utils/common';
import store from '@/store/system/config2/dimensionConfig/Index';
import PageHeader from '@/components/PageHeader';
import {Table, Icon, Switch, Spin, message, Dropdown, Menu, Button, Modal, Form} from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import {withRouter} from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';
import SaveForm from '@/components/system/config2/dimensionConfig/SaveForm';
import dimensionService from '@/api/system/config2/dimensionService';
import MultiControl from "@/components/common/MultiControl";

@Form.create()
@withRouter
@observer
class DimensionConfig extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.modalOk = this.modalOk.bind(this);
        this.state = {
            visibleForAdd: false
        }
    }

    componentDidMount() {
        store.initParams();
        store.getDataSourceForApi();
    }

    /**
     * 表格排序变化回调
     */
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
    }

    changePage = (pageNum, pageSize) => {
        this.componentDidUpdate();
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
        store.setSelectedRowKeys([])
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

    modalOk(e) {
        this.refs.getFormValue.validateFields((err, values) => {
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
                store.saveData.setName(values.name);
                store.saveData.setCode(values.code);
                store.saveData.setDescription(values.description);
                store.saveResult();
            } else {
                console.log(err);
                return err;
            }
        });
    }


    showConfirm(type) {
        Modal.confirm({
            title: '确定批量删除?',
            content: '',
            onOk() {
                store.multiControl('删除');
            },
            onCancel() {
            },
        });
    }


    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '名称',
            dataIndex: 'code',
            key: 'code'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        }/*, {
            title: '本地维度名',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => {
                return a.code.localeCompare(b.resultKey)
            }
        }*/, {
            title: '创建人',
            dataIndex: 'createdUser',
            key: 'createdUser',
        }, {
            title: '更新时间',
            dataIndex: 'modifiedTime',
            key: 'modifiedTime',
            sorter: (a, b) => {
                return String(a.modifiedTime).localeCompare(String(b.modifiedTime))
            }
        }/*, {
            title: '维度描述',
            dataIndex: 'description',
            key: 'description'
        }*/, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            filters: [{
                text: '已同步',
                value: 1,
            }, {
                text: '未同步',
                value: 0,
            }],
            onFilter: (value, record) => record.status.props.children.props.status == value
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 50
        }];

        const menuItems = [
            { label: '删除', callback: () => store.multiControl('删除'), confirmIcon: <Icon type="close-circle" style={{color: '#f00'}} /> },
        ];
        let multiActionComponent = <MultiControl
            style={ { float: 'right', margin: '4px 20px 0 0' } }
            items={ menuItems }
            selectedKeys={ store.getSelectedRowKeys }
            showConfirm={ true }
        />;

        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入名称查询"
                                     btnStr={publicUtils.isAuth("system:config:dimensionConfig:edit") ? "新建维度" : ''}
                                     btnCallBack={() => {
                                         store.saveData.init();
                                         store.setIsShowModal(true)
                                     }}>
                            {
                                multiActionComponent
                            }
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table scroll={{x: store.getDataSource.length > 0 ? 1100 : 'auto'}} columns={columns}
                                   dataSource={store.getDataSource} pagination={false}
                                   rowSelection={rowSelection}
                            />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize}
                                changePage={this.changePage}></Paging>
                    </div>


                    {
                        publicUtils.isAuth("system:config:dimensionConfig:edit") ?
                            <Modal
                                title={store.saveData.getStatus !==''?"编辑维度":"新建维度"}
                                visible={store.getIsShowModal}
                                onOk={this.modalOk}
                                onCancel={() =>{
                                    store.init();
                                    store.setIsShowModal(false)
                                }}
                                width='400px'
                                keyboard
                                destroyOnClose={true}
                                maskClosable={false}
                            >
                                <SaveForm ref="getFormValue"/>
                            </Modal>
                            :
                            <Modal
                                title={store.saveData.getStatus !==''?"编辑维度":"新建维度"}
                                visible={store.getIsShowModal}
                                onOk={this.modalOk}
                                onCancel={() => store.setIsShowModal(false)}
                                width='400px'
                                keyboard
                                destroyOnClose={true}
                                footer={null}
                                maskClosable={false}
                            >
                                <SaveForm ref="getFormValue"/>
                            </Modal>
                    }
                </div>
            </Provider>
        )
    }
}

export default DimensionConfig