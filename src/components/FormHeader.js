/*
 * @Author: zengzijian
 * @Date: 2019-08-24 09:40:21
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-24 15:38:28
 * @Description: 
 */
import React, { Component } from 'react'
import { Divider } from 'antd'
import PropTypes from 'prop-types'

const style = {
    divider: {
        background: '#ec7c31',
        height: '20px',
        width: '4px'
    },
    title: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000'
    }
}

class FormHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={this.props.style}>
                <Divider type="vertical" style={style.divider} /><span style={style.title}>{this.props.title}</span>
                {this.props.children}
            </div>
        )
    }
}
FormHeader.propTypes = {
    title: PropTypes.string.isRequired,
    style: PropTypes.object
}
FormHeader.defaultProps = {

}
export default FormHeader