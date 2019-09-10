/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component, Fragment } from 'react'
import { observer, Provider, PropTypes } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/monitor/alert/Setting'
import { Table, Spin, Drawer, InputNumber, Input, Button, Divider, Select, Modal } from 'antd'
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
        this.changeData = this.changeData.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        store.reset();
        store.getAlertSettingForApi()
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.list.updateData('pageNum', pageNum);
        store.list.updateData('pageSize', pageSize);
        store.getAlertSettingForApi();
    }

    changeData(index, value) {
        let data = store.detail.getData;
        data[index].thresholdValue = value
        store.detail.setData(data)
    }


    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <div className="pageContent charts-main">
                        {
                            store.detail.getData.map((item, i) =>
                                <FormItem label={item.indicatorName} key={i}>
                                    <InputNumber placeholder="请输入" min={0} style={{ float: 'left', width: '200px' }} value={item.thresholdValue} onChange={(value) => this.changeData(i, value)} />
                                </FormItem>
                            )
                        }
                        <Button type="primary" style={{ margin: '10px 0 0 120px' }}
                            onClick={() => store.saveAlertSettingForApi()}
                        >保存</Button>

                    </div>

                </div>

            </Provider>
        )
    }
}

export default Setting

class FormItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="clearfix" style={this.props.style}>
                <span style={{ display: 'inline-block', width: '120px', height: '32px', float: 'left', lineHeight: '32px', textAlign: 'right', paddingRight: '10px' }}>{this.props.label}：</span>
                {this.props.children}
            </div>
        )
    }
}
FormItem.propTypes = {
    label: PropTypes.string,
    style: PropTypes.object
}
FormItem.defaultProps = {
    label: '',
    style: {
        marginBottom: '20px'
    }
}

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