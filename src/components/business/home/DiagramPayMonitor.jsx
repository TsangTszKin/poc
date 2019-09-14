import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CellPayMonitor from '@/components/business/home/widgets/CellPayMonitor'
import CellPayMonitorTD from '@/components/business/home/widgets/CellPayMonitorTD'
import BranchPay from '@/components/business/home/widgets/BranchPay'
import { Icon } from 'antd';

@inject('store') @observer
class DiagramPayMonitor extends Component {
    render() {
        const { store } = this.props;
        const front = store.data.getData.find(el => el.clusterName === 'front');
        const online = store.data.getData.find(el => el.clusterName === 'online');
        const esb = store.data.getData.find(el => el.clusterName === 'esb');
        const td1 = store.data.getData.find(el => el.clusterName === 'td1');
        const td2 = store.data.getData.find(el => el.clusterName === 'td2');
        return (
            <div style={{ minWidth: '680px' }}>
                <div className="clearfix" style={{ minWidth: '1000px', width: 'fit-content', margin: '40px auto' }}>
                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellPayMonitor
                            title='支付系统前置集群'
                            count={front.totalTrade}
                            time={front.avgTime}
                            type="pre"
                        />
                        <div style={style.linker_cell2}>
                            <p style={style.linker2}></p>
                            <span className="pay-up-to-dowm-rowup"></span>
                            {/* <span className="pay-dowm-to-up-rowup"></span> */}
                        </div>
                        <CellPayMonitor
                            title='支付系统联机集群'
                            count={online.totalTrade}
                            time={online.avgTime}
                            type="unit"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <div style={{ position: 'absolute', bottom: '150px', left: '-50%' }}>
                            <CellPayMonitorTD
                                title='网络流量统计'
                                count={td1.totalTrade}
                                time={td1.avgTime}
                            />
                        </div>
                        <div style={{ position: 'absolute', bottom: '50px', left: '-50%' }}>
                            <div style={style.linker_cell2_TD}>
                                <p style={style.linker2_TD}></p>
                            </div>
                        </div>

                        <span style={{ display: 'inline-block', backgroundColor: '#85b37d', width: '15px', height: '15px', position: 'absolute', bottom: '39px', left: '46%', borderRadius: '50%', zIndex: '1' }}></span>
                        <p style={style.linker}></p>
                        <span className="pay-left-to-right-rowup"></span>
                    </div>
                    {/* 最右端 */}
                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellPayMonitor
                            style={{ float: 'left' }}
                            title='ESB集群'
                            count={esb.totalTrade}
                            time={esb.avgTime}
                            type="esb"
                        />
                        <div style={style.linker_cell_right}>
                            <div style={{ position: 'absolute', bottom: '150px', left: '-90%' }}>
                                <CellPayMonitorTD
                                    title='网络流量统计'
                                    count={td2.totalTrade}
                                    time={td2.avgTime}
                                />
                            </div>
                            <div style={{ position: 'absolute', bottom: '50px', left: '-91%' }}>
                                <div style={style.linker_cell2_TD}>
                                    <p style={style.linker2_TD}></p>
                                </div>
                            </div>
                            <span style={{ display: 'inline-block', backgroundColor: '#85b37d', width: '15px', height: '15px', position: 'absolute', bottom: '39px', left: '88%', borderRadius: '50%', zIndex: '1' }}></span>



                            <p style={style.linker_right}></p>
                            <span className="pay-left-to-right-2-rowup"></span>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

DiagramPayMonitor.propTypes = {

};

export default DiagramPayMonitor;

const style = {
    linker_cell: {
        width: '150px', height: '96px', float: 'left', position: 'relative'
    },
    linker: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },
    linker_cell2: {
        width: '300px', height: '68px', overFlow: 'hidden', position: 'relative'
    },
    linker2: {
        margin: '0', width: '1px', height: '100%', position: 'relative', right: '-50%', border: '1.5px solid #ec7c31'
    },
    linker_cell_right: {
        width: '80px', height: '96px', float: 'left', position: 'relative'
    },
    linker_right: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },

    linker_cell2_TD: {
        width: '300px', height: '100px', overFlow: 'hidden', position: 'relative'
    },
    linker2_TD: {
        margin: '0', width: '1px', height: '100%', position: 'relative', right: '-50%', border: '1.5px solid #85b37d'
    },
}