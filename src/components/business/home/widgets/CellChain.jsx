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
                    <span style={style.cell1_title}>{this.props.title}</span>
                    <Button type="primary" shape="circle" icon="profile" title="点击查看详情"
                        style={style.cell1_btn}
                        onClick={() => {
                            switch (this.props.type) {
                                case 'pre':
                                    this.props.history.push('/business/pay/pre')
                                    break;
                                case 'unit':
                                    this.props.history.push('/business/pay/unit')
                                    break;
                                case 'esb':
                                    this.props.history.push('/business/pay/esb')
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                </div>
                <Row style={style.cell2}>
                    <Col span={12} style={style.cell2_l}>交易笔数：{this.props.count}</Col>
                    <Col span={12} style={style.cell2_r}>平均耗时：{this.props.time}</Col>
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
    type: PropTypes.oneOf(['pre', 'unit', 'esb'])
};
CellChain.defaultProps = {
    style: {
        width: '230px', textAlign: 'center'
    },
    title: '',
    count: 0,
    time: 0
}

export default CellChain;

const style = {
    main: {
        width: '230px', textAlign: 'center', boxShadow: '4px 4px 10px #ec7c31'
    },
    cell1: {
        height: '63px', border: '1px solid rgba(201, 201, 201, 1)', borderBottom: 'none', lineHeight: '63px', position: 'relative'
    },
    cell1_btn: {
        position: 'absolute', top: '15px', right: '10px', cursor: 'pointer'
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