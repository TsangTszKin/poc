import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <p style={{ fontFamily: 'Microsoft Tai Le', fontSize: '14px', float: 'left', width: '50%', marginBottom: '15px' }}>
                <span style={{opacity: '0.85'}}>{this.props.name}：</span>
                <span style={{opacity: '0.65'}}>{this.props.value}</span>
            </p>
        )
    }
}
FormItem.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string
}
FormItem.defaultProps = {
    name: '',
    value: ''
}
export default FormItem