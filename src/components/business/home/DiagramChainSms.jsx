import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CellChain from '@/components/business/home/widgets/CellChain'
import { Icon, Tag } from 'antd'

@inject('store') @observer
class DiagramChainSms extends Component {
    render() {
        return (
            <div style={{ minWidth: '930px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto' }}>


                    <div style={style.linker_cell}>
                        <Tag color="#2db7f5" style={style._4} title="点击查看日志">1</Tag>
                    </div>

                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='MQ'
                            count={200}
                            time={20}
                            type="pre"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <p style={style.linker}></p>
                        <span className="pay-left-to-right-rowup"></span>
                        <Icon type="caret-right" style={style.linker_to} />
                        <Tag color="#87d068" style={style._4} title="点击查看日志">2</Tag>
                    </div>

                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='Front'
                            count={200}
                            time={20}
                            type="pre"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <p style={style.linker}></p>
                        <span className="pay-left-to-right-rowup"></span>
                        <Icon type="caret-right" style={style.linker_to} />
                        <Tag color="#108ee9" style={style._4} title="点击查看日志">3</Tag>
                    </div>

                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellChain
                            title='Realtime'
                            count={200}
                            time={20}
                            type="pre"
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
    linker_cell2: {
        width: '230px', height: '68px', position: 'relative'
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