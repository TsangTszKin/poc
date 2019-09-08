import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CellChain from '@/components/business/home/widgets/CellChain'
import { Icon, Tag, message } from 'antd'
import common from '@/utils/common';

@inject('store') @observer
class DiagramChainSms extends Component {
    constructor(props) {
        super(props)
        this.hasLog = this.hasLog.bind(this);
    }

    hasLog(step) {
        switch (step) {
            case '1':
                return !common.isEmpty(this.props.store.detail.getData.data.MQ.info)
            case '2':
                return !common.isEmpty(this.props.store.detail.getData.data.Front.info)
            case '3':
                return !common.isEmpty(this.props.store.detail.getData.data.Realtime.info)
            default:
                return false
        }
    }
    render() {
        const { MQ, Front, Realtime } = this.props.store.detail.getData.data
        return (
            <div style={{ minWidth: '950px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto' }}>


                    <div style={style.linker_cell}>
                        <Tag color={this.hasLog('1') ? '#2db7f5' : '#DCDCDC'} style={style._4} title="点击查看日志"
                            onClick={() => {
                                if (this.hasLog('1')) this.props.store.detail.updateData('step', 1)
                                else message.warning('此处日志信息')
                            }}
                        >1</Tag>
                    </div>

                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='MQ'
                            count={MQ.sendCount}
                            time={MQ.takeTimes}
                            type="sms"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <p style={style.linker}></p>
                        {
                            this.hasLog('3') ?
                                <span className="pay-left-to-right-rowup"></span>
                                :
                                ''
                        }
                        <Icon type="caret-right" style={style.linker_to} />
                        <Tag color={this.hasLog('3') ? '#108ee9' : '#DCDCDC'} style={style._4} title="点击查看日志"
                            onClick={() => {
                                if (this.hasLog('3')) this.props.store.detail.updateData('step', 3)
                                else message.warning('此处日志信息')
                            }}
                        >3</Tag>
                    </div>

                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='Realtime'
                            count={Realtime.sendCount}
                            time={Realtime.takeTimes}
                            type="sms"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <p style={style.linker}></p>
                        {
                            this.hasLog('2') ?
                                <span className="pay-right-to-left-rowup"></span>
                                :
                                ''
                        }
                        <Icon type="caret-left" style={style.linker_to2} />
                        <Tag color={this.hasLog('2') ? '#87d068' : '#DCDCDC'} style={style._4} title="点击查看日志"
                            onClick={() => {
                                if (this.hasLog('2')) this.props.store.detail.updateData('step', 2)
                                else message.warning('此处日志信息')
                            }}
                        >2</Tag>
                    </div>

                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='Front'
                            count={Front.sendCount}
                            time={Front.takeTimes}
                            type="sms"
                        />
                    </div>

                   
                </div>

            </div>
        );
    }
}

DiagramChainSms.propTypes = {

};

export default DiagramChainSms;

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
    linker_to2: {
        position: 'absolute', left: '-4px', top: '44%', color: '#ec7c31'
    },
    linker_cell2: {
        width: '300px', height: '68px', position: 'relative'
    },
    linker2: {
        margin: '0', width: '1px', height: '100%', position: 'absolute', top: '0', left: '33%', border: '1.5px solid #ec7c31'
    },
    linker2_to: {
        position: 'absolute', bottom: '-4px', left: '30%', color: '#ec7c31'
    },
    linker2_1: {
        margin: '0', width: '1px', height: '100%', position: 'absolute', top: '0', left: '66%', border: '1.5px solid #ec7c31'
    },
    linker2_1_to: {
        position: 'absolute', top: '-4px', left: '63.2%', color: '#ec7c31'
    },
    linker_cell_right: {
        width: '80px', height: '96px', float: 'left'
    },
    linker_right: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },
    _1: {
        position: 'absolute', left: '22%', top: '1px', borderRadius: '50%', cursor: 'pointer'
    },
    _2: {
        position: 'absolute', left: '47%', bottom: '-24px', borderRadius: '50%', cursor: 'pointer', zIndex: '1'
    },
    _3: {
        position: 'absolute', right: '18%', top: '1px', borderRadius: '50%', cursor: 'pointer'
    },
    _4: {
        position: 'absolute', right: '-38px', top: '22%', borderRadius: '50%', cursor: 'pointer', zIndex: '1'
    }
}