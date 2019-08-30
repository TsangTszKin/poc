/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/business/sms/Chain'
import { Table, Spin, Drawer, DatePicker, Input, Button } from 'antd'
import PageHeader from '@/components/PageHeader';
import common from '@/utils/common';
import Paging from '@/components/Paging';
import Code from '@/components/Code';
import moment from 'moment';
import DiagramChainSms from '@/components/business/home/DiagramChainSms'

@withRouter @observer
class Chain extends Component {

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
        store.getChainListForApi()
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.list.updateData('pageNum', pageNum);
        store.list.updateData('pageSize', pageSize);
        store.getChainListForApi();
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

                        <div className="clearfix" style={style.searchPanel}>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>日期 :</span>
                                <DatePicker.RangePicker size="small"
                                    defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                    format={'YYYY/MM/DD'}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>客户账号 :</span>
                                <Input size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入" />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>客户名称 :</span>
                                <Input size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入" />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary">查询</Button>
                            </div>
                        </div>

                        <Spin spinning={store.list.getData.loading} size="large">
                            <Table
                                scroll={{ x: store.list.getData.dataSource.length > 0 ? 1100 : 'auto' }}
                                // rowSelection={rowSelection}
                                columns={columns}
                                dataSource={(() => {
                                    let dataSource = common.deepClone(store.list.getData.dataSource);
                                    dataSource.forEach((el, i) => {
                                        el.index = i + 1;
                                        el.action = <Fragment>
                                            <a onClick={() => {
                                                store.detail.updateData('visible', true)
                                                store.detail.updateData('log', el.log)
                                            }}>查看</a>
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

                    <Drawer
                        title="调用链明细"
                        placement="right"
                        closable={true}
                        onClose={() => store.detail.updateData('visible', false)}
                        visible={store.detail.getData.visible}
                        width={1000}
                        id="log-detail"
                    >
                        {/* <p>{store.detail.getData.log}</p> */}
                        {/* <Code sqlCode={store.detail.getData.log} type={1} /> */}
                        <DiagramChainSms />
                        <div style={{ height: '40px' }}></div>
                        <Code sqlCode={sessionStorage.log} type={1} />
                    </Drawer>

                </div>

            </Provider>
        )
    }
}

export default Chain

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time.',
        sorter: (a, b) => {
            return a.time.localeCompare(b.time)
        }
    },
    {
        title: '模板ID',
        dataIndex: 'templateId',
        key: 'templateId'
    },
    {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile'
    },
    {
        title: '短信内容',
        dataIndex: 'smsContent',
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