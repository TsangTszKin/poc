/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/business/pay/Chain'
import { Table, Spin, Tag, Drawer, DatePicker, Input, Button, Divider } from 'antd'
import PageHeader from '@/components/PageHeader';
import common from '@/utils/common';
import Paging from '@/components/Paging';
import Code from '@/components/Code';
import moment from 'moment';
import DiagramChainPay from '@/components/business/home/DiagramChainPay'

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

                        {/* <Button onClick={() => {
                            store.detail.updateData('visible', true)
                            store.getChainDetailForApi('')
                            common.loading.hide();
                        }}>
                            fdsaf
                        </Button> */}

                        <div className="clearfix" style={style.searchPanel}>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>日期 :</span>
                                <DatePicker.RangePicker size="small"
                                    allowClear={false}
                                    value={[moment(store.list.getData.query.startTime, 'YYYY-MM-DD hh:mm'), moment(store.list.getData.query.endTime, 'YYYY-MM-DD hh:mm')]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(date, dateString) => {
                                        let query = store.list.getData.query;
                                        query.startTime = `${dateString[0]} 00:00`
                                        query.endTime = `${dateString[1]} 00:00`
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>客户账号 :</span>
                                <Input allowClear={true} size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.userAccount}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.userAccount = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>客户名称 :</span>
                                <Input allowClear={true} size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.userName}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.userName = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>关联流水号 :</span>
                                <Input allowClear={true} size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.tradeNo}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.tradeNo = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary" onClick={store.getChainListForApi}>查询</Button>
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
                                                store.getChainDetailForApi(el.tradeNo)
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
                        width={1210}
                        id="log-detail"
                    >
                        <DiagramChainPay
                            data={store.detail.getData.data}
                            callbackfn={(step) => {
                                store.detail.updateData('step', step)
                            }}
                        />
                        <div style={{ height: '40px' }}></div>
                        {
                            !common.isEmpty(store.detail.getData.step) ?
                                <Fragment>
                                    <Divider orientation="left">日志（步骤{store.detail.getData.step}）</Divider>
                                    <Code sqlCode={store.detail.getData.log[store.detail.getData.step]} type={1} />
                                </Fragment>
                                : ''
                        }
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
        title: '开始时间',
        dataIndex: 'beginDate',
        key: 'beginDate'
    },
    {
        title: '耗时',
        dataIndex: 'takeTimes',
        key: 'takeTimes',
        render: (value) => {
            return  `${value}毫秒`
        }
    },
    {
        title: '业务代码',
        dataIndex: 'mmsgCd',
        key: 'mmsgCd'
    },
    {
        title: '客户账号',
        dataIndex: 'userAccount',
        key: 'userAccount'
    },
    {
        title: '客户名称',
        dataIndex: 'userName',
        key: 'userName'
    },
    {
        title: '涉及渠道',
        dataIndex: 'bizTp',
        key: 'bizTp',
        render: (value) => {
            return <Tag>{value}</Tag>
        }
    },
    {
        title: '涉及金额',
        dataIndex: 'amt',
        key: 'amt'
    },
    {
        title: '关联流水号',
        dataIndex: 'tradeNo',
        key: 'tradeNo'
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