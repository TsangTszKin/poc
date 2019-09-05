/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/monitor/alert/Setting'
import { Table, Spin, Drawer, DatePicker, Input, Button, Divider, Select } from 'antd'
import common from '@/utils/common';
import Paging from '@/components/Paging';
import Code from '@/components/Code';
import moment from 'moment';
import DiagramChainSms from '@/components/business/home/DiagramChainSms'

@withRouter @observer
class Setting extends Component {

    constructor(props) {
        super(props)
        this.init = this.init.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        store.reset();
        store.getAlerSettingtListForApi()
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.list.updateData('pageNum', pageNum);
        store.list.updateData('pageSize', pageSize);
        store.getAlerSettingtListForApi();
    }


    render() {
        // const rowSelection = {
        //     selectedRowKeys: store.list.getData.selectedRowKeys,
        //     onChange: (selectedRowKeys) => {
        //         console.log('selectedRowKeys changed: ', selectedRowKeys);
        //         store.list.updateData('selectedRowKeys', selectedRowKeys)
        //     }
        // };
        return (
            <Provider store={store}>
                <div className='panel'>
                    {/* <PageHeader meta={this.props.meta} /> */}
                    <div className="pageContent charts-main">

                        <Button size="small" type="primary" style={{ float: 'right', marginBottom: '20px' }}>新增</Button>


                        <Spin spinning={store.list.getData.loading} size="large">
                            <Table
                                scroll={{ x: store.list.getData.dataSource.length > 0 ? 1100 : 'auto' }}
                                // rowSelection={rowSelection}
                                columns={columns}
                                dataSource={(() => {
                                    let dataSource = common.deepClone(store.list.getData.dataSource);
                                    dataSource.forEach((el, i) => {
                                        el.number = i + 1;
                                        el.action = <Fragment>
                                            <a onClick={() => {
                                            }}>编辑</a>
                                            <Divider type="vertical" />
                                            <a onClick={() => {
                                            }}>删除</a>
                                        </Fragment>
                                    })
                                    return dataSource
                                })()}
                                pagination={false} />
                        </Spin>

                        <Paging
                            pageNum={store.list.getData.pageNum}
                            total={store.list.getData.total}
                            showPageSize={store.list.getData.pageSize}
                            changePage={this.changePage}
                        />
                    </div>

                </div>

            </Provider>
        )
    }
}

export default Setting

const columns = [
    {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '指标',
        dataIndex: 'index',
        key: 'index'
    },
    {
        title: '目标',
        dataIndex: 'target',
        key: 'target'
    },
    {
        title: '阈值',
        dataIndex: 'threshold',
        key: 'threshold'
    },
    {
        title: '告警等级',
        dataIndex: 'level',
        key: 'level'
    },
    {
        title: '告警信息',
        dataIndex: 'message',
        key: 'smsContent'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 50
    }];

const style = {
    searchPanel: {
        marginBottom: '20px'
    },
    searchShell: {
        margin: '0px 30px 10px 0px',
        width: 'fit-content',
        float: 'left',
        height: '25px'
    },
    searchTitle: {
        height: '21px',
        lineHeight: '21px',
        display: 'inline-block',
        marginRight: '5px'
    }
}