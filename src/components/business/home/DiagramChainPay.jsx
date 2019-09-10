import React, { Component } from 'react';
import { observer, inject, PropTypes } from 'mobx-react'
import CellChain from '@/components/business/home/widgets/CellChain'
import BranchChain from '@/components/business/home/widgets/BranchChain'
import { Icon, Tag, message } from 'antd'
import common from '@/utils/common';

@inject('store') @observer
class DiagramChainPay extends Component {

    constructor(props) {
        super(props)
        this.hasLog = this.hasLog.bind(this);
    }

    hasLog(step) {
        return !common.isEmpty(this.props.store.detail.getData.log[step])
    }

    render() {
        return (
            <div style={{ minWidth: '950px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto' }}>
                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='支付系统前置'
                            time={this.props.data.front.takeTimes}
                            ip={this.props.data.front.hostIp}
                            type="pre"
                        />
                        <div style={style.linker_cell2}>
                            <p style={style.linker2}></p>
                            <Icon type="caret-down" style={style.linker2_to} />
                            <p style={style.linker2_1}></p>
                            <Icon type="caret-up" style={style.linker2_1_to} />
                            {
                                this.hasLog('1') ?
                                    <span className="pay-up-to-dowm-chain-rowup"></span>
                                    :
                                    ''
                            }

                            {
                                this.hasLog('3') ?
                                    <span className="pay-dowm-to-up-chain-rowup"></span>
                                    :
                                    ''
                            }
                            <Tag color={this.hasLog('1') ? '#2db7f5' : '#DCDCDC'} style={style._1} title="点击查看日志"
                                onClick={() => {
                                    if (this.hasLog('1')) this.props.callbackfn(1)
                                    else message.warning('此处无日志信息')
                                }}
                            >1</Tag>
                            <Tag color={this.hasLog('2') ? '#87d068' : '#DCDCDC'} style={style._2} title="点击查看日志"
                                onClick={() => {
                                    if (this.hasLog('2')) this.props.callbackfn(2)
                                    else message.warning('此处无日志信息')
                                }}
                            >2</Tag>
                            <Tag color={this.hasLog('3') ? '#108ee9' : '#DCDCDC'} style={style._3} title="点击查看日志"
                                onClick={() => {
                                    if (this.hasLog('3')) this.props.callbackfn(3)
                                    else message.warning('此处无日志信息')
                                }}
                            >3</Tag>

                            <Tag
                                color={this.hasLog('4') ? '#4169E1' : '#DCDCDC'}
                                style={style._4} title="点击查看日志"
                                onClick={() => {
                                    if (this.hasLog('4')) this.props.callbackfn(4)
                                    else message.warning('此处无日志信息')
                                }}
                            >4</Tag>

                        </div>
                        <CellChain
                            title='支付系统联机'
                            time={this.props.data.online.takeTimes}
                            ip={this.props.data.online.hostIp}
                            type="unit"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <p style={style.linker}></p>
                        <Icon type="caret-right" style={style.linker_to} />
                        <Tag
                            color={this.hasLog('5') ? '#5F9EA0' : '#DCDCDC'}
                            style={style._5} title="点击查看日志"
                            onClick={() => {
                                if (this.hasLog('5')) this.props.callbackfn(5)
                                else message.warning('此处无日志信息')
                            }}
                        >5</Tag>
                        {
                            this.hasLog('5') ?
                                <span className="pay-left-to-right-rowup"></span>
                                :
                                ''
                        }
                    </div>
                    {/* 最右端 */}
                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            style={{ float: 'left' }}
                            title='ESB'
                            time={this.props.data.esb.takeTimes}
                            ip={this.props.data.esb.hostIp}
                            type="esb"
                        />
                        {
                            !common.isEmpty(this.props.data.services) ?

                                <div style={style.linker_cell_right}>
                                    <p style={style.linker_right}></p>
                                </div>
                                : ''
                        }
                    </div>
                    {
                        !common.isEmpty(this.props.data.services) ?
                            <div className="clearfix" style={{ float: 'left' }}>
                                <BranchChain data={this.props.data.services} />
                            </div>
                            : ''
                    }
                </div>

            </div>
        );
    }
}

DiagramChainPay.propTypes = {
    data: PropTypes.object,
    callbackfn: PropTypes.func
};
DiagramChainPay.defaultProps = {
    data: {
        front: {
            "logFile": "",
            "hostIp": "",
            "takeTimes": 0,
        },
        online: {
            "logFile": "",
            "hostIp": "",
            "takeTimes": 0,
        },
        ESB: {
            "logFile": "",
            "hostIp": "",
            "takeTimes": 0,
            "service": []
        }
    },
    callbackfn: () => { }
}
export default DiagramChainPay;

const style = {
    linker_cell: {
        width: '80px', height: '96px', float: 'left', position: 'relative'
    },
    linker: {
        margin: '0', width: '100%', position: 'absolute', top: '50%', border: '1.5px solid #ec7c31'
    },
    linker_to: {
        position: 'absolute', right: '-4px', top: '44%', color: '#ec7c31'
    },
    linker_cell2: {
        width: '300px', height: '68px', position: 'relative'
    },
    linker2: {
        margin: '0', width: '1px', height: '100%', position: 'absolute', top: '0', left: '33%', border: '1.5px solid #ec7c31'
    },
    linker2_to: {
        position: 'absolute', bottom: '-4px', left: '31%', color: '#ec7c31'
    },
    linker2_1: {
        margin: '0', width: '1px', height: '100%', position: 'absolute', top: '0', left: '66%', border: '1.5px solid #ec7c31'
    },
    linker2_1_to: {
        position: 'absolute', top: '-4px', left: '64%', color: '#ec7c31'
    },
    linker_cell_right: {
        width: '80px', height: '96px', float: 'left', position: 'relative'
    },
    linker_right: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },
    _1: {
        position: 'absolute', left: '22%', top: '1px', borderRadius: '50%', cursor: 'pointer'
    },
    _2: {
        position: 'absolute', right: '2%', bottom: '-44px', borderRadius: '50%', cursor: 'pointer', zIndex: '1'
    },
    _3: {
        position: 'absolute', right: '18%', top: '1px', borderRadius: '50%', cursor: 'pointer'
    },
    _4: {
        position: 'absolute', right: '0', top: '-71px', borderRadius: '50%', cursor: 'pointer', zIndex: '1'
    },
    _5: {
        position: 'absolute', right: '-38px', top: '25%', borderRadius: '50%', cursor: 'pointer', zIndex: '1'
    }
}