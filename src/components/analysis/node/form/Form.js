import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Form extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ color: '#000', padding: '5px 0 0 32px' }}>
                <p style={{ fontFamily: 'Microsoft Uighur', fontSize: '16px', fontWeight: 'bold',marginBottom: '15PX' }}>{this.props.name}</p>
                {this.props.children}
            </div>


        )
    }
}
Form.propTypes = {
    name: PropTypes.string
}
Form.defaultProps = {
    name: ""
}

export default Form