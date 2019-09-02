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
            >
                <div style={(() => {
                    return Object.assign(style.cell1, { lineHeight: this.props.type === 'sms' ? '63px' : '31.5px' })
                })()} >
                    <p style={style.cell1_title}>{this.props.title}</p>
                    <p>{this.props.ip}</p>
                </div>
                <Row style={style.cell2}>
                    <Col span={12} style={style.cell2_l}>交易笔数：{this.props.count}</Col>
                    <Col span={12} style={style.cell2_r}>平均耗时：{this.props.time}</Col>
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
    type: PropTypes.oneOf(['pay', 'sms'])
};
CellDetail.defaultProps = {
    style: {
    },
    title: '',
    count: 0,
    time: 0,
    ip: '',
    type: 'pay'
}

export default CellDetail;

const style = {
    main: {
        width: '230px', textAlign: 'center', boxShadow: '4px 4px 10px #ec7c31', marginBottom: '40px'
    },
    cell1: {
        height: '63px', border: '1px solid rgba(201, 201, 201, 1)', borderBottom: 'none', position: 'relative'
    },
    cell2: {
        height: '33px', border: '1px solid rgba(201, 201, 201, 1)', lineHeight: '63px'
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