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
            // <div style={{ minWidth: '950px' }}>
            //     <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto' }}>


            //         <div style={style.linker_cell}>
            //             <Tag color={this.hasLog('1') ? '#2db7f5' : '#DCDCDC'} style={style._4} title="点击查看日志"
            //                 onClick={() => {
            //                     if (this.hasLog('1')) this.props.store.detail.updateData('step', 1)
            //                     else message.warning('此处无日志信息')
            //                 }}
            //             >1</Tag>
            //         </div>

            //         <div className="clearfix" style={{ float: 'left' }}>
            //             <CellChain
            //                 title='MQ'
            //                 count={MQ.sendCount}
            //                 time={MQ.takeTimes}
            //                 type="sms"
            //             />
            //         </div>

            //         <div style={style.linker_cell}>
            //             <p style={style.linker}></p>
            //             {
            //                 this.hasLog('3') ?
            //                     <span className="pay-left-to-right-rowup"></span>
            //                     :
            //                     ''
            //             }
            //             <Icon type="caret-right" style={style.linker_to} />
            //             <Tag color={this.hasLog('3') ? '#108ee9' : '#DCDCDC'} style={style._4} title="点击查看日志"
            //                 onClick={() => {
            //                     if (this.hasLog('3')) this.props.store.detail.updateData('step', 3)
            //                     else message.warning('此处无日志信息')
            //                 }}
            //             >3</Tag>
            //         </div>

            //         <div className="clearfix" style={{ float: 'left' }}>
            //             <CellChain
            //                 title='Realtime'
            //                 count={Realtime.sendCount}
            //                 time={Realtime.takeTimes}
            //                 type="sms"
            //             />
            //         </div>

            //         <div style={style.linker_cell}>
            //             <p style={style.linker}></p>
            //             {
            //                 this.hasLog('2') ?
            //                     <span className="pay-right-to-left-rowup"></span>
            //                     :
            //                     ''
            //             }
            //             <Icon type="caret-left" style={style.linker_to2} />
            //             <Tag color={this.hasLog('2') ? '#87d068' : '#DCDCDC'} style={style._4} title="点击查看日志"
            //                 onClick={() => {
            //                     if (this.hasLog('2')) this.props.store.detail.updateData('step', 2)
            //                     else message.warning('此处无日志信息')
            //                 }}
            //             >2</Tag>
            //         </div>

            //         <div className="clearfix" style={{ float: 'left' }}>
            //             <CellChain
            //                 title='Front'
            //                 count={Front.sendCount}
            //                 time={Front.takeTimes}
            //                 type="sms"
            //             />
            //         </div>


            //     </div>

            // </div>

            <div className="clearfix" style={{ width: '810px', margin: '0 auto', minHeight: '100px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto', float: 'left', position: 'relative' }}>
                    <CellChain
                        title='MQ'
                        count={MQ.sendCount}
                        time={MQ.takeTimes}
                        type="sms"
                        style={{ marginBottom: '100px' }}
                    />
                    <CellChain
                        title='Front'
                        count={Front.sendCount}
                        time={Front.takeTimes}
                        type="sms"
                        style={{ marginBottom: '40px' }}
                    />
                    <Tag color={this.hasLog('1') ? '#2db7f5' : '#DCDCDC'} style={style._1} title="点击查看日志"
                        onClick={() => {
                            if (this.hasLog('1')) this.props.store.detail.updateData('step', 1)
                            else message.warning('此处无日志信息')
                        }}
                    >1</Tag>
                    <Tag color={this.hasLog('2') ? '#87d068' : '#DCDCDC'} style={style._2} title="点击查看日志"
                        onClick={() => {
                            if (this.hasLog('2')) this.props.store.detail.updateData('step', 2)
                            else message.warning('此处无日志信息')
                        }}
                    >2</Tag>
                </div>
                <div className="clearfix" style={{ width: '200px', height: '300px', position: 'relative', float: 'left' }}>
                    <p className="transform-26deg " style={style.linker}></p>
                    <span className="pay-lefttop-to-rightbottom-chain-rowup"></span>
                    <p className="transform-154deg " style={style.linker2}></p>
                    <span className="pay-rightbottom-to-lefttop-chain-rowup"></span>
                </div>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto', float: 'left', position: 'relative' }}>
                    <CellChain
                        title='Realtime'
                        count={Realtime.sendCount}
                        time={Realtime.takeTimes}
                        type="sms"
                        style={{ marginTop: '98px' }}
                    />
                    <Tag color={this.hasLog('3') ? '#108ee9' : '#DCDCDC'} style={style._3} title="点击查看日志"
                        onClick={() => {
                            if (this.hasLog('3')) this.props.store.detail.updateData('step', 3)
                            else message.warning('此处无日志信息')
                        }}
                    >3</Tag>
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
        width: '80px', height: '96px', float: 'left', position: 'relative', marginBottom: '40px'
    },
    linker: {
        margin: '0', width: '221px', position: 'absolute', top: '33%', border: '1.5px solid #ec7c31', backgroundColor: '#ec7c31', left: '-10px'
    },
    linker2: {
        margin: '0', width: '221px', position: 'absolute', bottom: '33%', border: '1.5px solid #ec7c31', backgroundColor: '#ec7c31', left: '-10px'
    },
    _1: {
        position: 'absolute', right: '10px', top: '22px', borderRadius: '50%', cursor: 'pointer'
    },
    _2: {
        position: 'absolute', right: '10px', bottom: '90px', borderRadius: '50%', cursor: 'pointer', zIndex: '1'
    },
    _3: {
        position: 'absolute', left: '15px', bottom: '51px', borderRadius: '50%', cursor: 'pointer'
    }
}