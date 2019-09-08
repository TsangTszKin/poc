import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Row, Col } from 'antd'

@inject('store') @observer
class CellDetail extends Component {
    render() {
        return (
            <div
                style={(() => {
                    return Object.assign(this.props.style, style.main)
                })()}
                onClick={() => {
                    let query = this.props.store.logList.getData.query;
                    query.hostIp = this.props.ip;
                    query.logFile = '';
                    this.props.store.logList.updateData('query', query);
                    this.props.store.logList.updateData('pageNum', 1);

                    console.log('this.props.store.logList.getData.pageNum', this.props.store.logList.getData.pageNum)


                    let type = '';
                    switch (this.props.title) {
                        case 'MQ':
                            type = '1';
                            break;
                        case 'Front':
                            type = '2';
                            break;
                        case 'Realtime':
                            type = '3';
                            break;
                        default:
                            break;
                    }

                    this.props.store.getLogForApi(type);
                    this.props.store.logList.updateData('title', this.props.title)
                }}
                title="点击查看节点日志信息"
            >
                <div style={(() => {
                    return Object.assign(style.cell1, { lineHeight: this.props.type === 'sms' ? '63px' : '31.5px' })
                })()} >
                    <p style={style.cell1_title}>{this.props.title}</p>
                    <p>{this.props.ip}</p>
                </div>
                <Row style={style.cell2}>
                    <Col span={12} style={style.cell2_l} className="ellipsis-1">交易笔数：{this.props.count}</Col>
                    <Col span={12} style={style.cell2_r} className="ellipsis-1" title={this.props.time}>平均耗时(ms)：{this.props.time}</Col>
                </Row>
            </div>
        );
    }
}

CellDetail.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    count: PropTypes.number,
    time: PropTypes.number,
    ip: PropTypes.string,
    type: PropTypes.oneOf(['front', 'online', 'sms']),
    nodeKey: PropTypes.number,
    content: PropTypes.string,
};
CellDetail.defaultProps = {
    style: {
    },
    title: '',
    count: 0,
    time: 0,
    ip: '',
    type: '',
    nodeKey: 0,
    content: ''
}

export default CellDetail;

const style = {
    main: {
        width: '300px', textAlign: 'center', boxShadow: '4px 4px 10px #ec7c31', cursor: 'pointer'
    },
    cell1: {
        height: '63px', border: '1px solid rgba(201, 201, 201, 1)', borderBottom: 'none', position: 'relative'
    },
    cell2: {
        height: '34px', border: '1px solid rgba(201, 201, 201, 1)', lineHeight: '34px'
    },
    cell2_l: {
        borderRight: '1px solid rgba(201, 201, 201, 1)', height: '33px', lineHeight: '33px'
    },
    cell2_r: {
        height: '33px', lineHeight: '33px'
    },
    cell1_title: {
        fontSize: '16px', fontWeight: 'bold'
    }
}