/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/business/log/Index'
import { Table, Spin, Input, Tag, Drawer, DatePicker, Select, Button, InputNumber, Tabs } from 'antd'
import PageHeader from '@/components/PageHeader';
import common from '@/utils/common';
import Paging from '@/components/Paging';
import Code from '@/components/Code';
import moment from 'moment';

@withRouter @observer
class Index extends Component {

    constructor(props) {
        super(props)
        this.init = this.init.bind(this);
        this.changePage = this.changePage.bind(this);
        this.state = {
            defaultActiveKey: 'front'
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        store.reset();
        store.getLogListForApi()
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.list.updateData('pageNum', pageNum);
        store.list.updateData('pageSize', pageSize);
        store.getLogListForApi();
    }


    render() {
        const rowSelection = {
            selectedRowKeys: store.list.getData.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.list.updateData('selectedRowKeys', selectedRowKeys)
            }
        };
        return (
            <Provider store={store}>
                <div className='panel'>
                    {/* <PageHeader meta={this.props.meta} /> */}
                    <div className="pageContent charts-main">

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
                                <span style={style.searchTitle}>所属系统模块 :</span>
                                <Select
                                    mode="multiple"
                                    size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }}
                                    dropdownMatchSelectWidth={false}
                                    placeholder="请选择"

                                    value={store.list.getData.query.clusterSign}
                                    onChange={(value) => {
                                        if (value === undefined) value = ''
                                        let query = store.list.getData.query;
                                        query.clusterSign = value
                                        store.list.updateData('query', query);
                                    }}
                                >
                                    <Select.Option value="front">前置</Select.Option>
                                    <Select.Option value="online">联机</Select.Option>
                                    <Select.Option value="esb">ESB</Select.Option>
                                    <Select.Option value="message">短信</Select.Option>
                                </Select>
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>日志类型 :</span>
                                <Select
                                    size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }}
                                    dropdownMatchSelectWidth={false}
                                    placeholder="请选择"

                                    value={store.list.getData.query.logGrade}
                                    onChange={(value) => {
                                        if (value === undefined) value = ''
                                        let query = store.list.getData.query;
                                        query.logGrade = value
                                        store.list.updateData('query', query);
                                    }}
                                >
                                    <Select.Option value="test0">所有</Select.Option>
                                    <Select.Option value="test1">正常</Select.Option>
                                    <Select.Option value="test2">错误</Select.Option>
                                    <Select.Option value="test3">警告</Select.Option>
                                    <Select.Option value="test3">成功</Select.Option>
                                    <Select.Option value="test3">失败</Select.Option>
                                </Select>
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>主机IP :</span>
                                <Input size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.hostIp}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.hostIp = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>交易流水号 :</span>
                                <Input size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.tradeNo}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.tradeNo = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>耗时 :</span>
                                <InputNumber size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.takeTimes}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.takeTimes = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>日志内容关键字 :</span>
                                <Input size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.content}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.content = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary">查询</Button>
                            </div>
                        </div>

                        <Tabs defaultActiveKey={this.state.defaultActiveKey} onChange={(defaultActiveKey) => this.setState({ defaultActiveKey })} >
                            {
                                tabList.map((item, i) =>
                                    <Tabs.TabPane tab={item.label} key={item.value}>
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
                                    </Tabs.TabPane>
                                )
                            }
                        </Tabs>


                        <Paging
                            pageNum={store.list.getData.pageNum}
                            total={store.list.getData.total}
                            showPageSize={store.list.getData.pageSize}
                            changePage={this.changePage}
                        />
                    </div>

                    <Drawer
                        title="日志详情"
                        placement="right"
                        closable={true}
                        onClose={() => store.detail.updateData('visible', false)}
                        visible={store.detail.getData.visible}
                        width={800}
                        id="log-detail"
                    >
                        {/* <p>{store.detail.getData.log}</p> */}
                        {/* <Code sqlCode={store.detail.getData.log} type={1} /> */}
                        <Code sqlCode={sessionStorage.log} type={1} />
                    </Drawer>

                </div>

            </Provider>
        )
    }
}

export default Index

const tabList = [
    {
        label: '前置',
        value: 'front'
    },
    {
        label: '联机',
        value: 'online'
    },
    {
        label: 'ESB',
        value: 'esb'
    },
    {
        label: '短信',
        value: 'message'
    }
]

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '日志ID',
        dataIndex: 'logId',
        key: 'logId '
    },
    {
        title: '日志类型',
        dataIndex: 'logGrade',
        key: 'logGrade',
        render: (value) => {
            switch (value) {
                case '正常':
                    return <Tag color="blue">{value}</Tag>
                case '错误':
                    return <Tag color="red">{value}</Tag>
                case '警告':
                    return <Tag color="orange">{value}</Tag>
                case '成功':
                    return <Tag color="green">{value}</Tag>
                case '失败':
                    return <Tag color="#f50">{value}</Tag>
                default:
                    break;
            }
            return <Tag>{value}</Tag>
        }
    },
    {
        title: '日志生成时间',
        dataIndex: 'logCrdate',
        key: 'logCrdate.',
        sorter: (a, b) => {
            return a.logCrdate.localeCompare(b.logCrdate)
        }
    },
    {
        title: '耗时',
        dataIndex: 'takeTimes',
        key: 'takeTimes.',
        sorter: (a, b) => {
            return a.takeTimes.localeCompare(b.takeTimes)
        },
        render: (value) => {
            return `${value}毫秒`
        }
    },
    {
        title: '交易流水号',
        dataIndex: 'tradeNo',
        key: 'tradeNo'
    },
    {
        title: '所属系统',
        dataIndex: 'clusterSign',
        key: 'clusterSign'
    },
    {
        title: '主机IP',
        dataIndex: 'hostIp',
        key: 'hostIp'
    },
    {
        title: '日志名称',
        dataIndex: 'logFile',
        key: 'logFile'
    },
    {
        title: '日志内容',
        dataIndex: 'content',
        key: 'content'
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