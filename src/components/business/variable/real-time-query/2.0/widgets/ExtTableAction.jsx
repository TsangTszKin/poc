import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, Popconfirm } from 'antd'

export class ExtTableAction extends Component {
    static propTypes = {

    }

    render() {
        return (
            <div>
                <a style={{ color: '#0068BC' }} onClick={() => this.props.toConfig(this.props.index)} >配置</a>
                <Divider type="vertical" />

                <Popconfirm title="是否确定删除?" onConfirm={() => {
                    this.props.deleteOne(this.props.datakey)
                }} onCancel={() => {
                }} okText="确定" cancelText="取消">
                    <a style={{ color: '#E44B4E' }} >删除</a>
                </Popconfirm>
            </div>
        )
    }
}
ExtTableAction.propTypes = {
    toConfig: PropTypes.func,
    deleteOne: PropTypes.func,
    datakey: PropTypes.string,
    index: PropTypes.number
}
ExtTableAction.defaultProps = {
    toConfig: () => { },
    deleteOne: () => { },
    datakey: '',
    index: null
}
export default ExtTableAction
