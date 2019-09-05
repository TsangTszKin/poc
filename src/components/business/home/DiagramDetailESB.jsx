import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import CellPay from '@/components/business/home/widgets/CellPay'
import BranchPay from '@/components/business/home/widgets/BranchPay'

@inject('store') @observer
class DiagramDetailESB extends Component {
    render() {
        return (
            <div style={{ minWidth: '950px', marginBottom: '40px', minHeight: '100px' }}>
                <div style={{ width: 'fit-content', margin: '0 auto' }}>
                    {
                        this.props.data.map((item, i) =>
                            <div key={i} className="clearfix" style={{ float: 'left', marginBottom: '40px' }}>
                                <div className="clearfix" style={{ float: 'left' }}>
                                    <CellPay
                                        style={{ float: 'left' }}
                                        title={item.title}
                                        count={item.count}
                                        time={item.time}
                                        ip={item.ip}
                                        type="esb"
                                        isESB={true}
                                    />
                                    <div style={style.linker_cell_right}>
                                        <p style={style.linker_right}></p>
                                    </div>
                                </div>
                                <div className="clearfix" style={{ float: 'left' }}>
                                    <BranchPay data={item.service} isESB={true} />
                                </div>
                            </div>
                        )
                    }
                </div>

            </div>
        );
    }
}

DiagramDetailESB.propTypes = {
    data: PropTypes.array
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
    ]
}

export default DiagramDetailESB;

const style = {
    linker_cell: {
        width: '80px', height: '96px', float: 'left', position: 'relative', marginBottom: '40px'
    },
    linker: {
        margin: '0', width: '100%', position: 'absolute', top: '50%', border: '1.5px solid #ec7c31'
    },
    linker_cell_right: {
        width: '80px', height: '96px', float: 'left', position: 'relative'
    },
    linker_right: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },
}

