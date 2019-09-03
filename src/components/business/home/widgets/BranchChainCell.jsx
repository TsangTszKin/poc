import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Tag } from 'antd'

@inject('store') @observer
class BranchCell extends Component {
    render() {
        return (
            <div className="clearfix" style={{ width: 'fit-content', marginTop: this.props.nodeKey > 1 ? '10px' : '0', position: 'relative' }}>
                {
                    this.props.nodeKey === 0 ?
                        <div style={style.linker_cell}>
                            <p style={style.linker}></p>
                        </div>
                        :
                        <div style={style.linker_cell2}>
                            <span className="pay-left-to-right-3-rowup"></span>
                            <span className="pay-up-to-dowm-2-rowup"></span>
                        </div>
                }

                <Tag color="#7B68EE" style={style._5} title="点击查看日志">{this.props.nodeKey + 5}</Tag>
                <div style={style.title}>
                    {this.props.title}
                </div>
                <div style={style.data_cell}>
                    <p className="ellipsis-1">交易笔数：{this.props.count}</p>
                    <p className="ellipsis-1">平均耗时：{this.props.time}</p>
                </div>
            </div>
        );
    }
}

BranchCell.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    count: PropTypes.number,
    time: PropTypes.number,
    nodeKey: PropTypes.number,
};
BranchCell.defaultProps = {
    style: {
        width: '230px', textAlign: 'center'
    },
    title: '',
    count: 0,
    time: 0,
    nodeKey: 0
}

export default BranchCell;


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
        width: '100px', float: 'left', margin: '27px 20px 0px 10px'
    },
    _5: {
        position: 'absolute', left: '50px', top: '24%', borderRadius: '50%', cursor: 'pointer'
    }
}