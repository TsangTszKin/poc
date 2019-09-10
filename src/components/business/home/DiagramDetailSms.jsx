import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import CellDetail from '@/components/business/home/widgets/CellDetail'

@inject('store') @observer
class DiagramDetailSms extends Component {
    render() {
        const MQ = this.props.data.find(el => el.title === 'MQ')
        const Front = this.props.data.find(el => el.title === 'Front')
        const Realtime = this.props.data.find(el => el.title === 'Realtime')
        return (
            <div className="clearfix" style={{ width: '810px', margin: '0 auto', minHeight: '100px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto', float: 'left' }}>
                    <CellDetail {...MQ} type={this.props.type} style={{ marginBottom: '100px' }}
                        callbackfn={this.props.callbackfn}
                    />
                    <CellDetail {...Front} type={this.props.type} style={{ marginBottom: '40px' }}
                        callbackfn={this.props.callbackfn}
                    />
                </div>
                <div className="clearfix" style={{ width: '200px', height: '300px', position: 'relative', float: 'left' }}>
                    <p className="transform-26deg " style={style.linker}></p>
                    <span className="pay-lefttop-to-rightbottom-chain-rowup"></span>
                    <p className="transform-154deg " style={style.linker2}></p>
                    <span className="pay-rightbottom-to-lefttop-chain-rowup"></span>
                </div>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto', float: 'left' }}>
                    <CellDetail {...Realtime} type={this.props.type} style={{ marginTop: '98px' }}
                        callbackfn={this.props.callbackfn}
                    />
                </div>

            </div>
        );
    }
}

DiagramDetailSms.propTypes = {
    data: PropTypes.array,
    type: PropTypes.oneOf(['front', 'online', 'sms']),
    callbackfn: PropTypes.func
};
DiagramDetailSms.defaultProps = {
    data: [
        {
            title: '',
            count: 0,
            time: 0,
            ip: ''
        }
    ],
    type: '',
    callbackfn: () => { }
}

export default DiagramDetailSms;

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
}

