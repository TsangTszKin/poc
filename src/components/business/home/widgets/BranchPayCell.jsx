import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class BranchPayCell extends Component {
    render() {
        return (
            <div className="clearfix" style={{ width: 'fit-content', marginTop: this.props.nodeKey > 1 ? '10px' : '0' }}>
                {
                    (() => {
                        if (this.props.nodeKey === 0) {
                            return (
                                <div style={style.linker_cell}>
                                    <p style={style.linker}></p>
                                </div>
                            )
                        }
                        return (
                            <div style={style.linker_cell2}>
                                <span className="pay-left-to-right-3-rowup"></span>
                                <span className="pay-up-to-dowm-2-rowup"></span>
                            </div>
                        )
                    })()
                }
                <div style={style.title} className="ellipsis-1" title={this.props.name}>
                    {this.props.name}
                </div>
                <div style={style.data_cell}>
                    <p className="ellipsis-1" title={this.props.totalCount}>交易笔数：{this.props.totalCount}</p>
                    <p className="ellipsis-1" title={this.props.avgTime}>平均耗时(ms)：{this.props.avgTime}</p>
                </div>
            </div>
        );
    }
}

BranchPayCell.propTypes = {
    style: PropTypes.object,
    name: PropTypes.string,
    totalCount: PropTypes.number,
    avgTime: PropTypes.number,
    nodeKey: PropTypes.number
};
BranchPayCell.defaultProps = {
    style: {
        width: '300px', textAlign: 'center'
    },
    name: '',
    totalCount: 0,
    avgTime: 0,
    nodeKey: 0
}

export default BranchPayCell;


const style = {
    linker_cell: {
        width: '80px', height: '96px', float: 'left'
    },
    linker_cell2: {
        width: '80px', height: '96px', float: 'left',
        border: '2px solid rgb(236, 124, 49)',
        borderTop: 'none',
        borderRight: 'none',
        marginTop: '-46px',
        position: 'relative'
    },
    linker: {
        margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    },
    title: {
        width: '75px', height: '75px', lineHeight: '75px', textAlign: 'center', borderRadius: '50%', border: '1px solid #ec7c31', float: 'left', marginTop: '11px', boxShadow: '0 0 10px #ec7c31'
    },
    data_cell: {
        width: '180px', float: 'left', margin: '27px 20px 0px 10px'
    }
}