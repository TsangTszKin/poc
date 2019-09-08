import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Row, Col, Icon } from 'antd'
import { withRouter } from 'react-router-dom'

@withRouter @inject('store') @observer
class CellPayMonitorTD extends Component {
    render() {
        return (
            <div
                style={(() => {
                    return Object.assign(this.props.style, style.main)
                })()}
            >
                <div style={style.cell1}>
                    <span style={style.cell1_title} title={this.props.title}>{this.props.title}</span>
                    <Icon type="swap" style={{ color: '#85b37d', fontSize: "21px", position: 'absolute', top: '22px', right: '65px' }} />
                </div>
                <Row style={style.cell2}>
                    <Col span={12} style={style.cell2_l} className="ellipsis-1" title={this.props.count}>交易笔数：{this.props.count}</Col>
                    <Col span={12} style={style.cell2_r} className="ellipsis-1" title={this.props.time}>平均耗时(ms)：{this.props.time}</Col>
                </Row>
            </div>
        );
    }
}

CellPayMonitorTD.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    count: PropTypes.number,
    time: PropTypes.number,
    type: PropTypes.oneOf(['pre', 'unit', 'esb'])
};
CellPayMonitorTD.defaultProps = {
    style: {},
    title: '',
    count: 0,
    time: 0
}

export default CellPayMonitorTD;

const style = {
    main: {
        width: '300px', textAlign: 'center', boxShadow: '4px 4px 10px #85b37d'
    },
    cell1: {
        height: '63px', border: '1px solid rgba(201, 201, 201, 1)', borderBottom: 'none', lineHeight: '63px', position: 'relative'
    },
    cell1_btn: {
        position: 'absolute', top: '15px', right: '10px', cursor: 'pointer'
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