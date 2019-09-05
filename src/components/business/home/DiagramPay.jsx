import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import CellPay from '@/components/business/home/widgets/CellPay'
import BranchPay from '@/components/business/home/widgets/BranchPay'

@inject('store') @observer
class DiagramPay extends Component {
    render() {
        const { store } = this.props;
        const front = store.data.getData.find(el => el.clusterName === 'front');
        const online = store.data.getData.find(el => el.clusterName === 'online');
        const esb = store.data.getData.find(el => el.clusterName === 'esb');
        return (
            <div style={{ minWidth: '950px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '40px auto' }}>
                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellPay
                            title='支付系统前置集群'
                            count={front.tradeCount}
                            time={front.avgCountTime}
                            type="pre"
                        />
                        <div style={style.linker_cell2}>
                            <p style={style.linker2}></p>
                            <span className="pay-up-to-dowm-rowup"></span>
                            {/* <span className="pay-dowm-to-up-rowup"></span> */}
                        </div>
                        <CellPay
                            title='支付系统联机集群'
                            count={online.tradeCount}
                            time={online.avgCountTime}
                            type="unit"
                        />
                    </div>

                    <div style={style.linker_cell}>
                        <p style={style.linker}></p>
                        <span className="pay-left-to-right-rowup"></span>
                    </div>
                    {/* 最右端 */}
                    <div className="clearfix" style={{ float: 'left' }}>
                        <CellPay
                            style={{ float: 'left' }}
                            title='ESB集群'
                            count={esb.tradeCount}
                            time={esb.avgCountTime}
                            type="esb"
                        />
                        <div style={style.linker_cell_right}>
                            <p style={style.linker_right}></p>
                            <span className="pay-left-to-right-2-rowup"></span>
                        </div>
                    </div>
                    <div className="clearfix" style={{ float: 'left' }}>
                        <BranchPay data={this.props.store.esbServices.getData} />
                    </div>
                </div>

            </div>
        );
    }
}

DiagramPay.propTypes = {

};

export default DiagramPay;

const style = {
    linker_cell: {
        width: '80px', height: '96px', float: 'left', position: 'relative'
    },
    linker: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },
    linker_cell2: {
        width: '230px', height: '68px', overFlow: 'hidden', position: 'relative'
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
}