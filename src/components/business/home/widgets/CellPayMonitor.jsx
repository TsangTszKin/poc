import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Row, Col, Button, Select } from 'antd'
import { withRouter } from 'react-router-dom'

@withRouter @inject('store') @observer
class CellPayMonitor extends Component {
    render() {
        return (
            <div
                style={(() => {
                    return Object.assign(this.props.style, style.main)
                })()}
            >
                <div style={style.cell1}>
                    <span style={style.cell1_title} title={this.props.title}>{this.props.title}</span>
                    <div>
                        <Select style={{ width: '120px' }} value="实时借记业务" size="small" >
                            <Select.Option value="实时借记业务">实时借记业务</Select.Option>
                        </Select>
                    </div>
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
                    <Col span={12} style={style.cell2_l} className="ellipsis-1" title={this.props.count}>交易笔数：{this.props.count}</Col>
                    <Col span={12} style={style.cell2_r} className="ellipsis-1" title={this.props.time}>平均耗时(ms)：{this.props.time}</Col>
                </Row>
            </div>
        );
    }
}

CellPayMonitor.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    count: PropTypes.number,
    time: PropTypes.number,
    type: PropTypes.oneOf(['pre', 'unit', 'esb'])
};
CellPayMonitor.defaultProps = {
    style: {},
    title: '',
    count: 0,
    time: 0
}

export default CellPayMonitor;

const style = {
    main: {
        width: '300px', textAlign: 'center', boxShadow: '4px 4px 10px #ec7c31'
    },
    cell1: {
        height: '75px', border: '1px solid rgba(201, 201, 201, 1)', borderBottom: 'none', lineHeight: '36.5px', position: 'relative'
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