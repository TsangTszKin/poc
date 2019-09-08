import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Row, Col, Button } from 'antd'
import { withRouter } from 'react-router-dom'

@withRouter @inject('store') @observer
class CellChain extends Component {
    render() {
        return (
            <div
                style={(() => {
                    return Object.assign(this.props.style, style.main)
                })()}
            >
                <div style={style.cell1}>
                    <p style={style.cell1_title}>{this.props.title}</p>
                    <span >{this.props.ip}</span>
                </div>
                <Row style={style.cell2}>
                    <Col span={24} style={style.cell2_r} className="ellipsis-1" title={this.props.time}>耗时(ms)：{this.props.time}</Col>
                </Row>
            </div>
        );
    }
}

CellChain.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    count: PropTypes.number,
    time: PropTypes.number,
    type: PropTypes.oneOf(['pre', 'unit', 'esb']),
    ip: PropTypes.string
};
CellChain.defaultProps = {
    style: {
        width: '300px', textAlign: 'center'
    },
    title: '',
    count: 0,
    time: 0,
    ip: ''
}

export default CellChain;

const style = {
    main: {
        width: '300px', textAlign: 'center', boxShadow: '4px 4px 10px #ec7c31'
    },
    cell1: {
        height: '63px', border: '1px solid rgba(201, 201, 201, 1)', borderBottom: 'none', lineHeight: '31.5px', position: 'relative'
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