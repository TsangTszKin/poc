/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/business/log/Index'
import { Table, Spin, Divider, Tag, Drawer, DatePicker, Select, Button } from 'antd'
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
                                    defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                    format={'YYYY/MM/DD'}
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
                                >
                                    <Select.Option value="test1">test1</Select.Option>
                                    <Select.Option value="test2">test2</Select.Option>
                                    <Select.Option value="test3">test3</Select.Option>
                                </Select>
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>业务类型 :</span>
                                <Select
                                    size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }}
                                    dropdownMatchSelectWidth={false}
                                    placeholder="请选择"
                                >
                                    <Select.Option value="test0">所有</Select.Option>
                                    <Select.Option value="test1">转账</Select.Option>
                                    <Select.Option value="test2">对账</Select.Option>
                                    <Select.Option value="test3">查询</Select.Option>
                                </Select>
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>日志类型 :</span>
                                <Select
                                    size="small"
                                    style={{ minWidth: '100px', width: 'fit-content' }}
                                    dropdownMatchSelectWidth={false}
                                    placeholder="请选择"
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
                                <Button size="small" type="primary">查询</Button>
                            </div>
                        </div>

                        <Spin spinning={store.list.getData.loading} size="large">
                            <Table
                                scroll={{ x: store.list.getData.dataSource.length > 0 ? 1100 : 'auto' }}
                                rowSelection={rowSelection}
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
                                            <Divider type="vertical" />
                                            <a>下载</a>
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

const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
}, {
    title: '日志ID',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '日志名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '时间',
    dataIndex: 'time',
    key: 'time.',
    sorter: (a, b) => {
        return a.time.localeCompare(b.time)
    }
}, {
    title: '所属系统及模块',
    dataIndex: 'module',
    key: 'module'
}, {
    title: '所属机构',
    dataIndex: 'org',
    key: 'org'
}, {
    title: '业务类型',
    dataIndex: 'type',
    key: 'type',
    render: (value) => {
        return <Tag>{value}</Tag>
    }
},
{
    title: '日志类型',
    dataIndex: 'category',
    key: 'category',
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
    title: '账号',
    dataIndex: 'account',
    key: 'account'
},
{
    title: '客户号',
    dataIndex: 'custNo',
    key: 'custNo'
},
{
    title: '卡号',
    dataIndex: 'cardNo',
    key: 'cardNo'
},
{
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 100
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