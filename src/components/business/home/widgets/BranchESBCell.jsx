import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'

@inject('store') @observer
class BranchESBCell extends Component {
    render() {
        return (
            <div className="clearfix" style={{ width: 'fit-content', float: 'left' }}>
                <div style={{ width: '180px' }}>
                    {
                        (() => {
                            if (this.props.start) {
                                return (
                                    <p style={{ width: '90px', height: '1px', border: '1.5px solid #ec7c31', backgroundColor: '#ec7c31', float: "right" }}></p>
                                )
                            }
                            if (this.props.end) {
                                return (
                                    <p style={{ width: '90px', height: '1px', border: '1.5px solid #ec7c31', backgroundColor: '#ec7c31', float: 'left' }}></p>
                                )
                            }
                            return (
                                <p style={{ width: '180px', height: '1px', border: '1.5px solid #ec7c31', backgroundColor: '#ec7c31' }}></p>
                            )
                        })()

                    }
                    <p style={{ width: '1px', height: '30px', border: '1.5px solid #ec7c31', margin: '0 auto', backgroundColor: '#ec7c31' }}></p>
                </div>
                <div style={{ width: '180px', cursor: 'pointer' }}
                    onClick={() => {
                        let query = this.props.store.logList.getData.query;
                        query.hostIp = this.props.ip;
                        query.logFile = this.props.name;
                        this.props.store.logList.updateData('query', query);

                        this.props.store.getLogForApi(this.props.type);
                        this.props.store.logList.updateData('title', this.props.name)
                    }}
                    title="点击查看节点日志信息">
                    <div style={style.title} className="ellipsis-1" title={this.props.name}>
                        {this.props.name}
                    </div>
                    <div style={style.data_cell}>
                        <p className="ellipsis-1" style={{ textAlign: 'center' }} title={this.props.totalCount}>交易笔数：{this.props.totalCount}</p>
                        <p className="ellipsis-1" style={{ textAlign: 'center' }} title={this.props.avgTime}>平均耗时(ms)：{this.props.avgTime}</p>
                    </div>
                </div>
            </div>
        );
    }
}

BranchESBCell.propTypes = {
    style: PropTypes.object,
    name: PropTypes.string,
    ip: PropTypes.string,
    totalCount: PropTypes.number,
    avgTime: PropTypes.number,
    nodeKey: PropTypes.number,
    start: PropTypes.bool,
    end: PropTypes.bool,
};
BranchESBCell.defaultProps = {
    style: {
        width: '300px', textAlign: 'center'
    },
    name: '',
    ip: '',
    totalCount: 0,
    avgTime: 0,
    nodeKey: 0,
    start: false,
    end: false
}

export default BranchESBCell;


const style = {
    // linker_cell: {
    //     width: '80px', height: '96px', float: 'left'
    // },
    // linker_cell2: {
    //     width: '80px', height: '96px', float: 'left',
    //     border: '2px solid rgb(236, 124, 49)',
    //     borderTop: 'none',
    //     borderRight: 'none',
    //     marginTop: '-46px',
    //     position: 'relative'
    // },
    // linker: {
    //     margin: '0', width: '100%', position: 'relative', top: '50%', border: '1.5px solid #ec7c31'
    // },
    title: {
        width: '120px', height: '50px', lineHeight: '50px', textAlign: 'center', borderRadius: '50%', border: '1px solid #ec7c31', boxShadow: '0 0 10px #ec7c31', margin: '0 auto'
    },
    data_cell: {
        width: 'auto', margin: '10px 0px'
    }
}