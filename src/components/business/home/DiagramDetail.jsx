import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import CellDetail from '@/components/business/home/widgets/CellDetail'

@inject('store') @observer
class DiagramDetail extends Component {
    render() {
        return (
            <div style={{ minWidth: '1070px', marginBottom: '40px', minHeight: '100px' }}>
                <div className="clearfix" style={{ width: 'fit-content', margin: '0 auto' }}>
                    {
                        this.props.data.map((item, i) =>
                            <Fragment key={i}>
                                {
                                    i !== 0 ?
                                        <div style={style.linker_cell}>
                                            {
                                                this.props.type === 'sms' ?
                                                    <Fragment>
                                                        <p style={style.linker}></p>
                                                        {
                                                            (() => {
                                                                if (i === 1) {
                                                                    return <span className="pay-left-to-right-rowup"></span>
                                                                }
                                                                if (i === 2) {
                                                                    return <span className="pay-right-to-left-rowup"></span>
                                                                }
                                                            })()
                                                        }
                                                    </Fragment>
                                                    : ''
                                            }
                                        </div>
                                        : ''
                                }
                                <div className="clearfix" style={{ float: 'left' }}>
                                    <CellDetail key={i} {...item} type={this.props.type} style={{ marginBottom: '40px' }}
                                        nodeKey={i}
                                    />
                                </div>
                            </Fragment>
                        )
                    }
                </div>

            </div>
        );
    }
}

DiagramDetail.propTypes = {
    data: PropTypes.array,
    type: PropTypes.oneOf(['front', 'online', 'sms']),
};
DiagramDetail.defaultProps = {
    data: [
        {
            title: '',
            count: 0,
            time: 0,
            ip: ''
        }
    ],
    type: ''
}

export default DiagramDetail;

const style = {
    linker_cell: {
        width: '80px', height: '96px', float: 'left', position: 'relative', marginBottom: '40px'
    },
    linker: {
        margin: '0', width: '100%', position: 'absolute', top: '50%', border: '1.5px solid #ec7c31'
    },
}

