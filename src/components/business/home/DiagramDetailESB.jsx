import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import CellPay from '@/components/business/home/widgets/CellPay'
import BranchESB from '@/components/business/home/widgets/BranchESB'

@inject('store') @observer
class DiagramDetailESB extends Component {
    render() {
        return (
            <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto', marginBottom: '40px', minHeight: '100px' }}>
                {
                    this.props.data.map((item, i) =>
                        <div key={i} className="clearfix" style={{ float: 'left', margin: '0 20px 40px 20px' }}>
                            <div
                                className="clearfix" style={{ margin: '0 auto' }}
                                onClick={() => {
                                    this.props.store.logList.updateData('visible', true)

                                    setTimeout(() => {
                                        let query = this.props.store.logList.getData.query;
                                        query.hostIp = item.ip;
                                        query.logFile = '';
                                        this.props.store.logList.updateData('query', query);

                                        if (this.props.type === 'query')
                                            this.props.store.getLogForApi('esb');
                                            
                                        this.props.store.logList.updateData('title', item.title)
                                        this.props.callbackfn(item.ip);
                                    }, 300);
                                }}
                            >
                                <CellPay
                                    style={{ margin: '0 auto', cursor: 'pointer' }}
                                    title={item.title}
                                    count={item.count}
                                    time={item.time}
                                    ip={item.ip}
                                    type="esb-detail"
                                />

                                <div style={style.linker_cell_v}>
                                    <p style={style.linker_v}></p>
                                </div>
                            </div>
                            <BranchESB data={item.service} />
                        </div>
                    )
                }
            </div>
        );
    }
}

DiagramDetailESB.propTypes = {
    data: PropTypes.array,
    callbackfn: PropTypes.func,
    type: PropTypes.oneOf(['query', 'monitor'])
};
DiagramDetailESB.defaultProps = {
    data: [
        {
            title: '',
            count: 0,
            time: 0,
            ip: '',
            service: []
        }
    ],
    callbackfn: () => { },
    type: 'query'
}

export default DiagramDetailESB;

const style = {
    linker_cell_v: {
        width: '300px', height: '70px', margin: '0 auto'
    },
    linker_v: {
        margin: '0 auto', width: '1px', height: '100%', border: '1.5px solid #ec7c31', backgroundColor: '#ec7c31'
    },
}

