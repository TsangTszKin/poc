/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/monitor/alert/Index'
import { Table, Spin, Drawer, DatePicker, Input, Button, Divider, Select, Tag, message } from 'antd'
import common from '@/utils/common';
import Paging from '@/components/Paging';
import publicUtils from '@/utils/publicUtils';
import moment from 'moment';
import alertService from '@/api/business/alertService';

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
        store.getAlertSelectionForApi()
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.list.updateData('pageNum', pageNum);
        store.list.updateData('pageSize', pageSize);
        store.getAlertListForApi();
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
                                    allowClear={false}
                                    value={[moment(store.list.getData.query.startTime, 'YYYY-MM-DD hh:mm:ss'), moment(store.list.getData.query.endTime, 'YYYY-MM-DD hh:mm:s')]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(date, dateString) => {
                                        let query = store.list.getData.query;
                                        query.startTime = `${dateString[0]} 00:00:00`
                                        query.endTime = `${dateString[1]} 00:00:00`
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>告警级别 :</span>
                                <Select dropdownMatchSelectWidth={false} allowClear={true} size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请选择"
                                    value={store.list.getData.query.level}
                                    onChange={(value) => {
                                        if (value === undefined) value = ''
                                        let query = store.list.getData.query;
                                        query.level = value
                                        store.list.updateData('query', query);
                                    }}>
                                    {
                                        store.helper.getData.alarmLevel.map((item, i) =>
                                            <Select.Option key={i} value={item.value}>{item.name}</Select.Option>
                                        )
                                    }
                                </Select>
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span dropdownMatchSelectWidth={false} style={style.searchTitle}>告警状态 :</span>
                                <Select allowClear={true} size="small" style={{ minWidth: '100px', width: 'fit-content' }} placeholder="请选择"
                                    value={store.list.getData.query.status}
                                    onChange={(value) => {
                                        if (value === undefined) value = ''
                                        let query = store.list.getData.query;
                                        query.status = value
                                        store.list.updateData('query', query);
                                    }}>
                                    {
                                        store.helper.getData.alarmStatus.map((item, i) =>
                                            <Select.Option key={i} value={item.value}>{item.name}</Select.Option>
                                        )
                                    }
                                </Select>
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>告警ID :</span>
                                <Input allowClear={true} size="small" style={{ minWidth: '80px', width: 'fit-content' }} placeholder="请输入"
                                    value={store.list.getData.query.id}
                                    onChange={(e) => {
                                        let query = store.list.getData.query;
                                        query.id = e.target.value
                                        store.list.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary"
                                    onClick={store.getAlertListForApi}
                                >查询</Button>
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
                                            {
                                                el.status === '1' ?
                                                    <a>已处理</a>
                                                    :
                                                    <a onClick={() => {
                                                        common.loading.show();
                                                        alertService.handleAlert(el.id).then(res => {
                                                            common.loading.hide();
                                                            if (!publicUtils.isOk(res)) return
                                                            message.success('操作成功')
                                                            store.getAlertListForApi();
                                                        }).catch(res => common.loading.hide())
                                                    }}>设为已处理</a>
                                            }
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

export default Index

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '告警产生时间',
        dataIndex: 'date',
        key: 'time.',
        sorter: (a, b) => {
            return a.time.localeCompare(b.time)
        }
    },
    {
        title: '告警ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: '告警级别',
        dataIndex: 'levelName',
        key: 'levelName',
        render: (value) => {
            switch (value) {
                case '紧急':
                    return <Tag color="red">{value}</Tag>
                case '重要':
                    return <Tag color="orange">{value}</Tag>
                case '提示':
                    return <Tag >{value}</Tag>
                default:
                    break;
            }
            return <Tag>{value}</Tag>
        }
    },
    {
        title: '告警状态',
        dataIndex: 'statusName',
        key: 'statusName',
        render: (value) => {
            switch (value) {
                case '已处理':
                    return <Tag color="green">{value}</Tag>
                case '未处理':
                    return <Tag color="blue">{value}</Tag>
                default:
                    break;
            }
            return <Tag>{value}</Tag>
        }
    },
    {
        title: '告警消息',
        dataIndex: 'msgBody',
        key: 'msgBody'
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